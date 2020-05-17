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
})({"../drafter/src/utils.js":[function(require,module,exports) {
var _arguments = arguments;

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

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
},{}],"../drafter/src/observable.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createObservable = exports.createObservable2 = void 0;

function _createForOfIteratorHelper(o) { if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (o = _unsupportedIterableToArray(o))) { var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var it, normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

var createObservable2 = function createObservable2() {
  var observers = [];

  var subscribe = function subscribe(fn) {
    observers = observers.concat(fn);
    return function () {
      return observers = observers.filter(function (l) {
        return l != fn;
      });
    };
  };

  var unsubscribe = function unsubscribe(fn) {
    observers = observers.filter(function (l) {
      return l != fn;
    });
  };

  var message = function message(msg) {
    observers.map(function (fn) {
      return fn(msg);
    });
  };

  return {
    subscribe: subscribe,
    unsubscribe: unsubscribe,
    message: message
  };
};

exports.createObservable2 = createObservable2;

var createObservable = function createObservable() {
  var dirty = false;
  var observers = [];

  var subscribe = function subscribe(fn) {
    if (fn == null) {
      debugger;
    }

    var position = observers.length; // let observerList = observers;

    var update = function update(newObserverList) {
      position = newObserverList.length;
      newObserverList.push(item);
    };

    var item = {
      fn: fn,
      update: update
    };
    update(observers);
    return function () {
      observers[position] = false;
      dirty = true;
    };
  };

  var message = function message(msg) {
    if (dirty) {
      var newObserverList = [];

      var _iterator = _createForOfIteratorHelper(observers),
          _step;

      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          observers = _step.value;

          if (observer) {
            observer.fn(msg);
            observer.update(newObserverList);
          }
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
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
},{}],"../drafter/src/state.js":[function(require,module,exports) {
function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

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

var ERR_STATE_UPDATE = 'State update argument must either be an Object/Array or an update function.';
var stateDefaults = {
  mutable: false
};

var createState = function createState() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var options = arguments.length > 1 ? arguments[1] : undefined;

  var _stateDefaults$option = _objectSpread(_objectSpread({}, stateDefaults), options),
      mutable = _stateDefaults$option.mutable,
      env = _stateDefaults$option.env;

  var _createObservable = createObservable(),
      message = _createObservable.message,
      subscribe = _createObservable.subscribe,
      unsubscribe = _createObservable.unsubscribe;

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
    subscribe: subscribe,
    unsubscribe: unsubscribe
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

        handler && handler(record);
      }

      return true;
    },
    deleteProperty: function deleteProperty(target, prop) {
      if (record.hasOwnProperty(prop)) {
        record = state();
        delete record[prop];
        delete subproxies[prop]; // mutable ||

        handler && handler(record);
      }
    },
    apply: function apply(target, thisArg, args) {
      if (env.isRenderMode) {}

      if (!args.length) {
        Object.freeze(record);
        handler && handler(record);

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
          handler && handler(record);
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
          handler && handler(record);
          return proxy;
        }
      }
    }
  });
};

module.exports = {
  produce: produce,
  createState: createState,
  createProxy: createProxy,
  stateGuard: stateGuard,
  subProxy: subProxy
};
},{"./utils":"../drafter/src/utils.js","./observable":"../drafter/src/observable.js"}],"../drafter/src/dispatch.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.connect = exports.dispatch = void 0;

var _ref = function () {
  var q = true;
  var a = [];
  return {
    connect: function connect(handler) {
      a.push(handler);
      console.log(a);
    },
    dispatch: function dispatch() {
      console.log({
        q: q
      }); // debugger;

      q && a.forEach(function (handler) {
        console.log('DISPATCHING!');
        setTimeout(function () {
          console.log('DISPATCH DONE!!!!', q);
          q = true;
          handler();
        }, 0);
      }); // q = false;
    }
  };
}(),
    dispatch = _ref.dispatch,
    connect = _ref.connect;

exports.connect = connect;
exports.dispatch = dispatch;
},{}],"../drafter/src/store.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Store = exports.resolveMapper = exports.connectStoreFactory = void 0;

var _utils = require("./utils");

var _observable = require("./observable");

var _state = require("./state");

var _dispatch = require("./dispatch");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

var id = function id(x) {
  return x;
};

