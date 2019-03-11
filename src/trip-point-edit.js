import Component from './component.js';
import * as moment from 'moment';
import {removeChilds} from './utils/dom-utils.js';
import {TRIP_POINT_ICONS, TRIP_POINT_DESTINATION_TEXT} from './trip-point-types.js';

const ESC_KEYCODE = 27;

/**
 * Класс описывает точку путешествия в режиме редактирования
 */
export default class TripPointEdit extends Component {
  constructor(data) {
    super();
    this._number = TripPointEdit.number++;
    this._type = data.type;
    this._destination = data.destination;
    this._destinationText = data.destinationText;
    this._startDate = data.startDate;
    this._endDate = data.endDate;
    this._offers = data.offers;
    this._price = data.price;
    this._distination = data.distination;
    this._photos = data.photos;
    this._isFavorite = data.isFavorite;

    this._onSubmit = null;
    this._onSubmitButtonClick = this._onSubmitButtonClick.bind(this);
    this._onDelete = null;
    this._onDeleteButtonClick = this._onDeleteButtonClick.bind(this);
    this._onCancel = null;
    this._onESCkeydown = this._onESCkeydown.bind(this);
    this._onSelectTripPointTypeClick = this._onSelectTripPointTypeClick.bind(this);
  }

  /**
   * Задает обрабочик события клика на кнопку "Save"
   * @param {Function} fn - функция обработчик события
   */
  set onSubmit(fn) {
    this._onSubmit = fn;
  }

  /**
   * Обработчик события клика на кнопку сохранения точки путешествия
   * @param {*} evt  - событие
   */
  _onSubmitButtonClick(evt) {
    evt.preventDefault();
    if (typeof this._onSubmit === `function`) {
      this._onSubmit();
    }
  }

  /**
   * Задает обрабочик события клика на кнопку "Delete"
   * @param {Function} fn - функция обработчик события
   */
  set onDelete(fn) {
    this._onDelete = fn;
  }

  /**
   * Обработчик события клика на кнопку удаления точки путешествия
   * @param {*} evt - событие
   */
  _onDeleteButtonClick(evt) {
    evt.preventDefault();
    if (typeof this._onDelete === `function`) {
      this._onDelete();
    }
  }

  /**
   * Обработчик клика в окне выбора типа точки путешествия
   * @param {Event} evt - событие
   */
  _onSelectTripPointTypeClick(evt) {
    if (evt.target.classList.contains(`travel-way__select-input`)) {
      const typeIconElement = this._element.querySelector(`.travel-way__label`);
      typeIconElement.textContent = TRIP_POINT_ICONS[evt.target.value];

      const toogleElement = this._element.querySelector(`.travel-way__toggle`);
      toogleElement.checked = false;
    }
  }

  /**
   * Задает обрабочик события выхода без сохранения
   * @param {Function} fn - функция обработчик события
   */
  set onCancel(fn) {
    this._onCancel = fn;
  }

  /**
   * Обработчик нажатия клавиатуры
   * @param {*} evt - событие
   */
  _onESCkeydown(evt) {
    if (evt.keyCode === ESC_KEYCODE && typeof this._onCancel === `function`) {
      this._onCancel();
    }
  }

  /**
   * Установка обработчиков событий
   */
  bind() {
    this._element.querySelector(`form`).addEventListener(`submit`, this._onSubmitButtonClick);

    this._element.querySelector(`button[type=reset]`).addEventListener(`click`, this._onDeleteButtonClick);

    this._element.querySelector(`.travel-way__select`).addEventListener(`click`, this._onSelectTripPointTypeClick);

    document.addEventListener(`keydown`, this._onESCkeydown);
  }

  /**
   * Удаление обработчиков событий
   */
  unbind() {
    this._element.querySelector(`.point__button--save`).removeEventListener(`submit`, this._onSubmitButtonClick);

    this._element.querySelector(`button[type=reset]`).removeEventListener(`click`, this._onDeleteButtonClick);

    this._element.querySelector(`.travel-way__select`).removeEventListener(`click`, this._onSelectTripPointTypeClick);

    document.removeEventListener(`keydown`, this._onESCkeydown);
  }

