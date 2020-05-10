import api from '../api';
import StorageService from './storageService'

/**
 * Service to abstract api calls to one file - to be used in middleware
 */
class ApiSerice {


  constructor() {
    this.api_url = 'http://localhost:8000';
  }

  /**
   * Service function to avoid repetition of fetch everywhere
   * @param {string} url - url to fetch
   * @param {string} method - method get or post
   * @param {string|boolean} token  - authentication token
   * @param {object|null} params - params payload
   */
  async apiCall(url, method = 'GET', token = false, params = null) {
    let payload = {
      method,
      mode: 'cors',
      headers: this.buildHeaders(token),
    }
    if (params) {
      payload.body = JSON.stringify(params);
    }
    console.log(payload)
    const res = await fetch(`${this.api_url}${url}`, payload);
    const status = res.status;
    const body = await res.json();
    return { status, body };
  }

  /**
   * Build  http headers object
   * @param {string|boolean} token
   */
  buildHeaders(token = false) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    if (token) {
      headers.append('Authorization', `Bearer facebook ${token}`);
    }
    return headers;
  }

  /**
   * Throw common error on not successful status
   * @param {object} response
   * @param {bool} auth - check for unauth error or not
   */
  handleCommonError(response, auth = false) {
    if(response.status === 401 && auth) {
      StorageService.removeToken()
      window.location(api.login)
    }
    if (response.status !== 200 && response.status !== 201) {
      throw new Error(response.status)
    }
    return;
  }


  async register(params) { //registration
    const reg = await this.apiCall(api.sign_up, 'POST', false, params);
    return reg;
  }

  // login/register
  async convertToken(params) {
    console.log(params);
    const res = await this.apiCall(api.convert_token, 'POST', false, params);
    this.handleCommonError(res);
    return res.body;
  }

  async me(token) {
    console.log(token);
    const res = await this.apiCall(api.me, 'GET', token);
    this.handleCommonError(res);
    return res.body;
  }

  async login(params) { //login
    const res = await this.apiCall(api.login, 'POST', false, params);
    this.handleCommonError(res);
    return res.body;
  }

  async logout(token) { //login
    const res = await this.apiCall(api.logout, 'POST', false, null, token);
    return res.status;
  }

  async verify_token(token = false) { //verify token on load
    const res = await this.apiCall(api.verify_token, 'POST', false, { token });
    this.handleCommonError(res);
    return res.status;
  }
}

export default new ApiSerice()
