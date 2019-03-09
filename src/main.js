import createFilterElement from './filter.js';
import TripPointsList from './trip-points-list.js';

/**
 * Отображение фильтров
 */
function renderFilters() {
  const filterDefinitions = [
    {
      id: `everything`,
      name: `Everything`,
      isActive: true,
      onChange: undefined
    },
    {
      id: `future`,
      name: `Future`,
      isActive: false,
      onChange: undefined
    },
    {
      id: `past`,
      name: `Past`,
      isActive: false,
      onChange: undefined
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

// Отображение точек маршрута
const tripPointsList = new TripPointsList();
document.querySelector(`main`).append(tripPointsList.render());


