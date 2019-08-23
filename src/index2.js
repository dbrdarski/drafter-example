import { createState } from '../../drafter/src/state';
const eventHandler = /^on[\w]+/g;
// const componentExample = (createState) => {
//   const updateState = createState({ greeting: 'Hello', color: 'white'});
//   return (
//     <div class="whatever" color={({ state }) => state.color }>{ ({state}) => `${state.greeting} world!` }</div>
//   );
// };

const h = (tagName, attrs = {}, ...children) => {
  return { tagName, attrs, children };
};

const patch = ($parent, $new, $old) => {
  const newList = Array.isArray($new);
  const oldList = Array.isArray($old);
  ( newList
    ? (oldList ? patchManyToMany : patchManyToOne)
    : (oldList ? patchOneToMany : patchOneToOne)
  )($parent, $new, $old)
};

const patchOneToOne = ($parent, $new, $old) => $old
    ? $parent.replaceChild($new, $old)
    : $parent.appendChild($new);

const patchManyToOne = ($parent, $new, $old) => $old
  ? ( $new.forEach($n => $parent.insertBefore($n, $old)), $parent.removeChild($oldNode))
  : $new.forEach($n => $parent.appendChild($n));

const patchOneToMany = ($parent, $new, $old) => $old
  ? ( $parent.insertBefore($new, $old[0]), $old.forEach($o => $parent.removeChild($o)) )
  : $parent.appendChild($new);

const patchManyToMany = ($parent, $newNode, $oldNodes) => {

};

const updateAttr = ($el, k, condition) => {
  const v = condition();
  if (v == null) {
    $el.removeAttribute(k);
  } else {
    switch (k) {
      case 'value': {
        $el[k] = v;
        break;
      }
      case 'style': {
        Object.assign($el.style, v);
        break;
      }
      default: {
        $el.setAttribute(k, v);
      }
    }
  }
  // console.log("UPDATE ATTRS")
};

// const createDOMElement = (vNode, $parent, $old) => {
//   const type = typeof vNode;
//   if (type === 'string' || type === 'number'){
//     const textNode = document.createTextNode(vNode);
//     $old
//       ? $parent.replaceChild(textNode, $old)
//       : $parent.appendChild(textNode);
//     return [ textNode ];
//   } else {
//     return renderNode(vNode)($parent);
//   }
// };

// const renderNode = (vNode) => {
//   let r = R(vNode);
//   // console.log(r)
//   return r;
// }
const renderNode = (vNode) => {
  const type = typeof vNode;
  if (type === 'boolean' || vNode == null) {
    return createEmptyNode();
  } else if (type === 'string' || type === 'number') {
    return createTextNode(vNode);
  } else if (type === 'function') {
    return createExpression(vNode);
  } else if (Array.isArray(vNode)) {
    return createFragment(vNode);
  } else {
    return createElement(vNode);
  }
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
      update && update($el);
      patch($el, element);
    }
  }

  const update = () => {
    updates.forEach(update => update($el))
  };

  return [ $el, update ]
}

// const resolveNode = (vNode, updates) => {
//   switch (typeof vNode) {
//     case 'undefined':
//     case 'boolean':
//       return createEmptyNode();
//     case 'number':
//     case 'string':
//       return createTextNode(vNode);
//     case 'function':
//       return createExpression(vNode);
//     default: {
//       return vNode
//         ? Array.isArray
//           ? createFragment(vNode)
//           : createElement(vNode)
//         : createEmptyNode();
//     }
//   }
// }

// const renderVNode = ({ tagName, attrs, children }) => {
//   const $el = document.createElement(tagName);
// }
//
// const renderNode = ({ tagName, attrs, children }) => {
//   const updates = [];
//   const $el = document.createElement(tagName);
//
//   if (attrs) {
//     for (const [k, v] of Object.entries(attrs)) {
//       if (k.match(eventHandler)) {
//         $el[k] = v;
//       } else if (typeof v === 'function') {
//         const update = updateAttr.bind(null, $el, k, v);
//         updates.push(update);
//         update();
//       } else {
//         $el.setAttribute(k, v);
//       }
//     }
//   }
//
//   if (children) {
//     for (const child of children) {
//       const type = typeof child;
//       if ( type === 'function' ) {
//         let c, $child, $updates;
//         // let $child = createDOMElement(c, $el);
//         const update = () => {
//           const d = child();
//           // console.log({d, c})
//           if (d !== c) {
//             const [ $newChild, $newUpdates ] = createDOMElement(d, $el, $child);
//             $child = $newChild;
//             c = d;
//           }
//           $updates && $updates();
//         };
//         updates.push(update);
//         update();
//         // console.log('SHOULD PUSH!', { updates })
//       } else {
//         const [$newEl, update ] = createDOMElement(child, $el);
//         update && updates.push(update);
//       }
//     }
//   }
//
//   const update = () => {
//     // console.log({ updates })
//     updates.forEach( u => u ())
//   };
//
//   return ($parent, $old) => {
//     // update();
//     $old
//     ? $parent.replaceChild($el, $old)
//     : $parent.appendChild($el);
//     // return $el;
//     return [ $el, update ];
//   }
// };

