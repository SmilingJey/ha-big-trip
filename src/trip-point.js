const tripPointTemplate = document.querySelector(`#trip-point-template`);

/**
 * Возвращает элемент, созданный из шаблона #trip-point-template
 * @param {Object} tripPointDefinition - описание точки маршрута
 * @return {Node} - возвращает элемент точки маршрута
 */
function createTripPointElement() {
  const taskElement = tripPointTemplate.content.querySelector(`.trip-point`).cloneNode(true);
  return taskElement;
}

export default createTripPointElement;
