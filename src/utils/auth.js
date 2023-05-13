class Auth {
  constructor(baseUrl) {
    this._baseUrl = baseUrl;
  }

  _getResponseData(res) {
    if (!res.ok) {
      return Promise.reject(`Ошибка: ${res.status}`);
    }
    return res.json();
  }

  register({ email, password }) {
    return fetch(this._baseUrl + "/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    }).then((res) => this._getResponseData(res));
  }

  authorize({ email, password }) {
    return fetch(this._baseUrl + "/signin", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    }).then((res) => this._getResponseData(res));
  }

  checkToken(jwt) {
    return fetch(this._baseUrl + "/users/me", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwt}`,
      },
    }).then((res) => this._getResponseData(res));
  }
}

const auth = new Auth("https://auth.nomoreparties.co");

export default auth;
