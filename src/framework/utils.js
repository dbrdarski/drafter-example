export const isPrimitive = (val) => Object(val) !== val;
export const isObject = (val) => Object(val) === val;
export const isCallable = (f) => typeof f === 'function';
export const pipe = (...fns) => arg => fns.reduce((acc, fn) => fn(acc), arg);
export const empty = (o) => o.constructor();
export const copy = (o) => Object.assign(o.constructor(), o);
export const length = (o) => Object.keys(o).length;
export const filter = (object, fn) => Object.keys(object).reduce(
  (acc, key) => {
    if(fn(object[key], key, object)){
      acc[key] = object[key];
    }
    return acc;
  }, {}
);
export const map = (object, fn) => Object.keys(object).reduce(
  (acc, key) => {
    acc[key] = fn(object[key], key, object);
    return acc;
  }, {}
);
export const reduce = (object, fn, initial) => Object.keys(object).reduce(
  (acc, key) => {
    acc[key] = fn(object[key], key, object);
    return acc;
  }, initial
);
export const each = (object, fn) =>  Object.keys(object).forEach(
  (key) => {
    fn(object[key], key, object);
  }
);
export const logger = (log = []) => (...args) => {
  if (args.length){
    log.push(
      args.length > 1
        ? args
        : args[0]
    )
  } else {
    return log;
  }
}

export const curry = (f) => {
  return (...arguments) => {
    if (arguments.length == f.length) {
      // If arguments passed is sufficient then return value = f(arguments)
      return (f.apply(null, arguments))
    }
    return curry(f.bind(null, ...arguments))
  }
}
