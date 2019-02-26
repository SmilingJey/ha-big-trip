import {randomInteger, removeChilds} from './utils.js';
import createFilterElement from './filter.js';
import createTripPointElement from './trip-point.js';

function renderFilters() {
  const filterDefinitions = [
    {
      id: `everything`,
      name: `Everything`,
      isActive: true,
      onChange: showTripPoints
    },
    {
      id: `future`,
      name: `Future`,
      isActive: false,
      onChange: showTripPoints
    },
    {
      id: `past`,
      name: `Past`,
      isActive: false,
      onChange: showTripPoints
    }
  ];

  const filtersFragment = document.createDocumentFragment();
  const filterElements = filterDefinitions.map(createFilterElement);

  for (const filterElement of filterElements) {
    filtersFragment.appendChild(filterElement);
  }

  const filtersContainerElement = document.querySelector(`.trip-filter`);
  filtersContainerElement.appendChild(filtersFragment);
}

renderFilters();


const tripPointsContainerElement = document.querySelector(`.trip-day__items`);

/**
 * Функция отображает случайное количество точек маршрута
 */
function showTripPoints() {
  removeChilds(tripPointsContainerElement);
  const tripPointCount = randomInteger(10);
  const tasksFragment = document.createDocumentFragment();
  for (let i = 0; i <= tripPointCount; i++) {
    tasksFragment.appendChild(createTripPointElement());
  }

  tripPointsContainerElement.appendChild(tasksFragment);
}

showTripPoints();
