import { patch } from './patch';
// import { createValue, createState, createComputed } from './state';
import { useValue, useState, useComputed } from './hooks';
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
  let resultCache, elementCache, updatesCache;
  const update = ($parent) => {
    const result = fn();

    if (result !== resultCache) {
      const [ element, updates ] = renderNode(result);

      $parent && patch($parent, element, elementCache);
      elementCache = element;
      resultCache = result;
      updatesCache = updates;
    }
    updatesCache && updatesCache();
  };
  update();
  return [ elementCache, update ];
};

const createFragment = (vNodes) => {
  const $elements = [];
  const updates = [];
  vNodes.forEach(vNode => {
    // const [ $el ] = renderNode(vNode);
    const [ $el, update ] = renderNode(vNode);
    $elements.push($el);
    update && updates.push(update);
  });

  const update = ($parent) => {
    updates.forEach(update => update($parent));
  }

  return [ $elements, update ];
}

const createElement = ({ tagName, attrs, children }) => {
  const updates = [];
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
      const [ element, update ] = renderNode(child);
      update && updates.push(update);
      // update && update($el);
      patch($el, element);
    }
  }

  const update = () => {
    updates.forEach(update => update($el))
  };

  return [ $el, update ];
}

const createComponent = ({ tagName: component, attrs, children }) => {
  const unsubscribeList = [];
  const destroy = () => {
    unsubscribeList.forEach( d => d());
  };
  const connectState = (subscribe) => setTimeout(() => unsubscribeList.push(subscribe(update)));
  const [ $el, update ] = renderNode(component({
    attrs,
    children,
    useComputed: useComputed.bind(connectState),
    // useValue: hook.bind(connectState, createValue),
    // useState: hook.bind(connectState, createState)
    useValue: useValue.bind(connectState),
    useState: useState.bind(connectState)
  }));

  return [ $el, update, destroy ];
}
