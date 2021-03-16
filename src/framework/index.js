import { createState } from './state';
import { renderNode, mount } from './render';
import { patch } from './patch';
import { $and, $or, $if } from './extras';

const env = { isRenderMode: true }

const h = (tagName, attrs = {}, ...children) => {
  return { tagName, attrs, children };
};

export {
  h,
  mount,
  $if,
  $and,
  $or
}
