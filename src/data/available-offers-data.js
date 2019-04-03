import ServerAPI from './server-api.js';
import OfflineStore from './offline-store.js';
import OfflineProvider from './offline-provider.js';

const AVAILABLE_OFFRES_RESOURSE = `offers`;

/**
 * Отвечает за загрузку и хранение точек назначения
 */
export default class AvailableOffersData {
  constructor({END_POINT, AUTHORIZATION}) {
    this._data = [];
    this._api = new ServerAPI({
      endPoint: END_POINT,
      authorization: AUTHORIZATION,
      resourceName: AVAILABLE_OFFRES_RESOURSE,
    });

    this._store = new OfflineStore({key: AVAILABLE_OFFRES_RESOURSE, storage: localStorage});
    this._provider = new OfflineProvider({
      api: this._api,
      store: this._store,
      getId: (data) => data.type,
      generateId: () => ``,
    });
  }

  /**
   * Загрузка точек назначения
   * @return {Promise} - промис
   */
  load() {
    return this._provider.getResources()
      .then((data) => data.map(AvailableOffersData.parseData))
      .then((data) => {
        this._data = data;
        return data;
      });
  }

  /**
   * Возвращает доступные офферы для заданного типа точки путешествия
   * @param {String} type - имя
   * @return {Object} - описание
   */
  getOffers(type) {
    const offersForType = this._data.find((availableOffres) => availableOffres.type === type);
    return offersForType ? offersForType.offers : [];
  }

  static parseData(data) {
    return {
      type: data.type,
      offers: data.offers.map((offer) => ({
        title: offer.name,
        price: offer.price,
        accepted: false,
      })),
    };
  }
}
