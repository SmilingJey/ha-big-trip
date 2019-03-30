import Component from './component.js';

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
    const filterInputElement = this._element.querySelector(`input`);
    filterInputElement.value = this._name;
    filterInputElement.checked = this._isActive;
    filterInputElement.disabled = this._disabled;
    filterInputElement.setAttribute(`id`, `filter-${this._name}`);

    const filterLabelElement = this._element.querySelector(`label`);
    filterLabelElement.textContent = this._name;
    filterLabelElement.setAttribute(`for`, `filter-${this._name}`);
  }

  bind() {
    const filterInputElement = this._element.querySelector(`input`);
    filterInputElement.addEventListener(`change`, this._onFiltrerChange);
  }

  unbind() {
    const filterInputElement = this._element.querySelector(`input`);
    filterInputElement.removeEventListener(`change`, this._onFiltrerChange);
  }

  _onFiltrerChange() {
    if (typeof this._onFilter === `function` && !this._disabled) {
      this._onFilter(this._name, this._filterFunction);
    }
  }
}
