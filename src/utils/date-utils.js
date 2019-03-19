import * as moment from 'moment';

/**
 * Сравнение двух дат их вычитанием
 * @param {Date} date1 - первая дата
 * @param {Date} date2 - вторая дата
 * @return {Number} - разница дат
 */
function compareDate(date1, date2) {
  return date1 - date2;
}

/**
 * Разница в днях между двумя датами, без учета времени
 * @param {Date} startDate - первая дата
 * @param {Date} endDate - вторая дата
 * @return {Number} - разница в днях
 */
function calcDaysDiff(startDate, endDate) {
  const startDateMoment = moment(startDate).startOf(`day`);
  const endDateMoment = moment(endDate).startOf(`day`);
  return endDateMoment.diff(startDateMoment, `days`);
}

export {compareDate, calcDaysDiff};
