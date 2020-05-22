export const scheduler = (parent) => {
  let scheduled = false;
  const queue = [];
  const run = () => {
    queue.forEach(task => {
      task();
      queue.length = 0;
      scheduled = false;
    });
  };

  return function schedule (task) {
    scheduled || parent(run);
    queue.push(task);
  };
};