const componentExample = ({ createState } = {}) => {
  // const updateState = createState({ greeting: 'Hello', color: 'white'});
  const state = window.state = { greeting: 'Hello', color: 'blue'};
  return h(
    'div', {
      class: 'whatever',
      color: () => state.color
      // color: ({ state }) => state.color
    },
    h(
      'h2', {

      },
      () => `${state.greeting} world`,
      '!',
    ),
    h(
      'h3', {}, 'Hi, Dane!!!!!'
    )
    // ({state}) => `${state.greeting} world!`
  );
};

// console.log(componentExample());
// const example2 = ({ attrs, createState }) => {
//   const state = createState({ someState: 1 });
//   const user = connectStore(Auth);
//   return (
//     <div dynamicAttr={ () => attrs.dynamicAttr }>
//       <div class="static">Hello, {() => state.user.name }</div>
//       { () => state.user.hasSubscribers && (
//         <div class="subscribers">
//           Whatever, { () => state.user.name }
//         </div>
//       ) }
//       { () => state.someCondition
//         ? <Component1 user={state.user} />
//         : <Component2 user={state.user} />
//       }
//     </div>
//   )
// }
//
// const example3 = ({ attrs, createState }) => {
//   const state = createState({ someState:  });
//   const user = connectStore(Auth);
//   return (
//     <div dynamicAttr={ () => attrs.dynamicAttr }>
//       <div class="static">Hello, {() => state.user.name }</div>
//       <GUARD if={state.user.hasSubscribers}>
//         <div class="subscribers">
//           Whatever, { () => state.user.name }
//         </div>
//       </GUARD>
//       <IF>
//         ) }
//       { () => state.someCondition
//         ? <Component1 user={state.user} />
//         : <Component2 user={state.user} />
//       }
//       </IF>
//     </div>
//   )
// }


// const example4 = ({ createState, connectStore }) => {
//
//   const updateState = createState({
//     counter: 1,
//     input: ''
//   });
//
//   connectStore({ Auth });
//   connectStore({ VAT });
//
//   const onClick = () => {
//     updateState(({ state }) => state.counter++);
//   };
//
//   const removeSubscriber = (subscriber) => () => Channel.removeSubscriberById(subscriber.id);
//
//   return ({ attrs, state, Auth, Channel }) => {
//     const { user } = Auth;
//     return (
//       <div id="app" dynamicAttr={ attrs.dynamicAttr }>
//         <p class="static">Hello, { user.name }</p>
//         <p>You clicked { state.count } times!</p>
//         <button onclick={ onClick }>Click me!!!</button>
//         { $.and(user.hasSubscribers, (
//           <div class="subscribers">
//             <h1>Top subscriber</h1>
//             <p>{ Channel.subscribers[ Channel.TopUser ] }</p>
//             Whatever, { () => user.name }
//             <ul>
//               { Channel.subscribers.map( subscriber => {
//                 return (
//                   <li key={ subscriber.id }>
//                     <span>{ subscriber.name }</span>
//                     <button onClick={ removeSubscriber(subscriber) }>Remove</button>
//                   </li>
//                 ); }
//               ) }
//             </ul>
//           </div>
//         ) }
//         { $.if(
//           state.someCondition,
//           <div>No data found.</div>,
//           <Component2 user={ user } />
//         ) }
//       </div>
//     );
//   };
// };

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
const $and = (x, y) => (...args) => lift(x, args) && lift(y, args);
const $or = (x, y) => (...args) => lift(x, args) || lift(y, args);

// const $if = (x, y, z) => (...args) => lift(x, args) ? lift(y, args) : lift(z, args);

// const $if2 = (x, y, z) => {
//   let cache1, cache2, result;
//   return (...args) => {
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

const $if = (condition, x, y) => (...args) => lift(lift(condition ? x : y, args));

const $add = (x, y) => () => lift(x) + lift(y);
const $sub = (x, y) => () => lift(x) - lift(y);
const $multiply = (x, y) => () => lift(x) * lift(y);
const $divide = (x, y) => () => lift(x) / lift(y);
const $pow = (x, y) => () => lift(x) ** lift(y);
const $mod = (x, y) => () => lift(x) % lift(y);

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

// <p>{ $.get(Channel.subscribers, Channel.TopUser }</p>

var { $state, setState, subscribe } = createState({
  name: 'John Doe',
  count: 0,
  color: 'green'
});

window.$state = $state;
const incrementClicks = () => setState(state => state.count++);
const updateName = (e) => $state.name = e.target.value;
const selectColor = (e) => $state.color = e.target.value;

var attrs = { dynamicAttr: 2 };
var buttonStyle = () => ({
  background: $state.color,
  color: 'white',
  border: `5px solid ${$state.color}`
});

var colors = ['red', 'orange', 'purple', 'black'];

