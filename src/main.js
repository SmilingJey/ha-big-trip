import TripPointsList from './ui/trip-points-list.js';
import FilterList from './ui/filters-list.js';
import Statistic from './ui/statistic.js';
import ScheduleView from './ui/schedule.js';
import TotalCostView from './ui/total-cost.js';
import DestinationsData from './data/destinations-data.js';
import AvailableOffersData from './data/available-offers-data.js';
import TripPointsData from './data/trip-points-data.js';
import {compareDate} from './utils/date-utils.js';
import {calcTripPointCost} from './utils/trip-utils.js';


const AUTHORIZATION = `Basic smilingjey9`;
const END_POINT = `https://es8-demo-srv.appspot.com/big-trip`;

// компоненты доступа к данным
const tripPointsData = new TripPointsData({END_POINT, AUTHORIZATION});
const destinationsData = new DestinationsData({END_POINT, AUTHORIZATION});
const availableOffersData = new AvailableOffersData({END_POINT, AUTHORIZATION});

// компоненты интерфейса
// список точек путешествия
const tripPointsList = new TripPointsList({
  tripPointsData,
  destinationsData,
  availableOffersData,
});
document.querySelector(`main`).append(tripPointsList.render());

// фильтры
const filtersList = new FilterList(tripPointsData.getTripPoints.bind(tripPointsData));
const filtersContainerElement = document.querySelector(`.trip-controls__menus`);
filtersContainerElement.appendChild(filtersList.render());

// статистика
const statistic = new Statistic(tripPointsData.getTripPoints.bind(tripPointsData));
document.querySelector(`body`).appendChild(statistic.render());
statistic.element.classList.add(`visually-hidden`);

// заголовок с точками путешесвия
const tripElement = document.querySelector(`.trip`);
const schedule = new ScheduleView(tripPointsData.getTripPoints.bind(tripPointsData));
tripElement.appendChild(schedule.render());

// блок с суммарной стоимость
const totalCost = new TotalCostView(tripPointsData.getTripPoints.bind(tripPointsData));
tripElement.appendChild(totalCost.render());

// связывание компонентов
filtersList.onFilter = (filterFunction) => {
  tripPointsList.filterFunction = filterFunction;
};

tripPointsData.addListener(tripPointsList.update.bind(tripPointsList));
tripPointsData.addListener(schedule.update.bind(schedule));
tripPointsData.addListener(totalCost.update.bind(totalCost));
tripPointsData.addListener(statistic.update.bind(statistic));
tripPointsData.addListener(filtersList.update.bind(filtersList));

// переключение между списком и статистикой
const tableLinkElement = document.querySelector(`a[href="#table"]`);
const statsLinkElement = document.querySelector(`a[href="#stats"]`);
const mainElement = document.querySelector(`main`);

statsLinkElement.addEventListener(`click`, (evt) => {
  tableLinkElement.classList.remove(`view-switch__item--active`);
  statsLinkElement.classList.add(`view-switch__item--active`);
  mainElement.classList.add(`visually-hidden`);
  statistic.element.classList.remove(`visually-hidden`);
  filtersList.element.style.visibility = `hidden`;
  statistic.update();
  evt.preventDefault();
});

tableLinkElement.addEventListener(`click`, (evt) => {
  tableLinkElement.classList.add(`view-switch__item--active`);
  statsLinkElement.classList.remove(`view-switch__item--active`);
  mainElement.classList.remove(`visually-hidden`);
  statistic.element.classList.add(`visually-hidden`);
  filtersList.element.style.visibility = `visible`;
  evt.preventDefault();
});

// создание новой точки путешествия
const newTripPointButton = document.querySelector(`.trip-controls__new-event`);
newTripPointButton.addEventListener(`click`, tripPointsList.createNewTripPoint.bind(tripPointsList));

// сортировки списка точек путешествия
const sortingElement = document.querySelector(`.trip-sorting`);

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

sortingElement.addEventListener(`change`, (evt) => {
  if (sortingFunctions.hasOwnProperty(evt.target.value)) {
    tripPointsList.sortFunction = sortingFunctions[evt.target.value];
  }
});

// переключение между online и offline режимами работы
window.addEventListener(`offline`, () => {
  document.title = `${document.title} [OFFLINE]`;
});

window.addEventListener(`online`, () => {
  document.title = document.title.split(` [OFFLINE]`)[0];
  tripPointsData.syncTripPoints();
});

// загрузка данных
tripPointsList.showLoadingMessage();
Promise.all([
  destinationsData.load(),
  availableOffersData.load(),
  tripPointsData.load(),
]).then(() => tripPointsList.hideMessage())
  .catch(() => tripPointsList.showErrorMessage());
