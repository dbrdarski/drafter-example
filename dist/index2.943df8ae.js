// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"src/framework/utils.js":[function(require,module,exports) {
var _arguments = arguments;

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

var isPrimitive = function isPrimitive(val) {
  return Object(val) !== val;
};

var isObject = function isObject(val) {
  return Object(val) === val;
};

var isCallable = function isCallable(f) {
  return typeof f === 'function';
};

var pipe = function pipe() {
  for (var _len = arguments.length, fns = new Array(_len), _key = 0; _key < _len; _key++) {
    fns[_key] = arguments[_key];
  }

  return function (arg) {
    return fns.reduce(function (acc, fn) {
      return fn(acc);
    }, arg);
  };
};

var empty = function empty(o) {
  return o.constructor();
};

var copy = function copy(o) {
  return Object.assign(o.constructor(), o);
};

var length = function length(o) {
  return Object.keys(o).length;
};

var filter = function filter(object, fn) {
  return Object.keys(object).reduce(function (acc, key) {
    if (fn(object[key], key, object)) {
      acc[key] = object[key];
    }

    return acc;
  }, {});
};

var map = function map(object, fn) {
  return Object.keys(object).reduce(function (acc, key) {
    acc[key] = fn(object[key], key, object);
    return acc;
  }, {});
};

var reduce = function reduce(object, fn, initial) {
  return Object.keys(object).reduce(function (acc, key) {
    acc[key] = fn(object[key], key, object);
    return acc;
  }, initial);
};

var each = function each(object, fn) {
  return Object.keys(object).forEach(function (key) {
    fn(object[key], key, object);
  });
};

var logger = function logger() {
  var log = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  return function () {
    for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      args[_key2] = arguments[_key2];
    }

    if (args.length) {
      log.push(args.length > 1 ? args : args[0]);
    } else {
      return log;
    }
  };
};

var curry = function curry(f) {
  return function () {
    if (_arguments.length == f.length) {
      // If arguments passed is sufficient then return value = f(arguments)
      return f.apply(null, _arguments);
    }

    return curry(f.bind.apply(f, [null].concat(_toConsumableArray(_arguments))));
  };
};

module.exports = {
  isPrimitive: isPrimitive,
  isObject: isObject,
  isCallable: isCallable,
  pipe: pipe,
  empty: empty,
  copy: copy,
  length: length,
  filter: filter,
  map: map,
  reduce: reduce,
  each: each,
  logger: logger,
  curry: curry
};
},{}],"src/framework/observable.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createObservable = void 0;

var createObservable = function createObservable() {
  var dirty = false;
  var observers = [];

  function update(newObserverList) {
    this.position = newObserverList.length;
    newObserverList.push(this);
  }

  var subscribe = function subscribe(fn) {
    var item = {
      fn: fn,
      update: update,
      position: void 0
    };
    item.update(observers);
    return function () {
      observers[item.position] = false;
      dirty = true;
    };
  };

  var message = function message(msg) {
    if (dirty) {
      var newObserverList = [];

      for (var _i = 0, _observers = observers; _i < _observers.length; _i++) {
        observers = _observers[_i];

        if (observer) {
          observer.fn(msg);
          observer.update(newObserverList);
        }
      }

      observers = newObserverList;
      dirty = false;
    } else {
      observers.forEach(function (o) {
        return o.fn(msg);
      });
    }
  };

  return {
    subscribe: subscribe,
    message: message
  };
};

exports.createObservable = createObservable;
},{}],"src/framework/extras.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.$gte = exports.$lte = exports.$gt = exports.$lt = exports.$mod = exports.$pow = exports.$divide = exports.$multiply = exports.$sub = exports.$add = exports.$eqw = exports.$eq = exports.$if = exports.$or = exports.$and = exports.$not = exports.flatten = void 0;

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

var map = function map(arr, fn) {
  var cacheArr, result;
  return function () {
    var a = arr();

    if (a !== cacheArr) {
      result = arr.map(fn);
      cacheArr = a;
    }

    return result;
  };
};

var flatten = function flatten(v, args) {
  return typeof v === 'function' ? v.apply(null, args) : v;
};

exports.flatten = flatten;

