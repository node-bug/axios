const { log } = require('@nodebug/logger')
const axios = require('axios').default
const { CookieJar } = require('tough-cookie')
const { HttpCookieAgent, HttpsCookieAgent } = require('http-cookie-agent/http')

class Axios {
  constructor(url) {
    this.url = url
    this.jar = new CookieJar()
    const props = {
      cookies: { jar: this.jar },
      keepAlive: true,
      rejectUnauthorized: false, // disable CA checks
    }
    axios.defaults.httpAgent = new HttpCookieAgent(props)
    axios.defaults.httpsAgent = new HttpsCookieAgent(props)
    this.connection = axios.create({
      baseURL: this.url,
    })
  }

  get url() {
    return this._url
  }

  set url(value) {
    this._url = value
  }

  async request(config) {
    let response
    const retry = 3
    log.info(`Running request for the resource ${this.url}${config.url}`)

    for (let i = 0; i <= retry; i++) {
      try {
        // eslint-disable-next-line no-await-in-loop
        response = await this.connection.request(config)
        log.info(
          `Request returned a response '${response.statusText}' with code '${response.status}'`,
        )
        break
      } catch (err) {
        response = err.response
        try {
          log.error(
            `Request returned an error '${response.stack}' with code '${response.status}'`,
          )
          if (i < retry) {
            log.info('Retrying API request again')
          }
        } catch (ex) {
          log.error(
            `Request failed. Request config: ${JSON.stringify(config)}\n${
              err.stack
            }`,
          )
          log.info('Retrying API request again')
          if (i === retry) {
            throw err
          }
        }
      }
    }
    log.debug(`Request config:\n${JSON.stringify(config)}`)
    return response
  }
}

module.exports = Axios
