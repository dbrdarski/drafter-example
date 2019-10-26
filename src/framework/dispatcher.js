import { createObservable } from './observable';

let run, subscribe, current, exprUpdate, exprCleanup_$;
const createUpdateCycle = () => {
  [ run, subscribe ] = createObservable();
  setTimeout(() => {
    run();
    run = subscribe = null;
  }, 0);
}
export const dispatcher = {
  renderInProgress: false,
  registerDep (subscribeToDep) {
    exprCleanup_$ && exprCleanup_$(subscribeToDep(exprUpdate));
  },
  renderExpression (expr) {
    let exprCache = exprUpdate;
    exprUpdate = expr;
    this.renderInProgress = true;
    exprUpdate(); // not sure about the second... or the first!
    this.renderInProgress = false;
    return dispatcher;
    exprUpdate = expreCache;
  },
  registerExpression (update, cleanup) {
    console.log("====RegisterExpression====", [ update, cleanup ])
    let cancel = false;
    const resolve = update.bind(() => { // resolve never gets called too!!!!! [2]
      console.log("====Resolve====")
      cancel = false;
    });
    exprCleanup_$ = cleanup;
    exprUpdate = () => {
      console.log("============================================================expreUpdate====")
      // ok, this is why this && this() never works in createExpression,
      // this code never gets called!!!!!!!!! [1]
      run || createUpdateCycle();
      if (!cancel) { // schedule update if not scheduled
        cancel = subscribe(resolve) // maybe I need to think how to unsubscrie after all
      }
    };
    return dispatcher;
  }
};
