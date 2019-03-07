/**
 * Функция возвращает целое случайное число в диапазоне [0, max)
 * @param {*} max - максимальное число ()
 * @return {Node}
 */
function randomInteger(max) {
  return Math.floor(Math.random() * max);
}

/**
 * Функция возвращает случайный элемент массива
 * @param {Array} array - массив
 * @return {*} - случайный элемент массива
 */
function randomArrayItem(array) {
  return array[randomInteger(array.length)];
}

/**
 * Функция возвращает случайное булевое значение
 * @param {Number} chance - вероятность возвращения true, число в диапазоне
 * от 0 до 1. При chance=0 всегда возвращает false, при chance = 1 всегда
 * возвращает true ghb по умолчанию равна 0.5
 * @return {Boolean} случайное булевое значение
 */
function randomBoolean(chance = 0.5) {
  return Math.random() < chance;
}

/**
 * Создает новый массив случайно включая в него элементы из заданного массива
 * @param {Array} array массив из которого будутет создан новый
 * @return {Array} новый случайный массив
 */
function randomArrayFromArray(array) {
  return array.filter(() => randomBoolean());
}

export {randomInteger, randomArrayItem, randomBoolean, randomArrayFromArray};
