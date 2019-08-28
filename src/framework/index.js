import { createState } from './state';
import { renderNode } from './render';
import { patch } from './patch';
import { $and, $or, $if } from './extras';

const env = { isRenderMode: true }

const h = (tagName, attrs = {}, ...children) => {
  return { tagName, attrs, children };
};

const mount = (hdom, $target) => {
  const [ $el, update ] = renderNode(hdom);
  patch($target, $el);
}

export {
  h,
  mount,
  $if,
  $and,
  $or
}
