/**
 * Устранение дребезка
 * @param {Function} cb - вызываемая функция
 * @param {Number} interval - задержка вызова
 * @return {Function} - функция фильтрующая частый вызов
 */
function debounce(cb, interval = 500) {
  let lastTimeout = null;

  return function (...parameters) {
    if (lastTimeout) {
      window.clearTimeout(lastTimeout);
    }
    lastTimeout = window.setTimeout(function () {
      cb(...parameters);
    }, interval);
  };
}

export {debounce};
