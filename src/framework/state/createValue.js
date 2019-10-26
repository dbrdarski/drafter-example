const { createObservable } = require('../observable');
const { dispatcher } = require('../dispatcher')

export const createValue = (value) => {
	const [ message, subscribe ] = createObservable();

	const $state = () => {
		dispatcher.renderInProgress && dispatcher.registerDep(subscribe);
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
