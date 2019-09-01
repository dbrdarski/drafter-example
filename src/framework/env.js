export const env = {
  register(destroyFn){
    this.renderTargetUnsubscribe.push(destroyFn);
  }
};
