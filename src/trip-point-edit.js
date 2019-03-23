import Component from './component.js';
import * as moment from 'moment';
import {removeChilds} from './utils/dom-utils.js';
import {TripPointType} from './trip-point-type.js';
import flatpickr from "flatpickr";

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
    this._date = data.date;
    this._startTime = data.startTime;
    this._endTime = data.endTime;
    this._price = data.price;
    this._offers = data.offers;
    this._isFavorite = data.isFavorite;
    this._destinationText = data.destinationText;
    this._photos = data.photos;

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
    const formData = new FormData(this._element.querySelector(`form`));
    const newData = this._processForm(formData);
    if (typeof this._onSubmit === `function`) {
      this._onSubmit(newData);
    }
  }

  /**
   * Создание объекта к описанием задачи из данных формы
   * @param {FormData} formData - данные формы
   * @return {Object} - объект с описанием задачи
   */
  _processForm(formData) {
    const newData = {
      type: formData.get(`travel-way`),
      destination: formData.get(`destination`),
      date: moment(formData.get(`day`), `MMM D`).toDate(),
      offers: [],
      startTime: null,
      endTime: null,
      price: parseFloat(formData.get(`price`)),
      isFavorite: formData.get(`favorite`) === `on`,
      destinationText: this._destinationText,
      photos: this._photos.slice(0),
    };

    const times = formData.get(`time`).split(` - `);
    newData.startTime = moment(times[0], `H:mm`).toDate();
    if (times.length > 1 && times[0] !== times[1]) {
      newData.endTime = moment(times[1], `H:mm`).toDate();
      if (moment(newData.endTime).isBefore(newData.startTime)) {
        newData.endTime = moment(newData.endTime).add(1, `day`).toDate();
      }
    } else {
      newData.endTime = newData.startTime;
    }

    newData.offers = this._offers.map((offer) => ({
      name: offer.name,
      text: offer.text,
      price: offer.price,
      isSelected: formData.getAll(`offer`).includes(offer.name),
    }));

    return newData;
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
      this._updateType(evt.target.value);

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
   * Выход из режима редактирования
   */
  cancelEdit() {
    if (typeof this._onCancel === `function`) {
      this._onCancel();
    }
  }

  /**
   * Обработчик нажатия клавиатуры
   * @param {*} evt - событие
   */
  _onESCkeydown(evt) {
    if (evt.keyCode === ESC_KEYCODE) {
      this.cancelEdit();
    }
  }

  /**
   * Установка обработчиков событий
   */
  bind() {
    this._element.querySelector(`form`).addEventListener(`submit`, this._onSubmitButtonClick);

    this._element.querySelector(`button[type=reset]`).addEventListener(`click`, this._onDeleteButtonClick);

    this._element.querySelector(`.travel-way__select`).addEventListener(`click`, this._onSelectTripPointTypeClick);

    const dateInputElement = this._element.querySelector(`input[name=day]`);
    flatpickr(dateInputElement, {
      altInput: true,
      altFormat: `M j`,
      dateFormat: `M j`,
      parseDate(date) {
        return moment(date, `MMM D`).toDate();
      },
    });

    const timeInputElement = this._element.querySelector(`input[name=time]`);
    flatpickr(timeInputElement, {
      enableTime: true,
      mode: `range`,
      // eslint-disable-next-line camelcase
      time_24hr: true,
      altInput: true,
      altFormat: `H:i`,
      dateFormat: `H:i`,
      defaultDate: [
        moment(this._startTime).format(`H:mm`),
        moment(this._endTime).format(`H:mm`)
      ],
      locale: {
        rangeSeparator: ` - `
      },
    });

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

  /**
   * Возвращает пустой шаблон редактирования точки путешествия
   * @return {Node} - шаблон редактирования точки путешествия
   */
  get template() {
    const templateElement = document.querySelector(`#trip-point-edit-template`).content;
    const element = templateElement.querySelector(`.point`).cloneNode(true);
    return element;
  }

  /**
   * Обновляет отображение элемента
   */
  update() {
    this._updateType(this._type);
    this._updateDestination();
    this._updateDate();
    this._updateTime();
    this._updatePrice();
    this._updateOffers();
    this._updateDestinationText();
    this._updateDestinationImages();
    this._updateIsFavotire();
  }

  /**
   * Задает тип события
   * @param {String} type - тип
   */
  _updateType(type) {
    const typeIconElement = this._element.querySelector(`.travel-way__label`);
    typeIconElement.textContent = TripPointType[type].icon;

    const destinationLabelElement = this._element.querySelector(`.point__destination-label`);
    destinationLabelElement.textContent = TripPointType[type].destinationText;

    const selectedRadioElement = this._element.querySelector(`#travel-way-${type}`);
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
   * Задает дату точки назначения
   */
  _updateDate() {
    const dateElement = this._element.querySelector(`input[name=day]`);
    dateElement.value = moment(this._date).format(`MMM D`).toUpperCase();
  }

  /**
   * Задает время начала и окончания события
   */
  _updateTime() {
    const timeElement = this._element.querySelector(`input[name=time]`);
    const startTimeText = moment(this._startTime).format(`H:mm`);
    const hasEndTime = this._endTime && this._endTime !== this._startTime;
    const endTimeText = hasEndTime ? ` TO ${moment(this._endTime).format(`H:mm`)}` : ``;
    timeElement.value = `${startTimeText}${endTimeText}`;
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
    if (!this._offers || !this._offers.length) {
      const offersElement = this._element.querySelector(`.point__offers`);
      offersElement.remove();
    } else {
      const offersContainerElement = this._element.querySelector(`.point__offers-wrap`);
      removeChilds(offersContainerElement);
      for (const offerElement of this._offers.map(this._renderTripPointOffer)) {
        offersContainerElement.prepend(offerElement);
      }
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

