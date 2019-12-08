import { dispatcher } from './dispatcher';
import { patch } from './patch';
// import { createValue, createState, createComputed } from './state/index';
import { createObservable } from './observable';
import { useEffect, useValue, useState, useComputed, useRef } from './hooks';
import { eventHandler, createAttrs, objectSpreadProxy } from './attrs';

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
  let $parent, resultCache, elementCache,
      updatesCache, destroyCache, cancelUpdate = false;

  // dispatcher.render() -> setCurrent renderTarget
  const destroy = () => {
    cancelUpdate && cancelUpdate(); // if called during an pending update, cancel it!
    destroyCache && destroyCache(); // TODO: This might need to be removed!
    cleanup();
    // instance.unsubscribeList.forEach(f => f());
  };

  const updateDestroyer = (destroyUpdate) => {
    destroyCache = (destroyCache ? subscribeToDestroyOb : destroyUpdate)(destroyUpdate);
  }

  const [ cleanup, subscribeToCleanup ] = createObservable();
  const update = function ($parentUpdate) {
    console.log({ $parentUpdate })
    this && this();
    console.log({ that: this })
    // cancelUpdate = false; // clears cancel update
    if ($parentUpdate) $parent = $parentUpdate;
    const result = fn();
    if (result !== resultCache) {
      const [ element, updates, destroyUpdate ] = renderNode(result);
      destroy();
      destroyCache = destroyUpdate;
      // updateDestroyer(destroyUpdate);
      $parent && patch($parent, element, elementCache);
      elementCache = element;
      resultCache = result;
      // updatesCache = updates;
    }
    updatesCache && updatesCache(); // this needs to go with new subscription system
  };

  // dispatcher.registerExpression(update, subscribeToCleanup)
  // dispatcher.enderExpression(update)
  update();

  // const scheduleUpdate = () => {
  //   if (!cancelUpdate) {
  //     cancelUpdate = dispatcher.scheduleUpdate(update); // puts the update into the dispatcher queue and return a cancel handler
  //   }
  // };

  // const instance = {
  //   unsubscribe: subscribeToCleanup,
    // unsubscribeList: [],
  //   target: scheduleUpdate,
  //   inProgress: true
  // };

  // dispatcher.render(instance);
  // instance.inProgress = false;

  return [ elementCache, update, destroyCache ];
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
    if (typeof attrs === 'function') {

    } else {
      createAttrs(attrs, $el, updates)
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
  const [ updateObservableMessage, updateObservableSubscribe ] = createObservable();
  const [ destroyObservableMessage, subscribeToDestroyOb ] = createObservable();

  const destroy = () => {
    unsubscribeList.forEach( d => d());
    destroyObservableMessage();
  };

  // parentDestroy.subscribe()

  const update = (...args) => {
    updateDom(...args);
    updateObservableMessage();
  }

  const connectState = (subscribe) => setTimeout(() => unsubscribeList.push(subscribe(update)));
  const [ $el, updateDom ] = renderNode(component({
    attrs,
    children,
    useEffect: useEffect.bind({
      subscribeToUpdates: updateObservableSubscribe,
      subscribeToDestroy: subscribeToDestroyOb
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
