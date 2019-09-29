// TODO: Freeze on Create State...
// TODO: Investigate: assign, deep assign.
// TODO: Support arrays in shorthand mode

const { isPrimitive, isObject, isCallable, copy, map, empty, each } = require('./utils');
const { createObservable } = require('./observable');
const { flatten } = require('./extras')
const { dispatcher } = require('./dispatcher')

const ERR_STATE_UPDATE = 'State update argument must either be an Object/Array or an update function.';

const stateDefaults = { mutable: false, };

const createValue = (value) => {
	const [ message, subscribe ] = createObservable();
	const $state = () => {
		dispatcher.render.inProgress && dispatcher.register(subscribe);
		return value;
	};
	const setState = (v) => {
		if (typeof v === 'function') {
			v = v(value);
		}
		if (value !== v) {
			value = v;
			message(v);
		}
	};
	return {
		$state,
		setState,
		subscribe
	};
};

const createComputed = (deps, computedFn) => {
	const [ message, subscribe ] = createObservable();
	let cache, subscriptions;
	const clearCache = () => cache = null;
	const $state = () => {
		dispatcher.render.inProgress && dispatcher.register(subscribe);
		return computedFn(map(deps, (x) => flatten(x)))
	};
	return {
		$state,
		subscribe
	}
};

const createEffect = (deps, effectFn) => {
	let destroy, depsCache;

  const destroyEffect = () => {
    destroy && destroy(depsCache);
  }

	const runEffect = () => {
		destroyEffect();
		depsCache = map(deps, (x) => flatten(x));
		destroy = effectFn(depsCache);
	};

	return {
    runEffect,
    destroyEffect
  };
};

const createState = (state = {}, options) => {
	const { mutable, dispatcher } = Object.assign({}, stateDefaults, options);
	const [ handler, subscribe ] = createObservable(false);
	// const handler = (stateUpdate) => {
	// 	if (stateUpdate !== state) {
	// 		state = stateUpdate;
	// 		message(state);
	// 	}
	// }
	// const handler = message;
	const stateProxy = createProxy(state, {
		// dispatcher,
		handler, mutable
	});
	const getState = () => stateProxy();
	const setState = (stateUpdate) => {
		if (isPrimitive(stateUpdate)) throw new Error(ERR_STATE_UPDATE);
		return stateProxy(stateUpdate);
	}
	return {
		$state: stateProxy,
		getState,
		setState,
		subscribe
	};
};

const produce = (...args) => {
	const [ first, second ] = args;
	if (args.length === 1 && isCallable(first)) {
		return state => createProxy(state)(first)();
	} else {
		return createProxy(first)(second)()
	}
}

const mutatorList = { pop: 0, shift: 0, push: 1, unshift: 1, splice: 0, reverse: 0, fill: 0, sort: 0 };

const apply = (fn) => fn();
const applyToObjectKeys = (proxy) => (v, k) => isPrimitive(v) || proxy[k]();

const subProxy = (subarray, prop, subproxies, { handler, mutable, dispatcher }) => {
	if (!subproxies.hasOwnProperty(prop)) {
		subproxies[prop] = createProxy(subarray, {
			handler,
			mutable
		});
	}
	return subproxies[prop];
};

const stateGuard = (state, { mutable = false } = {}) => {
	let dirty = false;
	return () => {
		if (mutable && dirty) {
			return state;
		}
		dirty = mutable;
		return state = copy(state);
	}
};

const createProxy = (record, { handler, mutable = false, dispatcher = {}} = {}) => {
	let proxy,
			subproxies = {},
			state = stateGuard(record, { mutable });
  const isArray = Array.isArray(record);
  const [ message, subscribe ] = createObservable();
  const unsubscribe = handler && subscribe(handler);
	// handler && console.log({ handler })
	const defineMutatorFn = isArray && mutable
		? (len, prop) => ({
			value: (...args) => {
				if ( args.length >= len ) record = state();
				return Array.prototype[prop].apply(record, args);
			}
		})
		: null;
	const mutators = isArray && mutable
		? Object.defineProperties({}, map(mutatorList, defineMutatorFn))
		: null;
	return proxy = new Proxy(new Function, {
		get: (target, prop, parent) => {
			if (record.hasOwnProperty(prop)) {
				const p = record[prop];
				return isPrimitive(p)
					? dispatcher.isRenderMode
						? () => p
						: p
					: subProxy(p, prop, subproxies, {
						dispatcher,
						mutable,
						handler: (record) => parent[prop] = record
					});
			} else if (isArray && mutable && mutators.hasOwnProperty(prop)) {
				return mutators[prop];
			} else if (record.constructor.prototype.hasOwnProperty(prop)) {
				return record.constructor.prototype[prop].bind(record);
			}
		},
		set: (target, prop, value) => {
			if (!record.hasOwnProperty(prop) || record[prop] !== value) {
				record = state();
				record[prop] = value;
				// delete subproxies[prop];
				// mutable ||

        message(record);
				// handler && handler(record);
			}
			return true;
		},
		deleteProperty: (target, prop) => {
			if (record.hasOwnProperty(prop)) {
				record = state();
				delete record[prop];
				delete subproxies[prop];
				// mutable ||
        message(record);
				// handler && handler(record);
			}
		},
		apply: ( target, thisArg, args ) => {
			if (dispatcher.isRenderMode) {
        // dispatcher.renderTarget.unmountHandlers.push(subscribe(dispatcher.renderTarget.shouldUpdate));
			}
			if (!args.length) {
				Object.freeze(record);
        message(record);
				// handler && handler(record);
				if (mutable) {
					state = stateGuard(record);
					map(record, applyToObjectKeys(proxy));
				}
				return record;
			} else {
				const [ stateUpdate, options ] = args;
				if (isCallable(stateUpdate)) {
					const p = createProxy(record, { mutable: true });
					stateUpdate(p);
					record = p();
					state = stateGuard(record, { mutable });
          message(record);
					// handler && handler(record);
					return proxy;
				} else if (isObject(stateUpdate)) {
					const p = createProxy(record, { mutable: true });
					Object.assign(p, stateUpdate);
					record = p();
					state = stateGuard(record, { mutable });
          message(record);
					// handler && handler(record);
					return proxy;
				}
			}
		}
	});
};

module.exports = {
  produce,
	createEffect,
	createValue,
	createState,
	createComputed,
	createProxy,
	stateGuard,
	subProxy
}
