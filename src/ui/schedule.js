
import Component from './component.js';
import * as moment from 'moment';
import {compareDate} from '../utils/date-utils.js';
import {getTripStartDate, getTripEndDate} from '../utils/trip-utils.js';
/**
 * Описывает компонент, отображающий путь и даты путешестия
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
    const pointsElement = this._element.querySelector(`.trip__points`);
    const datesElement = this._element.querySelector(`.trip__dates`);

    pointsElement.textContent = noPoints ? `No route points yet` : this._getPoints(tripPoints);
    datesElement.textContent = noPoints ? `` : this._getDates(tripPoints);
  }

  _getPoints(tripPoints) {
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

  _getDates(tripPoints) {
    const startData = moment(getTripStartDate(tripPoints)).format(`MMM D`);
    const endData = moment(getTripEndDate(tripPoints)).format(`MMM D`);
    return `${startData} - ${endData}`;
  }
}
