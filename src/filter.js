import Component from './component.js';

export default class Filter extends Component {
  constructor(data) {
    super();
    this._id = data.id;
    this._name = data.name;
    this._filterFunction = data.filterFunction;
    this._isActive = data.isActive;
    this._onFilter = null;
    this._onFiltrerChange = this._onFiltrerChange.bind(this);
  }

  get template() {
    return document.querySelector(`#filter-template`).content.cloneNode(true);
  }

  set onFilter(fn) {
    this._onFilter = fn;
  }

  update() {
    const filterInputElement = this._element.querySelector(`input`);
    filterInputElement.value = this._id;
    filterInputElement.checked = this._isActive;
    filterInputElement.setAttribute(`id`, `filter-${this._id}`);

    const filterLabelElement = this._element.querySelector(`label`);
    filterLabelElement.textContent = this._name;
    filterLabelElement.setAttribute(`for`, `filter-${this._id}`);
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
    if (typeof this._onFilter === `function`) {
      this._onFilter(this._filterFunction);
    }
  }
}