var flat = function flat(fn) {
  return function () {
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return args.any(function (arg) {
      return typeof argument === 'function';
    }) ? function () {
      return fn.apply(void 0, _toConsumableArray(args.map(flatten)));
    } : fn.apply(void 0, args);
  };
};

var $not = function $not(x) {
  return typeof x === 'function' ? function () {
    for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      args[_key2] = arguments[_key2];
    }

    return !flatten(x, args);
  } : !x;
};

exports.$not = $not;

var $and = function $and(cond, x) {
  return typeof cond === 'function' ? function () {
    for (var _len3 = arguments.length, args = new Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
      args[_key3] = arguments[_key3];
    }

    return cond() && flatten(x, args);
  } : cond && x;
};

exports.$and = $and;

var $or = function $or(cond, x) {
  return typeof cond === 'function' ? function () {
    for (var _len4 = arguments.length, args = new Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
      args[_key4] = arguments[_key4];
    }

    return cond() || flatten(x, args);
  } : cond || x;
};

exports.$or = $or;

var $if = function $if(cond, x, y) {
  return typeof cond === 'function' ? function () {
    for (var _len5 = arguments.length, args = new Array(_len5), _key5 = 0; _key5 < _len5; _key5++) {
      args[_key5] = arguments[_key5];
    }

    return cond() ? flatten(x, args) : flatten(y, args);
  } : cond ? x : y;
};

exports.$if = $if;
var $eq = flat(function (x, y) {
  return x === y;
});
exports.$eq = $eq;
var $eqw = flat(function (x, y) {
  return x == y;
});
exports.$eqw = $eqw;
var $add = flat(function (x, y) {
  return x + y;
});
exports.$add = $add;
var $sub = flat(function (x, y) {
  return x - y;
});
exports.$sub = $sub;
var $multiply = flat(function (x, y) {
  return x * y;
});
exports.$multiply = $multiply;
var $divide = flat(function (x, y) {
  return x / y;
});
exports.$divide = $divide;
var $pow = flat(function (x, y) {
  return Math.pow(x, y);
});
exports.$pow = $pow;
var $mod = flat(function (x, y) {
  return x % y;
});
exports.$mod = $mod;
var $lt = flat(function (x, y) {
  return x < y;
});
exports.$lt = $lt;
var $gt = flat(function (x, y) {
  return x > y;
});
exports.$gt = $gt;
var $lte = flat(function (x, y) {
  return x <= y;
});
exports.$lte = $lte;
var $gte = flat(function (x, y) {
  return x >= y;
}); // export const $add = (x, y) => () => flatten(x) + flatten(y);
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

