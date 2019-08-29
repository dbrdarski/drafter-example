export const createObservable = () => {
  let dirty = false;
  let observers = [];

  function update (newObserverList) {
    this.position = newObserverList.length;
    newObserverList.push(this);
  }

  const subscribe = (fn) => {
    const item = { fn, update, position: void 0 };
    item.update(observers);

    return () => {
      observers[item.position] = false;
      dirty = true;
    }
  };

  const message = ( msg ) => {
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
	};
  return {
    subscribe,
    message
  };
}
