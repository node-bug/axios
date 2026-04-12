import { CookieJar } from 'tough-cookie'
import { HttpCookieAgent, HttpsCookieAgent } from 'http-cookie-agent/http'
import axios from 'axios'

/**
 * @typedef {import('axios').AxiosRequestConfig} AxiosRequestConfig
 * @typedef {import('axios').AxiosResponse} AxiosResponse
 * @typedef {import('axios').AxiosError} AxiosError
 * @typedef {import('axios').AxiosInstance} AxiosInstance
 */

/**
 * Creates an HTTP agent with cookie support
 * @param {CookieJar} jar - Cookie jar instance
 * @param {boolean} rejectUnauthorized - Whether to reject unauthorized certificates
 * @returns {HttpCookieAgent}
 */
function createHttpAgent(jar, rejectUnauthorized = true) {
  return new HttpCookieAgent({
    cookies: { jar },
    keepAlive: true,
    rejectUnauthorized,
  })
}

/**
 * Creates an HTTPS agent with cookie support
 * @param {CookieJar} jar - Cookie jar instance
 * @param {boolean} rejectUnauthorized - Whether to reject unauthorized certificates
 * @returns {HttpsCookieAgent}
 */
function createHttpsAgent(jar, rejectUnauthorized = true) {
  return new HttpsCookieAgent({
    cookies: { jar },
    keepAlive: true,
    rejectUnauthorized,
  })
}

/**
 * Axios wrapper with cookie jar support and retry logic
 */
class Axios {
  /**
   * @param {string} url - Base URL for requests
   * @param {boolean} rejectUnauthorized - Whether to reject unauthorized TLS certificates (default: true)
   */
  constructor(url, rejectUnauthorized = true) {
    this._url = url
    this._jar = new CookieJar()
    this._rejectUnauthorized = rejectUnauthorized

    const httpAgent = createHttpAgent(this._jar, this._rejectUnauthorized)
    const httpsAgent = createHttpsAgent(this._jar, this._rejectUnauthorized)

    // Set global agents if not already set
    if (!axios.defaults.httpAgent) {
      axios.defaults.httpAgent = httpAgent
    }
    if (!axios.defaults.httpsAgent) {
      axios.defaults.httpsAgent = httpsAgent
    }

    this._connection = axios.default.create({
      baseURL: this._url,
    })
  }

  /**
   * Get the base URL
   * @returns {string}
   */
  get url() {
    return this._url
  }

  /**
   * Set the base URL
   * @param {string} value - New base URL
   */
  set url(value) {
    this._url = value
    this._connection.defaults.baseURL = value
  }

  /**
   * Get the cookie jar instance
   * @returns {CookieJar}
   */
  get jar() {
    return this._jar
  }

  /**
   * Get the axios instance
   * @returns {AxiosInstance}
   */
  get connection() {
    return this._connection
  }

  /**
   * Perform an HTTP request with retry logic
   * @param {AxiosRequestConfig} config - Request configuration
   * @param {number} maxRetries - Maximum number of retries (default: 3)
   * @returns {Promise<AxiosResponse>}
   */
  async request(config, maxRetries = 3) {
    const retryConfig = { ...config }
    let lastError
    
    for (let i = 0; i <= maxRetries; i++) {
      try {
        const response = await this._connection.request(retryConfig)
        return response
      } catch (error) {
        lastError = error
        // If this is the last retry, throw the error
        if (i === maxRetries) {
          throw error
        }
        // Wait before retrying (exponential backoff)
        await new Promise(resolve => setTimeout(resolve, Math.pow(2, i) * 1000))
      }
    }
    throw lastError
  }

  /**
   * Perform a GET request
   * @param {string} url - Request URL
   * @param {AxiosRequestConfig} config - Request configuration
   * @returns {Promise<AxiosResponse>}
   */
  async get(url, config = {}) {
    return this._connection.get(url, config)
  }

  /**
   * Perform a POST request
   * @param {string} url - Request URL
   * @param {*} data - Request data
   * @param {AxiosRequestConfig} config - Request configuration
   * @returns {Promise<AxiosResponse>}
   */
  async post(url, data, config = {}) {
    return this._connection.post(url, data, config)
  }

  /**
   * Perform a PUT request
   * @param {string} url - Request URL
   * @param {*} data - Request data
   * @param {AxiosRequestConfig} config - Request configuration
   * @returns {Promise<AxiosResponse>}
   */
  async put(url, data, config = {}) {
    return this._connection.put(url, data, config)
  }

  /**
   * Perform a DELETE request
   * @param {string} url - Request URL
   * @param {AxiosRequestConfig} config - Request configuration
   * @returns {Promise<AxiosResponse>}
   */
  async delete(url, config = {}) {
    return this._connection.delete(url, config)
  }
}

export { Axios, CookieJar }