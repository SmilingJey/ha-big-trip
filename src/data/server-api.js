const Method = {
  GET: `GET`,
  POST: `POST`,
  PUT: `PUT`,
  DELETE: `DELETE`
};

export default class ServerAPI {
  constructor({endPoint, authorization, resourceName}) {
    this._endPoint = endPoint;
    this._authorization = authorization;
    this._resourceName = resourceName;
  }

  getResources() {
    return this._load({url: this._resourceName})
      .then(ServerAPI.toJSON);
  }

  createResource({data}) {
    return this._load({
      url: this._resourceName,
      method: Method.POST,
      body: JSON.stringify(data),
      headers: new Headers({'Content-Type': `application/json`})
    })
      .then(ServerAPI.toJSON);
  }

  updateResource({id, data}) {
    return this._load({
      url: `${this._resourceName}/${id}`,
      method: Method.PUT,
      body: JSON.stringify(data),
      headers: new Headers({'Content-Type': `application/json`})
    })
      .then(ServerAPI.toJSON);
  }

  deleteResource({id}) {
    return this._load({
      url: `${this._resourceName}/${id}`,
      method: Method.DELETE
    });
  }

  syncResources({data}) {
    return this._load({
      url: `${this._resourceName}/sync`,
      method: `POST`,
      body: JSON.stringify(data),
      headers: new Headers({'Content-Type': `application/json`})
    })
      .then(ServerAPI.toJSON);
  }

  _load({url, method = Method.GET, body = null, headers = new Headers()}) {
    headers.append(`Authorization`, this._authorization);
    return fetch(`${this._endPoint}/${url}`, {method, body, headers})
      .then(ServerAPI.checkStatus);
  }

  static checkStatus(response) {
    if (response.status >= 200 && response.status < 300) {
      return response;
    } else {
      throw new Error(`${response.status}: ${response.statusText}`);
    }
  }

  static toJSON(response) {
    return response.json();
  }
}
