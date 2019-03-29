import Component from './component.js';
import * as moment from 'moment';
import {removeChilds} from '../utils/dom-utils.js';
import {TripPointType} from '../trip-point-type.js';
import {deepCopy} from '../utils/data-utils.js';
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
    this._data = deepCopy(data);

    this._onEdit = null;
    this._onEditClick = this._onEditClick.bind(this);
  }

  /**
   * Задает обработчик события перехода в режим редактирования
   * @param {Function} fn - обработчки события
   */
  set onEdit(fn) {
    this._onEdit = fn;
  }

  get data() {
    return this._data;
  }

  /**
   * Установка обработчиков событий
   */
  bind() {
    this._element.addEventListener(`click`, this._onEditClick);
  }

  /**
   * Удаление обработчиков событий
   */
  unbind() {
    this._element.removeEventListener(`click`, this._onEditClick);
  }

  /**
   * Возвращает пустой шаблон точки путешествия
   * @return {Node} - шаблон точки путешествия
   */
  get template() {
    const templateElement = document.querySelector(`#trip-point-template`).content;
    const element = templateElement.querySelector(`.trip-point`).cloneNode(true);
    return element;
  }

  /**
   * Отображение точки путешествия
   */
  update() {
    this._updateIcon();
    this._updateTitle();
    this._updateTime();
    this._updatePrice();
    this._updateOffers();
  }

  /**
   * Задает соответствующую иконку для элемента точки путешествия
   */
  _updateIcon() {
    const iconElement = this._element.querySelector(`.trip-icon`);
    iconElement.textContent = TripPointType[this._data.type].icon;
  }

  /**
   * Задает заголовок для элемента точки путешествия
   */
  _updateTitle() {
    const titleElement = this._element.querySelector(`.trip-point__title`);
    titleElement.textContent = `${TripPointType[this._data.type].destinationText} ${this._data.destination.name}`;
  }

  /**
   * Задает время начала, окончания и длительность события
   */
  _updateTime() {
    const timeElement = this._element.querySelector(`.trip-point__timetable`);
    const startDateText = moment(this._data.dateFrom).format(`D MMM H:mm`);
    const hasEndDate = this._data.dateTo && (this._data.dateFrom - this._data.dateTo);
    const isSameDay = moment(this._data.dateFrom).isSame(this._data.dateTo, `day`);
    const endDateFormat = isSameDay ? `H:mm` : `D MMM H:mm`;
    const endDateText = hasEndDate ? ` - ` + moment(this._data.dateTo).format(endDateFormat) : ``;
    timeElement.textContent = `${startDateText}${endDateText}`;
    const durationElement = this._element.querySelector(`.trip-point__duration`);
    durationElement.textContent = calcDurationString(this._data.dateFrom, this._data.dateTo);
  }

  /**
   * Функция задает стоимость для элемента точки путешествия
   */
  _updatePrice() {
    const priceElement = this._element.querySelector(`.trip-point__price`);
    priceElement.textContent = `€ ${calcTripPointCost(this._data)}`;
  }

  /**
   * Задает доступные офферы для элемента точки путешествия
   */
  _updateOffers() {
    const offersContainerElement = this._element.querySelector(`.trip-point__offers`);
    removeChilds(offersContainerElement);
    const availableOffers = this._data.offers.filter((offer) => !offer.accepted);
    for (const offerElement of availableOffers.map(this._renderTripPointOffer)) {
      offersContainerElement.prepend(offerElement);
    }
  }

  /**
   * Создает элемент оффера
   * @param {*} offer - данные оффера
   * @return {Node} - элемент оффера
   */
  _renderTripPointOffer(offer) {
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
}
