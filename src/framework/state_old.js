// TODO: Freeze on Create State...
// TODO: Investigate: assign, deep assign.
// TODO: Support arrays in shorthand mode

const { isPrimitive, isObject, isCallable, copy, map, empty, each } = require('./utils');
const { createObservable } = require('./observable');
const { dispatcher } = require('./dispatcher')

// const ElementListProxy = (elementList) => {
// 	Object.keys(elementList);
// 	return [Object];
// };
//
// const IterableProxy = window.Iterable = (state, {
// 	onCreate,
// 	onDestroy,
// 	onUpdate
// }) => {
// 	const keys = [];
// 	const values = new WeakMap;
// 	let shouldUpdateParent = false;
// 	const replace = (state) => {
// 		for ([k, v] in entries) {
// 			const match = values.get(v);
// 			if ( match == null) {
// 				values.set(v, k);
// 			} else if (match !== k) {
// 				shouldUpdateParent = true;
// 			} else {
//
// 			}
// 		}
// 	}
// }

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
