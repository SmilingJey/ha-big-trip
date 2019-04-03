import ServerAPI from './server-api.js';
import OfflineStore from './offline-store.js';
import OfflineProvider from './offline-provider.js';

const DESTINATION_RESOURSE = `destinations`;

/**
 * Отвечает за загрузку и хранение точек назначения
 */
export default class DestinationsData {
  constructor({END_POINT, AUTHORIZATION}) {
    this._data = [];
    this._api = new ServerAPI({
      endPoint: END_POINT,
      authorization: AUTHORIZATION,
      resourceName: DESTINATION_RESOURSE,
    });

    this._store = new OfflineStore({key: DESTINATION_RESOURSE, storage: localStorage});
    this._provider = new OfflineProvider({
      api: this._api,
      store: this._store,
      getId: (data) => data.name,
      generateId: () => ``,
    });
  }

  /**
   * Загрузка точек назначения
   * @return {Promise} - промис
   */
  load() {
    return this._provider.getResources()
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
      name: destinationName,
      description: `No descrition for this destination`,
      pictures: [],
    };
  }

  /**
   * Возвращает имена точек назначения
   * @return {Array} - массив с именами точек назначения
   */
  getDestinationsNames() {
    return this._data.map((destination) => destination.name);
  }
}
