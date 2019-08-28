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

const lift = (v, args) => typeof v === 'function' ? v.apply(null, args) : v;
export const $and = (x, y) => (...args) => lift(x, args) && lift(y, args);
export const $or = (x, y) => (...args) => lift(x, args) || lift(y, args);
export const $if = (x, y, z) => (...args) => lift(x, args) ? lift(y, args) : lift(z, args);
export const $add = (x, y) => () => lift(x) + lift(y);
export const $sub = (x, y) => () => lift(x) - lift(y);
export const $multiply = (x, y) => () => lift(x) * lift(y);
export const $divide = (x, y) => () => lift(x) / lift(y);
export const $pow = (x, y) => () => lift(x) ** lift(y);
export const $mod = (x, y) => () => lift(x) % lift(y);

// const $if2 = (x, y, z) => {
//   let cache1, cache2, result;
//   returnf (...args) => {
//     const condition = lift(x, args);
//     if (condition) {
//       result = lift(y, args);
//       if result !== void 0;
//         cache1 = result;
//     } else {
//       result = lift(z, args);
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
//     const outcome = Number(!lift(x, args));
//     result = lift(outcomes[outcome], args);
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
//     const outcome = Number(!lift(x, args));
//     result = outcomes[outcome];
//     cache[outcome] = result;
//     return lift(result, args);
//   };
// };

// const $if = (condition, x, y) => (...args) => lift(lift(condition ? x : y, args));


// $if(false, 1, $if(2, 3, 4));

// { $.if(
//   state.someCondition,
//   <div>No data found.</div>,
//   <Component2 user={ user } />
// ) }
//
// { (...args) => lift(state.someCondition, args)
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