var connectStoreFactory = function connectStoreFactory($instance) {
  return function (Store, mapper) {
    var store = new Store();
    var mapFn = mapper ? resolveMapper(mapper) : false;
    store.subscribe(function (state) {
      if (mapper) state = mapFn(state);
      $instance[Store.name] = state;
    });
    store.getState(); // this will not work for re-initialized components
  };
};

exports.connectStoreFactory = connectStoreFactory;

var resolveMapper = function resolveMapper(mapper) {
  if ((0, _utils.isCallable)(mapper)) {
    return mapper;
  } else if (Array.isArray(mapper)) {
    return function (state) {
      var s = (0, _utils.empty)(state);
      mapper.forEach(function (key) {
        s[key] = state[key];
      });
      return s;
    };
  } else {
    return id;
  }
};

exports.resolveMapper = resolveMapper;

var Store = function Store(name, _ref) {
  var state = _ref.state,
      methods = _ref.methods,
      computed = _ref.computed;

  var _createState = (0, _state.createState)(state),
      $state = _createState.$state,
      getState = _createState.getState,
      stateProxy = _objectWithoutProperties(_createState, ["$state", "getState"]);

  var $methods = (0, _utils.map)(methods, function (method) {
    return {
      value: method.bind($state)
    };
  });

  var _createObservable = (0, _observable.createObservable)(),
      message = _createObservable.message,
      subscribe = _createObservable.subscribe,
      unsubscribe = _createObservable.unsubscribe;

  var Store = function Store() {
    _classCallCheck(this, Store);
  };

  ;

  Store.toString = function () {
    return name;
  };

  Object.assign(Store.prototype, {
    subscribe: subscribe,
    unsubscribe: unsubscribe,
    getState: getState
  });
  Object.defineProperties(Store, _objectSpread(_objectSpread({}, $methods), {}, {
    name: {
      value: name,
      enumerable: false
    }
  }));
  stateProxy.subscribe(message);
  return Store;
};

exports.Store = Store;
},{"./utils":"../drafter/src/utils.js","./observable":"../drafter/src/observable.js","./state":"../drafter/src/state.js","./dispatch":"../drafter/src/dispatch.js"}],"src/stores/VAT.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _store = require("../../../drafter/src/store");

var _default = (0, _store.Store)('VAT', {
  state: {
    VATRate: 0.18,
    VATAmount: 0,
    VATCode: 'V18'
  },
  methods: {
    setVATAmount: function setVATAmount(value) {
      this.VATAmount = value;
    },
    setVATRate: function setVATRate(value) {
      this.VATRate = value;
    }
  }
}); // class VAT {
//   constructor(){
//     this.VATRate = 0;
//     this.VATAmount = 0;
//   }
//   setVATAmount(value){
//     this.VATAmount = value;
//   }
//   setVATRate(value){
//     this.VATRate = value;
//   }
// }
// )


exports.default = _default;
},{"../../../drafter/src/store":"../drafter/src/store.js"}],"../drafter/src/component.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.mountComponent = void 0;

var _state = require("./state");

var _store = require("./store");

var _dispatch = require("./dispatch");

var componentInstance = function componentInstance(attrs, children) {
  var instance = {
    state: null,
    attrs: attrs,
    children: children,
    refs: {}
  };

  var _createState = (0, _state.createState)(instance, {
    mutable: true
  }),
      $state = _createState.$state,
      subscribe = _createState.subscribe;

  var methods = Object.defineProperties({}, {
    createState: {
      value: createStateFactory($state)
    },
    createEffect: {
      value: function value() {}
    },
    connectStore: {
      value: (0, _store.connectStoreFactory)($state)
    },
    mix: {
      value: function value() {}
    }
  });
  return {
    $state: $state,
    subscribe: subscribe,
    methods: methods
  };
};

var createStateFactory = function createStateFactory($instance) {
  return function (state) {
    var _createState2 = (0, _state.createState)(state),
        $state = _createState2.$state,
        subscribe = _createState2.subscribe,
        setState = _createState2.setState;

    $instance.state = state;
    subscribe(function (state) {
      $instance.state = state;
    });
    return setState;
  };
};