  get template() {
    const templateElement = document.querySelector(`#trip-point-edit-template`).content;
    const element = templateElement.querySelector(`.point`).cloneNode(true);
    return element;
  }

  /**
   * Обновляет отображение элемента
   */
  update() {
    this._updateType();
    this._updateDestination();
    this._updateTime();
    this._updatePrice();
    this._updateOffers();
    this._updateDestinationText();
    this._updateDestinationImages();
  }

  /**
   * Задает тип события
   */
  _updateType() {
    const typeIconElement = this._element.querySelector(`.travel-way__label`);
    typeIconElement.textContent = TRIP_POINT_ICONS[this._type];

    const destinationLabelElement = this._element.querySelector(`.point__destination-label`);
    destinationLabelElement.textContent = TRIP_POINT_DESTINATION_TEXT[this._type];

    const selectedRadioElement = this._element.querySelector(`#travel-way-${this._type}`);
    selectedRadioElement.checked = true;
  }

  /**
   * Задает название точки назначения
   */
  _updateDestination() {
    const destinationInputElement = this._element.querySelector(`.point__destination-input`);
    destinationInputElement.value = this._destination;
  }

  /**
   * Задает время начала и окончания события
   */
  _updateTime() {
    const timeElement = this._element.querySelector(`input[name=time]`);
    const startTimeText = moment(this._startDate).format(`HH:mm`);
    const endTimeText = moment(this._endDate).format(`HH:mm`);
    timeElement.value = `${startTimeText} - ${endTimeText}`;
  }

  /**
   * задает стоимость
   */
  _updatePrice() {
    const priceElement = this._element.querySelector(`input[name=price]`);
    priceElement.value = this._price;
  }

  /**
   * Задает доступные офферы
   */
  _updateOffers() {
    const offersContainerElement = this._element.querySelector(`.point__offers-wrap`);
    removeChilds(offersContainerElement);
    for (const offerElement of this._offers.map(this._renderTripPointOffer)) {
      offersContainerElement.prepend(offerElement);
    }
  }

  /**
   * Создает элемент оффера
   * @param {*} offer - параметры оффера
   * @return {Node} - элемент оффера
   */
  _renderTripPointOffer(offer) {
    const offerTemlate = document.querySelector(`#trip-point-edit-offer-template`).content;
    const offerElement = offerTemlate.cloneNode(true);
    const inputElement = offerElement.querySelector(`.point__offers-input`);
    inputElement.id = offer.name;
    inputElement.value = offer.name;
    inputElement.checked = offer.isSelected;
    const labelElement = offerElement.querySelector(`.point__offers-label`);
    labelElement.htmlFor = offer.name;
    const nameElement = offerElement.querySelector(`.point__offer-service`);
    nameElement.textContent = offer.text;
    const priceElement = offerElement.querySelector(`.point__offer-price`);
    priceElement.textContent = offer.price;
    return offerElement;
  }

  /**
   * Задает описание точки назначения
   */
  _updateDestinationText() {
    const destinationTextElement = this._element.querySelector(`.point__destination-text`);
    destinationTextElement.textContent = this._destinationText;
  }

  /**
   * Задает изображения точки назначения
   */
  _updateDestinationImages() {
    const imagesComtainerElement = this._element.querySelector(`.point__destination-images`);
    removeChilds(imagesComtainerElement);
    for (const imageElement of this._photos.map(this._renderDestinationImage)) {
      imagesComtainerElement.prepend(imageElement);
    }
  }

  /**
   * Создает элемент изображения описания точки назначения
   * @param {*} image - ссылка на изображение
   * @return {Node} - элемент изображения
   */
  _renderDestinationImage(image) {
    const imageElement = document.createElement(`img`);
    imageElement.src = image;
    imageElement.alt = `picture from place`;
    imageElement.classList.add(`point__destination-image`);
    return imageElement;
  }

  /**
   * Задает состояние элемента "Избранный"
   */
  _updateIsFavotire() {
    const favoriteElement = this._element.querySelector(`input[name=favorite]`);
    favoriteElement.checked = this._isFavorite;
  }
}

TripPointEdit.number = 0;

