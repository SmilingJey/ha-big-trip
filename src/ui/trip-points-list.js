import Component from './component.js';
import * as moment from 'moment';
import removeChilds from '../utils/remove-childs.js';
import calcDaysDiff from '../utils/calc-days-diff.js';
import compareDate from '../utils/compare-date.js';
import TripPoint from './trip-point.js';
import TripPointEdit from './trip-point-edit.js';
import getTripStartDate from '../utils/get-trip-start-date.js';
import getTripEndDate from '../utils/get-trip-end-date.js';
import TripPointsData from '../data/trip-points-data.js';

/**
 * Класс описывает список отображения точек путешествия
 */
export default class TripPointsList extends Component {
  constructor({tripPointsData, destinationsData, availableOffersData}) {
    super();
    this._sortFunction = (point1, point2) => compareDate(point1.dateFrom, point2.dateFrom);
    this._filterFunction = null;
    this._tripPointEdit = null;
    this._newTripPointEdit = null;
    this._messageElement = null;
    this._tripPoints = [];
    this._tripPointsData = tripPointsData;
    this._destinationsData = destinationsData;
    this._availableOffersData = availableOffersData;
    this._message = ``;
  }

  /**
   * Задает алгоритм сортировки точек путешествия
   * @param {Function} fn - функция сравнения точек для использования sort
   */
  set sortFunction(fn) {
    if (fn !== this._sortFunction) {
      this._sortFunction = fn;
      this.update();
    }
  }

  /**
   * Задает алгоритм фильтрации точек путешествия
   * @param {Function} fn - функция фильтрации точек для использования filter
   */
  set filterFunction(fn) {
    if (fn !== this._filterFunction) {
      this._filterFunction = fn;
      this.update();
    }
  }

  /**
   * Возвращает шаблон
   * @return {Node} - пустой шаблон списка точек маршрута
   */
  get template() {
    const element = document.createElement(`section`);
    element.classList.add(`trip-points`);
    return element;
  }

  /**
   * Возвращает отсортированный и отфильтрованный массив точек путешествия
   * @return {Array} - массив точек путешествия
   */
  getDisplayedPoints() {
    return this._sortPoints(this._filterPoints(this._getData()));
  }

  /**
   * Отображение списка точек путешествия
   */
  update() {
    this._unrenderContent();
    this._messageElement = this._createMessage(this._message);
    this._element.appendChild(this._messageElement);
    const tripPointsFragment = document.createDocumentFragment();
    if (this._newTripPointEdit) {
      tripPointsFragment.appendChild(this._newTripPointEdit.render());
    }
    this._renderTripPoints(tripPointsFragment);
    this._element.appendChild(tripPointsFragment);
  }

  /**
   * Отображает сообщение об ошибке
   */
  showErrorMessage() {
    this._message = `Something went wrong. Check your connection or try again later`;
    this._messageElement.textContent = this._message;
    this._messageElement.classList.remove(`visually-hidden`);
  }

  /**
   * Отображает сообщение о загрузке данных
   */
  showLoadingMessage() {
    this._message = `Loading route...`;
    this._messageElement.textContent = this._message;
    this._messageElement.classList.remove(`visually-hidden`);
  }

  /**
   * Скрывает сообщение
   */
  hideMessage() {
    this._message = ``;
    this._messageElement.textContent = this._message;
    this._messageElement.classList.add(`visually-hidden`);
  }

  /**
   * Открытие редактора создания новой точки путешествия
   */
  createNewTripPoint() {
    const data = TripPointsData.createEmpty({
      type: `taxi`,
      dateFrom: getTripEndDate(this._tripPointsData.getAll()),
      dateTo: getTripEndDate(this._tripPointsData.getAll()),
      offers: this._availableOffersData.getOffers(`taxi`),
    });

    this._newTripPointEdit = new TripPointEdit({
      data,
      destinationsData: this._destinationsData,
      availableOffersData: this._availableOffersData,
    });

    this._newTripPointEdit.onSubmit = (newData) => {
      this._submitNewTripPoint(newData);
    };

    this._newTripPointEdit.onCancel = () => {
      this._deleteNewTripPoint();
    };

    this._newTripPointEdit.onDelete = () => {
      this._deleteNewTripPoint();
    };

    this.update();
  }

  /**
   * Отображение точек путешествия
   * @param {*} tripPointsFragment
   */
  _renderTripPoints(tripPointsFragment) {
    const tripStartDate = getTripStartDate(this._getData());
    let prevTripPointDate = 0;
    let dayElement = null;
    let dayItemsElement = null;
    const displayedTripPoints = this.getDisplayedPoints();
    for (const tripPointData of displayedTripPoints) {
      if (calcDaysDiff(prevTripPointDate, tripPointData.dateFrom) !== 0) {
        dayElement = this._createTripDayElement(tripPointData.dateFrom, tripStartDate);
        dayItemsElement = dayElement.querySelector(`.trip-day__items`);
        tripPointsFragment.appendChild(dayElement);
      }
      const tripPoint = this._createTripPoint(tripPointData);
      this._tripPoints.push(tripPoint);
      dayItemsElement.appendChild(tripPoint.render());
      prevTripPointDate = tripPointData.dateFrom;
    }
  }

  /**
   * Действие при неудачном сохранении
   * @param {*} tripPointEdit
   */
  _showSavingError(tripPointEdit) {
    tripPointEdit.shake();
    tripPointEdit.changesUnsaved();
    tripPointEdit.unblock();
    this.showErrorMessage();
  }

  /**
   * Вохвращает данные точек путешествия
   * @return {Array}
   */
  _getData() {
    const data = this._tripPointsData.getAll();
    return data === null ? [] : data;
  }

