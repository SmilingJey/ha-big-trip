import * as moment from 'moment';

/**
 * Разница в днях между двумя датами, без учета времени
 * @param {Date} startDate - первая дата
 * @param {Date} endDate - вторая дата
 * @return {Number} - разница в днях
 */
export default function calcDaysDiff(startDate, endDate) {
  const startDateMoment = moment(startDate).startOf(`day`);
  const endDateMoment = moment(endDate).startOf(`day`);
  return endDateMoment.diff(startDateMoment, `days`);
}
