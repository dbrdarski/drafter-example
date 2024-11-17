import { createValue, createState, createComputed, createEffect } from './state.mjs';

// export function hook(method, ...args) {
//   console.log({ method, args })
//   const { $state, setState, subscribe } = method(...args);
//   this(subscribe);
//   return [ $state, setState ];
// }

export function useComputed(deps, computedFn) {
  const { $state, subscribe } = createComputed(deps, computedFn);
  this(subscribe);
  return $state;
}

export function useValue(value) {
  const { $state, setState, subscribe } = createValue(value);
  this(subscribe);
  return [ $state, setState ];
}

export function useState(state) {
  const { $state, setState, subscribe } = createState(state);
  this(subscribe);
  return [ $state, setState ];
}

export function useEffect(deps, effectFn) {
  const { runEffect, destroyEffect } = createEffect(deps, effectFn);
  deps ? this.subscribeToUpdates(runEffect) : queueMicrotask(runEffect);
  this.subscribeToDestroy(destroyEffect);
}

export function useRef(value) {
  return (...args) => {
    if (args.length) {
      [ value ] = args;
    }
    return value;
  }
}
