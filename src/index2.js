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
    // console.log({$el, k, v, condition})
    $el.setAttribute(k, v);
  }
  console.log("UPDATE ATTRS")
};

const createDOMElement = (vNode, $parent, $old) => {
  const type = typeof vNode;
  if (type === 'string' || type === 'number'){
    const textNode = document.createTextNode(vNode);
    $old
      ? $parent.replaceChild(textNode, $old)
      : $parent.appendChild(textNode);
    return textNode;
  } else {
    return renderNode(vNode)($parent);
  }
}

const h = (tagName, attrs = {}, ...children) => {
  return { tagName, attrs, children };
}

const renderNode = ({ tagName, attrs, children }) => {
  const updates = [];
  const $el = document.createElement(tagName);

  for (const [k, v] of Object.entries(attrs)) {
    if (typeof v === 'function') {
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
      let c, $child;
      // let $child = createDOMElement(c, $el);
      const update = () => {
        const d = child();
        console.log({d, c})
        // if (d !== c) {
        $child = createDOMElement(d, $el, $child);
        c = d;
        // }
      };
      updates.push(update);
      update();
      console.log('SHOULD PUSH!', { updates })
    } else {
      createDOMElement(child, $el);
    }
  }

  const update = () => {
    console.log({ updates })
    updates.forEach( u => u ())
  };

  return ($parent, $old) => {
    // update();
    $old
    ? $parent.replaceChild($el, $old)
    : $parent.appendChild($el);
    return $el;
    // return [ $el, update ];
  }
}

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
window.vdom = renderNode(componentExample())(document.body);

const example2 = ({ attrs, createState }) => {
  const state = createState({ someState:  });
  const user = connectStore(Auth);
  return (
    <div dynamicAttr={ () => attrs.dynamicAttr }>
      <div class="static">Hello, {() => state.user.name }</div>
      { () => state.user.hasSubscribers && (
        <div class="subscribers">
          Whatever, { () => state.user.name }
        </div>
      ) }
      { () => state.someCondition
        ? <Component1 user={state.user} />
        : <Component2 user={state.user} />
      }
    </div>
  )
}

const example3 = ({ attrs, createState }) => {
  const state = createState({ someState:  });
  const user = connectStore(Auth);
  return (
    <div dynamicAttr={ () => attrs.dynamicAttr }>
      <div class="static">Hello, {() => state.user.name }</div>
      <GUARD if={state.user.hasSubscribers}>
        <div class="subscribers">
          Whatever, { () => state.user.name }
        </div>
      </GUARD>
      <IF>
        ) }
      { () => state.someCondition
        ? <Component1 user={state.user} />
        : <Component2 user={state.user} />
      }
      </IF>
    </div>
  )
}


const example4 = ({ createState, connectStore }) => {

  const updateState = createState({
    counter: 1,
    input: ''
  });

  connectStore({ Auth });
  connectStore({ VAT });

  const onClick = () => {
    updateState(({ state }) => state.counter++);
  };

  const removeSubscriber = (subscriber) => () => Channel.removeSubscriberById(subscriber.id);

  return ({ attrs, state, Auth, Channel }) => {
    const { user } = Auth;
    return (
      <div dynamicAttr={ attrs.dynamicAttr }>
        <p class="static">Hello, { user.name }</p>
        <p>You clicked { state.count } times!</p>
        <button onclick={ onClick }>Click me!!!</button>
        { $.and(user.hasSubscribers, (
          <div class="subscribers">
            Whatever, { () => user.name }
            <ul>
              { Channel.subscribers.map( subscriber => {
                return (
                  <li key={ subscriber.id }>
                    <span>{ subscriber.name }</span>
                    <button onClick={ removeSubscriber(subscriber) }>Remove</button>
                  </li>
                ); }
              ) }
            </ul>
          </div>
        ) }
        { $.if(
          state.someCondition,
          <Component1 user={ user } />,
          <Component2 user={ user } />
        ) }
      </div>
    );
  };
};

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

const $if = (x, y, z) => (...args) => lift(x, args) ? lift(y, args) : lift(z, args);

const $if2 = (x, y, z) => {
  let cache1, cache2, result;
  return (...args) => {
    const condition = lift(x, args);
    if (condition) {
      result = lift(y, args);
      if result !== void 0;
        cache1 = result;
    } else {
      result = lift(z, args);
      if result !== void 0;
        cache2 = result;
    }
    return result;
  };
};

const $if3 = (condition, ...outcomes) => {
  let result, cache = [];
  return (...args) => {
    const outcome = Number(!lift(x, args));
    result = lift(outcomes[outcome], args);
    if (result !== void 0) {
      cache[outcome] = result;
    }
    return result;
  };
};

const $add = (x, y) => () => lift(x) + lift(y);
const $sub = (x, y) => () => lift(x) - lift(y);
const $multiply = (x, y) => () => lift(x) * lift(y);
const $divide = (x, y) => () => lift(x) / lift(y);
const $pow = (x, y) => () => lift(x) ** lift(y);
const $mod = (x, y) => () => lift(x) % lift(y);
