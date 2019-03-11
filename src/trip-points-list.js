import Component from './component.js';
import * as moment from 'moment';
import {removeChilds} from './utils/dom-utils.js';
import {calcDaysDiff, compareDate} from './utils/date-utils.js';
import TripPoint from './trip-point.js';
import TripPointEdit from './trip-point-edit.js';
import createMockTripPoint from './mock-trip-point.js';

/**
 * Класс описывает список отображения точек путешествия
 */
export default class TripPointsList extends Component {
  constructor() {
    super();
    this._points = Array(10).fill().map(createMockTripPoint);

    this._sortFunction = (point1, point2) => compareDate(point1.startDate, point2.startDate);
    this._filterFunction = null;
    this._tripPointEdit = null;
  }

  /**
   * Задает алгоритм сортировки точек путешествия
   * @param {Function} fn - функция сравнения точек для использования sort
   */
  set sortFunction(fn) {
    this._sortFunction = fn;
    this.update();
  }

  /**
   * Задает алгоритм фильтрации точек путешествия
   * @param {Function} fn - функция фильтрации точек для использования filter
   */
  set filterFunction(fn) {
    this._filterFunction = fn;
    this.update();
  }

  /**
   * Возврацает массив точек путешествия, после применения заданного фильтра
   * @param {Array} array - исходный массив
   * @return {Array} - отфильтрованный массив
   */
  filterPoints(array) {
    const hasFilterFunction = typeof this._filterFunction === `function`;
    return (hasFilterFunction) ? array.filter(this._filterFunction) : array;
  }

  /**
   * Возвращает отсортированный массив, после применения заданного способа сортировки
   * @param {Array} array - исходный массив
   * @return {Array} - отсортированный путешествия
   */
  sortPoints(array) {
    const hasSortFunction = typeof this._sortFunction === `function`;
    return (hasSortFunction) ? array.sort(this._sortFunction) : array;
  }

  /**
   * Возвращает отсортированный и отфильтрованный массив точек путешествия
   * @return {Array} - массив точек путешествия
   */
  getDisplayedPoints() {
    return this.sortPoints(this.filterPoints(this._points));
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
   * Отображение списка точек путешествия
   */
  update() {
    removeChilds(this._element);
    const displayedTripPoints = this.getDisplayedPoints();

    if (displayedTripPoints.length === 0) {
      return;
    }

    const tripPointsFragment = document.createDocumentFragment();
    const tripStartDate = this._getTripStartDate();

    let prevTripPointDate = 0;
    let dayElement = null;
    for (const tripPointData of displayedTripPoints) {
      if (calcDaysDiff(prevTripPointDate, tripPointData.startDate) !== 0) {
        dayElement = this._createTripDayElement(tripPointData.startDate, tripStartDate);
        tripPointsFragment.appendChild(dayElement);
      }
      const tripPoint = this._createTripPoint(tripPointData);
      this._addTripPointElementToDayElement(dayElement, tripPoint.render());
      prevTripPointDate = tripPointData.startDate;
    }

    this._element.appendChild(tripPointsFragment);
  }

  /**
   * Возвращает дату начала путешествия
   * @return {Node} - дата начала путешествия
   */
  _getTripStartDate() {
    return this._points.reduce((min, point) => point.startDate < min ? point.startDate : min, Infinity);
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
        return;
      }
      this._tripPointEdit = this._createTripPointEdit(data);
      tripPoint.element.parentElement.replaceChild(this._tripPointEdit.render(), tripPoint.element);
      tripPoint.unrender();
    };
    return tripPoint;
  }

  /**
   * Создает объект точки путешествия в режиме редактирования
   * @param {*} data - описание точки путешествия
   * @return {Object} объект точки путешествия в режиме редактирования
   */
  _createTripPointEdit(data) {
    const tripPointEdit = new TripPointEdit(data);

    tripPointEdit.onSubmit = () => {
      const tripPoint = this._createTripPoint(data);
      tripPointEdit.element.parentElement.replaceChild(tripPoint.render(), tripPointEdit.element);
      tripPointEdit.unrender();
      this._tripPointEdit = null;
    };

    tripPointEdit.onCancel = () => {
      const tripPoint = this._createTripPoint(data);
      tripPointEdit.element.parentElement.replaceChild(tripPoint.render(), tripPointEdit.element);
      tripPointEdit.unrender();
      this._tripPointEdit = null;
    };

    tripPointEdit.onDelete = () => {
      this._points.splice(this._points.indexOf(data), 1);
      tripPointEdit.unrender();
      this.update();
      this._tripPointEdit = null;
    };
    return tripPointEdit;
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

  /**
   * Добавляет элемент точки путешестия в элемент дня путешествия
   * @param {Node} dayElement - элемент дня путешествия
   * @param {Node} tripPoinElement - элемент точки путешествия
   */
  _addTripPointElementToDayElement(dayElement, tripPoinElement) {
    const tripPointsConteinerElement = dayElement.querySelector(`.trip-day__items`);
    tripPointsConteinerElement.appendChild(tripPoinElement);
  }
}