exports.$gte = $gte;
},{}],"src/framework/env.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.env = void 0;
var env = {
  register: function register(destroyFn) {
    this.renderTargetUnsubscribe.push(destroyFn);
  }
};
exports.env = env;
},{}],"src/framework/state.js":[function(require,module,exports) {
function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

// TODO: Freeze on Create State...
// TODO: Investigate: assign, deep assign.
// TODO: Support arrays in shorthand mode
var _require = require('./utils'),
    isPrimitive = _require.isPrimitive,
    isObject = _require.isObject,
    isCallable = _require.isCallable,
    copy = _require.copy,
    map = _require.map,
    empty = _require.empty,
    each = _require.each;

var _require2 = require('./observable'),
    createObservable = _require2.createObservable;

var _require3 = require('./extras'),
    flatten = _require3.flatten;

var _require4 = require('./env'),
    env = _require4.env;

var ERR_STATE_UPDATE = 'State update argument must either be an Object/Array or an update function.';
var stateDefaults = {
  mutable: false
};

var createValue = function createValue(value) {
  var _createObservable = createObservable(),
      message = _createObservable.message,
      subscribe = _createObservable.subscribe;

  var $state = function $state() {
    return value;
  };

  var setState = function setState(v) {
    // if (env.renderInProgress) {
    // 	env.register(subscribe(env.renderTarget));
    // }
    if (typeof v === 'function') {
      v = v(value);
    }

    if (value !== v) {
      value = v;
      message(v);
    }
  };

  return {
    $state: $state,
    setState: setState,
    subscribe: subscribe
  };
};

var createComputed = function createComputed(deps, computedFn) {
  var _createObservable2 = createObservable(),
      subscribe = _createObservable2.subscribe;

  var $state = function $state() {
    return computedFn(map(deps, function (x) {
      return flatten(x);
    }));
  };

  return {
    $state: $state,
    subscribe: subscribe
  };
};

var createState = function createState() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var options = arguments.length > 1 ? arguments[1] : undefined;

  var _Object$assign = Object.assign({}, stateDefaults, options),
      mutable = _Object$assign.mutable,
      env = _Object$assign.env;

  var _createObservable3 = createObservable(),
      message = _createObservable3.message,
      subscribe = _createObservable3.subscribe;

  var handler = function handler(stateUpdate) {
    if (stateUpdate !== state) {
      state = stateUpdate;
      message(state);
    }
  };

  var stateProxy = createProxy(state, {
    // env,
    handler: handler,
    mutable: mutable
  });

  var getState = function getState() {
    return stateProxy();
  };

  var setState = function setState(stateUpdate) {
    if (isPrimitive(stateUpdate)) throw new Error(ERR_STATE_UPDATE);
    return stateProxy(stateUpdate);
  };

  return {
    $state: stateProxy,
    getState: getState,
    setState: setState,
    subscribe: subscribe
  };
};

var produce = function produce() {
  for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  var first = args[0],
      second = args[1];

  if (args.length === 1 && isCallable(first)) {
    return function (state) {
      return createProxy(state)(first)();
    };
  } else {
    return createProxy(first)(second)();
  }
};

var mutatorList = {
  pop: 0,
  shift: 0,
  push: 1,
  unshift: 1,
  splice: 0,
  reverse: 0,
  fill: 0,
  sort: 0
};

var apply = function apply(fn) {
  return fn();
};

var applyToObjectKeys = function applyToObjectKeys(proxy) {
  return function (v, k) {
    return isPrimitive(v) || proxy[k]();
  };
};

var subProxy = function subProxy(subarray, prop, subproxies, _ref) {
  var handler = _ref.handler,
      mutable = _ref.mutable,
      env = _ref.env;

  if (!subproxies.hasOwnProperty(prop)) {
    subproxies[prop] = createProxy(subarray, {
      handler: handler,
      mutable: mutable
    });
  }

  return subproxies[prop];
};

var stateGuard = function stateGuard(state) {
  var _ref2 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
      _ref2$mutable = _ref2.mutable,
      mutable = _ref2$mutable === void 0 ? false : _ref2$mutable;

  var dirty = false;
  return function () {
    if (mutable && dirty) {
      return state;
    }

    dirty = mutable;
    return state = copy(state);
  };
};

var createProxy = function createProxy(record) {
  var _ref3 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
      handler = _ref3.handler,
      _ref3$mutable = _ref3.mutable,
      mutable = _ref3$mutable === void 0 ? false : _ref3$mutable,
      _ref3$env = _ref3.env,
      env = _ref3$env === void 0 ? {} : _ref3$env;

  var proxy,
      subproxies = {},
      state = stateGuard(record, {
    mutable: mutable
  });
  var isArray = Array.isArray(record);

  var _createObservable4 = createObservable(),
      message = _createObservable4.message,
      subscribe = _createObservable4.subscribe;

  var unsubscribe = handler && subscribe(handler); // handler && console.log({ handler })

  var defineMutatorFn = isArray && mutable ? function (len, prop) {
    return {
      value: function value() {
        for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
          args[_key2] = arguments[_key2];
        }

        if (args.length >= len) record = state();
        return Array.prototype[prop].apply(record, args);
      }
    };
  } : null;
  var mutators = isArray && mutable ? Object.defineProperties({}, map(mutatorList, defineMutatorFn)) : null;
  return proxy = new Proxy(new Function(), {
    get: function get(target, prop, parent) {
      if (record.hasOwnProperty(prop)) {
        var p = record[prop];
        return isPrimitive(p) ? env.isRenderMode ? function () {
          return p;
        } : p : subProxy(p, prop, subproxies, {
          env: env,
          mutable: mutable,
          handler: function handler(record) {
            return parent[prop] = record;
          }
        });
      } else if (isArray && mutable && mutators.hasOwnProperty(prop)) {
        return mutators[prop];
      } else if (record.constructor.prototype.hasOwnProperty(prop)) {
        return record.constructor.prototype[prop].bind(record);
      }
    },
    set: function set(target, prop, value) {
      if (!record.hasOwnProperty(prop) || record[prop] !== value) {
        record = state();
        record[prop] = value; // delete subproxies[prop];
        // mutable ||

        message(record); // handler && handler(record);
      }

      return true;
    },
    deleteProperty: function deleteProperty(target, prop) {
      if (record.hasOwnProperty(prop)) {
        record = state();
        delete record[prop];
        delete subproxies[prop]; // mutable ||

        message(record); // handler && handler(record);
      }
    },
    apply: function apply(target, thisArg, args) {
      if (env.isRenderMode) {// env.renderTarget.unmountHandlers.push(subscribe(env.renderTarget.shouldUpdate));
      }

      if (!args.length) {
        Object.freeze(record);
        message(record); // handler && handler(record);

        if (mutable) {
          state = stateGuard(record);
          map(record, applyToObjectKeys(proxy));
        }

        return record;
      } else {
        var _args = _slicedToArray(args, 2),
            stateUpdate = _args[0],
            options = _args[1];

        if (isCallable(stateUpdate)) {
          var p = createProxy(record, {
            mutable: true
          });
          stateUpdate(p);
          record = p();
          state = stateGuard(record, {
            mutable: mutable
          });
          message(record); // handler && handler(record);

          return proxy;
        } else if (isObject(stateUpdate)) {
          var _p = createProxy(record, {
            mutable: true
          });

          Object.assign(_p, stateUpdate);
          record = _p();
          state = stateGuard(record, {
            mutable: mutable
          });
          message(record); // handler && handler(record);

          return proxy;
        }
      }
    }
  });
};

