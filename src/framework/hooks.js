import { createValue, createState, createComputed } from './state';

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
