import Component from './component.js';
import * as moment from 'moment';
import {removeChilds} from '../utils/dom-utils.js';
import {TripPointType} from '../trip-point-type.js';
import flatpickr from "flatpickr";
import {deepCopy} from '../utils/data-utils.js';
import {debounce} from '../utils/events-utils.js';

/**
 * Класс описывает точку путешествия в режиме редактирования
 */
export default class TripPointEdit extends Component {
  constructor({data, destinationsData, availableOffersData}) {
    super();
    this._data = deepCopy(data);
    this._destinationsData = destinationsData;
    this._availableOffersData = availableOffersData;

    this._onSubmit = null;
    this._onSubmitButtonClick = this._onSubmitButtonClick.bind(this);
    this._onDelete = null;
    this._onDeleteButtonClick = this._onDeleteButtonClick.bind(this);
    this._onCancel = null;
    this._onESCkeydown = this._onESCkeydown.bind(this);

    this._onSelectTripPointTypeClick = this._onSelectTripPointTypeClick.bind(this);
    this._onDestinationChange = this._onDestinationChange.bind(this);
    this._onDestinationKeyUp = this._onDestinationKeyUp.bind(this);

    this._flatpickrDateFrom = null;
    this._flatpickrDateTo = null;

    this._offerId = 0;

    this._changeDestinationDescription = debounce(this._changeDestinationDescription.bind(this));
  }

  /**
   * Задает обрабочик события клика на кнопку "Save"
   * @param {Function} fn - функция обработчик события
   */
  set onSubmit(fn) {
    this._onSubmit = fn;
  }

  /**
   * Задает обрабочик события клика на кнопку "Delete"
   * @param {Function} fn - функция обработчик события
   */
  set onDelete(fn) {
    this._onDelete = fn;
  }

  /**
   * Задает обрабочик события выхода без сохранения
   * @param {Function} fn - функция обработчик события
   */
  set onCancel(fn) {
    this._onCancel = fn;
  }

