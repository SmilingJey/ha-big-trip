import {randomInteger, randomBoolean, randomArrayItem, randomArrayFromArray} from './utils/random-utils.js';
import {TRIP_POINT_TYPES} from './trip-point-types.js';

const MOCK_DESTINATION = [
  `Amsterdam`,
  `London`,
  `London`,
  `Tokio`
];

const MOCK_DESCRIPTION_STRINGS = [
  `Lorem ipsum dolor sit amet, consectetur adipiscing elit. `,
  `Cras aliquet varius magna, non porta ligula feugiat eget. `,
  `Fusce tristique felis at fermentum pharetra. `,
  `Aliquam id orci ut lectus varius viverra. `,
  `Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante. `,
  `Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum. `,
  `Sed blandit, eros vel aliquam faucibus, eu luctus nunc ante ut dui. `,
  `Sed sed nisi sed augue convallis suscipit in sed felis. `,
  `Aliquam erat volutpat. Nunc fermentum tortor ac porta dapibus. `,
  `In rutrum ac purus sit amet tempus. `
];

const MOCK_OFFERS = [
  {
    name: `add-luggage`,
    text: `Add luggage`,
    price: `10`,
    isSelected: true
  },
  {
    name: `switch-to-comfort-class`,
    text: `Switch to comfort class`,
    price: `20`,
    isSelected: true
  },
  {
    name: `add-meal`,
    text: `Add meal`,
    price: `30`,
    isSelected: false
  },
  {
    name: `choose-seats`,
    text: `Choose seats`,
    price: `40`,
    isSelected: false
  }
];

/**
 * Функция возвращает случайно сгенерированную точку маршрута
 * @return {Object} - точка маршрута
 */
function createMockTripPoint() {
  const type = randomArrayItem(TRIP_POINT_TYPES);
  const startDate = Date.now() + 1 + randomInteger(10 * 24 * 3600 * 1000);
  const endDate = startDate + (1 + randomInteger(10)) * 1800 * 1000;

  return {
    type,
    destination: randomArrayItem(MOCK_DESTINATION),
    startDate,
    endDate,
    offers: randomArrayFromArray(MOCK_OFFERS).slice(0, 2),
    price: 10 + randomInteger(100) * 5,
    destinationText: randomArrayFromArray(MOCK_DESCRIPTION_STRINGS).slice(0, 5).join(` `),
    photos: Array.from({length: 3}, () => `http://picsum.photos/300/150?r=${Math.random()}`),
    isFavorite: randomBoolean()
  };
}

export default createMockTripPoint;
