import {randomInteger, randomBoolean, randomArrayItem, randomArrayFromArray} from './utils/random-utils.js';
import {TripPointType} from './trip-point-type.js';

const MOCK_DESTINATION = [
  `Amsterdam`,
  `London`,
  `Moscow`,
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
    title: `Add luggage`,
    price: `10`,
    accepted: true,
  },
  {
    title: `Switch to comfort class`,
    price: `20`,
    accepted: true,
  },
  {
    title: `Add meal`,
    price: `30`,
    accepted: false,
  },
  {
    title: `Choose seats`,
    price: `40`,
    accepted: false,
  },
];

let mockId = 0;

/**
 * Функция возвращает случайно сгенерированную точку маршрута
 * @return {Object} - точка маршрута
 */
function createMockTripPoint() {
  const dateFrom = Date.now() + 1 + randomInteger(10 * 24 * 3600 * 1000);
  return {
    id: mockId++,
    type: randomArrayItem(Object.keys(TripPointType)),
    destination: {
      name: randomArrayItem(MOCK_DESTINATION),
      description: randomArrayFromArray(MOCK_DESCRIPTION_STRINGS).slice(0, 5).join(` `),
      pictures: Array.from({length: 3}, () => ({
        description: `some text`,
        src: `http://picsum.photos/290/150?r=${Math.random()}`,
      }))
    },
    dateFrom,
    dateTo: dateFrom + randomInteger(10) * 60 * 15 * 1000,
    price: 10 + randomInteger(100) * 5,
    offers: randomArrayFromArray(MOCK_OFFERS).splice(0, 2),
    isFavorite: randomBoolean(),
  };
}

export default createMockTripPoint;
