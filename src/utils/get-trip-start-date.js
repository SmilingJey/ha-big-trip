/**
 * Возвращает дату начала путешествия
 * @param {Array} tripPoints - массив точек путешествия
 * @return {Date} - дата начала путешествия
 */
export default function getTripStartDate(tripPoints) {
  if (!tripPoints || tripPoints.length === 0) {
    return Date.now();
  }
  return tripPoints.reduce((min, point) => {
    return point.dateFrom < min ? point.dateFrom : min;
  }, Infinity);
}