module.exports = {
  produce: produce,
  createValue: createValue,
  createState: createState,
  createComputed: createComputed,
  createProxy: createProxy,
  stateGuard: stateGuard,
  subProxy: subProxy
};
},{"./utils":"src/framework/utils.js","./observable":"src/framework/observable.js","./extras":"src/framework/extras.js","./env":"src/framework/env.js"}],"src/framework/patch.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.patch = void 0;

var patch = function patch($parent, $new, $old) {
  var newList = Array.isArray($new);
  var oldList = Array.isArray($old);
  (newList ? oldList ? patchManyToMany : patchManyToOne : oldList ? patchOneToMany : patchOneToOne)($parent, $new, $old);
};

exports.patch = patch;

var patchOneToOne = function patchOneToOne($parent, $new, $old) {
  return $old ? $parent.replaceChild($new, $old) : $parent.appendChild($new);
};

var patchManyToOne = function patchManyToOne($parent, $new, $old) {
  return $old ? ($new.forEach(function ($n) {
    return $parent.insertBefore($n, $old);
  }), $parent.removeChild($old)) : $new.forEach(function ($n) {
    return $parent.appendChild($n);
  });
};

var patchOneToMany = function patchOneToMany($parent, $new, $old) {
  return $old ? ($parent.insertBefore($new, $old[0]), $old.forEach(function ($o) {
    return $parent.removeChild($o);
  })) : $parent.appendChild($new);
};

var patchManyToMany = function patchManyToMany($parent, $new, $old) {
  var newLength = $new.length;
  var oldLength = $old.length;
  var min = Math.min(newLength, oldLength);
  var max = Math.max(newLength, oldLength);

  for (var i = 0; i < min; i++) {
    $parent.replaceChild($new[i], $old[i]);
  }

  if (newLength !== oldLength) {
    var addNew = newLength < oldLength;
    var method = addNew ? 'appendChild' : 'removeChild';
    var target = addNew ? $new : $old;

    for (var _i = min; _i < max; _i++) {
      $parent[method](target[_i]);
    }
  }
};
},{}],"src/framework/hooks.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useComputed = useComputed;
exports.useValue = useValue;
exports.useState = useState;
exports.useEffect = useEffect;

var _state = require("./state");

// export function hook(method, ...args) {
//   console.log({ method, args })
//   const { $state, setState, subscribe } = method(...args);
//   this(subscribe);
//   return [ $state, setState ];
// }
function useComputed(deps, computedFn) {
  var _createComputed = (0, _state.createComputed)(deps, computedFn),
      $state = _createComputed.$state,
      subscribe = _createComputed.subscribe;

  this(subscribe);
  return $state;
}

