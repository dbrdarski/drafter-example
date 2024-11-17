import { createState } from './state.mjs';
import { renderNode } from './render.mjs';
import { patch } from './patch.mjs';
export { $and, $or, $if } from './extras.mjs';

export const env = { isRenderMode: true }

export const h = (tagName, attrs = {}, ...children) => {
  return { tagName, attrs, children };
};

export const mount = (hdom, $target) => {
  const [ $el, update ] = renderNode(hdom);
  window.update = update;
  patch($target, $el);
}
