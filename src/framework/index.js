import { createState } from './state.js';
import { renderNode } from './render.js';
import { patch } from './patch.js';
import { $and, $or, $if } from './extras.js';

export const env = { isRenderMode: true }

export const h = (tagName, attrs = {}, ...children) => {
  return { tagName, attrs, children };
};

export const mount = (hdom, $target) => {
  const [ $el, update ] = renderNode(hdom);
  window.update = update;
  patch($target, $el);
}

export default {
  h,
  mount,
  $if,
  $and,
  $or
}
