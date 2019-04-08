/**
 * Вычисляет стоимость с учетом офферов
 * @param {Object} tripPointData - данные точки путешествия
 * @return {Number} - стоимость
 */
export default function calcTripPointCost(tripPointData) {
  const offersCost = tripPointData.offers.reduce((cost, offer) => {
    return offer.accepted ? cost + offer.price : cost;
  }, 0);
  return tripPointData.price + offersCost;
}
