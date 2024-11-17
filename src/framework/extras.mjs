const map = (arr, fn) => {
  let cacheArr, result;
  return () => {
    const a = arr();
    if (a !== cacheArr){
      result = arr.map(fn);
      cacheArr = a;
    }
    return result;
  };
};

export const flatten = (v, args) => typeof v === 'function' ? v.apply(null, args) : v;
const flat = (fn) => (...args) => {
  return args.any(arg => typeof argument === 'function')
    ? () => fn(...args.map(flatten))
    : fn(...args)
}

export const $not = (x) => typeof x === 'function'
  ? (...args) => !flatten(x, args)
  : !x;
export const $and = (cond, x) => typeof cond === 'function'
  ? (...args) => cond() && flatten(x, args)
  : cond && x;
export const $or = (cond, x) => typeof cond === 'function'
  ? (...args) => cond() || flatten(x, args)
  : cond || x;
export const $if = (cond, x, y) => typeof cond === 'function'
  ? (...args) => cond() ? flatten(x, args) : flatten(y, args)
  : cond ? x : y;

export const $eq = flat((x, y) => x === y);
export const $eqw = flat((x, y) => x == y);

export const $add = flat((x, y) => x + y);
export const $sub = flat((x, y) => x - y);
export const $multiply = flat((x, y) => x * y);
export const $divide = flat((x, y) => x / y);
export const $pow = flat((x, y) => x ** y);
export const $mod = flat((x, y) => x % y);
export const $lt = flat((x, y) => x < y);
export const $gt = flat((x, y) => x > y);
export const $lte = flat((x, y) => x <= y);
export const $gte = flat((x, y) => x >= y);

// export const $add = (x, y) => () => flatten(x) + flatten(y);
// export const $sub = (x, y) => () => flatten(x) - flatten(y);
// export const $multiply = (x, y) => () => flatten(x) * flatten(y);
// export const $divide = (x, y) => () => flatten(x) / flatten(y);
// export const $pow = (x, y) => () => flatten(x) ** flatten(y);
// export const $mod = (x, y) => () => flatten(x) % flatten(y);

// const $if2 = (x, y, z) => {
//   let cache1, cache2, result;
//   returnf (...args) => {
//     const condition = flatten(x, args);
//     if (condition) {
//       result = flatten(y, args);
//       if result !== void 0;
//         cache1 = result;
//     } else {
//       result = flatten(z, args);
//       if result !== void 0;
//         cache2 = result;
//     }
//     return result;
//   };
// };
//
// const $if3 = (condition, ...outcomes) => {
//   let result, cache = [];
//   return (...args) => {
//     const outcome = Number(!flatten(x, args));
//     result = flatten(outcomes[outcome], args);
//     if (result !== void 0) {
//       cache[outcome] = result;
//     }
//     return result;
//   };
// };
//
// const $if4 = (condition, ...outcomes) => {
//   let result, cache = [];
//   return (...args) => {
//     const outcome = Number(!flatten(x, args));
//     result = outcomes[outcome];
//     cache[outcome] = result;
//     return flatten(result, args);
//   };
// };

// const $if = (condition, x, y) => (...args) => flatten(flatten(condition ? x : y, args));


// $if(false, 1, $if(2, 3, 4));

// { $.if(
//   state.someCondition,
//   <div>No data found.</div>,
//   <Component2 user={ user } />
// ) }
//
// { (...args) => flatten(state.someCondition, args)
//   ?  <div>No data found.</div>
//   : <Component2 user={ user } />
// }



// reactiveArray.map( reactiveItem => <div attr={reactiveItem.attr}>{ reactiveItem.content }</div> )
//
// const renderMethod = method => function (fn) {
//     let arrayData;
//     let cache;
//     return () => {
//       const newArrayData = this.arrayProxy();
//       if (newArrayData !== arrayData) {
//         cache = method(this.arrayProxy, fn);
//       }
//       return cache;
//   };
// };
//
// const map = function (fn) {
//     let arrayData;
//     let cache;
//     return () => {
//       const newArrayData = this.arrayProxy();
//       if (newArrayData !== arrayData) {
//         cache = map(this.arrayProxy, fn);
//       }
//       return cache;
//   };
// };
//
//
// $observable.map() =>
// () => {
//   return ()
// }
//
// const renderMethods = Object.freeze({
//     map: renderMethod(map),
//     filter: renderMethod(filter),
//     reduce: renderMethod(reduce)
// });
//
// const bindRenderMethods = (arrayProxy) => {
//   Object.create(renderMethods, {
//     arrayProxy: { value: arrayProxy }
//   });
// };
