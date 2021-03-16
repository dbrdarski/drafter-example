import { env } from './env';
import { patch } from './patch';
// import { createValue, createState, createComputed } from './state';
import { createObservable } from './observable';
import { useEffect, useValue, useState, useComputed, useRef } from './hooks';
import { eventHandler, updateAttr } from './attrs';
import { scheduler } from './scheduler'
import Walker from './walker'

const updatesWalker = new Walker;

export const mount = (hdom, $target) => {
  const [ $el, update ] = renderNode(hdom);
  window.update = update;
  update($target);
  // this wasn't needed before ?

  patch($target, $el);
}

export const renderNode = (vNode) => {
  const type = typeof vNode;
  if (type === 'boolean' || vNode == null) {
    return createEmptyNode();
  } else if (type === 'string' || type === 'number') {
    return createTextNode(vNode);
  } else if (type === 'function') {
    return createExpression(vNode);
  } else if (Array.isArray(vNode)) {
    return createFragment(vNode);
  } else if (typeof vNode.tagName === 'function'){
    return createComponent(vNode);
  }
  return createElement(vNode);
}

const createEmptyNode = () => [ document.createTextNode(''), false ]

const createTextNode = (text) => [ document.createTextNode(text), false ];

const createExpression = (fn) => {
  let resultCache, elementCache, updatesCache, destroyCache;
  const schedule = scheduler(updatesWalker.current);
  const destroy = () => {
    destroyCache && destroyCache();
  };
  const update = ($parent) => {
    const result = fn();

    if (result !== resultCache) {
      const [ element, updates, destroyUpdate ] = renderNode(result); // computed
      destroy();
      destroyCache = destroyUpdate;
      $parent && schedule(patch.bind(this, $parent, element, elementCache));
      elementCache = element;
      resultCache = result;
      updatesCache = updates;
    }
    updatesCache && updatesCache();
  };
  const stepOut = updatesWalker.stepIn(schedule);
  update();
  stepOut();
  return [ elementCache, update, destroy ];
};

const createFragment = (vNodes) => {
  const $elements = [];
  const updates = [];
  const destroyHandlers = [];

  vNodes.forEach(vNode => {
    // const [ $el ] = renderNode(vNode);
    const [ $el, update, destroy ] = renderNode(vNode);
    $elements.push($el);
    update && updates.push(update);
    destroy && destroyHandlers.push(destroy);
  });

  // Do we need fragments as function (reactive getter????)

  const update = ($parent) => {
    updates.forEach(update => update($parent));
  }

  const destroy = () => {
    updates.forEach(fn => fn());
  }

  return [ $elements, update, destroy ];
}

const createElement = ({ tagName, attrs, children }) => {
  // const updates = [];
  const schedule = scheduler(updatesWalker.current);

  const destroyHandlers = [];

  const $el = document.createElement(tagName);

  if (attrs) {
    for (const [k, v] of Object.entries(attrs)) {
      if (k.match(eventHandler)) {
        $el[k] = v;
      } else if (typeof v === 'function') {
        const update = updateAttr.bind(null, $el, k, v);
        // updates.push(update);
        v.subscribe(schedule.bind(null, update)); // this won't work with v.subscribe
        update();
      } else {
        $el.setAttribute(k, v);
      }
    }
  }

  if (children) {
    for (const child of children) {
      const stepOut = updatesWalker.stepIn(schedule)
      const [ element, update, destroyHandler ] = renderNode(child);
      stepOut();
      // update && updates.push(update);

      // no updates needed due to walker and the fact we dont support
      // children expression (we achieve the same with fragments)
      destroyHandler && destroyHandlers.push(destroyHandler);
      // update && update($el);
      patch($el, element);
    }
  }

  // const update = () => {
  //   updates.forEach(update => update($el))
  // };

  const destroy = () => {
    destroyHandlers.forEach(fn => fn())
  };

  return [ $el, update, destroy ];
}

const createComponent = ({ tagName: component, attrs, children }) => {
  const schedule = scheduler(updatesWalker.current)
  const unsubscribeList = [];
  const updateObservable = createObservable();
  const destroyObservable = createObservable();

  const destroy = () => {
    unsubscribeList.forEach( d => d());
    destroyObservable.message();
  };

  const update = (...args) => {
    updateDom(...args);
    updateObservable.message();
  }

  const connectState = (subscribe) => setTimeout(() => unsubscribeList.push(subscribe(update)));
  const [ $el, updateDom ] = renderNode(component({
    attrs,
    children,
    useEffect: useEffect.bind({
      subscribeToUpdates: updateObservable.subscribe,
      subscribeToDestroy: destroyObservable.subscribe
    }),
    useComputed: useComputed.bind(connectState),
    // useValue: hook.bind(connectState, createValue),
    // useState: hook.bind(connectState, createState)
    useValue: useValue.bind(connectState),
    useState: useState.bind(connectState),
    useRef
  }));

  return [ $el, update, destroy ];
}
