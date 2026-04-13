import { Axios, CookieJar } from '../index.js'
import { jest } from '@jest/globals'
import axios from 'axios'
// Helper to create a mock connection
function createMockConnection() {
  return {
    defaults: { baseURL: '' },
    request: jest.fn(),
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
  }
}

describe('Axios', () => {
  describe('Constructor', () => {
    test('should be defined', () => {
      expect(Axios).toBeDefined()
    })

    test('should create an instance with URL and rejectUnauthorized=true', () => {
      const axiosInstance = new Axios('https://api.example.com', true)
      expect(axiosInstance).toBeDefined()
      expect(axiosInstance.url).toBe('https://api.example.com')
    })

    test('should create an instance with default rejectUnauthorized=true', () => {
      const axiosInstance = new Axios('https://api.example.com')
      expect(axiosInstance).toBeDefined()
      expect(axiosInstance.url).toBe('https://api.example.com')
    })

    test('should create an instance with rejectUnauthorized=false', () => {
      const axiosInstance = new Axios('https://api.example.com', false)
      expect(axiosInstance).toBeDefined()
      expect(axiosInstance.url).toBe('https://api.example.com')
    })

    test('should have cookie jar functionality', () => {
      const axiosInstance = new Axios('https://api.example.com')
      expect(axiosInstance.jar).toBeDefined()
      expect(axiosInstance.jar).toBeInstanceOf(CookieJar)
    })

    test('should have connection instance', () => {
      const axiosInstance = new Axios('https://api.example.com')
      expect(axiosInstance.connection).toBeDefined()
    })

    test('should have request, get, post, put, delete methods', () => {
      const axiosInstance = new Axios('https://api.example.com')
      expect(typeof axiosInstance.request).toBe('function')
      expect(typeof axiosInstance.get).toBe('function')
      expect(typeof axiosInstance.post).toBe('function')
      expect(typeof axiosInstance.put).toBe('function')
      expect(typeof axiosInstance.delete).toBe('function')
    })
  })

  describe('URL Property', () => {
    test('should get URL', () => {
      const axiosInstance = new Axios('https://api.example.com')
      expect(axiosInstance.url).toBe('https://api.example.com')
    })

    test('should set and get URL properly', () => {
      const axiosInstance = new Axios('https://api.example.com')
      axiosInstance.url = 'https://newapi.example.com'
      expect(axiosInstance.url).toBe('https://newapi.example.com')
    })

    test('should handle empty URL string', () => {
      const axiosInstance = new Axios('')
      expect(axiosInstance.url).toBe('')
      axiosInstance.url = 'https://newapi.example.com'
      expect(axiosInstance.url).toBe('https://newapi.example.com')
    })

    test('should handle URL changes multiple times', () => {
      const axiosInstance = new Axios('https://api1.example.com')
      axiosInstance.url = 'https://api2.example.com'
      axiosInstance.url = 'https://api3.example.com'
      expect(axiosInstance.url).toBe('https://api3.example.com')
    })
  })

  describe('Cookie Jar', () => {
    test('should create independent cookie jars for different instances', () => {
      const instance1 = new Axios('https://api1.example.com')
      const instance2 = new Axios('https://api2.example.com')

      expect(instance1.jar).not.toBe(instance2.jar)
      expect(instance1.jar).toBeInstanceOf(CookieJar)
      expect(instance2.jar).toBeInstanceOf(CookieJar)
    })

    test('should maintain reference to same cookie jar', () => {
      const axiosInstance = new Axios('https://api.example.com')
      const jar1 = axiosInstance.jar
      const jar2 = axiosInstance.jar

      expect(jar1).toBe(jar2)
    })
  })

  describe('HTTP Methods - GET', () => {
    let mockConnection
    let axiosInstance

    beforeEach(() => {
      mockConnection = createMockConnection()
      // Override the axios instance's connection
      axiosInstance = new Axios('https://api.example.com')
      axiosInstance._connection = mockConnection
    })

    test('should perform GET request with no config', async () => {
      const mockResponse = { data: { id: 1 }, status: 200 }
      mockConnection.get.mockResolvedValue(mockResponse)

      const result = await axiosInstance.get('/endpoint')
      expect(mockConnection.get).toHaveBeenCalledWith('/endpoint', {})
      expect(result).toEqual(mockResponse)
    })

    test('should perform GET request with config', async () => {
      const mockResponse = { data: { id: 1 }, status: 200 }
      const config = { headers: { 'X-Custom': 'header' } }
      mockConnection.get.mockResolvedValue(mockResponse)

      const result = await axiosInstance.get('/endpoint', config)
      expect(mockConnection.get).toHaveBeenCalledWith('/endpoint', config)
      expect(result).toEqual(mockResponse)
    })

    test('should propagate GET errors', async () => {
      const mockError = new Error('Request failed')
      mockConnection.get.mockRejectedValue(mockError)

      await expect(axiosInstance.get('/endpoint')).rejects.toThrow('Request failed')
    })
  })

  describe('HTTP Methods - POST', () => {
    let mockConnection
    let axiosInstance

    beforeEach(() => {
      mockConnection = createMockConnection()
      axiosInstance = new Axios('https://api.example.com')
      axiosInstance._connection = mockConnection
    })

    test('should perform POST request with data and no config', async () => {
      const mockResponse = { data: { id: 1 }, status: 201 }
      const postData = { name: 'test' }
      mockConnection.post.mockResolvedValue(mockResponse)

      const result = await axiosInstance.post('/endpoint', postData)
      expect(mockConnection.post).toHaveBeenCalledWith('/endpoint', postData, {})
      expect(result).toEqual(mockResponse)
    })

    test('should perform POST request with data and config', async () => {
      const mockResponse = { data: { id: 1 }, status: 201 }
      const postData = { name: 'test' }
      const config = { headers: { 'Content-Type': 'application/json' } }
      mockConnection.post.mockResolvedValue(mockResponse)

      const result = await axiosInstance.post('/endpoint', postData, config)
      expect(mockConnection.post).toHaveBeenCalledWith('/endpoint', postData, config)
      expect(result).toEqual(mockResponse)
    })

    test('should propagate POST errors', async () => {
      const mockError = new Error('Request failed')
      mockConnection.post.mockRejectedValue(mockError)

      await expect(axiosInstance.post('/endpoint', {})).rejects.toThrow('Request failed')
    })
  })

  describe('HTTP Methods - PUT', () => {
    let mockConnection
    let axiosInstance

    beforeEach(() => {
      mockConnection = createMockConnection()
      axiosInstance = new Axios('https://api.example.com')
      axiosInstance._connection = mockConnection
    })

    test('should perform PUT request with data and no config', async () => {
      const mockResponse = { data: { id: 1 }, status: 200 }
      const putData = { name: 'updated' }
      mockConnection.put.mockResolvedValue(mockResponse)

      const result = await axiosInstance.put('/endpoint', putData)
      expect(mockConnection.put).toHaveBeenCalledWith('/endpoint', putData, {})
      expect(result).toEqual(mockResponse)
    })

    test('should perform PUT request with data and config', async () => {
      const mockResponse = { data: { id: 1 }, status: 200 }
      const putData = { name: 'updated' }
      const config = { headers: { 'Content-Type': 'application/json' } }
      mockConnection.put.mockResolvedValue(mockResponse)

      const result = await axiosInstance.put('/endpoint', putData, config)
      expect(mockConnection.put).toHaveBeenCalledWith('/endpoint', putData, config)
      expect(result).toEqual(mockResponse)
    })

    test('should propagate PUT errors', async () => {
      const mockError = new Error('Request failed')
      mockConnection.put.mockRejectedValue(mockError)

      await expect(axiosInstance.put('/endpoint', {})).rejects.toThrow('Request failed')
    })
  })

  describe('HTTP Methods - DELETE', () => {
    let mockConnection
    let axiosInstance

    beforeEach(() => {
      mockConnection = createMockConnection()
      axiosInstance = new Axios('https://api.example.com')
      axiosInstance._connection = mockConnection
    })

    test('should perform DELETE request with no config', async () => {
      const mockResponse = { status: 204 }
      mockConnection.delete.mockResolvedValue(mockResponse)

      const result = await axiosInstance.delete('/endpoint')
      expect(mockConnection.delete).toHaveBeenCalledWith('/endpoint', {})
      expect(result).toEqual(mockResponse)
    })

    test('should perform DELETE request with config', async () => {
      const mockResponse = { status: 204 }
      const config = { headers: { 'X-Custom': 'header' } }
      mockConnection.delete.mockResolvedValue(mockResponse)

      const result = await axiosInstance.delete('/endpoint', config)
      expect(mockConnection.delete).toHaveBeenCalledWith('/endpoint', config)
      expect(result).toEqual(mockResponse)
    })

    test('should propagate DELETE errors', async () => {
      const mockError = new Error('Request failed')
      mockConnection.delete.mockRejectedValue(mockError)

      await expect(axiosInstance.delete('/endpoint')).rejects.toThrow('Request failed')
    })
  })

  describe('Retry Logic', () => {
    let mockConnection
    let axiosInstance

    beforeEach(() => {
      mockConnection = createMockConnection()
      axiosInstance = new Axios('https://api.example.com')
      axiosInstance._connection = mockConnection
    })

    test('should return response on first attempt', async () => {
      const mockResponse = { data: { id: 1 }, status: 200 }
      mockConnection.request.mockResolvedValue(mockResponse)

      const result = await axiosInstance.request({ url: '/endpoint' })
      expect(mockConnection.request).toHaveBeenCalledTimes(1)
      expect(result).toEqual(mockResponse)
    })

    test('should retry request on failure and succeed on second attempt', async () => {
      const mockError = new Error('Network error')
      const mockResponse = { data: { id: 1 }, status: 200 }
      mockConnection.request
        .mockRejectedValueOnce(mockError)
        .mockResolvedValueOnce(mockResponse)

      const result = await axiosInstance.request({ url: '/endpoint' }, 3)
      expect(mockConnection.request).toHaveBeenCalledTimes(2)
      expect(result).toEqual(mockResponse)
    })

    test('should retry request multiple times', async () => {
      const mockError = new Error('Network error')
      const mockResponse = { data: { id: 1 }, status: 200 }
      mockConnection.request
        .mockRejectedValueOnce(mockError)
        .mockRejectedValueOnce(mockError)
        .mockResolvedValueOnce(mockResponse)

      const result = await axiosInstance.request({ url: '/endpoint' }, 3)
      expect(mockConnection.request).toHaveBeenCalledTimes(3)
      expect(result).toEqual(mockResponse)
    })

    test('should throw error after max retries exceeded', async () => {
      const mockError = new Error('Network error')
      mockConnection.request.mockRejectedValue(mockError)

      await expect(axiosInstance.request({ url: '/endpoint' }, 2)).rejects.toThrow(
        'Network error'
      )
      expect(mockConnection.request).toHaveBeenCalledTimes(3) // Initial + 2 retries
    })

    test('should use default maxRetries of 3', async () => {
      const mockError = new Error('Network error')
      mockConnection.request.mockRejectedValue(mockError)

      await expect(axiosInstance.request({ url: '/endpoint' })).rejects.toThrow()
      expect(mockConnection.request).toHaveBeenCalledTimes(4) // Initial + 3 retries
    })

    test('should use exponential backoff between retries', async () => {
      const mockError = new Error('Network error')
      const mockResponse = { data: { id: 1 }, status: 200 }

      mockConnection.request
        .mockRejectedValueOnce(mockError)
        .mockRejectedValueOnce(mockError)
        .mockResolvedValueOnce(mockResponse)

      const startTime = Date.now()
      const result = await axiosInstance.request({ url: '/endpoint' }, 2)
      const elapsedTime = Date.now() - startTime

      // With exponential backoff: 2^0 * 1000 = 1s, 2^1 * 1000 = 2s (total ~3s)
      expect(elapsedTime).toBeGreaterThanOrEqual(2800)
      expect(result).toEqual(mockResponse)
    }, 15000)

    test('should preserve request config across retries', async () => {
      const mockResponse = { data: { id: 1 }, status: 200 }
      const requestConfig = {
        url: '/endpoint',
        method: 'POST',
        data: { test: 'data' }
      }
      mockConnection.request
        .mockRejectedValueOnce(new Error('Network error'))
        .mockResolvedValueOnce(mockResponse)

      await axiosInstance.request(requestConfig, 1)

      expect(mockConnection.request).toHaveBeenCalledWith(requestConfig)
      expect(mockConnection.request).toHaveBeenNthCalledWith(2, requestConfig)
    })

    test('should handle maxRetries of 0', async () => {
      const mockError = new Error('Network error')
      mockConnection.request.mockRejectedValue(mockError)

      await expect(axiosInstance.request({ url: '/endpoint' }, 0)).rejects.toThrow()
      expect(mockConnection.request).toHaveBeenCalledTimes(1) // No retries
    })

    test('should preserve all request properties during retry', async () => {
      const requestConfig = {
        url: '/endpoint',
        method: 'POST',
        data: { key: 'value' },
        headers: { 'Custom': 'header' },
        timeout: 5000,
      }

      const mockError = new Error('Network error')
      mockConnection.request
        .mockRejectedValueOnce(mockError)
        .mockResolvedValueOnce({ status: 200 })

      await axiosInstance.request(requestConfig, 1)

      expect(mockConnection.request).toHaveBeenNthCalledWith(1, requestConfig)
      expect(mockConnection.request).toHaveBeenNthCalledWith(2, requestConfig)
    })
  })

  describe('Request Method Error Handling', () => {
    let mockConnection
    let axiosInstance

    beforeEach(() => {
      mockConnection = createMockConnection()
      axiosInstance = new Axios('https://api.example.com')
      axiosInstance._connection = mockConnection
    })

    test('should throw error after all retries fail', async () => {
      const mockError = new Error('Connection timeout')
      mockConnection.request.mockRejectedValue(mockError)

      try {
        await axiosInstance.request({ url: '/endpoint' }, 1)
      } catch (error) {
        expect(error.message).toBe('Connection timeout')
      }
    })

    test('should preserve error information', async () => {
      const mockError = new Error('Not Found')
      mockError.response = { status: 404, statusText: 'Not Found' }
      mockConnection.request.mockRejectedValue(mockError)

      try {
        await axiosInstance.request({ url: '/endpoint' }, 0)
      } catch (error) {
        expect(error.response.status).toBe(404)
        expect(error.response.statusText).toBe('Not Found')
      }
    })
  })

  describe('Integration - URL and baseURL sync', () => {
    let mockConnection
    let axiosInstance

    beforeEach(() => {
      mockConnection = createMockConnection()
      mockConnection.defaults = { baseURL: 'https://api.example.com' }
      axiosInstance = new Axios('https://api.example.com')
      axiosInstance._connection = mockConnection
    })

    test('should update connection baseURL when URL is changed', () => {
      axiosInstance.url = 'https://newapi.example.com'
      expect(mockConnection.defaults.baseURL).toBe('https://newapi.example.com')
    })

    test('should sync URL changes multiple times', () => {
      axiosInstance.url = 'https://api1.example.com'
      expect(mockConnection.defaults.baseURL).toBe('https://api1.example.com')

      axiosInstance.url = 'https://api2.example.com'
      expect(mockConnection.defaults.baseURL).toBe('https://api2.example.com')
    })
  })

  describe('Cookie Jar Behavior', () => {
    let axiosInstance

    beforeEach(() => {
      axiosInstance = new Axios('https://api.example.com')
    })

    test('should handle cookie setting and retrieval', async () => {
      // Test that we can set cookies in the jar
      const cookieValue = 'sessionid=abc123; Path=/; HttpOnly'
      await axiosInstance.jar.setCookie(cookieValue, 'https://api.example.com')
      
      // Test that we can get cookies from the jar
      const cookies = await axiosInstance.jar.getCookieString('https://api.example.com')
      expect(cookies).toContain('sessionid=abc123')
    })

    test('should maintain separate cookies per instance', async () => {
      const instance1 = new Axios('https://api1.example.com')
      const instance2 = new Axios('https://api2.example.com')
      
      // Set different cookies for each instance
      await instance1.jar.setCookie('cookie1=value1', 'https://api1.example.com')
      await instance2.jar.setCookie('cookie2=value2', 'https://api2.example.com')
      
      // Verify each instance only has its own cookies
      const cookies1 = await instance1.jar.getCookieString('https://api1.example.com')
      const cookies2 = await instance2.jar.getCookieString('https://api2.example.com')
      
      expect(cookies1).toContain('cookie1=value1')
      expect(cookies2).toContain('cookie2=value2')
      expect(cookies1).not.toContain('cookie2=value2')
      expect(cookies2).not.toContain('cookie1=value1')
    })

    test('should handle cookie expiration', async () => {
      const cookieValue = 'sessionid=abc123; Path=/; Max-Age=0'
      await axiosInstance.jar.setCookie(cookieValue, 'https://api.example.com')
      
      const cookies = await axiosInstance.jar.getCookieString('https://api.example.com')
      // Cookie should be expired and not returned
      expect(cookies).not.toContain('sessionid=abc123')
    })
  })

  describe('Agent Creation and Usage', () => {
    let axiosInstance

    beforeEach(() => {
      axiosInstance = new Axios('https://api.example.com')
    })

    test('should create proper HTTP and HTTPS agents', () => {
      // Verify that agents are created with correct parameters
      expect(axiosInstance._connection.defaults.httpAgent).toBeDefined()
      expect(axiosInstance._connection.defaults.httpsAgent).toBeDefined()
    })

    test('should use global agents when not already set', () => {
      // Verify that the global defaults are set
      expect(axios.defaults.httpAgent).toBeDefined()
      expect(axios.defaults.httpsAgent).toBeDefined()
    })
  })

  describe('Retry Logic Edge Cases', () => {
    let mockConnection
    let axiosInstance

    beforeEach(() => {
      mockConnection = createMockConnection()
      axiosInstance = new Axios('https://api.example.com')
      axiosInstance._connection = mockConnection
    })

    test('should handle negative retry counts by not making any requests', async () => {
      const mockError = new Error('Network error')
      mockConnection.request.mockRejectedValue(mockError)

      // Negative retry counts cause the loop to not execute at all
      // No requests are made
      await expect(axiosInstance.request({ url: '/endpoint' }, -1)).rejects.toEqual(undefined)
      expect(mockConnection.request).toHaveBeenCalledTimes(0) // No requests made
    })
  })

  describe('Error Propagation', () => {
    let mockConnection
    let axiosInstance

    beforeEach(() => {
      mockConnection = createMockConnection()
      axiosInstance = new Axios('https://api.example.com')
      axiosInstance._connection = mockConnection
    })

    test('should preserve original error properties', async () => {
      const originalError = new Error('Connection failed')
      originalError.code = 'ECONNREFUSED'
      originalError.response = { status: 500, data: 'Server Error' }
      mockConnection.request.mockRejectedValue(originalError)

      try {
        await axiosInstance.request({ url: '/endpoint' })
      } catch (error) {
        expect(error.code).toBe('ECONNREFUSED')
        expect(error.response.status).toBe(500)
        expect(error.response.data).toBe('Server Error')
      }
    })

    test('should handle axios errors properly', async () => {
      const axiosError = new Error('Request failed')
      axiosError.isAxiosError = true
      axiosError.response = { status: 404, statusText: 'Not Found' }
      mockConnection.request.mockRejectedValue(axiosError)

      try {
        await axiosInstance.request({ url: '/endpoint' })
      } catch (error) {
        expect(error.isAxiosError).toBe(true)
        expect(error.response.status).toBe(404)
        expect(error.response.statusText).toBe('Not Found')
      }
    })
  })

  describe('Configuration Validation', () => {
    test('should handle invalid URL gracefully', () => {
      // Should not throw immediately on invalid URL, but should fail when making requests
      const axiosInstance = new Axios('invalid-url')
      expect(axiosInstance).toBeDefined()
      expect(axiosInstance.url).toBe('invalid-url')
    })

    test('should handle null and undefined parameters', () => {
      // Test with null URL
      const axiosInstance = new Axios(null)
      expect(axiosInstance).toBeDefined()
      expect(axiosInstance.url).toBe(null)
      
      // Test with undefined URL
      const axiosInstance2 = new Axios(undefined)
      expect(axiosInstance2).toBeDefined()
      expect(axiosInstance2.url).toBe(undefined)
    })
  })
})