import ServerAPI from './server-api.js';
import OfflineStore from './offline-store.js';
import OfflineProvider from './offline-provider.js';

const TRIP_POINTS_RESOURSE = `points`;

/**
 * Класс содержит данные точек путешествия
 */
export default class TripPointsData {
  constructor({END_POINT, AUTHORIZATION}) {
    this._data = null;
    this._api = new ServerAPI({
      endPoint: END_POINT,
      authorization: AUTHORIZATION,
      resourceName: TRIP_POINTS_RESOURSE,
    });
    this._store = new OfflineStore({key: TRIP_POINTS_RESOURSE, storage: localStorage});
    this._provider = new OfflineProvider({
      api: this._api,
      store: this._store,
      getId: (data) => data.id,
      generateId: (data) => {
        data.id = String(Date.now());
        return data.id;
      },
    });

    this._listeners = [];
  }

  /**
   * Подписка на изменение данных
   * @param {Function} callback - функция вызываемая при изменении данных
   */
  addListener(callback) {
    this._listeners.push(callback);
  }

  /**
   * Удаление подписки на изменение данных
   * @param {Function} callback
   */
  removeListener(callback) {
    this._listeners = this._listeners.filter((listener) => listener !== callback);
  }

  /**
   * Загрузка данных
   * @return {Promise} - промис
   */
  load() {
    return this._provider.getResources()
      .then((data) => data.filter(Boolean))
      .then((data) => data.map(TripPointsData.parseData))
      .then((data) => {
        this._data = data;
        this._emitDataChange(`load`);
        return this._data;
      });
  }

  /**
   * Возвращает данные
   * @return {Array} - массив данных
   */
  getAll() {
    return this._data;
  }

  /**
   * Добавляет новую точку путешествия
   * @param {Object} tripPointData - задача
   * @return {Promise} - промис
   */
  add(tripPointData) {
    const rawData = TripPointsData.toRAW(tripPointData);
    delete rawData.id;
    return this._provider.createResource({data: rawData})
      .then(TripPointsData.parseData)
      .then((newData) => {
        this._data.push(newData);
        this._emitDataChange(`add`);
        return newData;
      });
  }

  /**
   * Обновляет точку путешествия
   * @param {Object} tripPointData - новые данные
   * @return {Promise} - промис
   */
  update(tripPointData) {
    return this._provider.updateResource({
      id: tripPointData.id,
      data: TripPointsData.toRAW(tripPointData),
    })
      .then(TripPointsData.parseData)
      .then((updatedData) => {
        const tripPointIndex = this._getIndexById(tripPointData.id);
        this._data[tripPointIndex] = updatedData;
        this._emitDataChange(`update`);
        return updatedData;
      });
  }

  /**
   * Удаление точки путешествич
   * @param {Object} data - данные точки путешествия
   * @return {Promise} - промис
   */
  delete({id}) {
    return this._provider.deleteResource({id})
      .then(() => {
        this._data.splice(this._getIndexById(id), 1);
        this._emitDataChange(`delete`);
      });
  }

  sync() {
    this._provider.syncResources();
  }

  /**
   * Поиск в this._data по id
   * @param {String} id - идентификатор
   * @return {Number} - индекс в массиве this._data
   */
  _getIndexById(id) {
    return this._data.findIndex((tripPoint) => id === tripPoint.id);
  }

  /**
   * Событие о изменении данных
   * @param {String} eventName - имя события
   */
  _emitDataChange(eventName) {
    this._listeners.forEach((listener) => listener(eventName));
  }

  /**
   * Возвращает новую точку путешествия
   * @param {Object} data - начальные данные
   * @return {Object} - данные точки путешествия
   */
  static createEmpty(data = {}) {
    data.id = data.id ? data.id : `0`;
    data.type = data.type ? data.type : `taxi`;
    data.destination = data.destination ? data.destination : {
      name: `New point`,
      description: `No descrition for this destination`,
      pictures: [],
    };
    data.dateFrom = data.dateFrom ? data.dateFrom : Date.now();
    data.dateTo = data.dateTo ? data.dateTo : Date.now();
    data.price = data.price ? data.price : 20;
    data.offers = data.offers ? data.offers : [];
    data.isFavorite = data.isFavorite ? data.isFavorite : false;
    return data;
  }

  /**
   * Преобразует данные точки путешествия в данные для отправки на сервер
   * @param {Object} data - точка путешествия
   * @return {Object} - данные в формате, принимаемом сервером
   */
  static toRAW(data) {
    return {
      id: data.id,
      type: data.type,
      destination: data.destination,
      // eslint-disable-next-line camelcase
      date_from: data.dateFrom,
      // eslint-disable-next-line camelcase
      date_to: data.dateTo,
      // eslint-disable-next-line camelcase
      base_price: data.price,
      offers: data.offers,
      // eslint-disable-next-line camelcase
      is_favorite: data.isFavorite,
    };
  }

  /**
   * Преобразует данные полученные от сервера в объект точки путешествия
   * @param {Object} data - данные сервера
   * @return {Object} - точка путешествия
   */
  static parseData(data) {
    return {
      id: data.id,
      type: data.type,
      destination: data.destination,
      dateFrom: data.date_from,
      dateTo: data.date_to,
      price: data.base_price,
      offers: data.offers,
      isFavorite: data.is_favorite,
    };
  }
}
