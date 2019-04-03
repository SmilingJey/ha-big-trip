import TripPointsList from './ui/trip-points-list.js';
import FilterList from './ui/filters-list.js';
import Statistic from './ui/statistic.js';
import Schedule from './ui/schedule.js';
import TotalCost from './ui/total-cost.js';
import DestinationsData from './data/destinations-data.js';
import AvailableOffersData from './data/available-offers-data.js';
import TripPointsData from './data/trip-points-data.js';
import {initOfflineController} from './controllers/offline-controller.js';
import {initTripSortContrloller} from './controllers/trip-sort-controller.js';
import {initPageChangeController} from './controllers/page-change-controller.js';

const ServerConfig = {
  AUTHORIZATION: `Basic smilingjey9`,
  END_POINT: `https://es8-demo-srv.appspot.com/big-trip`,
};

// компоненты доступа к данным
const tripPointsData = new TripPointsData(ServerConfig);
const destinationsData = new DestinationsData(ServerConfig);
const availableOffersData = new AvailableOffersData(ServerConfig);

// создание списока точек путешествия
const tripPointsList = new TripPointsList({
  tripPointsData,
  destinationsData,
  availableOffersData,
});
document.querySelector(`main`).append(tripPointsList.render());
tripPointsData.addListener(tripPointsList.update.bind(tripPointsList));

// создание списка фильтров
const filtersList = new FilterList(tripPointsData.getAll.bind(tripPointsData));
const filtersContainerElement = document.querySelector(`.trip-controls__menus`);
filtersContainerElement.appendChild(filtersList.render());
filtersList.onFilter = (filterFunction) => {
  tripPointsList.filterFunction = filterFunction;
};
tripPointsData.addListener(filtersList.update.bind(filtersList));

// создание компонента статистики
const statistic = new Statistic(tripPointsData.getAll.bind(tripPointsData));
document.querySelector(`body`).appendChild(statistic.render());
statistic.element.classList.add(`visually-hidden`);
tripPointsData.addListener(statistic.update.bind(statistic));

// создание заголовка с точками путешествия
const tripElement = document.querySelector(`.trip`);
const schedule = new Schedule(tripPointsData.getAll.bind(tripPointsData));
tripElement.appendChild(schedule.render());
tripPointsData.addListener(schedule.update.bind(schedule));

// создание блока с суммарной стоимостью
const totalCost = new TotalCost(tripPointsData.getAll.bind(tripPointsData));
tripElement.appendChild(totalCost.render());
tripPointsData.addListener(totalCost.update.bind(totalCost));

// настройка создания новой точки путешествия по клику на кнопку
const newPointButtonElement = document.querySelector(`.trip-controls__new-event`);
newPointButtonElement.addEventListener(`click`, tripPointsList.createNewTripPoint.bind(tripPointsList));

// настройка переключения между страницами
initPageChangeController({
  tripTableLinkElement: document.querySelector(`a[href="#table"]`),
  statisticLinkElement: document.querySelector(`a[href="#stats"]`),
  tripTableElement: document.querySelector(`main`),
  statistic,
  filtersList
});

// настройка сортировки
const sortingElement = document.querySelector(`.trip-sorting`);
initTripSortContrloller({sortingElement, tripPointsList});

// настройка перехода между оффлайн и онлайн режимами работы
initOfflineController({tripPointsData});

// загрузка данных
tripPointsList.showLoadingMessage();
Promise.all([
  destinationsData.load(),
  availableOffersData.load(),
  tripPointsData.load(),
]).then(() => tripPointsList.hideMessage())
  .catch(() => tripPointsList.showErrorMessage());
