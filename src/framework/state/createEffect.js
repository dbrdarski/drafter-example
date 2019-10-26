const { flatten } = require('../extras');
const { map } = require('../utils');
// const { createObservable } = require('./observable');
// const { dispatcher } = require('./dispatcher')

export const createEffect = (deps, effectFn) => {
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
