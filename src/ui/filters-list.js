import Component from "./component";
import Filter from "./filter";

const filtersData = [
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

/**
 * Класс представляет список фильтров
 */
export default class FilterList extends Component {
  constructor(getDataCallback) {
    super();
    this._filters = [];
    this._onFilter = null;
    this._getDataCallback = getDataCallback;
    this._activeFilterName = `Everything`;
  }

  /**
   * Установка обработчика события выбора фильтра
   * @param {Function} fn - обработчик
   */
  set onFilter(fn) {
    this._onFilter = fn;
  }

  /**
   * Возвращает пустой шаблон контейнера фильтров
   */
  get template() {
    const elem = document.createElement(`form`);
    elem.classList.add(`trip-filter`);
    return elem;
  }

  /**
   * Обновление списка фильтров
   */
  update() {
    for (const filter of this._filters) {
      filter.unrender();
    }
    const data = this._getDataCallback();
    for (const filterData of filtersData) {
      filterData.isActive = filterData.name === this._activeFilterName;
      filterData.disabled = !data || !data.filter(filterData.filterFunction).length;
    }
    this._filters = filtersData.map(this._createFilter.bind(this));
    const filtersFragment = document.createDocumentFragment();
    for (const filter of this._filters) {
      filtersFragment.appendChild(filter.render());
    }
    this._element.appendChild(filtersFragment);
  }

  /**
   * Удаление компонента
   */
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
