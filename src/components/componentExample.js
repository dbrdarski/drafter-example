// import { VAT, SomeStore } from '../stores';
import VAT from '../stores/VAT';

export default ({ createState, connectStore, createEffect, mix }) => {

  const updateState = createState({
    count: 0,
    todos: [],
    isActive: false
  });

  connectStore(VAT, ['VATRate', 'VATAmount']);
  // connectStore(SomeStore, ({ one, two, mutli: { three, four } }) => ({ one, two, three, four }));

  const onClick = window.clickFn = (e) => {
    updateState(state => state.count++);
  };

  createEffect(({ state }) => {
    document.title = `You clicked ${state.count} times`;
  });

  createEffect(({ attrs }) => {
    // const usubscribe = someAPI.subscribe(attrs.someProp);
    return unsubscribe;
  }, false);

  return (data) => {
    console.log("RENDER - ", data);    
  }
}
