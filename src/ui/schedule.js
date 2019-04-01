
import Component from './component.js';
import * as moment from 'moment';
import {compareDate} from '../utils/date-utils.js';
import {getTripStartDate, getTripEndDate} from '../utils/trip-utils.js';

/**
 * Компонент отображает путь и дату путешестия
 */
export default class Schedule extends Component {
  constructor(getDataCallback) {
    super();
    this._getDataCallback = getDataCallback;
  }

  get template() {
    const templateElement = document.querySelector(`#trip-schedule-template`).content;
    const element = templateElement.querySelector(`.trip__schedule`).cloneNode(true);
    return element;
  }

  update() {
    const tripPoints = this._getDataCallback();
    const noPoints = !tripPoints || tripPoints.length === 0;

    this._ui.pointsElement.textContent = noPoints ? `No trip points yet` : Schedule._getPoints(tripPoints);
    this._ui.datesElement.textContent = noPoints ? `` : Schedule._getDates(tripPoints);
  }

  _getUiElements() {
    this._ui.pointsElement = this._element.querySelector(`.trip__points`);
    this._ui.datesElement = this._element.querySelector(`.trip__dates`);
  }

  /**
   * Возвращает текст с пунктами назначения путешествия в хрогологическом порядке
   * @param {Array} tripPoints - массив с точками путешествия
   * @return {String}
   */
  static _getPoints(tripPoints) {
    const sortedTripPoints = tripPoints.sort((point1, point2) => {
      return compareDate(point1.dateFrom, point2.dateFrom);
    });

    const points = [];
    let prevDestinationName = ``;
    for (const tripPoint of sortedTripPoints) {
      if (prevDestinationName !== tripPoint.destination.name) {
        points.push(tripPoint.destination.name);
        prevDestinationName = tripPoint.destination.name;
      }
    }
    return points.join(`-`);
  }

  /**
   * Возвращает текст с датой и окончанием путешествия
   * @param {Array} tripPoints - массив с точками путешествия
   * @return {String}
   */
  static _getDates(tripPoints) {
    const startData = moment(getTripStartDate(tripPoints)).format(`MMM D`);
    const endData = moment(getTripEndDate(tripPoints)).format(`MMM D`);
    return `${startData} - ${endData}`;
  }
}
