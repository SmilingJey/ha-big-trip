/**
 * Функция удаляет все дочерние элементы
 * @param {*} element - DOM элемент, из которого будут удалены дочерние
 */
function removeChilds(element) {
  while (element.firstChild) {
    element.removeChild(element.firstChild);
  }
}

export {removeChilds};
