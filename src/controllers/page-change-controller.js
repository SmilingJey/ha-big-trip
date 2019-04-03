
/**
 * Переключение между страницами
 * @param {Object} config
 */
function initPageChangeController(config) {
  config.statisticLinkElement.addEventListener(`click`, (evt) => {
    config.tripTableElement.classList.remove(`view-switch__item--active`);
    config.statisticLinkElement.classList.add(`view-switch__item--active`);
    config.tripTableElement.classList.add(`visually-hidden`);
    config.filtersList.element.style.visibility = `hidden`;
    config.statistic.element.classList.remove(`visually-hidden`);
    config.statistic.update();
    evt.preventDefault();
  });

  config.tripTableLinkElement.addEventListener(`click`, (evt) => {
    config.tripTableElement.classList.add(`view-switch__item--active`);
    config.statisticLinkElement.classList.remove(`view-switch__item--active`);
    config.tripTableElement.classList.remove(`visually-hidden`);
    config.statistic.element.classList.add(`visually-hidden`);
    config.filtersList.element.style.visibility = `visible`;
    evt.preventDefault();
  });
}

export {initPageChangeController};
