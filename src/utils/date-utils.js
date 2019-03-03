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
 * Функция сравнивает даты двух точек путешестия вычитанием даты начал
 * @param {Object} tripPoint1 - описание точки маршрута
 * @param {Object} tripPoint2 - описание точки маршрута
 * @return {Number} - разница дат начал
 */
function compareTripPointDate(tripPoint1, tripPoint2) {
  return compareDate(tripPoint1.startDate, tripPoint2.startDate);
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
  const MSEC_IN_DAY = 24 * MSEC_IN_HOUR;

  const dateDiff = moment(endDate).diff(moment(startDate));

  let diffFormat = `mm[M]`;
  if (dateDiff >= MSEC_IN_HOUR) {
    diffFormat = `H[H] mm[M]`;
  }
  let durationText = moment(dateDiff).utc().format(diffFormat);

  if (dateDiff >= MSEC_IN_DAY) {
    const days = moment(endDate).diff(moment(startDate), `days`);
    durationText = `${days}D ${durationText}`;
  }

  return durationText;
}

export {compareDate, compareTripPointDate, calcDaysDiff, calcDurationString};
