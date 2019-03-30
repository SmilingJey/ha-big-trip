
/**
 * Глубокое копирование объекта
 * @param {*} original
 * @return {*}
 */
function deepCopyData(original) {
  return JSON.parse(JSON.stringify(original));
}

export {deepCopyData};
