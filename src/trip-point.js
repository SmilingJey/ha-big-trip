import * as moment from 'moment';
import {removeChilds} from './utils/dom-utils.js';
import {calcDurationString} from './utils/date-utils.js';

const TRIP_POINT_ICONS = {
  [`Taxi`]: `🚕`,
  [`Bus`]: `🚌`,
  [`Train`]: `🚂`,
  [`Ship`]: `🛳️`,
  [`Transport`]: `🚊`,
  [`Drive`]: `🚗`,
  [`Flight`]: `✈️`,
  [`Check-in`]: `🏨`,
  [`Sightseeing`]: `🏛️`,
  [`Restaurant`]: `🍴`,
};

/**
 * Функция задает соответствующую иконку для элемента точки путешествия
 * @param {Node} tripPointElement - элемента точки путешествия
 * @param {Object} tripPointData - описание точки путешествия
 */
function setTripPointElementIcon(tripPointElement, tripPointData) {
  const iconElement = tripPointElement.querySelector(`.trip-icon`);
  iconElement.textContent = TRIP_POINT_ICONS[tripPointData.type];
}

/**
 * Функция задает заголовок для элемента точки путешествия
 * @param {Node} tripPointElement - элемента точки путешествия
 * @param {Object} tripPointData - описание точки путешествия
 */
function setTripPointElementTitle(tripPointElement, tripPointData) {
  const titleElement = tripPointElement.querySelector(`.trip-point__title`);
  titleElement.textContent = tripPointData.title;
}

/**
 * Функция задает время начала, окончания и длительность события
 * @param {Node} tripPointElement - элемента точки путешествия
 * @param {Object} tripPointData - описание точки путешествия
 */
function setTripPointElementTime(tripPointElement, tripPointData) {
  const timeElement = tripPointElement.querySelector(`.trip-point__timetable`);
  const startDateMoment = moment(tripPointData.startDate);
  const startDateText = startDateMoment.format(`H:mm`);

  let endDateText = ``;
  if (tripPointData.endDate) {
    const endDateMoment = moment(tripPointData.endDate);
    const dateDiff = endDateMoment.diff(startDateMoment);
    const MSEC_IN_DAY = 24 * 60 * 60 * 1000;
    const endDateFormat = dateDiff < MSEC_IN_DAY ? `H:mm` : `H:mm MMM D`;
    endDateText = ` - ` + moment(tripPointData.endDate).format(endDateFormat);
  }

  timeElement.textContent = `${startDateText}${endDateText}`;

  const durationElement = tripPointElement.querySelector(`.trip-point__duration`);
  durationElement.textContent = calcDurationString(tripPointData.startDate, tripPointData.endDate);
}

/**
 * Функция задает стоимость для элемента точки путешествия
 * @param {Node} tripPointElement - элемента точки путешествия
 * @param {Object} tripPointData - описание точки путешествия
 */
function setTripPointElementPrice(tripPointElement, tripPointData) {
  const priceElement = tripPointElement.querySelector(`.trip-point__price`);
  priceElement.textContent = `€ ${tripPointData.price}`;
}

const offerTemlate = document.querySelector(`#trip-point-offer-template`);

/**
 * Функция задает доступные офферы для элемента точки путешествия
 * @param {Node} tripPointElement - элемента точки путешествия
 * @param {Object} tripPointData - описание точки путешествия
 */
function setTripPointElementOffers(tripPointElement, tripPointData) {
  const offersContainerElement = tripPointElement.querySelector(`.trip-point__offers`);
  removeChilds(offersContainerElement);
  for (const offer of tripPointData.offers) {
    const offerElement = offerTemlate.content.cloneNode(true);
    const offerTextElement = offerElement.querySelector(`.trip-point__offer`);
    offerTextElement.textContent = `${offer.name} + € ${offer.price}`;
    offersContainerElement.prepend(offerElement);
  }
}

const tripPointTemplate = document.querySelector(`#trip-point-template`);

/**
 * Возвращает элемент, созданный из шаблона #trip-point-template
 * @param {Object} tripPointData - описание точки маршрута
 * @return {Node} - элемент точки маршрута
 */
function createTripPointElement(tripPointData) {
  const tripPointElement = tripPointTemplate.content.querySelector(`.trip-point`).cloneNode(true);
  setTripPointElementIcon(tripPointElement, tripPointData);
  setTripPointElementTitle(tripPointElement, tripPointData);
  setTripPointElementTime(tripPointElement, tripPointData);
  setTripPointElementPrice(tripPointElement, tripPointData);
  setTripPointElementOffers(tripPointElement, tripPointData);
  return tripPointElement;
}

export default createTripPointElement;