// const example4 = ({ connectStore } = {}) => {
//   // const updateState = createState({
//   //   counter: 1,
//   //   input: ''
//   // });
//
//   // connectStore({ Auth });
//   // connectStore({ VAT });
//   //
//   // const onClick = () => {
//     // updateState(({ state }) => state.counter++);
//   // };
//   //
//   // const removeSubscriber = (subscriber) => () => Channel.removeSubscriberById(subscriber.id);
//
//   // return () => {
//     // const { user } = Auth;
//
//     return h('div', {},
//       h('label', {
//         for: 'name'
//       }, 'Your name '),
//       h('br'),
//       h('input', {
//         type: 'text',
//         id: 'name',
//         value: () => $state.name,
//         oninput: updateName
//       }),
//       h('p', {},
//         () => `Hi, ${$state.name || 'John Doe'}! You have clicked ${$state.count} time${$state.count !== 1 ? 's' : ''} on the ${$state.color} button.`,
//       ),
//       h('button', {
//         style: buttonStyle,
//         onclick: incrementClicks
//       }, 'Increment!'),
//       h('p', {},
//         ...colors.map( color => h('label', { },
//           h('input', {
//             type: 'radio',
//             value: color,
//             name: 'color',
//             id: color,
//             onchange: selectColor
//           }),
//           color
//         )
//         )
//       )
//     );
//     // <div id="app" dynamicAttr={ attrs.dynamicAttr }>
//     //   <p class="static">Hello, { user.name }</p>
//     //   <p>You clicked { state.count } times!</p>
//     //   <button onclick={ console.log }>Click me!!!</button>
//     //   { $.and(user.hasSubscribers, (
//     //     <div class="subscribers">
//     //       <h1>Top subscriber</h1>
//     //       <p>{ Channel.subscribers[ Channel.TopUser ] }</p>
//     //       Whatever, { () => user.name }
//     //       <ul>
//     //         { Channel.subscribers.map( subscriber => {
//     //           return (
//     //             <li key={ subscriber.id }>
//     //               <span>{ subscriber.name }</span>
//     //               <button onClick={ removeSubscriber(subscriber) }>Remove</button>
//     //             </li>
//     //           ); }
//     //         ) }
//     //       </ul>
//     //     </div>
//     //   ) }
//     //   { $.if(
//     //     state.someCondition,
//     //     <div>No data found.</div>,
//     //     <Component2 user={ user } />
//     //   ) }
//     // </div>
//     // );
//   // };
// };

const example4 = ({ connectStore } = {}) => {
  return (
    <div>
      <label for="name">Your name</label>
      <br />
      <input type="text" id="name" value={() => $state.name} oninput={updateName} />
      <p> { () => `Hi, ${$state.name || 'John Doe'}! You have clicked ${$state.count} time${$state.count !== 1 ? 's' : ''} on the ${$state.color} button.` } </p>
      <button style={buttonStyle} onclick={incrementClicks}> Increment! </button>
      <p>
        { colors.map( color => <label>
            <input
              type="radio"
              value={color}
              name="color"
              id={color}
              onchange={selectColor}
            />
            { color }
          </label>
        ) }
      </p>
    </div>
  );

    // <div id="app" dynamicAttr={ attrs.dynamicAttr }>
    //   <p class="static">Hello, { user.name }</p>
    //   <p>You clicked { state.count } times!</p>
    //   <button onclick={ console.log }>Click me!!!</button>
    //   { $.and(user.hasSubscribers, (
    //     <div class="subscribers">
    //       <h1>Top subscriber</h1>
    //       <p>{ Channel.subscribers[ Channel.TopUser ] }</p>
    //       Whatever, { () => user.name }
    //       <ul>
    //         { Channel.subscribers.map( subscriber => {
    //           return (
    //             <li key={ subscriber.id }>
    //               <span>{ subscriber.name }</span>
    //               <button onClick={ removeSubscriber(subscriber) }>Remove</button>
    //             </li>
    //           ); }
    //         ) }
    //       </ul>
    //     </div>
    //   ) }
    //   { $.if(
    //     state.someCondition,
    //     <div>No data found.</div>,
    //     <Component2 user={ user } />
    //   ) }
    // </div>
    // );
  // };
};

// reactiveArray.map( reactiveItem => <div attr={reactiveItem.attr}>{ reactiveItem.content }</div> )

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

// window.vdom = renderNode(componentExample())(document.body);
const [ vdom, update ] = renderNode(example4());
patch(document.body, vdom);
subscribe(update, vdom);
Object.assign(window, { vdom, update });
// example4();

//
// renderNode::(vNode) => {
//   $el, ...children::map => createDOMElement(child, $el, null)
//   => ($parent, $old) => [ $el, update ] }
// createDOMElement::(vNode, $parent, $old) => vNode::string ? $textEl : renderNode(vNode)($parent, $old)
//
// bool, num, str => $el
//
// vNode => $el -> [...$els]
// children::map( patch( renderNode( child ) ) )
// arr
// fn