  /**
   * Возврацает массив точек путешествия, после применения заданного фильтра
   * @param {Array} array - исходный массив
   * @return {Array} - отфильтрованный массив
   */
  _filterPoints(array) {
    const hasFilterFunction = typeof this._filterFunction === `function`;
    return (hasFilterFunction) ? array.filter(this._filterFunction) : array;
  }

  /**
   * Возвращает отсортированный массив, после применения заданного способа сортировки
   * @param {Array} array - исходный массив
   * @return {Array} - отсортированный путешествия
   */
  _sortPoints(array) {
    const hasSortFunction = typeof this._sortFunction === `function`;
    return (hasSortFunction) ? array.sort(this._sortFunction) : array;
  }

  /**
   * Удаляет все точки путешествия
   */
  _unrenderContent() {
    if (this._newTripPointEdit) {
      this._newTripPointEdit.unrender();
    }

    if (this._tripPointEdit) {
      this._tripPointEdit.unrender();
      this._tripPointEdit = null;
    }
    for (const tripPoint of this._tripPoints) {
      tripPoint.unrender();
    }
    removeChilds(this._element);
  }

  /**
   * Сообщение для вывода на экран
   * @param {String} text - текст сообщения
   * @return {Node} - элемент с текстом
   */
  _createMessage(text) {
    const messageElement = document.createElement(`p`);
    messageElement.textContent = text;
    messageElement.classList.add(`trip-point-message`);
    if (!text) {
      messageElement.classList.add(`visually-hidden`);
    }
    return messageElement;
  }

  /**
   * Создает объект точки путешествия и задает ей переход в режим редактирования
   * @param {Object} data - описание точки путешествия
   * @return {Object} объект точки путешествия
   */
  _createTripPoint(data) {
    const tripPoint = new TripPoint(data);
    tripPoint.onEdit = () => {
      if (this._tripPointEdit) {
        this._tripPointEdit.cancelEdit();
      }
      this._showTripPointEdit(data);
      tripPoint.element.parentElement.replaceChild(this._tripPointEdit.render(), tripPoint.element);
      this._tripPoints.splice(this._tripPoints.indexOf(tripPoint), 1);
      tripPoint.unrender();
    };

    tripPoint.onAddOffer = (newData) => {
      this._tripPointsData.update(newData)
        .then(() => this.hideMessage())
        .catch(() => {
          this.showErrorMessage();
        });
    };

    return tripPoint;
  }

  /**
   * Открытие точки путешествия в режиме редактирования
   * @param {*} data - описание точки путешествия
   */
  _showTripPointEdit(data) {
    this._tripPointEdit = new TripPointEdit({
      data,
      destinationsData: this._destinationsData,
      availableOffersData: this._availableOffersData,
    });

    // сохранение изменений
    this._tripPointEdit.onSubmit = (newData) => {
      this._submitTripPoint(newData);
    };

    // выход из режима редактирования
    this._tripPointEdit.onCancel = () => {
      this._cancelTripPointEdit(data);
    };

    // удаление точки путешествия
    this._tripPointEdit.onDelete = () => {
      this._deleteTripPoint(data);
    };
  }

  /**
   * Сохранение изменений точки путешествия
   * @param {Object} newData
   */
  _submitTripPoint(newData) {
    this._tripPointEdit.savingBlock();
    this._tripPointsData.update(newData)
      .then(() => this.hideMessage())
      .catch(() => {
        this._showSavingError(this._tripPointEdit);
      });
  }

  /**
   * Выход из редактирования точки путешествия
   * @param {*} data
   */
  _cancelTripPointEdit(data) {
    const tripPoint = this._createTripPoint(data);
    this._tripPointEdit.element.parentElement.replaceChild(tripPoint.render(), this._tripPointEdit.element);
    this._tripPointEdit.unrender();
    this._tripPointEdit = null;
  }

  /**
   * Удаление точки путешествия
   * @param {Object} data
   */
  _deleteTripPoint(data) {
    this._tripPointEdit.deletingBlock();
    this._tripPointsData.delete(data)
      .then(() => this.hideMessage())
      .catch(() => {
        this._showSavingError(this._tripPointEdit);
      });
  }

  /**
   * Сохранение новой точки путешествия
   * @param {Object} newData данные новой точки путешествия
   */
  _submitNewTripPoint(newData) {
    this._newTripPointEdit.savingBlock();
    this._tripPointsData.add(newData)
      .then(() => {
        this._newTripPointEdit.unrender();
        this._newTripPointEdit = null;
        this.hideMessage();
      })
      .catch(() => {
        this._showSavingError(this._newTripPointEdit);
      });
  }

  /**
   * Отмена создания новой точки путешествия
   */
  _deleteNewTripPoint() {
    this._newTripPointEdit.unrender();
    this._newTripPointEdit = null;
    this.hideMessage();
    this.update();
  }

  /**
   * Создает элемент дня путешествия
   * @param {Date} date - дата дня путешествия
   * @param {Date} tripStartDate - дата дня начала путешествия
   * @return {Node} - элемент дня путешествия
   */
  _createTripDayElement(date, tripStartDate) {
    const tripDayTemplate = document.querySelector(`#trip-day-template`);
    const dayElement = tripDayTemplate.content.querySelector(`.trip-day`).cloneNode(true);
    const dayNumberElement = dayElement.querySelector(`.trip-day__number`);
    const dayNumber = calcDaysDiff(tripStartDate, date) + 1;
    dayNumberElement.textContent = dayNumber;
    const dayTitleElement = dayElement.querySelector(`.trip-day__title`);
    dayTitleElement.textContent = moment(date).format(`MMM D`);
    return dayElement;
  }
}
