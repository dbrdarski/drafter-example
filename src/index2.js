import { createState } from '../../drafter/src/state';
const eventHandler = /^on[\w\d]+/g;
// const componentExample = (createState) => {
//   const updateState = createState({ greeting: 'Hello', color: 'white'});
//   return (
//     <div class="whatever" color={({ state }) => state.color }>{ ({state}) => `${state.greeting} world!` }</div>
//   );
// };

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

const createDOMElement = (vNode, $parent, $old) => {
  const type = typeof vNode;
  if (type === 'string' || type === 'number'){
    const textNode = document.createTextNode(vNode);
    $old
      ? $parent.replaceChild(textNode, $old)
      : $parent.appendChild(textNode);
    return [ textNode ];
  } else {
    return renderNode(vNode)($parent);
  }
};

const h = (tagName, attrs = {}, ...children) => {
  return { tagName, attrs, children };
};

const renderNode = ({ tagName, attrs, children }) => {
  const updates = [];
  const $el = document.createElement(tagName);

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

  for (const child of children) {
    const type = typeof child;
    if ( type === 'function' ) {
      let c, $child, $updates;
      // let $child = createDOMElement(c, $el);
      const update = () => {
        const d = child();
        // console.log({d, c})
        if (d !== c) {
          const [ $newChild, $newUpdates ] = createDOMElement(d, $el, $child);
          $child = $newChild;
          c = d;
        }
        $updates && $updates();
      };
      updates.push(update);
      update();
      // console.log('SHOULD PUSH!', { updates })
    } else {
      const [$newEl, update ] = createDOMElement(child, $el);
      update && updates.push(update)
    }
  }

  const update = () => {
    // console.log({ updates })
    updates.forEach( u => u ())
  };

  return ($parent, $old) => {
    // update();
    $old
    ? $parent.replaceChild($el, $old)
    : $parent.appendChild($el);
    // return $el;
    return [ $el, update ];
  }
};

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

var attrs = { dynamicAttr: 2 };
var buttonStyle = () => ({
  background: $state.color,
  color: 'white',
  border: `5px solid ${$state.color}`
});

const example4 = ({ connectStore } = {}) => {
  // const updateState = createState({
  //   counter: 1,
  //   input: ''
  // });

  // connectStore({ Auth });
  // connectStore({ VAT });
  //
  // const onClick = () => {
    // updateState(({ state }) => state.counter++);
  // };
  //
  // const removeSubscriber = (subscriber) => () => Channel.removeSubscriberById(subscriber.id);

  // return () => {
    // const { user } = Auth;
    return h('div', {},
      h('label', {
        for: 'name'
      }, 'Your name '),
      h('br'),
      h('input', {
        type: 'text',
        id: 'name',
        value: () => $state.name,
        oninput: updateName
      }),
      h('p', {},
        () => `Hi, ${$state.name || 'John Doe'}! You have clicked ${$state.count} time${$state.count !== 1 ? 's' : ''} on the ${$state.color} button.`,
      ),
      h('button', {
        style: buttonStyle,
        onclick: incrementClicks
      }, 'Increment!')
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


// window.vdom = renderNode(componentExample())(document.body);
const [ vdom, update ] = renderNode(example4())(document.body);
subscribe(update);
Object.assign(window, { vdom, update });
// example4();
