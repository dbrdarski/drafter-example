import { isPrimitive } from '../utils';
import { createObservable } from '../observable';
import { dispatcher } from '../dispatcher';
import { createProxy } from './createProxy';

const ERR_STATE_UPDATE = 'State update argument must either be an Object/Array or an update function.';

const stateDefaults = { mutable: false };

export const createState = (state = {}, options) => {
	const { mutable } = Object.assign({}, stateDefaults, options);
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
