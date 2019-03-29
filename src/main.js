import TripPointsList from './ui/trip-points-list.js';
import FilterList from './ui/filters-list.js';
import Statistic from './ui/statistic.js';
import ScheduleView from './ui/schedule.js';
import TotalCostView from './ui/total-cost.js';
import DestinationsData from './data/destinations-data.js';
import AvailableOffersData from './data/available-offers-data.js';
import TripPointsData from './data/trip-points-data.js';
import {compareDate} from './utils/date-utils.js';
import {calcTripPointCost, getTripStartDate} from './utils/trip-utils.js';


const AUTHORIZATION = `Basic smilingjey2`;
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
const filtersList = new FilterList();
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

tripPointsData.onDataChange = () => {
  tripPointsList.update();
  schedule.update();
  totalCost.update();
  statistic.update();
};

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
function onNewTripPointClick() {
  const newTaskData = TripPointsData.createEmptyTripPoint({
    type: `taxi`,
    dateFrom: getTripStartDate(tripPointsData.getTripPoints()),
    dateTo: getTripStartDate(tripPointsData.getTripPoints()),
    offers: availableOffersData.getOffers(`taxi`),
  });

  tripPointsData.addTripPoint(newTaskData)
    .then((data) => tripPointsList.openTripPointInEditMode(data))
    .catch(() => tripPointsList.showErrorMessage());
}
const newTripPointButton = document.querySelector(`.trip-controls__new-event`);
newTripPointButton.addEventListener(`click`, onNewTripPointClick);

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

function onSortChange(evt) {
  if (sortingFunctions.hasOwnProperty(evt.target.value)) {
    tripPointsList.sortFunction = sortingFunctions[evt.target.value];
  }
}

sortingElement.addEventListener(`change`, onSortChange);

// загрузка данных
destinationsData.load();
availableOffersData.load();
tripPointsList.showLoadingMessage();
tripPointsData.load()
  .then((data) => {
    return data;
  })
  .then(() => tripPointsList.hideMessage())
  .catch(() => tripPointsList.showErrorMessage());
