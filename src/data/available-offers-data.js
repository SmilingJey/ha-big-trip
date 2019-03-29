import API from '../api.js';

/**
 * Отвечает за загрузку и хранение точек назначения
 */
export default class AvailableOffersData {
  constructor({END_POINT, AUTHORIZATION}) {
    this._data = null;
    this._offersAPI = new API({
      endPoint: END_POINT,
      authorization: AUTHORIZATION,
      resourceName: `offers`,
    });
  }

  /**
   * Загрузка точек назначения
   * @return {Promise} - промис
   */
  load() {
    return this._offersAPI.getResources()
      .then((data) => data.map(AvailableOffersData.parseOffer))
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
    return offersForType ? offersForType.offers : null;
  }

  static parseOffer(data) {
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
