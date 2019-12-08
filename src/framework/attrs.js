export const eventHandler = /^on[\w]+/g;

export const updateAttr = ($el, k, value) => {
  if (k === 'ref') {
    return void value($el);
  }
  const v = value();
  if (v == null) {
    $el.removeAttribute(k);
  } else {
    switch (k) {
      case 'checked':
      case 'value': {
        $el[k] = v;
        break;
      }
      case 'style': {
        if (typeof v === 'string') {
          $el.style = v;
          break;
        }
        Object.assign($el.style, v);
        break;
      }
      default: {
        $el.setAttribute(k, v);
      }
    }
  }
};

export const createAttrs = (attrs, $el, updates) => {
  for (const [k, v] of Object.entries(attrs)) {
    if (k.match(eventHandler)) {
      $el[k] = v;
    } else if (typeof v === 'function') {
      const update = updateAttr.bind(null, $el, k, v);
      updates.push(update);
      update();
    } else if (v == null){
      $el.removeAttribute(k);
    } else {
      $el.setAttribute(k, v);
    }
  }
}

export const arraySpreadProxy = window.arraySpreadProxy = (state, { handler } = {}) => {

}

// if parent expression create destroy
export const objectSpreadProxy = window.objectSpreadProxy = (state, { handler } = {}) => {
  let nulled = true;
  const proxy = new Proxy(state, {
    get: (target, prop, proxy) => {
      if (nulled) return null; // idea: if callibe intead of null return fn that removes attr and unsubscribes!!!!! :)
      const value = state[prop];
      if (value == null) {
        // if value was reactive (fn) => unsubscribe
        delete state[prop];
      }
      return value;
    }
  });
  return (...args) => {
    const newState = Object.assign.call(null, {}, ...args);
    nulled = true;
    Object.assign(state, proxy, newState);
    nulled = false;
    handler({ ...proxy});
    return state;
  };
  // return update;
  // return [ proxy, update ];
};

// const attrSpreadExpression = (xs) => {
//   let spreadCache = {};
//   const update = () => {
//     const spread = Object.assgin.apply(null, [{}, ...xs])
//   }
// }
//
export const extendAttrs = (...xs) => xs.any(isCallable)
  ? attrSpreadExpression(xs)
  : Object.assign.apply(null, xs)

// staticAttr="1"
// dynamicAttr={ x } // x = () =>
// {...asd} // asd = {}
// {...bsd} // bsd = () =>

window.renderNode = (parent, current, next) => {
  if (next == null) parent.appendChild(current);
  else parent.insertBefore(current, next)
}

window.elementIterator = (vnodes, parent) => {
  let o = {
    current: null,
    next: null
  };
  for (let i = vnodes.length; i > 0; --i;) {
    const vnode = vnodes[i];
    if (vnode == null || typeof vnode === 'boolean')
      continue;
    if (typeof vnode === 'function') {
      let elementCache;
      const getEl = () => elementCache == null
    }
  }
};
