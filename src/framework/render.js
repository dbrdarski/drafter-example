import { dispatcher } from './dispatcher';
import { patch } from './patch';
// import { createValue, createState, createComputed } from './state';
import { createObservable } from './observable';
import { useEffect, useValue, useState, useComputed, useRef } from './hooks';
import { eventHandler, updateAttr } from './attrs';

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
  let $parent,
      resultCache, elementCache, updatesCache,
      destroyCache, cancelUpdate = false;

  const destroy = () => {
    cancelUpdate && cancelUpdate(); // if called during an poending update, cancel it!
    destroyCache && destroyCache(); // TODO: This might need to be removed!

    destroyObservable.message();
    instance.unsubscribeList.forEach(f => f());
  };
  const destroyObservable = createObservable();

  const update = ($parentUpdate) => {
    cancelUpdate = false; // clears cancel update
    if ($parentUpdate) {
      $parent = $parentUpdate;
    }
    const result = fn();
    if (result !== resultCache) {
      const [ element, updates, destroyUpdate ] = renderNode(result);
      destroy();
      destroyCache = destroyUpdate;
      $parent && patch($parent, element, elementCache);
      elementCache = element;
      resultCache = result;
      updatesCache = updates;
    }
    updatesCache && updatesCache();
  };

  const scheduleUpdate = () => {
    if (!cancelUpdate) {
      cancelUpdate = dispatcher.scheduleUpdate(update); // puts the update into the dispatcher queue and return a cancel handler      
    }
  };

  const instance = {
    unsubscribe: destroyObservable.subscribe,
    unsubscribeList: [],
    target: scheduleUpdate,
    inProgress: true
  };

  dispatcher.render(instance);
  update();
  instance.inProgress = false;

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

  const update = ($parent) => {
    updates.forEach(update => update($parent));
  }

  const destroy = () => {
    updates.forEach(fn => fn());
  }

  return [ $elements, update, destroy ];
}

const createElement = ({ tagName, attrs, children }) => {
  const updates = [];
  const destroyHandlers = [];

  const $el = document.createElement(tagName);

  if (attrs) {
    for (const [k, v] of Object.entries(attrs)) {
      if (k.match(eventHandler)) {
        $el[k] = v;
      } else if (typeof v === 'function') {
        const update = updateAttr.bind(null, $el, k, v);
        updates.push(update);
        update();
      } else {
        $el.setAttribute(k, v);
      }
    }
  }

  if (children) {
    for (const child of children) {
      const [ element, update, destroyHandler ] = renderNode(child);
      update && updates.push(update);
      destroyHandler && destroyHandlers.push(destroyHandler);
      // update && update($el);
      patch($el, element);
    }
  }

  const update = () => {
    updates.forEach(update => update($el))
  };

  const destroy = () => {
    destroyHandlers.forEach(fn => fn())
  };

  return [ $el, update, destroy ];
}

const createComponent = ({ tagName: component, attrs, children }) => {
  const unsubscribeList = [];
  const updateObservable = createObservable();
  const destroyObservable = createObservable();

  const destroy = () => {
    unsubscribeList.forEach( d => d());
    destroyObservable.message();
  };

  // parentDestroy.subscribe()

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
