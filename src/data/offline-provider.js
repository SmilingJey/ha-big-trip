/**
 * Класс отвечает за переключением работы online/offline
 * online - запрос к серверу через api
 * offline - запрос к offline хранилищу
 */
export default class OfflineProvider {
  constructor(config) {
    this._api = config.api;
    this._store = config.store;
    this._getId = config.getId;
    this._generateId = config.generateId;

    this._needSync = false;

    this._storeResource = this._storeResource.bind(this);
    this._storeResources = this._storeResources.bind(this);
  }

  getResources() {
    if (this._isOnline()) {
      return this._api.getResources()
        .then(this._storeResources);
    }
    return Promise.resolve(this._store.getAllItems());
  }

  createResource({data}) {
    if (this._isOnline()) {
      return this._api.createResource({data})
        .then(this._storeResource);
    }

    const id = this._generateId(data);
    this._needSync = true;
    this._store.setItem({key: id, data});
    return Promise.resolve(data);
  }

  updateResource({id, data}) {
    if (this._isOnline()) {
      return this._api.updateResource({id, data})
        .then(this._storeItem);
    }

    this._needSync = true;
    this._store.setItem({key: id, data});
    return Promise.resolve(data);
  }

  deleteResource({id}) {
    if (this._isOnline()) {
      return this._api.deleteResource({id})
        .then(() => {
          this._store.removeItem({id});
        });
    }

    this._needSync = true;
    this._store.removeItem({key: id});
    return Promise.resolve(true);
  }

  syncResources() {
    return this._api.syncResources({data: this._store.getAllItems()});
  }

  _storeResource(data) {
    this._store.setItem({key: this._getId(data), data});
    return data;
  }

  _storeResources(data) {
    this._store.removeAllItems();
    data.map(this._storeResource);
    return data;
  }

  _isOnline() {
    return window.navigator.onLine;
  }
}