function useValue(value) {
  var _createValue = (0, _state.createValue)(value),
      $state = _createValue.$state,
      setState = _createValue.setState,
      subscribe = _createValue.subscribe;

  this(subscribe);
  return [$state, setState];
}

function useState(state) {
  var _createState = (0, _state.createState)(state),
      $state = _createState.$state,
      setState = _createState.setState,
      subscribe = _createState.subscribe;

  this(subscribe);
  return [$state, setState];
}

function useEffect(deps, effectFn) {}
},{"./state":"src/framework/state.js"}],"src/framework/attrs.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.updateAttr = exports.eventHandler = void 0;
var eventHandler = /^on[\w]+/g;
exports.eventHandler = eventHandler;

var updateAttr = function updateAttr($el, k, condition) {
  var v = condition();

  if (v == null) {
    $el.removeAttribute(k);
  } else {
    switch (k) {
      case 'checked':
      case 'value':
        {
          $el[k] = v;
          break;
        }

      case 'style':
        {
          if (typeof v === 'string') {
            $el.style = v;
            break;
          }

          Object.assign($el.style, v);
          break;
        }

      default:
        {
          $el.setAttribute(k, v);
        }
    }
  }
};

exports.updateAttr = updateAttr;
},{}],"src/framework/render.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.renderNode = void 0;

var _patch = require("./patch");

var _hooks = require("./hooks");

var _attrs = require("./attrs");

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

var renderNode = function renderNode(vNode) {
  var type = _typeof(vNode);

  if (type === 'boolean' || vNode == null) {
    return createEmptyNode();
  } else if (type === 'string' || type === 'number') {
    return createTextNode(vNode);
  } else if (type === 'function') {
    return createExpression(vNode);
  } else if (Array.isArray(vNode)) {
    return createFragment(vNode);
  } else if (typeof vNode.tagName === 'function') {
    return createComponent(vNode);
  }

  return createElement(vNode);
};

exports.renderNode = renderNode;

var createEmptyNode = function createEmptyNode() {
  return [document.createTextNode(''), false];
};

var createTextNode = function createTextNode(text) {
  return [document.createTextNode(text), false];
};

var createExpression = function createExpression(fn) {
  var resultCache, elementCache, updatesCache;

  var update = function update($parent) {
    var result = fn();

    if (result !== resultCache) {
      var _renderNode = renderNode(result),
          _renderNode2 = _slicedToArray(_renderNode, 2),
          element = _renderNode2[0],
          updates = _renderNode2[1];

      $parent && (0, _patch.patch)($parent, element, elementCache);
      elementCache = element;
      resultCache = result;
      updatesCache = updates;
    }

    updatesCache && updatesCache();
  };

  update();
  return [elementCache, update];
};

var createFragment = function createFragment(vNodes) {
  var $elements = [];
  var updates = [];
  vNodes.forEach(function (vNode) {
    // const [ $el ] = renderNode(vNode);
    var _renderNode3 = renderNode(vNode),
        _renderNode4 = _slicedToArray(_renderNode3, 2),
        $el = _renderNode4[0],
        update = _renderNode4[1];

    $elements.push($el);
    update && updates.push(update);
  });

  var update = function update($parent) {
    updates.forEach(function (update) {
      return update($parent);
    });
  };

  return [$elements, update];
};

var createElement = function createElement(_ref) {
  var tagName = _ref.tagName,
      attrs = _ref.attrs,
      children = _ref.children;
  var updates = [];
  var $el = document.createElement(tagName);

  if (attrs) {
    for (var _i2 = 0, _Object$entries = Object.entries(attrs); _i2 < _Object$entries.length; _i2++) {
      var _Object$entries$_i = _slicedToArray(_Object$entries[_i2], 2),
          k = _Object$entries$_i[0],
          v = _Object$entries$_i[1];

      if (k.match(_attrs.eventHandler)) {
        $el[k] = v;
      } else if (typeof v === 'function') {
        var _update = _attrs.updateAttr.bind(null, $el, k, v);

        updates.push(_update);

        _update();
      } else {
        $el.setAttribute(k, v);
      }
    }
  }

  if (children) {
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = children[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var child = _step.value;

        var _renderNode5 = renderNode(child),
            _renderNode6 = _slicedToArray(_renderNode5, 2),
            element = _renderNode6[0],
            _update2 = _renderNode6[1];

        _update2 && updates.push(_update2); // update && update($el);

        (0, _patch.patch)($el, element);
      }
    } catch (err) {
      _didIteratorError = true;
      _iteratorError = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion && _iterator.return != null) {
          _iterator.return();
        }
      } finally {
        if (_didIteratorError) {
          throw _iteratorError;
        }
      }
    }
  }

  var update = function update() {
    updates.forEach(function (update) {
      return update($el);
    });
  };

  return [$el, update];
};