var mountComponent = function mountComponent(component, attrs, children) {
  // console.log("MOUNT")
  var cache;

  var clearCache = function clearCache() {
    cache = null;
  };

  var _componentInstance = componentInstance(attrs, children),
      $state = _componentInstance.$state,
      subscribe = _componentInstance.subscribe,
      methods = _componentInstance.methods;

  var _render = component(methods); // const unsubscribe = subscribe(clearCache); // <- REAL problem maker!!!!


  subscribe(_dispatch.dispatch); // <- problem maker!!!!
  // return (vnode) => {
  //   if (cache == null){
  //     cache = render($state());
  //   }
  //   return cache;
  // };

  return {
    render: function render() {
      if (cache == null) {
        cache = _render($state());
      }

      return cache;
    },
    unmount: function unmount() {
      unsubscribe();
    }
  };
};

exports.mountComponent = mountComponent;
},{"./state":"../drafter/src/state.js","./store":"../drafter/src/store.js","./dispatch":"../drafter/src/dispatch.js"}],"../drafter/src/vdom.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.mount = exports.diff = exports.createDOM = exports.mountNode = exports.createDOMElement = exports.createElement = void 0;

var _component = require("./component");

var _dispatch = require("./dispatch");

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _createForOfIteratorHelper(o) { if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (o = _unsupportedIterableToArray(o))) { var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e2) { throw _e2; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var it, normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e3) { didErr = true; err = _e3; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var createElement = function createElement(tagName) {
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

exports.createElement = createElement;

var createDOMElement = function createDOMElement(vNode) {
  var tagName = vNode.tagName,
      attrs = vNode.attrs,
      children = vNode.children;
  var $el = document.createElement(tagName);

  for (var _i = 0, _Object$entries = Object.entries(attrs); _i < _Object$entries.length; _i++) {
    var _Object$entries$_i = _slicedToArray(_Object$entries[_i], 2),
        k = _Object$entries$_i[0],
        v = _Object$entries$_i[1];

    $el.setAttribute(k, v);
  }

  var _iterator = _createForOfIteratorHelper(children),
      _step;

  try {
    for (_iterator.s(); !(_step = _iterator.n()).done;) {
      var child = _step.value;
      var $child = createDOM(child);
      $el.appendChild($child);
    }
  } catch (err) {
    _iterator.e(err);
  } finally {
    _iterator.f();
  }

  vNode.instance = $el;
  return $el;
};

exports.createDOMElement = createDOMElement;

var createComponent = function createComponent(vNode) {
  var tagName = vNode.tagName,
      attrs = vNode.attrs,
      children = vNode.children;
  var componentInstance = (0, _component.mountComponent)(tagName, attrs, children);
  vNode.instance = componentInstance; // let i = componentInstance.render();
  // console.log({ i })

  return createDOM(componentInstance.render());
};

var mountNode = function mountNode($node, $target) {
  $target.replaceWith($node);
  return $node;
};

exports.mountNode = mountNode;

var createDOM = function createDOM(vNode) {
  // console.log({ vNode })
  if (vNode == null) {
    return vNode;
  }

  switch (_typeof(vNode)) {
    case 'boolean':
      return void 0;
      break;

    case 'number':
    case 'string':
      {
        return document.createTextNode(vNode);
        break;
      }

    case 'object':
      {
        var nodeType = _typeof(vNode.tagName);

        if (nodeType === 'string') {
          return createDOMElement(vNode);
        } else if (nodeType === 'function') {
          return createComponent(vNode);
        }

        break;
      }

    default:
  }
};

exports.createDOM = createDOM;

var isTextNode = function isTextNode(v) {
  var type = _typeof(v);

  return type === 'string' || type === 'number';
};

var isNotNode = function isNotNode(v) {
  return v == null || typeof v === 'boolean';
};

var diffAttrs = function diffAttrs(oldAttrs, newAttrs) {
  var patches = []; // console.log({ oldAttrs, newAttrs })

  var _loop = function _loop() {
    var _Object$entries2$_i = _slicedToArray(_Object$entries2[_i2], 2),
        k = _Object$entries2$_i[0],
        v = _Object$entries2$_i[1];

    patches.push(function ($node) {
      $node.setAttribute(k, v);
      return $node;
    });
  };

  for (var _i2 = 0, _Object$entries2 = Object.entries(newAttrs); _i2 < _Object$entries2.length; _i2++) {
    _loop();
  }

  var _loop2 = function _loop2() {
    var _Object$entries3$_i = _slicedToArray(_Object$entries3[_i3], 2),
        k = _Object$entries3$_i[0],
        v = _Object$entries3$_i[1];

    if (!(k in newAttrs)) {
      patches.push(function ($node) {
        node.removeAttribut(k);
        return $node;
      });
    }
  };

  for (var _i3 = 0, _Object$entries3 = Object.entries(oldAttrs); _i3 < _Object$entries3.length; _i3++) {
    _loop2();
  }

  return function ($node) {
    var _iterator2 = _createForOfIteratorHelper(patches),
        _step2;

    try {
      for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
        var patch = _step2.value;
        patch($node);
      }
    } catch (err) {
      _iterator2.e(err);
    } finally {
      _iterator2.f();
    }
  };
};

var zip = function zip(xs, ys) {
  var zipped = [];

  for (var i = 0; i < Math.min(xs.length, ys.length); i++) {
    zipped.push([xs[i], ys[i]]);
  }

  return zipped;
};

var diffChildren = function diffChildren(oldChildren, newChildren) {
  var patches = [];

  var _iterator3 = _createForOfIteratorHelper(zip(oldChildren, newChildren)),
      _step3;

  try {
    for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
      var _step3$value = _slicedToArray(_step3.value, 2),
          oldChild = _step3$value[0],
          newChild = _step3$value[1];

      patches.push(diff(oldChild, newChild));
    }
  } catch (err) {
    _iterator3.e(err);
  } finally {
    _iterator3.f();
  }

  var additionalPatches = [];

  var _iterator4 = _createForOfIteratorHelper(newChildren.slice(oldChildren.length)),
      _step4;

  try {
    var _loop3 = function _loop3() {
      var additionalChild = _step4.value;
      additionalPatches.push(function ($node) {
        $node.appendChild(createDOM(additionalChild));
      });
      return {
        v: $node
      };
    };

    for (_iterator4.s(); !(_step4 = _iterator4.n()).done;) {
      var _ret = _loop3();

      if (_typeof(_ret) === "object") return _ret.v;
    }
  } catch (err) {
    _iterator4.e(err);
  } finally {
    _iterator4.f();
  }

  return function (parent) {
    var _iterator5 = _createForOfIteratorHelper(zip(patches, parent.childNodes)),
        _step5;

    try {
      for (_iterator5.s(); !(_step5 = _iterator5.n()).done;) {
        var _step5$value = _slicedToArray(_step5.value, 2),
            patch = _step5$value[0],
            child = _step5$value[1];

        patch(child);
        return parent;
      }
    } catch (err) {
      _iterator5.e(err);
    } finally {
      _iterator5.f();
    }
  };
};

