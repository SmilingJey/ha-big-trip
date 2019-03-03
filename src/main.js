import createFilterElement from './filter.js';
import createMockTripPoint from './mock-trip-point.js';
import renderTripPoints from './render-trip-points.js';

/**
 * Отображение фильтров
 */
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

/**
 * Отображение точек маршрута
 */
function showTripPoints() {
  const tripPoints = Array(10).fill().map(createMockTripPoint);
  renderTripPoints(tripPoints);
}

showTripPoints();
