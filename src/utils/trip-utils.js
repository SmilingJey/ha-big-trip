/**
 * Вычисляет стоимость с учетом офферов
 * @param {Object} tripPointData - данные точки путешествия
 * @return {Number} - стоимость
 */
function calcTripPointCost(tripPointData) {
  const offersCost = tripPointData.offers.reduce((cost, offer) => {
    return offer.accepted ? cost + offer.price : cost;
  }, 0);
  return tripPointData.price + offersCost;
}

/**
 * Возвращает дату начала путешествия
 * @param {Array} tripPoints - массив точек путешествия
 * @return {Date} - дата начала путешествия
 */
function getTripStartDate(tripPoints) {
  if (!tripPoints || tripPoints.length === 0) {
    return Date.now();
  }
  return tripPoints.reduce((min, point) => {
    return point.dateFrom < min ? point.dateFrom : min;
  }, Infinity);
}

/**
 * Возвращает дату окончания путешествия
 * @param {Array} tripPoints - массив точек путешествия
 * @return {Date} - дата окончания путешествия
 */
function getTripEndDate(tripPoints) {
  if (!tripPoints || tripPoints.length === 0) {
    return Date.now();
  }
  return tripPoints.reduce((max, point) => {
    const date = point.dateTo ? point.dateTo : point.dateFrom;
    return date > max ? date : max;
  }, -Infinity);
}

export {calcTripPointCost, getTripStartDate, getTripEndDate};