var diff = function diff(vOldNode, vNewNode, context) {
  // console.log({ vOldNode, vNewNode })
  if (isNotNode(vNewNode)) {
    return function ($node) {
      $node.remove();
      return void 0;
    };
  }

  if (isNotNode(vOldNode)) {
    return function ($node) {
      return createDOM(vNewNode);
    };
  }

  if (isTextNode(vOldNode) || isTextNode(vNewNode)) {
    if (vOldNode !== vNewNode) {
      return function ($node) {
        var $newNode = createDOM(vNewNode);
        $node.replaceWith($newNode);
        return $newNode;
      };
    } else {
      return function ($node) {
        return void 0;
      };
    }
  }

  if (vOldNode.tagName !== vNewNode.tagName) {
    return function ($node) {
      var $newNode = createDOM(vNewNode);
      $node.replaceWith($newNode);
      return $newNode;
    };
  }

  var patchAttrs = diffAttrs(vOldNode.attrs, vNewNode.attrs);
  var patchChildren = diffChildren(vOldNode.children, vNewNode.children);
  return function ($node) {
    patchAttrs($node);
    patchChildren($node);
    return $node;
  };
};

exports.diff = diff;

var mount = function mount(component, $el) {
  var vApp; // let $app = createDOM(component);

  var $rootEl;

  var handler = window.handler = function () {
    // console.log('TICK!!!!')
    var vNewApp = createDOM(component);
    var patch = diff(vApp, component);
    $rootEl = patch($rootEl);
    mountNode($rootEl, $el);
    $el = $rootEl;
    vApp = vNewApp;
  };

  handler();
  (0, _dispatch.connect)(handler); // dispatch();
  // console.log({ $rootEl, $el });
}; // const vNewApp = createVApp(count);
// const patch = diff(vApp, vNewApp);
// $rootEl = patch($rootEl);
// vApp = vNewApp;


