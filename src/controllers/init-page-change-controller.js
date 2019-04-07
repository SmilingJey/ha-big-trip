
/**
 * Переключение между страницами
 * @param {Object} config
 */
export default function initPageChangeController(config) {
  config.statisticLinkElement.addEventListener(`click`, (evt) => {
    config.tripTableElement.classList.remove(`view-switch__item--active`);
    config.statisticLinkElement.classList.add(`view-switch__item--active`);
    config.tripTableElement.classList.add(`visually-hidden`);
    config.filtersList.hide();
    config.statistic.unhide();
    config.statistic.update();
    evt.preventDefault();
  });

  config.tripTableLinkElement.addEventListener(`click`, (evt) => {
    config.tripTableElement.classList.add(`view-switch__item--active`);
    config.statisticLinkElement.classList.remove(`view-switch__item--active`);
    config.tripTableElement.classList.remove(`visually-hidden`);
    config.statistic.hide();
    config.filtersList.unhide();
    evt.preventDefault();
  });
}
