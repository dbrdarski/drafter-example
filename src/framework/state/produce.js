const { isCallable } = require('../utils');
const { createProxy } = require('./createProxy');

export const produce = (...args) => {
	const [ first, second ] = args;
	if (args.length === 1 && isCallable(first)) {
		return state => createProxy(state)(first)();
	} else {
		return createProxy(first)(second)()
	}
}