var createComponent = function createComponent(_ref2) {
  var component = _ref2.tagName,
      attrs = _ref2.attrs,
      children = _ref2.children;
  var unsubscribeList = [];

  var destroy = function destroy() {
    unsubscribeList.forEach(function (d) {
      return d();
    });
  };

  var connectState = function connectState(subscribe) {
    return setTimeout(function () {
      return unsubscribeList.push(subscribe(update));
    });
  };

  var _renderNode7 = renderNode(component({
    attrs: attrs,
    children: children,
    useComputed: _hooks.useComputed.bind(connectState),
    // useValue: hook.bind(connectState, createValue),
    // useState: hook.bind(connectState, createState)
    useValue: _hooks.useValue.bind(connectState),
    useState: _hooks.useState.bind(connectState)
  })),
      _renderNode8 = _slicedToArray(_renderNode7, 2),
      $el = _renderNode8[0],
      update = _renderNode8[1];

  return [$el, update, destroy];
};
},{"./patch":"src/framework/patch.js","./hooks":"src/framework/hooks.js","./attrs":"src/framework/attrs.js"}],"src/framework/index.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "$and", {
  enumerable: true,
  get: function () {
    return _extras.$and;
  }
});
Object.defineProperty(exports, "$or", {
  enumerable: true,
  get: function () {
    return _extras.$or;
  }
});
Object.defineProperty(exports, "$if", {
  enumerable: true,
  get: function () {
    return _extras.$if;
  }
});
exports.mount = exports.h = void 0;

var _state = require("./state");

var _render = require("./render");

var _patch = require("./patch");

var _extras = require("./extras");

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var env = {
  isRenderMode: true
};

var h = function h(tagName) {
  var attrs = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  for (var _len = arguments.length, children = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
    children[_key - 2] = arguments[_key];
  }

  return {
    tagName: tagName,
    attrs: attrs,
    children: children
  };
};

exports.h = h;

var mount = function mount(hdom, $target) {
  var _renderNode = (0, _render.renderNode)(hdom),
      _renderNode2 = _slicedToArray(_renderNode, 2),
      $el = _renderNode2[0],
      update = _renderNode2[1];

  window.update = update;
  (0, _patch.patch)($target, $el);
};

