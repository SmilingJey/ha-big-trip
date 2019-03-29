
/**
 * Глубокое копирование объекта
 * @param {Object} original
 * @return {Object}
 */
function deepCopy(original) {
  let clone = Object.create(Object.getPrototypeOf(original));
  let keys = Object.getOwnPropertyNames(original);
  for (let i = 0; i < keys.length; i++) {
    let descriptor = Object.getOwnPropertyDescriptor(original, keys[i]);
    if (descriptor.value && typeof descriptor.value === `object`) {
      descriptor.value = deepCopy(descriptor.value);
    }
    Object.defineProperty(clone, keys[i], descriptor);
  }
  return clone;
}

export {deepCopy};
