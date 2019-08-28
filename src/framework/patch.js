export const patch = ($parent, $new, $old) => {
  const newList = Array.isArray($new);
  const oldList = Array.isArray($old);
  ( newList
    ? (oldList ? patchManyToMany : patchManyToOne)
    : (oldList ? patchOneToMany : patchOneToOne)
  )($parent, $new, $old)
};

const patchOneToOne = ($parent, $new, $old) => $old
  ? $parent.replaceChild($new, $old)
  : $parent.appendChild($new);

const patchManyToOne = ($parent, $new, $old) => $old
  ? ( $new.forEach($n => $parent.insertBefore($n, $old)), $parent.removeChild($old))
  : $new.forEach($n => $parent.appendChild($n));

const patchOneToMany = ($parent, $new, $old) => $old
  ? ( $parent.insertBefore($new, $old[0]), $old.forEach($o => $parent.removeChild($o)) )
  : $parent.appendChild($new);

const patchManyToMany = ($parent, $new, $old) => {
  const newLength = $new.length;
  const oldLength = $old.length;
  const min = Math.min(newLength, oldLength);
  const max = Math.max(newLength, oldLength);

  for (let i = 0; i < min; i++) {
    $parent.replaceChild($new[i], $old[i]);
  }

  if (newLength !== oldLength) {
    const addNew = newLength < oldLength;
    const method = addNew ? 'appendChild' : 'removeChild';
    const target = addNew ? $new : $old;
    for (let i = min; i < max; i++) {
      $parent[method](target[i]);
    }
  }
};
