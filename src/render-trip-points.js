import * as moment from 'moment';
import createTripPointElement from './trip-point.js';
import {removeChilds} from './utils/dom-utils.js';
import {calcDaysDiff, compareTripPointDate} from './utils/date-utils.js';

const tripDayTemplate = document.querySelector(`#trip-day-template`);

/**
 * Функция создает элемент дня путешествия
 * @param {Date} date - дата дня путешествия
 * @param {Date} tripStartDate - дата дня начала путешествия
 * @return {Node} - элемент дня путешествия
 */
function createTripDayElement(date, tripStartDate) {
  const dayElement = tripDayTemplate.content.querySelector(`.trip-day`).cloneNode(true);
  const dayNumberElement = dayElement.querySelector(`.trip-day__number`);
  const dayNumber = calcDaysDiff(tripStartDate, date) + 1;
  dayNumberElement.textContent = dayNumber;
  const dayTitleElement = dayElement.querySelector(`.trip-day__title`);
  dayTitleElement.textContent = moment(date).format(`MMM D`);
  return dayElement;
}

/**
 * Функция добавляет элемент точки путешестия в элемент дня путешествия
 * @param {Node} dayElement - элемент дня путешествия
 * @param {Node} tripPoinElement - элемент точки путешествия
 */
function addTripPointElementToDayElement(dayElement, tripPoinElement) {
  const tripPointsConteinerElement = dayElement.querySelector(`.trip-day__items`);
  tripPointsConteinerElement.appendChild(tripPoinElement);
}

const tripPointsContainerElement = document.querySelector(`.trip-points`);

/**
 * Функция отображает точки путешестия в хронологическом порядке с
 * группировкой по датам
 * @param {*} tripPoints - данные точек путешествия
 */
function renderTripPoints(tripPoints) {
  removeChilds(tripPointsContainerElement);

  if (tripPoints.length === 0) {
    return;
  }

  const tripPointsFragment = document.createDocumentFragment();
  const orderedTripPoints = tripPoints.sort(compareTripPointDate);
  const tripStartDate = orderedTripPoints[0].startDate;

  let prevTripPointDate = 0;
  let dayElement;

  for (const tripPoint of orderedTripPoints) {
    if (calcDaysDiff(prevTripPointDate, tripPoint.startDate) !== 0) {
      dayElement = createTripDayElement(tripPoint.startDate, tripStartDate);
      tripPointsFragment.appendChild(dayElement);
    }

    const tripPointElement = createTripPointElement(tripPoint);
    addTripPointElementToDayElement(dayElement, tripPointElement);
    prevTripPointDate = tripPoint.startDate;
  }

  tripPointsContainerElement.appendChild(tripPointsFragment);
}

export default renderTripPoints;
