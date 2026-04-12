// Type definitions for @nodebug/axios 2.0.0

import type { AxiosRequestConfig, AxiosResponse, AxiosError, AxiosInstance } from 'axios'
import type { CookieJar } from 'tough-cookie'
import type { HttpCookieAgent } from 'http-cookie-agent/http'

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
 * @returns {HttpCookieAgent}
 */
function createHttpsAgent(jar, rejectUnauthorized = true) {
  return new HttpCookieAgent({
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
    if (!require('axios').defaults.httpAgent) {
      require('axios').defaults.httpAgent = httpAgent
    }
    if (!require('axios').defaults.httpsAgent) {
      require('axios').defaults.httpsAgent = httpsAgent
    }

    this._connection = require('axios').default.create({
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
}

export { Axios, CookieJar }
