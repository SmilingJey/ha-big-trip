/**
 * Класс отвечает за доступ к оффлайн хранилищу
 */
export default class OfflineStore {
  constructor({key, storage}) {
    this._storage = storage;
    this._storeKey = key;
  }

  setItem({key, data}) {
    const items = this._getAll();
    items[key] = data;
    this._storage.setItem(this._storeKey, JSON.stringify(items));
  }

  getItem({key}) {
    const items = this._getAll();
    return items[key];
  }

  getAllItems() {
    const object = this._getAll();
    return Object.keys(object).map((id) => object[id]);
  }

  removeItem({key}) {

    const items = this._getAll();
    delete items[key];
    this._storage.setItem(this._storeKey, JSON.stringify(items));
  }

  removeAllItems() {
    this._storage.setItem(this._storeKey, {});
  }

  _getAll() {
    const emptyItems = {};
    const items = this._storage.getItem(this._storeKey);

    if (!items) {
      return emptyItems;
    }

    try {
      return JSON.parse(items);
    } catch (e) {
      return emptyItems;
    }
  }
}
