import {compareDate} from '../utils/date-utils.js';
import {calcTripPointCost} from '../utils/trip-utils.js';

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

function initTripSortContrloller({sortingElement, tripPointsList}) {
  sortingElement.addEventListener(`change`, (evt) => {
    if (sortingFunctions.hasOwnProperty(evt.target.value)) {
      tripPointsList.sortFunction = sortingFunctions[evt.target.value];
    }
  });
}

export {initTripSortContrloller};
