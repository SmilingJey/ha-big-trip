/**
 * Устранение дребезка
 * @param {Function} cb - вызываемая функция
 * @param {Number} interval - задержка вызова
 * @return {Function} - функция фильтрующая частый вызов
 */
const DEFAULT_DEBOUNCE_TIME = 500;

export default function debounce(cb, interval = DEFAULT_DEBOUNCE_TIME) {
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
