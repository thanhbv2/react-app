

class FetchUtils {
  constructor() {
    this.url = 'http://localhost:3000';
    this.timeout = 10000;
  }
  /**
   * Request with data json
   */
  getHeaderConfigJson() {
    const headers = {
      'Content-Type': 'application/json',
    }
    return headers;
  }

  /**
   * endpoint: Full path URL
   * config: set method, headers, body
   * timeout: max time request
   */

  async fetchWithTimeout(endpoint, config, timeout, callback) {

    try {
      const response = await Promise.race([
        fetch(endpoint, config),
        new Promise((resolve, reject) => {
          setTimeout(() => resolve({ name: 'REQUEST_TIME_OUT', message: 'Request time out' }), timeout)
        })
      ])

      return await response.json();
    } catch (error) {
      throw Error(error.message);
    }
  }


  /**
   * endpoint: sort path request
   * config: set method, headers, body
   */


  async beforeFetch(endpoint, config) {
    let fullPath = endpoint.startsWith('/') ? this.url + endpoint : `${this.url}${endpoint}`;
    config.headers = this.getHeaderConfigJson();
    if (config.body) {
      config.body = typeof config.body === 'string' ? config.body : JSON.stringify(config.body)
    }
    try {


      const response = await this.fetchWithTimeout(fullPath, config, this.timeout);

      return response;
    } catch (error) {
      throw Error(error);
    }
  }


  async refreshToken() {
    let refreshToken = localStorage.getItem('refreshToken');
    const response = await this.getAccessToken(`/oauth/oauth/token`, { grant_type: 'refresh_token', refresh_token: refreshToken })
    if (response.httpCode === 200) {
      await localStorage.setItem('accessToken', response.accessToken);
      localStorage.setItem('refreshToken', response.refreshToken);
      localStorage.setItem('expiresAt', response.accessTokenExpiresAt);
    }
  }

  parseFormDataEncode(data) {
    const formData = [];
    if (data) {
      for (const key in data) {
        if (typeof data[key] === 'object') {
          formData.push(encodeURIComponent(key) + '=' + encodeURIComponent(JSON.stringify(data[key])));
        } else {
          formData.push(encodeURIComponent(key) + '=' + encodeURIComponent(data[key]));
        }
      }
    }
    return formData.join("&");
  }

  async getAccessToken(endpoint, body) {
    const config = {};
    let fullPath = endpoint.startsWith('/') ? this.url + endpoint : `${this.url}${endpoint}`;
    config.method = "POST";
    config.headers = this.getHeaderConfigEncoded();
    config.body = this.parseFormDataEncode(body)
    try {
      const response = await this.fetchWithTimeout(fullPath, config, this.timeout);
      if (response) {
        return response;
      }
    } catch (error) {
      throw Error(error);
    }
  }


  async get(endpoint, body) {
    if (body) {
      let query = this.parseFormDataEncode(body);
      endpoint = `${endpoint}?${query}`;
    }
    return this.beforeFetch(endpoint, { method: 'GET' })
  }

  async post(endpoint, body) {
    return this.beforeFetch(endpoint, { method: 'POST', body });
  }

  async put(endpoint, body) {
    return this.beforeFetch(endpoint, { method: 'PUT', body });
  }

  async patch(endpoint, body) {
    return this.beforeFetch(endpoint, { method: 'PATCH', body });
  }

  async delete(endpoint, body) {
    return this.beforeFetch(endpoint, { method: 'DELETE', body });
  }
}

export default new FetchUtils();