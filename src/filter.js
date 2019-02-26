const filterTemlate = document.querySelector(`#filter-template`);

/**
 * Возвращает элемент фильтра, созданный из шаблона #filter-template
 * @param {Object} filterDefinition - описание фильтра
 * @return {Node} - возвращает элемент фильтра
 */
function createFilterElement(filterDefinition) {
  const filterElement = filterTemlate.content.cloneNode(true);

  const filterInputElement = filterElement.querySelector(`input`);
  filterInputElement.value = filterDefinition.id;
  filterInputElement.checked = filterDefinition.isActive;
  filterInputElement.setAttribute(`id`, `filter-${filterDefinition.id}`);
  filterInputElement.addEventListener(`change`, filterDefinition.onChange);

  const filterLabelElement = filterElement.querySelector(`label`);
  filterLabelElement.textContent = filterDefinition.name;
  filterLabelElement.setAttribute(`for`, `filter-${filterDefinition.id}`);

  return filterElement;
}

export default createFilterElement;
