export const createObservable = () => {
  let dirty = false;
  let observers = [];

  const subscribe = (fn) => {
    // if (fn == null) { debugger; }
    let position = observers.length;
    const update = (newObserverList) => {
      position = newObserverList.length;
      newObserverList.push(item);
    };
    const item = { fn, update };
    update(observers);

    return () => {
      observers[position] = false;
      dirty = true;
    }
  };

  const message = (  msg  ) => {
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
