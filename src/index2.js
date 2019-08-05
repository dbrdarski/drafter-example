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
