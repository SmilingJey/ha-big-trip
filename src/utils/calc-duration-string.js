import * as moment from 'moment';

const MSEC_IN_HOUR = 60 * 60 * 1000;

/**
 * Функция возвращает разницу дат в виде строки вида 1D 20H 15M.
 * @param {Date} startDate - дата начала
 * @param {Date} endDate - дата окончания
 * @return {String} - строка с разницей дат
 */
export default function calcDurationString(startDate, endDate) {
  const dateDiff = moment(endDate).diff(moment(startDate));
  const diffFormat = (dateDiff >= MSEC_IN_HOUR) ? `H[H] mm[M]` : `mm[M]`;
  const durationHoursAndMinute = moment(dateDiff).utc().format(diffFormat);
  const durationDays = moment(endDate).diff(moment(startDate), `days`);
  const durationText = durationDays ? `${durationDays}D ${durationHoursAndMinute}` : durationHoursAndMinute;
  if (durationText === `00M`) {
    return ``;
  }
  return durationText;
}
