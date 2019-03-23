import Component from "./component";
import Filter from "./filter";

const filtersData = [
  {
    id: `everything`,
    name: `Everything`,
    isActive: true,
    filterFunction: () => true,
  },
  {
    id: `future`,
    name: `Future`,
    filterFunction: (tripPointDate) => tripPointDate.date > Date.now(),
  },
  {
    id: `past`,
    name: `Past`,
    filterFunction: (tripPointDate) => tripPointDate.date <= Date.now(),
  }
];

/**
 * Класс представляет список фильтров
 */
export default class FilterList extends Component {
  constructor() {
    super();
    this._filters = [];
    this._onFilter = null;
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

    this._filters = filtersData.map(this._createFilter.bind(this));
    const filtersFragment = document.createDocumentFragment();
    for (const filter of this._filters) {
      filtersFragment.appendChild(filter.render());
    }
    this._element.appendChild(filtersFragment);
  }

  /**
   * Создание фильтра
   * @param {Object} filterData - данные фильтра
   * @return {Object} - фильтр
   */
  _createFilter(filterData) {
    const filter = new Filter(filterData);
    filter.onFilter = (filterFunction) => {
      if (typeof this._onFilter === `function`) {
        this._onFilter(filterFunction);
      }
    };
    return filter;
  }

  /**
   * Удаление компонента
   */
  unrender() {
    super.unrender();
    for (const filter of this._filters) {
      filter.unrender();
    }
  }
}
