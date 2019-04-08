/**
 * Функция удаляет все дочерние элементы
 * @param {*} element - DOM элемент, из которого будут удалены дочерние
 */
export default function removeChilds(element) {
  while (element.firstChild) {
    element.removeChild(element.firstChild);
  }
}
