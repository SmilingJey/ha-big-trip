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

/**
 * Функция возвращает разницу дат в виде строки вида 1D 20H 15M.
 * @param {Date} startDate - дата начала
 * @param {Date} endDate - дата окончания
 * @return {String} - строка с разницей дат
 */
function calcDurationString(startDate, endDate) {
  const MSEC_IN_HOUR = 60 * 60 * 1000;

  const dateDiff = moment(endDate).diff(moment(startDate));

  const diffFormat = (dateDiff >= MSEC_IN_HOUR) ? `H[H] mm[M]` : `mm[M]`;
  const durationHoursAndMinute = moment(dateDiff).utc().format(diffFormat);
  const durationDays = moment(endDate).diff(moment(startDate), `days`);
  const durationText = durationDays ? `${durationDays}D ${durationHoursAndMinute}` : durationHoursAndMinute;
  return durationText;
}

export {compareDate, calcDaysDiff, calcDurationString};
