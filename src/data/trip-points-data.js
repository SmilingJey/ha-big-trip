import API from '../api.js';

/**
 * Класс содержиет данные задач
 */
export default class TripPointsData {
  constructor({END_POINT, AUTHORIZATION}) {
    this._data = null;
    this._api = new API({
      endPoint: END_POINT,
      authorization: AUTHORIZATION,
      resourceName: `points`,
    });

    this._onDataChange = null;
  }

  /**
   * Задает колбэк вызываемый при изменении данных
   * @param {Function} fn - функция вызываемая при изменении данных
   */
  set onDataChange(fn) {
    this._onDataChange = fn;
  }

  /**
   * Загрузка данных
   * @return {Promise} - промис
   */
  load() {
    return this._api.getResources()
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
  getTripPoints() {
    return this._data;
  }

  /**
   * Добавляет новую точку путешествия
   * @param {Object} tripPointData - задача
   * @return {Promise} - промис
   */
  addTripPoint(tripPointData) {
    const rawData = TripPointsData.toRAW(tripPointData);
    delete rawData.id;
    return this._api.createResource({data: rawData})
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
  updateTripPoint(tripPointData) {
    return this._api.updateResource({
      id: tripPointData.id,
      data: TripPointsData.toRAW(tripPointData),
    })
      .then(TripPointsData.parseData)
      .then((updatedData) => {
        const tripPointIndex = this._getTripPointIndexById(tripPointData.id);
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
  deleteTripPoint({id}) {
    return this._api.deleteResource({id})
      .then(() => {
        this._data.splice(this._getTripPointIndexById(id), 1);
        this._emitDataChange(`delete`);
      });
  }

  /**
   * Поиск в this._data по id
   * @param {String} id - идентификатор
   * @return {Number} - индекс в массиве this._data
   */
  _getTripPointIndexById(id) {
    return this._data.findIndex((tripPoint) => id === tripPoint.id);
  }

  /**
   * Событие о изменении данных
   * @param {String} eventName - имя события
   */
  _emitDataChange(eventName) {
    if (typeof this._onDataChange === `function`) {
      this._onDataChange(eventName);
    }
  }

  /**
   * Возвращает новую точку путешествия
   * @param {Object} data - начальные данные
   * @return {Object} - данные точки путешествия
   */
  static createEmptyTripPoint(data = {}) {
    data.id = data.id ? data.id : `0`;
    data.type = data.type ? data.type : `taxi`;
    data.destination = data.destination ? data.destination : {
      name: `New point`,
      description: `Select destination to view description`,
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