  /**
   * Установка обработчиков событий
   */
  bind() {
    this._element.querySelector(`form`).addEventListener(`submit`, this._onSubmitButtonClick);
    this._element.querySelector(`button[type=reset]`).addEventListener(`click`, this._onDeleteButtonClick);
    this._element.querySelector(`.travel-way__select`).addEventListener(`click`, this._onSelectTripPointTypeClick);
    this._element.querySelector(`.point__destination-input`).addEventListener(`change`, this._onDestinationChange);
    this._element.querySelector(`.point__destination-input`).addEventListener(`keyup`, this._onDestinationKeyUp);

    const dateStartInputElement = this._element.querySelector(`input[name='date-start']`);
    this._flatpickrDateFrom = flatpickr(dateStartInputElement, {
      enableTime: true,
      // eslint-disable-next-line camelcase
      time_24hr: true,
      altInput: true,
      altFormat: `j M H:i`,
      dateFormat: `j M Y H:i`,
      defaultDate: [
        moment(this._data.dateFrom).format(`D MMM YYYY H:mm`),
      ],
    });

    const dateEndInputElement = this._element.querySelector(`input[name='date-end']`);
    this._flatpickrDateTo = flatpickr(dateEndInputElement, {
      enableTime: true,
      // eslint-disable-next-line camelcase
      time_24hr: true,
      altInput: true,
      altFormat: `j M H:i`,
      dateFormat: `j M Y H:i`,
      defaultDate: [
        moment(this._data.dateTo).format(`D MMM YYYY H:mm`),
      ],
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
    this._element.querySelector(`.point__destination-input`).removeEventListener(`change`, this._onDestinationChange);
    this._element.querySelector(`.point__destination-input`).removeEventListener(`keyup`, this._onDestinationKeyUp);

    document.removeEventListener(`keydown`, this._onESCkeydown);
    if (this._flatpickrDateFrom) {
      this._flatpickrDateFrom.destroy();
    }
    if (this._flatpickrDateTo) {
      this._flatpickrDateTo.destroy();
    }
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
    this._updateType(this._data.type);
    this._updateDestination();
    this._updateDestinationsDatalist();
    this._updateDate();
    this._updatePrice();
    this._updateOffers(this._data.offers);
    this._updateIsFavotire();
    this._updateDestinationText(this._data.destination.description);
    this._updateDestinationImages(this._data.destination.pictures);
  }

  /**
   * Потрясти
   */
  shake() {
    const ANIMATION_TIMEOUT = 600;
    this._element.style.animation = `shake ${ANIMATION_TIMEOUT / 1000}s`;
    setTimeout(() => {
      this._element.style.animation = ``;
    }, ANIMATION_TIMEOUT);
  }

  savingBlock() {
    this._element.querySelector(`.point__button--save`).textContent = `saving ...`;
    this.setInputBlock(true);
  }

  deletingBlock() {
    this._element.querySelector(`button[type=reset]`).textContent = `deleting ...`;
    this.setInputBlock(true);
  }

  unblock() {
    this._element.querySelector(`.point__button--save`).textContent = `Save`;
    this._element.querySelector(`button[type=reset]`).textContent = `Delete`;
    this.setInputBlock(false);
  }

  setInputBlock(isBlock) {
    const controlElements = this._element.querySelectorAll(`input, button, textarea`);
    for (const controlElement of controlElements) {
      controlElement.disabled = isBlock;
    }
  }

  changesUnsaved() {
    this._element.classList.add(`unsaved`);
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
    destinationInputElement.value = this._data.destination.name;
  }

  /**
   * Задает список доступных точек назначения
   */
  _updateDestinationsDatalist() {
    const datalistElement = this._element.querySelector(`#destination-select`);
    removeChilds(datalistElement);
    const destinations = this._destinationsData.getDestinations();

    if (destinations) {
      const optionsElements = destinations.map((destination) => {
        const optionsElement = document.createElement(`option`);
        optionsElement.value = destination;
        return optionsElement;
      });

      for (const optionsElement of optionsElements) {
        datalistElement.appendChild(optionsElement);
      }
    }
  }

  /**
   * Задает время начала и окончания события
   */
  _updateDate() {
    const dateStartElement = this._element.querySelector(`input[name='date-start']`);
    dateStartElement.value = moment(this._data.dateFrom).format(`D MMM H:mm`);
    const dateEndElement = this._element.querySelector(`input[name='date-end']`);
    dateEndElement.value = this._data.dateTo ? moment(this._data.dateTo).format(`D MMM H:mm`) : ``;
  }

  /**
   * Задает стоимость
   */
  _updatePrice() {
    const priceElement = this._element.querySelector(`input[name=price]`);
    priceElement.value = this._data.price;
  }

  /**
   * Задает доступные офферы
   * @param {Array} offers - массив с доступными офферами
   */
  _updateOffers(offers) {
    const offersContainerElement = this._element.querySelector(`.point__offers-wrap`);
    removeChilds(offersContainerElement);
    if (offers && offers.length) {
      for (const offerElement of offers.map(this._renderTripPointOffer.bind(this))) {
        offersContainerElement.prepend(offerElement);
      }
    } else {
      offersContainerElement.textContent = `No avaliable offres`;
    }
  }

  /**
   * Создает элемент оффера
   * @param {*} offer - параметры оффера
   * @return {Node} - элемент оффера
   */
  _renderTripPointOffer(offer) {
    this._offerId++;
    const offerTemlate = document.querySelector(`#trip-point-edit-offer-template`).content;
    const offerElement = offerTemlate.cloneNode(true);
    const inputElement = offerElement.querySelector(`.point__offers-input`);
    const uniqueId = `offer-${this._data.id}-${this._offerId}`;
    inputElement.id = uniqueId;
    inputElement.value = offer.title;
    inputElement.checked = offer.accepted;
    const labelElement = offerElement.querySelector(`.point__offers-label`);
    labelElement.htmlFor = uniqueId;
    const nameElement = offerElement.querySelector(`.point__offer-service`);
    nameElement.textContent = offer.title;
    const priceElement = offerElement.querySelector(`.point__offer-price`);
    priceElement.textContent = offer.price;
    return offerElement;
  }

  /**
   * Задает описание точки назначения
   * @param {String} description - описание
   */
  _updateDestinationText(description) {
    const destinationTextElement = this._element.querySelector(`.point__destination-text`);
    destinationTextElement.textContent = description ? description : `No description`;
  }

  /**
   * Задает изображения точки назначения
   * @param {Array} images - массив с изображениями
   */
  _updateDestinationImages(images) {
    const imagesComtainerElement = this._element.querySelector(`.point__destination-images`);
    removeChilds(imagesComtainerElement);
    if (!images || !images.length) {
      imagesComtainerElement.classList.add(`visually-hidden`);
    } else {
      imagesComtainerElement.classList.remove(`visually-hidden`);
      for (const imageElement of images.map(this._renderDestinationImage)) {
        imagesComtainerElement.prepend(imageElement);
      }
    }
  }

  /**
   * Создает элемент изображения описания точки назначения
   * @param {*} image - ссылка на изображение
   * @return {Node} - элемент изображения
   */
  _renderDestinationImage(image) {
    const imageElement = document.createElement(`img`);
    imageElement.src = image.src;
    imageElement.alt = image.description;
    imageElement.classList.add(`point__destination-image`);
    return imageElement;
  }

  /**
   * Задает состояние элемента "Избранный"
   */
  _updateIsFavotire() {
    const favoriteElement = this._element.querySelector(`input[name=favorite]`);
    favoriteElement.checked = this._data.isFavorite;
  }

  /**
   * Обновление описания точки назначения при её изменении
   */
  _changeDestinationDescription() {
    const destinationInputElement = document.querySelector(`.point__destination-input`);
    if (destinationInputElement) {
      const destinationName = destinationInputElement.value;
      const destinationDescription = this._destinationsData.getDescription(destinationName);
      this._updateDestinationText(destinationDescription.description);
      this._updateDestinationImages(destinationDescription.pictures);
    }
  }

  /**
   * Создание объекта к описанием задачи из данных формы
   * @param {FormData} formData - данные формы
   * @return {Object} - объект с описанием задачи
   */
  _processForm(formData) {
    const newData = deepCopy(this._data);
    newData.type = formData.get(`travel-way`);
    newData.destination = this._destinationsData.getDescription(formData.get(`destination`));
    newData.dateFrom = moment(formData.get(`date-start`), `D MMM YYYY H:mm`).toDate().getTime();
    newData.dateTo = moment(formData.get(`date-end`), `D MMM YYYY H:mm`).toDate().getTime();
    newData.price = parseFloat(formData.get(`price`));
    newData.isFavorite = formData.get(`favorite`) === `on`;

    newData.offers = this._availableOffersData.getOffers(newData.type).map((offer) => {
      offer.accepted = formData.getAll(`offer`).includes(offer.title);
      return offer;
    });
    return newData;
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
    const ESC_KEYCODE = 27;
    if (evt.keyCode === ESC_KEYCODE) {
      this.cancelEdit();
    }
  }

  /**
   * Обработчик клика в окне выбора типа точки путешествия
   * @param {Event} evt - событие
   */
  _onSelectTripPointTypeClick(evt) {
    if (evt.target.classList.contains(`travel-way__select-input`)) {
      this._updateType(evt.target.value);
      this._updateOffers(this._availableOffersData.getOffers(evt.target.value));
      const toogleElement = this._element.querySelector(`.travel-way__toggle`);
      toogleElement.checked = false;
    }
  }

  /**
   * Обработчик изменения пункта назначения
   * @param {Event} evt - событие
   */
  _onDestinationChange() {
    this._changeDestinationDescription();
  }

  /**
   * Обработчик редактирования пункта назначения
   * @param {Event} evt - событие
   */
  _onDestinationKeyUp() {
    this._changeDestinationDescription();
  }
}

TripPointEdit.number = 0;

