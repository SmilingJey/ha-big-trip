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
  const tripDayElement = tripDayTemplate.content.cloneNode(true);
  const dayNumberElement = tripDayElement.querySelector(`.trip-day__number`);
  const dayNumber = calcDaysDiff(tripStartDate, date) + 1;
  dayNumberElement.textContent = dayNumber;
  const dayTitleElement = tripDayElement.querySelector(`.trip-day__title`);
  dayTitleElement.textContent = moment(date).format(`MMM D`);
  return tripDayElement;
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
  let prevTripPointDate = tripStartDate;
  let dayElement = createTripDayElement(prevTripPointDate, tripStartDate);

  for (const tripPoint of orderedTripPoints) {
    if (calcDaysDiff(prevTripPointDate, tripPoint.startDate) !== 0) {
      tripPointsFragment.appendChild(dayElement);
      dayElement = createTripDayElement(tripPoint.startDate, tripStartDate);
    }

    const tripPointElement = createTripPointElement(tripPoint);
    addTripPointElementToDayElement(dayElement, tripPointElement);
    prevTripPointDate = tripPoint.startDate;
  }

  tripPointsFragment.appendChild(dayElement);
  tripPointsContainerElement.appendChild(tripPointsFragment);
}

export default renderTripPoints;
