import Component from './component.js';
import * as moment from 'moment';
import {removeChilds} from './utils/dom-utils.js';
import {TRIP_POINT_ICONS, TRIP_POINT_DESTINATION_TEXT} from './trip-point-types.js';

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

    this._type = data.type;
    this._destination = data.destination;
    this._date = data.date;
    this._startTime = data.startTime;
    this._endTime = data.endTime;
    this._price = data.price;
    this._offers = data.offers;

    this._onEdit = null;
    this._onEditClick = this._onEditClick.bind(this);
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
   * Задает обработчик события перехода в режим редактирования
   * @param {Function} fn - обработчки события
   */
  set onEdit(fn) {
    this._onEdit = fn;
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
    iconElement.textContent = TRIP_POINT_ICONS[this._type];
  }

  /**
   * Задает заголовок для элемента точки путешествия
   */
  _updateTitle() {
    const titleElement = this._element.querySelector(`.trip-point__title`);
    titleElement.textContent = `${TRIP_POINT_DESTINATION_TEXT[this._type]} ${this._destination}`;
  }

  /**
   * Задает время начала, окончания и длительность события
   */
  _updateTime() {
    const timeElement = this._element.querySelector(`.trip-point__timetable`);
    const startDateText = moment(this._startTime).format(`H:mm`);
    const dateDiff = moment(this._endTime).diff(moment(this._startTime));
    const hasEndTime = this._endTime && dateDiff >= 60 * 1000;
    const endDateText = hasEndTime ? ` - ${moment(this._endTime).format(`H:mm`)}` : ``;
    timeElement.textContent = `${startDateText}${endDateText}`;
    const durationElement = this._element.querySelector(`.trip-point__duration`);
    const MSEC_IN_HOUR = 60 * 60 * 1000;
    const diffFormat = (dateDiff >= MSEC_IN_HOUR) ? `H[H] mm[M]` : `m[M]`;
    const duration = moment(dateDiff).utc().format(diffFormat);

    durationElement.textContent = hasEndTime ? duration : ``;
  }

  /**
   * Функция задает стоимость для элемента точки путешествия
   */
  _updatePrice() {
    const priceElement = this._element.querySelector(`.trip-point__price`);
    priceElement.textContent = `€ ${this._price}`;
  }

  /**
   * Задает доступные офферы для элемента точки путешествия
   */
  _updateOffers() {
    const offersContainerElement = this._element.querySelector(`.trip-point__offers`);
    removeChilds(offersContainerElement);
    const availableOffers = this._offers.filter((offer) => !offer.isSelected);
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
    offerTextElement.textContent = `${offer.text} + € ${offer.price}`;
    return offerElement;
  }
}
