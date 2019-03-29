import API from '../api.js';

/**
 * Отвечает за загрузку и хранение точек назначения
 */
export default class DestinationsData {
  constructor({END_POINT, AUTHORIZATION}) {
    this._data = null;
    this._api = new API({
      endPoint: END_POINT,
      authorization: AUTHORIZATION,
      resourceName: `destinations`,
    });
  }

  /**
   * Загрузка точек назначения
   * @return {Promise} - промис
   */
  load() {
    return this._api.getResources()
      .then((data) => {
        this._data = data;
        return data;
      });
  }

  /**
   * Возвращает описание точки назначения по её имени
   * @param {String} destinationName - имя
   * @return {Object} - описание
   */
  getDescription(destinationName) {
    const findingResult = this._data.find((destination) => destination.name === destinationName);
    return findingResult ? findingResult : {
      name: `Unknow`,
      description: ``,
      pictures: [],
    };
  }

  /**
   * Возвращает имена точек назначения
   * @return {Array} - массив с именами точек назначения
   */
  getDestinations() {
    return this._data.map((destination) => destination.name);
  }
}
