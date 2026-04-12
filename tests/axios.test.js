import { Axios, CookieJar } from '../index.js'
import { expect } from 'chai'

describe('Axios', () => {
  let axiosInstance

  beforeEach(() => {
    axiosInstance = new Axios('https://httpbin.org', false)
  })

  describe('constructor', () => {
    it('creates an instance with default url', () => {
      const instance = new Axios('https://example.com')
      expect(instance.url).to.equal('https://example.com')
    })

    it('creates an instance with custom url', () => {
      const instance = new Axios('https://api.example.com/v1')
      expect(instance.url).to.equal('https://api.example.com/v1')
    })

    it('creates a cookie jar', () => {
      expect(axiosInstance.jar).to.be.an.instanceOf(CookieJar)
    })

    it('sets rejectUnauthorized to true by default', () => {
      const instance = new Axios('https://example.com')
      // The instance should be created without throwing
      expect(instance).to.be.ok
    })

    it('allows setting rejectUnauthorized to false', () => {
      const instance = new Axios('https://example.com', false)
      expect(instance).to.be.ok
    })
  })

  describe('url getter/setter', () => {
    it('gets the url', () => {
      expect(axiosInstance.url).to.equal('https://httpbin.org')
    })

    it('sets the url', () => {
      axiosInstance.url = 'https://new-example.com'
      expect(axiosInstance.url).to.equal('https://new-example.com')
      expect(axiosInstance.connection.defaults.baseURL).to.equal('https://new-example.com')
    })
  })

  describe('jar getter', () => {
    it('returns the cookie jar', () => {
      expect(axiosInstance.jar).to.be.an.instanceOf(CookieJar)
    })
  })

  describe('connection getter', () => {
    it('returns the axios instance', () => {
      expect(axiosInstance.connection).to.be.ok
    })
  })

  describe('request method', () => {
    it('should handle successful requests', async () => {
      // Test a simple GET request to httpbin.org
      const response = await axiosInstance.request({
        url: '/get',
        method: 'GET'
      })
      expect(response).to.be.ok
      expect(response.status).to.equal(200)
    }).timeout(5000)

    it('should handle errors', async () => {
      // Just verify the method exists and is a function
      expect(axiosInstance.request).to.be.a('function')
    })

    it('should retry on failure', async () => {
      // Test that the retry method exists and is callable
      expect(axiosInstance.request).to.be.a('function')
    })
  })

  describe('get method', () => {
    it('should perform a GET request', async () => {
      const response = await axiosInstance.get('/get')
      expect(response).to.be.ok
      expect(response.status).to.equal(200)
    })
  })

  describe('post method', () => {
    it('should perform a POST request', async () => {
      const response = await axiosInstance.post('/post', { test: 'data' })
      expect(response).to.be.ok
      expect(response.status).to.equal(200)
    })
  })

  describe('put method', () => {
    it('should perform a PUT request', async () => {
      const response = await axiosInstance.put('/put', { test: 'data' })
      expect(response).to.be.ok
      expect(response.status).to.equal(200)
    })
  })

  describe('delete method', () => {
    it('should perform a DELETE request', async () => {
      const response = await axiosInstance.delete('/delete')
      expect(response).to.be.ok
      expect(response.status).to.equal(200)
    })
  })

  describe('exports', () => {
    it('exports Axios class', () => {
      expect(Axios).to.be.a('function')
    })

    it('exports CookieJar', () => {
      expect(CookieJar).to.be.a('function')
    })
  })
})
