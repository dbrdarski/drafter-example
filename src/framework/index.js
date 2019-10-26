import { createState } from './state/index';
import { renderNode } from './render';
import { patch } from './patch';
import { $and, $or, $if } from './extras';

const env = { isRenderMode: true }

const h = (tagName, attrs = {}, ...children) => {
  return { tagName, attrs, children };
};

const mount = (hdom, $target) => {
  const [ $el, update ] = renderNode(hdom);
  window.update = update;
  patch($target, $el);
}

export {
  h,
  mount,
  $if,
  $and,
  $or
}
