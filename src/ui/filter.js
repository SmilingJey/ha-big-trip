import Component from './component.js';

/**
 * Компонент отвечает за отобращение фильтра
 */
export default class Filter extends Component {
  constructor(data) {
    super();
    this._name = data.name;
    this._filterFunction = data.filterFunction;
    this._isActive = data.isActive;
    this._disabled = data.disabled;
    this._onFilter = null;
    this._onFiltrerChange = this._onFiltrerChange.bind(this);
  }

  get template() {
    const filterTemplate = document.querySelector(`#filter-template`).content.cloneNode(true);
    return filterTemplate.querySelector(`.trip-filter__container`);
  }

  set onFilter(fn) {
    this._onFilter = fn;
  }

  update() {
    this._ui.filterInputElement.value = this._name;
    this._ui.filterInputElement.checked = this._isActive;
    this._ui.filterInputElement.disabled = this._disabled;
    this._ui.filterInputElement.setAttribute(`id`, `filter-${this._name}`);
    this._ui.filterLabelElement.textContent = this._name;
    this._ui.filterLabelElement.setAttribute(`for`, `filter-${this._name}`);
  }

  bind() {
    this._ui.filterInputElement.addEventListener(`change`, this._onFiltrerChange);
  }

  unbind() {
    this._ui.filterInputElement.removeEventListener(`change`, this._onFiltrerChange);
  }

  _getUiElements() {
    this._ui.filterInputElement = this._element.querySelector(`input`);
    this._ui.filterLabelElement = this._element.querySelector(`label`);
  }

  /**
   * Обработчик события клика по фильтру
   */
  _onFiltrerChange() {
    if (typeof this._onFilter === `function` && !this._disabled) {
      this._onFilter(this._name, this._filterFunction);
    }
  }
}
