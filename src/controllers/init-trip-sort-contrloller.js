import compareDate from '../utils/compare-date.js';
import calcTripPointCost from '../utils/calc-trippoint-cost.js';

const sortingFunctions = {
  [`day`]: (point1, point2) => compareDate(point1.dateFrom, point2.dateFrom),
  [`event`]: (point1, point2) => {
    if (point1.type < point2.type) {
      return -1;
    }
    if (point1.type > point2.type) {
      return 1;
    }
    return 0;
  },
  [`time`]: (point1, point2) => {
    return (point2.dateFrom - point2.dateTo) - (point1.dateFrom - point1.dateTo);
  },
  [`price`]: (point1, point2) => calcTripPointCost(point1) - calcTripPointCost(point2),
};

export default function initTripSortContrloller({sortingElement, tripPointsList}) {
  sortingElement.addEventListener(`change`, (evt) => {
    if (sortingFunctions.hasOwnProperty(evt.target.value)) {
      tripPointsList.sortFunction = sortingFunctions[evt.target.value];
    }
  });
}
