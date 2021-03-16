export const scheduler = (subscribeToParent) => {
  let scheduled = false;
  const queue = [];
  const run = () => {
    queue.forEach(task => {
      task();
    });
    queue.length = 0;
    scheduled = false;
  };

  return function schedule (task) {
    scheduled || subscribeToParent(run);
    queue.push(task);
  };
};
