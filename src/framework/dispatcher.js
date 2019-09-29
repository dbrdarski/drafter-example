import { createObservable } from './observable';

let queue, expression;
const createUpdate = () => {
  queue = createObservable();
  setTimeout(() => {
    queue[0]();
    queue = null;
  }, 0);
}
export const dispatcher = {
  register (subscribeFn) {
    expression.unsubscribe(subscribeFn(expression.target));
    expression.unsubscribeList.push(
      subscribe(expression.target)
    );
  },
  render (t) {
    // this.render.inProgress = true;
    this.target = t;
  },
  scheduleUpdate (update) {
    queue || createUpdate();
    return queue[1](update);
  }
};
