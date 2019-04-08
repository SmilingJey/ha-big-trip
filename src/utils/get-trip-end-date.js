/**
 * Возвращает дату окончания путешествия
 * @param {Array} tripPoints - массив точек путешествия
 * @return {Date} - дата окончания путешествия
 */
export default function getTripEndDate(tripPoints) {
  if (!tripPoints || tripPoints.length === 0) {
    return Date.now();
  }
  return tripPoints.reduce((max, point) => {
    const date = point.dateTo ? point.dateTo : point.dateFrom;
    return date > max ? date : max;
  }, -Infinity);
}
