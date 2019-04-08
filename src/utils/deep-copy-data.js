
/**
 * Глубокое копирование объекта
 * @param {*} original
 * @return {*}
 */
export default function deepCopyData(original) {
  return JSON.parse(JSON.stringify(original));
}
