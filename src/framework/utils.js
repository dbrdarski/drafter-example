const isPrimitive = (val) => Object(val) !== val;
const isObject = (val) => Object(val) === val;
const isCallable = (f) => typeof f === 'function';
const pipe = (...fns) => arg => fns.reduce((acc, fn) => fn(acc), arg);
const empty = (o) => o.constructor();
const copy = (o) => Object.assign(o.constructor(), o);
const length = (o) => Object.keys(o).length;
const filter = (object, fn) => Object.keys(object).reduce(
  (acc, key) => {
    if(fn(object[key], key, object)){
      acc[key] = object[key];
    }
    return acc;
  }, {}
);
const map = (object, fn) => Object.keys(object).reduce(
  (acc, key) => {
    acc[key] = fn(object[key], key, object);
    return acc;
  }, {}
);
const reduce = (object, fn, initial) => Object.keys(object).reduce(
  (acc, key) => {
    acc[key] = fn(object[key], key, object);
    return acc;
  }, initial
);
const each = (object, fn) =>  Object.keys(object).forEach(
  (key) => {
    fn(object[key], key, object);
  }
);
const logger = (log = []) => (...args) => {
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

const curry = (f) => {
  return (...arguments) => {
    if (arguments.length == f.length) {
      // If arguments passed is sufficient then return value = f(arguments)
      return (f.apply(null, arguments))
    }
    return curry(f.bind(null, ...arguments))
  }
}

function createTuples () {
  class ArrayLike extends Array {
      constructor (...args) {
          super(...args);
      }
  }

  Object.setPrototypeOf(ArrayLike.prototype, null)

  class Tuple extends ArrayLike {
    constructor (...args) {
      super(...args);
      Object.freeze(this);
    }
    static from (o) {
      if (o.length == null) throw Error('Expecting array/array-like data type');
      return new Tuple(...o);
    }
    count (value) {
      let count = 0;
      for (let i = 0; x < this.length; i++) {
        if (this[i] === value) count++
      }
      return count;
    }
  }

  Tuple.prototype.indexOf = Array.prototype.indexOf

  return {
    ArrayLike, Tuple
  };
}

module.exports = {
  isPrimitive,
  isObject,
  isCallable,
  pipe,
  empty,
  copy,
  length,
  filter,
  map,
  reduce,
  each,
  logger,
  curry
}
