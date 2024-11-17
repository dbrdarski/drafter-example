import VAT from './stores/VAT';
import { resolveMapper } from '../../drafter/src/store';
import { mountComponent } from '../../drafter/src/component';
import { createState } from '../../drafter/src/state';
import { createDOM, mount, createElement, diff } from '../../drafter/src/vdom';
import componentExample from './components/componentExample';

// window.a = createState({a: 1}).$state;
// const mapper = resolveMapper(['VATAmount'])

// (new VAT).subscribe((data) => {
//   console.log("VAT_SUBSCRIBE_FN", data)}
// )

window.createState = createState;

const createVApp = (count) => createElement('div', { id: 'app' },
  createElement('h1', {}, count),
  createElement('img', {
    src: 'https://media.giphy.com/media/hqfUzrSYHUMLmRaMNQ/giphy.gif'
  })
);

const App = ({ createState }) => {

  const updateState = createState({ count: 0 });

  setInterval(() => {
    updateState( state => state.count++ );
  }, 3000);

  return ({ attrs, state }) => createElement('div', { id: 'app' },
    createElement('h1', {}, state.count),
    createElement('img', {
      src: 'https://media.giphy.com/media/hqfUzrSYHUMLmRaMNQ/giphy.gif'
    })
  );
}

// mount(createElement(App), document.getElementById('app'));

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

window.VAT = VAT;
// window.Vat = new VAT;
// window.Vat2 = new VAT(mapper);

// const component = mountComponent(componentExample);
//
// window.createDOM = component.createDOM;
//
// window.mountComponent = mountComponent;
