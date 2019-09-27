import { createObservable } from './observable';

let queue, render;
const createUpdate = () => {
  queue = createObservable();
  setTimeout(() => {
    queue.message();
    queue = null;
  }, 0);
}
export const dispatcher = {
  register (subscribe) {
    render.unsubscribe(subscribe(render.target));
    render.unsubscribeList.push(
      subscribe(render.target)
    );
  },
  render (t) {
    // this.render.inProgress = true;
    this.target = t;
  },
  scheduleUpdate (update) {
    queue || createUpdate();
    return queue.subscribe(update);
  }
};
