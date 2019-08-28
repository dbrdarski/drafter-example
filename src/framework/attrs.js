export const eventHandler = /^on[\w]+/g;

export const updateAttr = ($el, k, condition) => {
  const v = condition();
  if (v == null) {
    $el.removeAttribute(k);
  } else {
    switch (k) {
      case 'checked':
      case 'value': {
        $el[k] = v;
        break;
      }
      case 'style': {
        if (typeof v === 'string') {
          $el.style = v;
          break;
        }
        Object.assign($el.style, v);
        break;
      }
      default: {
        $el.setAttribute(k, v);
      }
    }
  }
};
