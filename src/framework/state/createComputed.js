const { flatten } = require('../extras')
const { map } = require('../utils');
const { createObservable } = require('../observable');
const { dispatcher } = require('../dispatcher')

const flattenUnary = x => flatten(x);
export const createComputed = (deps, computedFn) => {
	const [ message, subscribe ] = createObservable();
	const flattenDeps = map.bind(null, deps, flattenUnary);

	// dispatcher
	// 	.registerExpression(message)
	// 	.renderExpression(flattenDeps);

	let cache;
	const clearCache = () => cache = null;
	subscribe(clearCache);
	const $state = () => {
		dispatcher.renderInProgress && dispatcher.registerDep(subscribe);
		return computedFn(flattenDeps());
		// if (cache == null) {
		// 	cache = computedFn(flattenDeps())
		// }
		// return cache
	};
	return {
		$state,
		subscribe
	}
};
