export const createObservable = (emitOnEqualValues = true) => {
  let dirty = false;
  let observers = [];
  let valueCache;

  function update (newObserverList) {
    this.position = newObserverList.length;
    newObserverList.push(this);
  }

  const subscribe = (fn) => {
    const item = { fn, update, position: void 0 };
    item.update(observers);

    return (newHandler) => {
      observers[item.position] = newHandler || false;
      if (!newHandler) dirty = true;
    }
  };

  const message = ( msg ) => {
    if (emitOnEqualValues || msg !== valueCache) {
      if (dirty) {
        let newObserverList = [];
        for (observers of observers) {
          if (observer) {
            observer.fn( msg );
            observer.update(newObserverList)
          }
        }
        observers = newObserverList;
        dirty = false;
      } else {
        observers.forEach(
          (o) => {
            return o.fn( msg )
          }
        );
      }
    }
	};
  return [
    message,
    subscribe
  ];
}
