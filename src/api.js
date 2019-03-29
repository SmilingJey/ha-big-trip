const Method = {
  GET: `GET`,
  POST: `POST`,
  PUT: `PUT`,
  DELETE: `DELETE`
};

export default class API {
  constructor({endPoint, authorization, resourceName}) {
    this._endPoint = endPoint;
    this._authorization = authorization;
    this._resourceName = resourceName;
  }

  createResource({data}) {
    return this._load({
      url: this._resourceName,
      method: Method.POST,
      body: JSON.stringify(data),
      headers: new Headers({'Content-Type': `application/json`})
    })
      .then(API.toJSON);
  }

  getResources() {
    return this._load({url: this._resourceName})
      .then(API.toJSON);
  }

  updateResource({id, data}) {
    return this._load({
      url: `${this._resourceName}/${id}`,
      method: Method.PUT,
      body: JSON.stringify(data),
      headers: new Headers({'Content-Type': `application/json`})
    })
      .then(API.toJSON);
  }

  deleteResource({id}) {
    return this._load({
      url: `${this._resourceName}/${id}`,
      method: Method.DELETE
    });
  }

  _load({url, method = Method.GET, body = null, headers = new Headers()}) {
    headers.append(`Authorization`, this._authorization);
    return fetch(`${this._endPoint}/${url}`, {method, body, headers})
      .then(API.checkStatus);
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