exports.mount = mount;
},{"./state":"src/framework/state.js","./render":"src/framework/render.js","./patch":"src/framework/patch.js","./extras":"src/framework/extras.js"}],"src/index2.js":[function(require,module,exports) {
"use strict";

var _framework = require("./framework");

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var Wrapper = function Wrapper(_ref) {
  var children = _ref.children;
  console.log('Rendering <Wrapper />');
  return (0, _framework.h)("div", {
    style: function style() {
      return {
        border: '4px solid #177fb6',
        padding: '20px'
      };
    }
  }, children);
};

var UxInput = function UxInput(_ref2) {
  var _ref2$attrs = _ref2.attrs,
      name = _ref2$attrs.name,
      label = _ref2$attrs.label,
      placeholder = _ref2$attrs.placeholder,
      type = _ref2$attrs.type,
      value = _ref2$attrs.value,
      oninput = _ref2$attrs.oninput;
  console.log("Rendering <UxInput! />");
  return (0, _framework.h)("div", {
    "class": "uxInput"
  }, (0, _framework.h)("label", {
    "for": name
  }, label), (0, _framework.h)("br", null), (0, _framework.h)("input", {
    type: type || text,
    placeholder: placeholder || '',
    name: name,
    id: name,
    value: value,
    oninput: oninput
  }));
};

var Timer = function Timer(_ref3) {
  var useValue = _ref3.useValue,
      useComputed = _ref3.useComputed;

  var _useValue = useValue(0),
      _useValue2 = _slicedToArray(_useValue, 2),
      counter = _useValue2[0],
      setCounter = _useValue2[1];

  var increment = function increment() {
    setCounter(function (v) {
      return v + 1;
    });
  };

  var counterDisplay = useComputed({
    counter: counter
  }, function (_ref4) {
    var counter = _ref4.counter;
    var reversed = String(counter).split('').reverse().join('');
    var sum = counter + Number(reversed);
    return "".concat(counter, " | ").concat(sum, " | ").concat(reversed);
  });
  setInterval(increment, 1000);
  console.log("Rendering <Timer />");
  return (0, _framework.h)("h2", null, counterDisplay);
};

var Main = function Main() {
  var _ref5 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
      attrs = _ref5.attrs,
      useState = _ref5.useState,
      useEffect = _ref5.useEffect;

  var _useState = useState({
    name: '',
    count: 0,
    color: 'green',
    showColors: true
  }),
      _useState2 = _slicedToArray(_useState, 2),
      state = _useState2[0],
      updateState = _useState2[1];

  window.state = state; // useEffect({
  //   counter
  // }, ({
  //   counter
  // }) => {
  //   document.title = `You clicked ${counter} times`;
  // });
  //

  var toggleColorOptions = function toggleColorOptions(e) {
    return state.showColors = e.target.checked;
  };

  var incrementClicks = function incrementClicks() {
    return state.count++;
  };

  var updateName = function updateName(e) {
    return state.name = e.target.value;
  };

  var selectColor = function selectColor(e) {
    return state.color = e.target.value;
  };

  var buttonStyle = function buttonStyle() {
    return {
      background: state.color,
      color: 'white',
      border: "5px solid ".concat(state.color)
    };
  };

  console.log("Rendering <Main />");
  return (0, _framework.h)("div", null, (0, _framework.h)(UxInput, {
    type: "text",
    name: "name",
    label: "Your name",
    value: function value() {
      return state.name;
    },
    oninput: updateName
  }), (0, _framework.h)("p", null, "Hello ", function () {
    return state.name || 'John Doe';
  }, "! You have clicked ", function () {
    return state.count;
  }, " time", function () {
    return state.count !== 1 ? 's' : '';
  }, " on the ", function () {
    return state.color;
  }, " button."), (0, _framework.h)("button", {
    style: buttonStyle,
    onclick: incrementClicks
  }, " Increment! "), (0, _framework.h)("p", null, (0, _framework.h)("label", null, (0, _framework.h)("input", {
    type: "checkbox",
    checked: function checked() {
      return state.showColors;
    },
    oninput: toggleColorOptions
  }), "Show color options")), (0, _framework.h)("p", null, (0, _framework.$and)(function () {
    return state.showColors;
  }, attrs.colors.map(function (color) {
    return (0, _framework.h)("label", null, (0, _framework.h)("input", {
      type: "radio",
      value: color,
      checked: function checked() {
        return color === state.color ? 'checked' : null;
      },
      name: "color",
      id: color,
      onchange: selectColor
    }), color);
  }))));
}; // const Test = () => {
//   return [ ...Array(10000).keys() ].map( (x) => (
//     <div>{ x }</div>
//   ));
// }


console.time();
(0, _framework.mount)((0, _framework.h)(Wrapper, null, (0, _framework.h)(Main, {
  colors: ['red', 'orange', 'green', 'purple', 'black']
}), (0, _framework.h)(Timer, null)), document.body); // mount(<Test />, document.body);

console.timeEnd();
},{"./framework":"src/framework/index.js"}],"C:/Users/dane/AppData/Roaming/npm/node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "60708" + '/');

  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);

          if (didAccept) {
            handled = true;
          }
        }
      }); // Enable HMR for CSS by default.

      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });

      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else {
        window.location.reload();
      }
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }

  if (checkedAssets[id]) {
    return;
  }

  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}

function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }
}
},{}]},{},["C:/Users/dane/AppData/Roaming/npm/node_modules/parcel-bundler/src/builtins/hmr-runtime.js","src/index2.js"], null)
//# sourceMappingURL=/index2.943df8ae.js.map