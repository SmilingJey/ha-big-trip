import TripPointsList from './trip-points-list.js';
import FilterList from './filters-list.js';
import Statistic from './statistic.js';

// Отображение точек маршрута
const tripPointsList = new TripPointsList();
document.querySelector(`main`).append(tripPointsList.render());

// Отображение фильтров
const filtersList = new FilterList();
filtersList.onFilter = (filterFunction) => {
  tripPointsList.filterFunction = filterFunction;
};
const filtersListContainerElement = document.querySelector(`.trip-controls__menus`);
filtersListContainerElement.appendChild(filtersList.render());

// Отображение статистики
const statistic = new Statistic(tripPointsList.getData);

document.querySelector(`body`).appendChild(statistic.render());
statistic.element.classList.add(`visually-hidden`);
const tableLinkElement = document.querySelector(`a[href="#table"]`);
const statsLinkElement = document.querySelector(`a[href="#stats"]`);
const mainElement = document.querySelector(`main`);

statsLinkElement.addEventListener(`click`, (evt) => {
  tableLinkElement.classList.remove(`view-switch__item--active`);
  statsLinkElement.classList.add(`view-switch__item--active`);
  mainElement.classList.add(`visually-hidden`);
  statistic.element.classList.remove(`visually-hidden`);
  statistic.update();
  evt.preventDefault();
});

tableLinkElement.addEventListener(`click`, (evt) => {
  tableLinkElement.classList.add(`view-switch__item--active`);
  statsLinkElement.classList.remove(`view-switch__item--active`);
  mainElement.classList.remove(`visually-hidden`);
  statistic.element.classList.add(`visually-hidden`);
  evt.preventDefault();
});

