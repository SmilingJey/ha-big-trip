import Component from "./component";
import Filter from "./filter";

const FiltersData = [
  {
    name: `Everything`,
    filterFunction: () => true,
  },
  {
    name: `Future`,
    filterFunction: (tripPointDate) => tripPointDate.dateFrom > Date.now(),
  },
  {
    name: `Past`,
    filterFunction: (tripPointDate) => tripPointDate.dateFrom <= Date.now(),
  }
];

const DEFAULT_FILTER = `Everything`;

/**
 * Компонент отображает список фильтров
 */
export default class FilterList extends Component {
  constructor(getDataCallback) {
    super();
    this._filters = [];
    this._onFilter = null;
    this._getDataCallback = getDataCallback;
    this._activeFilterName = DEFAULT_FILTER;
  }

  /**
   * Установка обработчика события выбора фильтр
   * @param {Function} fn - обработчик
   */
  set onFilter(fn) {
    this._onFilter = fn;
  }

  get template() {
    const elem = document.createElement(`form`);
    elem.classList.add(`trip-filter`);
    return elem;
  }

  update() {
    for (const filter of this._filters) {
      filter.unrender();
    }
    const data = this._getDataCallback();
    for (const filterData of FiltersData) {
      filterData.isActive = filterData.name === this._activeFilterName;
      filterData.disabled = !data || !data.filter(filterData.filterFunction).length;
    }
    this._filters = FiltersData.map(this._createFilter.bind(this));
    const filtersFragment = document.createDocumentFragment();
    for (const filter of this._filters) {
      filtersFragment.appendChild(filter.render());
    }
    this._element.appendChild(filtersFragment);
  }

  hide() {
    this._element.style.visibility = `hidden`;
  }

  unhide() {
    this._element.style.visibility = `visible`;
  }

  unrender() {
    for (const filter of this._filters) {
      filter.unrender();
    }
    super.unrender();
  }

  /**
   * Создание фильтра
   * @param {Object} filterData - данные фильтра
   * @return {Object} - фильтр
   */
  _createFilter(filterData) {
    const filter = new Filter(filterData);
    filter.onFilter = (filterName, filterFunction) => {
      this._activeFilterName = filterName;
      if (typeof this._onFilter === `function`) {
        this._onFilter(filterFunction);
      }
    };
    return filter;
  }
}
