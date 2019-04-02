import Component from './component.js';
import * as moment from 'moment';
import {removeChilds} from '../utils/dom-utils.js';
import TripPointType from '../data/trip-point-type.js';
import flatpickr from "flatpickr";
import {deepCopyData} from '../utils/data-utils.js';
import {debounce} from '../utils/events-utils.js';

/**
 * Класс описывает точку путешествия в режиме редактирования
 */
export default class TripPointEdit extends Component {
  constructor({data, destinationsData, availableOffersData}) {
    super();
    this._data = deepCopyData(data);
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

  get template() {
    const templateElement = document.querySelector(`#trip-point-edit-template`).content;
    const element = templateElement.querySelector(`.point`).cloneNode(true);
    return element;
  }

  update() {
    this._updateType(this._data.type);
    this._updateDestination();
    this._updateDestinationsDatalist();
    this._updateDate();
    this._updatePrice();
    this._updateOffers();
    this._updateIsFavotire();
    this._updateDestinationText(this._data.destination.description);
    this._updateDestinationImages(this._data.destination.pictures);
  }

  bind() {
    this._ui.formElement.addEventListener(`submit`, this._onSubmitButtonClick);
    this._ui.deleteButtonElement.addEventListener(`click`, this._onDeleteButtonClick);
    this._ui.typeSelectElement.addEventListener(`click`, this._onSelectTripPointTypeClick);
    this._ui.destinationInputElement.addEventListener(`change`, this._onDestinationChange);
    this._ui.destinationInputElement.addEventListener(`keyup`, this._onDestinationKeyUp);

    this._flatpickrDateFrom = flatpickr(this._ui.dateStartElement, {
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

    this._flatpickrDateTo = flatpickr(this._ui.dateEndElement, {
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

  unbind() {
    this._ui.formElement.removeEventListener(`submit`, this._onSubmitButtonClick);
    this._ui.deleteButtonElement.removeEventListener(`click`, this._onDeleteButtonClick);
    this._ui.typeSelectElement.removeEventListener(`click`, this._onSelectTripPointTypeClick);
    this._ui.destinationInputElement.removeEventListener(`change`, this._onDestinationChange);
    this._ui.destinationInputElement.removeEventListener(`keyup`, this._onDestinationKeyUp);

    document.removeEventListener(`keydown`, this._onESCkeydown);
    if (this._flatpickrDateFrom) {
      this._flatpickrDateFrom.destroy();
    }
    if (this._flatpickrDateTo) {
      this._flatpickrDateTo.destroy();
    }
  }


  /**
   * Потрясти карточку
   */
  shake() {
    const ANIMATION_TIMEOUT = 600;
    this._element.style.animation = `shake ${ANIMATION_TIMEOUT / 1000}s`;
    setTimeout(() => {
      this._element.style.animation = ``;
    }, ANIMATION_TIMEOUT);
  }

  /**
   * Блокировка карточки при сохранении
   */
  savingBlock() {
    this._ui.saveButtonElement.textContent = `saving ...`;
    this._setInputBlock(true);
  }

  /**
   * Блокировка карточки при удалении
   */
  deletingBlock() {
    this._ui.deleteButtonElement.textContent = `deleting ...`;
    this._setInputBlock(true);
  }

  /**
   * Разблокировка карточки
   */
  unblock() {
    this._ui.saveButtonElement.textContent = `Save`;
    this._ui.deleteButtonElement.textContent = `Delete`;
    this.setInputBlock(false);
  }

  /**
   * Блокировка/Разблокировка полей ввода
   * @param {Boolean} isBlock - заблокированы ли поля ввода
   */
  _setInputBlock(isBlock) {
    const controlElements = this._element.querySelectorAll(`input, button, textarea`);
    for (const controlElement of controlElements) {
      controlElement.disabled = isBlock;
    }
  }

  changesUnsaved() {
    this._element.classList.add(`unsaved`);
  }

  _getUiElements() {
    this._ui.typeIconElement = this._element.querySelector(`.travel-way__label`);
    this._ui.destinationLabelElement = this._element.querySelector(`.point__destination-label`);
    this._ui.destinationInputElement = this._element.querySelector(`.point__destination-input`);
    this._ui.datalistElement = this._element.querySelector(`#destination-select`);
    this._ui.dateStartElement = this._element.querySelector(`input[name='date-start']`);
    this._ui.dateEndElement = this._element.querySelector(`input[name='date-end']`);
    this._ui.priceElement = this._element.querySelector(`input[name=price]`);
    this._ui.offersContainerElement = this._element.querySelector(`.point__offers-wrap`);
    this._ui.destinationTextElement = this._element.querySelector(`.point__destination-text`);
    this._ui.imagesComtainerElement = this._element.querySelector(`.point__destination-images`);
    this._ui.favoriteElement = this._element.querySelector(`input[name=favorite]`);
    this._ui.toogleElement = this._element.querySelector(`.travel-way__toggle`);
    this._ui.saveButtonElement = this._element.querySelector(`.point__button--save`);
    this._ui.deleteButtonElement = this._element.querySelector(`button[type=reset]`);
    this._ui.typeSelectElement = this._element.querySelector(`.travel-way__select`);
    this._ui.formElement = this._element.querySelector(`form`);
  }

  /**
   * Задает тип события
   * @param {String} type - тип
   */
  _updateType(type) {
    this._ui.typeIconElement.textContent = TripPointType[type].icon;
    this._ui.destinationLabelElement.textContent = TripPointType[type].destinationText;
    const selectedRadioElement = this._element.querySelector(`#travel-way-${type}`);
    selectedRadioElement.checked = true;
  }

  /**
   * Задает название точки назначения
   */
  _updateDestination() {
    this._ui.destinationInputElement.value = this._data.destination.name;
  }

  /**
   * Задает список доступных точек назначения
   */
  _updateDestinationsDatalist() {
    removeChilds(this._ui.datalistElement);
    const destinations = this._destinationsData.getDestinations();
    if (destinations) {
      const optionsElements = destinations.map((destination) => {
        const optionsElement = document.createElement(`option`);
        optionsElement.value = destination;
        return optionsElement;
      });

      for (const optionsElement of optionsElements) {
        this._ui.datalistElement.appendChild(optionsElement);
      }
    }
  }

  /**
   * Задает время начала и окончания события
   */
  _updateDate() {
    this._ui.dateStartElement.value = moment(this._data.dateFrom).format(`D MMM H:mm`);
    this._ui.dateEndElement.value = this._data.dateTo ? moment(this._data.dateTo).format(`D MMM H:mm`) : ``;
  }

  /**
   * Задает стоимость
   */
  _updatePrice() {
    this._ui.priceElement.value = this._data.price;
  }

  /**
   * Задает доступные офферы
   * @param {Array} offers - массив с доступными офферами
   */
  _updateOffers() {
    removeChilds(this._ui.offersContainerElement);
    if (this._data.offers && this._data.offers.length) {
      const offerElements = this._data.offers.map(this._createTripPointOffer.bind(this));
      for (const offerElement of offerElements) {
        this._ui.offersContainerElement.prepend(offerElement);
      }
    } else {
      this._ui.offersContainerElement.textContent = `No avaliable offres`;
    }
  }

  /**
   * Создает элемент оффера
   * @param {*} offer - параметры оффера
   * @return {Node} - элемент оффера
   */
  _createTripPointOffer(offer) {
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
    this._ui.destinationTextElement.textContent = description;
  }

  /**
   * Задает изображения точки назначения
   * @param {Array} images - массив с изображениями
   */
  _updateDestinationImages(images) {
    removeChilds(this._ui.imagesComtainerElement);
    if (!images || !images.length) {
      this._ui.imagesComtainerElement.classList.add(`visually-hidden`);
    } else {
      this._ui.imagesComtainerElement.classList.remove(`visually-hidden`);
      for (const imageElement of images.map(this._createDestinationImage)) {
        this._ui.imagesComtainerElement.prepend(imageElement);
      }
    }
  }

  /**
   * Создает элемент изображения описания точки назначения
   * @param {*} image - ссылка на изображение
   * @return {Node} - элемент изображения
   */
  _createDestinationImage(image) {
    const imageElement = document.createElement(`img`);
    imageElement.src = image.src.replace(/^http:/, ``);
    imageElement.alt = image.description;
    imageElement.classList.add(`point__destination-image`);
    return imageElement;
  }

  /**
   * Задает состояние элемента "Избранный"
   */
  _updateIsFavotire() {
    this._ui.favoriteElement.checked = this._data.isFavorite;
  }

  /**
   * Обновление описания точки назначения при её изменении
   */
  _changeDestinationDescription() {
    if (this._ui.destinationInputElement) {
      const destinationName = this._ui.destinationInputElement.value;
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
    const newData = deepCopyData(this._data);
    newData.type = formData.get(`travel-way`);
    newData.destination = this._destinationsData.getDescription(formData.get(`destination`));
    newData.dateFrom = moment(formData.get(`date-start`), `D MMM YYYY H:mm`).toDate().getTime();
    newData.dateTo = moment(formData.get(`date-end`), `D MMM YYYY H:mm`).toDate().getTime();
    newData.price = parseFloat(formData.get(`price`));
    newData.isFavorite = formData.get(`favorite`) === `on`;

    newData.offers = this._data.offers.map((offer) => {
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
    const formData = new FormData(this._ui.formElement);
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
      this._data.offers = deepCopyData(this._availableOffersData.getOffers(evt.target.value));
      this._updateOffers();
      this._ui.toogleElement.checked = false;
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