exports.mount = mount;
},{"./component":"../drafter/src/component.js","./dispatch":"../drafter/src/dispatch.js"}],"src/components/componentExample.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _VAT = _interopRequireDefault(require("../stores/VAT"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// import { VAT, SomeStore } from '../stores';
var _default = function _default(_ref) {
  var createState = _ref.createState,
      connectStore = _ref.connectStore,
      createEffect = _ref.createEffect,
      mix = _ref.mix;
  var updateState = createState({
    count: 0,
    todos: [],
    isActive: false
  });
  connectStore(_VAT.default, ['VATRate', 'VATAmount']); // connectStore(SomeStore, ({ one, two, mutli: { three, four } }) => ({ one, two, three, four }));

  var onClick = window.clickFn = function (e) {
    updateState(function (state) {
      return state.count++;
    });
  };

  createEffect(function (_ref2) {
    var state = _ref2.state;
    document.title = "You clicked ".concat(state.count, " times");
  });
  createEffect(function (_ref3) {
    var attrs = _ref3.attrs;
    // const usubscribe = someAPI.subscribe(attrs.someProp);
    return unsubscribe;
  }, false);
  return function (data) {
    console.log("RENDER - ", data);
  };
};

exports.default = _default;
},{"../stores/VAT":"src/stores/VAT.js"}],"src/index.js":[function(require,module,exports) {
"use strict";

var _VAT = _interopRequireDefault(require("./stores/VAT"));

var _store = require("../../drafter/src/store");

var _component = require("../../drafter/src/component");

var _state = require("../../drafter/src/state");

var _vdom = require("../../drafter/src/vdom");

var _componentExample = _interopRequireDefault(require("./components/componentExample"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// window.a = createState({a: 1}).$state;
// const mapper = resolveMapper(['VATAmount'])
// (new VAT).subscribe((data) => {
//   console.log("VAT_SUBSCRIBE_FN", data)}
// )
window.createState = _state.createState;

var createVApp = function createVApp(count) {
  return (0, _vdom.createElement)('div', {
    id: 'app'
  }, (0, _vdom.createElement)('h1', {}, count), (0, _vdom.createElement)('img', {
    src: 'https://media.giphy.com/media/hqfUzrSYHUMLmRaMNQ/giphy.gif'
  }));
};

var App = function App(_ref) {
  var createState = _ref.createState;
  var updateState = createState({
    count: 0
  });
  setInterval(function () {
    updateState(function (state) {
      return state.count++;
    });
  }, 3000);
  return function (_ref2) {
    var attrs = _ref2.attrs,
        state = _ref2.state;
    return (0, _vdom.createElement)('div', {
      id: 'app'
    }, (0, _vdom.createElement)('h1', {}, state.count), (0, _vdom.createElement)('img', {
      src: 'https://media.giphy.com/media/hqfUzrSYHUMLmRaMNQ/giphy.gif'
    }));
  };
}; // mount(createElement(App), document.getElementById('app'));
// let count = 0;
// let vApp = createVApp(count);
// const $app = createDOM(vApp);
// let $rootEl = mount($app, document.getElementById('app'));
// setInterval(() => {
//   count++;
//   const vNewApp = createVApp(count);
//   const patch = diff(vApp, vNewApp);
//   $rootEl = patch($rootEl);
//   vApp = vNewApp;
// }, 1000);


window.VAT = _VAT.default; // window.Vat = new VAT;
// window.Vat2 = new VAT(mapper);
// const component = mountComponent(componentExample);
//
// window.createDOM = component.createDOM;
//
// window.mountComponent = mountComponent;
},{"./stores/VAT":"src/stores/VAT.js","../../drafter/src/store":"../drafter/src/store.js","../../drafter/src/component":"../drafter/src/component.js","../../drafter/src/state":"../drafter/src/state.js","../../drafter/src/vdom":"../drafter/src/vdom.js","./components/componentExample":"src/components/componentExample.js"}],"C:/Users/dane/AppData/Roaming/npm/node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
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
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "55367" + '/');

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
      } else if (location.reload) {
        // `location` global exists in a web worker context but lacks `.reload()` function.
        location.reload();
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
},{}]},{},["C:/Users/dane/AppData/Roaming/npm/node_modules/parcel-bundler/src/builtins/hmr-runtime.js","src/index.js"], null)
//# sourceMappingURL=/src.a2b27638.js.map