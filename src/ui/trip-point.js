import Component from './component.js';
import * as moment from 'moment';
import {removeChilds} from '../utils/dom-utils.js';
import TripPointType from '../data/trip-point-type.js';
import {deepCopyData} from '../utils/data-utils.js';
import {calcDurationString} from '../utils/date-utils.js';
import {calcTripPointCost} from '../utils/trip-utils.js';

/**
 * Описывает точку путешествия в режиме отображения в списке
 */
export default class TripPoint extends Component {
  /**
   * Конструктор класса
   * @param {Object} data - данные точки маршрута
   */
  constructor(data) {
    super();
    this._data = deepCopyData(data);
    this._onEdit = null;
    this._onAddOffer = null;
    this._onEditClick = this._onEditClick.bind(this);
    this._onAddOfferClick = this._onAddOfferClick.bind(this);
  }

  /**
   * Задает обработчик события перехода в режим редактирования
   * @param {Function} fn - обработчки события
   */
  set onEdit(fn) {
    this._onEdit = fn;
  }

  /**
   * Задает обработчик события добавления оффера к точке
   * @param {Function} fn - обработчки события
   */
  set onAddOffer(fn) {
    this._onAddOffer = fn;
  }

  get template() {
    const templateElement = document.querySelector(`#trip-point-template`).content;
    const element = templateElement.querySelector(`.trip-point`).cloneNode(true);
    return element;
  }

  update() {
    this._updateIcon();
    this._updateTitle();
    this._updateTime();
    this._updatePrice();
    this._updateOffers();
  }

  bind() {
    this._element.addEventListener(`click`, this._onEditClick);

    const offerButtons = this._element.querySelectorAll(`.trip-point__offer`);
    for (const offerButton of offerButtons) {
      offerButton.addEventListener(`click`, this._onAddOfferClick);
    }
  }

  unbind() {
    this._element.removeEventListener(`click`, this._onEditClick);

    const offerButtons = this._element.querySelectorAll(`.trip-point__offer`);
    for (const offerButton of offerButtons) {
      offerButton.removeEventListener(`click`, this._onAddOfferClick);
    }
  }

  _getUiElements() {
    this._ui.iconElement = this._element.querySelector(`.trip-icon`);
    this._ui.titleElement = this._element.querySelector(`.trip-point__title`);
    this._ui.timeElement = this._element.querySelector(`.trip-point__timetable`);
    this._ui.durationElement = this._element.querySelector(`.trip-point__duration`);
    this._ui.priceElement = this._element.querySelector(`.trip-point__price`);
    this._ui.offersContainerElement = this._element.querySelector(`.trip-point__offers`);
  }

  /**
   * Задает соответствующую иконку для элемента точки путешествия
   */
  _updateIcon() {
    this._ui.iconElement.textContent = TripPointType[this._data.type].icon;
  }

  /**
   * Задает заголовок для элемента точки путешествия
   */
  _updateTitle() {
    this._ui.titleElement.textContent = `${TripPointType[this._data.type].destinationText}
    ${this._data.destination.name}`;
  }

  /**
   * Задает время начала, окончания и длительность события
   */
  _updateTime() {
    const startDateText = moment(this._data.dateFrom).format(`D MMM H:mm`);
    const hasEndDate = this._data.dateTo && (this._data.dateFrom - this._data.dateTo);
    const isSameDay = moment(this._data.dateFrom).isSame(this._data.dateTo, `day`);
    const endDateFormat = isSameDay ? `H:mm` : `D MMM H:mm`;
    const endDateText = hasEndDate ? ` - ` + moment(this._data.dateTo).format(endDateFormat) : ``;
    this._ui.timeElement.textContent = `${startDateText}${endDateText}`;
    this._ui.textContent = calcDurationString(this._data.dateFrom, this._data.dateTo);
  }

  /**
   * Функция задает стоимость для элемента точки путешествия
   */
  _updatePrice() {
    this._ui.priceElement.textContent = `€ ${calcTripPointCost(this._data)}`;
  }

  /**
   * Задает доступные офферы для элемента точки путешествия
   */
  _updateOffers() {
    removeChilds(this._ui.offersContainerElement);
    const availableOffers = this._data.offers.slice(0, 3).filter((offer) => !offer.accepted);
    for (const offerElement of availableOffers.map(this._createTripPointOffer)) {
      this._ui.offersContainerElement.prepend(offerElement);
    }
  }

  /**
   * Создает элемент оффера
   * @param {*} offer - данные оффера
   * @return {Node} - элемент оффера
   */
  _createTripPointOffer(offer) {
    const offerTemlate = document.querySelector(`#trip-point-offer-template`).content;
    const offerElement = offerTemlate.cloneNode(true);
    const offerTextElement = offerElement.querySelector(`.trip-point__offer`);
    offerTextElement.textContent = `${offer.title} + € ${offer.price}`;
    return offerElement;
  }

  /**
   * Обработчик события перехода в режим редактирования
   * @param {Event} evt - событие
   */
  _onEditClick(evt) {
    if (typeof this._onEdit !== `function`) {
      return;
    }

    if (evt.target.tagName === `BUTTON`) {
      evt.stopPropagation();
      return;
    }
    this._onEdit();
  }

  /**
   * Обработчик события добавления оффера к точке путешествия
   * @param {Event} evt - событие
   */
  _onAddOfferClick(evt) {
    if (typeof this._onAddOffer === `function`) {
      const offerTitle = evt.target.textContent.split(` + `)[0];
      const newData = deepCopyData(this._data);
      const offer = newData.offers.find((item) => item.title === offerTitle);
      if (offer) {
        offer.accepted = true;
      }
      this._onAddOffer(newData);
    }
  }
}
