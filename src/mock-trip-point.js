import {randomInteger, randomBoolean, randomArrayItem, randomArrayFromArray} from './utils/random-utils.js';

const TRIP_POINT_TYPES = [
  `Taxi`,
  `Bus`,
  `Train`,
  `Ship`,
  `Transport`,
  `Drive`,
  `Flight`,
  `Check-in`,
  `Sightseeing`,
  `Restaurant`,
];

const MOCK_TITLES = {
  [`Taxi`]: `Taxi to airport`,
  [`Bus`]: `Bus to hotel`,
  [`Train`]: `Train to Amsterdam`,
  [`Ship`]: `Ship to Chamonix`,
  [`Transport`]: `Transport to hotel`,
  [`Drive`]: `Drive to sighs`,
  [`Flight`]: `Flight to Geneva`,
  [`Check-in`]: `Check into hotel`,
  [`Sightseeing`]: `Sightseeing`,
  [`Restaurant`]: `Dinner in restaurant`,
};

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
    name: `Add luggage`,
    price: `20`,
    isSelected: false
  },
  {
    name: `Switch to comfort class`,
    price: `20`,
    isSelected: false
  },
  {
    name: `Add meal`,
    price: `20`,
    isSelected: false
  },
  {
    name: `Choose seats`,
    price: `20`,
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
    title: MOCK_TITLES[type],
    startDate,
    endDate,
    offers: randomArrayFromArray(MOCK_OFFERS).slice(0, 2),
    price: 10 + randomInteger(5) * 20,
    distination: randomArrayFromArray(MOCK_DESCRIPTION_STRINGS).slice(0, 5).join(` `),
    photos: Array.from({length: 5}, () => `http://picsum.photos/300/150?r=${Math.random()}`),
    isFavorite: randomBoolean()
  };
}

export default createMockTripPoint;
