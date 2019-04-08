import Component from './component.js';
import calcTripPointCost from '../utils/calc-trippoint-cost.js';

const NO_DATA_TEXT = `---`;
/**
 * Описывает компонент, отображающий полную стоимость путешествия
 */
export default class TotalCost extends Component {
  constructor(getDataCallback) {
    super();
    this._getDataCallback = getDataCallback;
  }

  get template() {
    const templateElement = document.querySelector(`#total-cost-template`).content;
    const element = templateElement.querySelector(`.trip__total`).cloneNode(true);
    return element;
  }

  update() {
    this._ui.totalCostElement.textContent = `€ ` + this._calcTotalCost();
  }

  _getUiElements() {
    this._ui.totalCostElement = this._element.querySelector(`.trip__total-cost`);
  }

  /**
   * Вычисление полной стоимости путешествия
   * @return {String}
   */
  _calcTotalCost() {
    const data = this._getDataCallback();
    if (!data) {
      return NO_DATA_TEXT;
    }

    return data.reduce((cost, tripPoint) => {
      return cost + calcTripPointCost(tripPoint);
    }, 0);
  }
}
