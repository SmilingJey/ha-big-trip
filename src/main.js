import createFilterElement from './filter.js';

function renderFilters() {

  function showActiveFilter(evt) {
    console.log(evt.target.value);
  }

  const filterDefinitions = [
    {
      id: `everything`,
      name: `Everything`,
      isActive: true,
      onChange: showActiveFilter
    },
    {
      id: `future`,
      name: `Future`,
      isActive: false,
      onChange: showActiveFilter
    },
    {
      id: `past`,
      name: `Past`,
      isActive: false,
      onChange: showActiveFilter
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
