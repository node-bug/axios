# @nodebug/axios

A Node.js axios wrapper with cookie support and automatic retry logic.

[![License: MPL-2.0](https://img.shields.io/badge/License-MPL%202.0-blue.svg)](https://opensource.org/licenses/MPL-2.0)
[![Node.js](https://img.shields.io/badge/node->=24-green.svg)](https://nodejs.org/)

## Features

- Cookie jar support via `tough-cookie`
- Automatic cookie handling with `http-cookie-agent`
- Automatic retry logic with exponential backoff
- TLS certificate validation (configurable)
- HTTP/HTTPS keep-alive support
- TypeScript type definitions
- Modern ES module support
- Comprehensive test coverage (100% statements, 85.71% branches, 100% functions, 100% lines)

## Installation

```bash
npm install @nodebug/axios
```

## Usage

### Basic Example

```js
import { Axios } from '@nodebug/axios'

// Create an instance
const client = new Axios('https://api.example.com')

// Make a GET request
const response = await client.get('/users')
console.log(response.data)

// Make a POST request
const response = await client.post('/users', { name: 'John' })
console.log(response.data)
```

### With Custom Options

```js
import { Axios } from '@nodebug/axios'

// Disable TLS validation (not recommended for production)
const client = new Axios('https://api.example.com', false)

// Or with TLS validation enabled (default)
const client = new Axios('https://api.example.com', true)
```

### Authentication with Headers

```js
import { Axios } from '@nodebug/axios'

const client = new Axios('https://api.example.com')

// Bearer token
const response = await client.get('/protected', {
  headers: {
    Authorization: 'Bearer YOUR_TOKEN_HERE',
  },
})

// API Key
const response = await client.get('/data', {
  headers: {
    'X-API-Key': 'your-api-key',
  },
})

// Basic Auth
const response = await client.get('/secure', {
  headers: {
    Authorization: 'Basic ' + Buffer.from('user:pass').toString('base64'),
  },
})
```

### Error Handling

```js
import { Axios } from '@nodebug/axios'

const client = new Axios('https://api.example.com')

try {
  const response = await client.get('/users/123')
  console.log(response.data)
} catch (error) {
  if (error.response) {
    // Server responded with error status code
    console.error('Status:', error.response.status)
    console.error('Message:', error.response.data)
  } else if (error.request) {
    // Request made but no response received
    console.error('No response received:', error.message)
  } else {
    // Error in request setup
    console.error('Error:', error.message)
  }
}
```

### Using Cookies

```js
import { Axios } from '@nodebug/axios'

const client = new Axios('https://api.example.com')

// Set a cookie manually
client.jar.setCookie('session_id=abc123', 'https://api.example.com')

// Cookies are automatically sent with subsequent requests
const response = await client.get('/profile')

// Get all cookies for a URL
const cookies = await client.jar.getCookies('https://api.example.com')
console.log(cookies)

// Clear cookies if needed
client.jar.removeAllCookies()
```

### Login Flow with Cookie Persistence

```js
import { Axios } from '@nodebug/axios'

const client = new Axios('https://api.example.com')

// Login - server sets session cookie
const loginResponse = await client.post('/login', {
  username: 'user@example.com',
  password: 'password123',
})

// Cookies are automatically persisted in the jar
// Subsequent requests automatically include the session cookie
const userResponse = await client.get('/user/profile')
console.log(userResponse.data)

// Another authenticated request
const settingsResponse = await client.put('/user/settings', {
  theme: 'dark',
})
```

### Working with Query Parameters

```js
import { Axios } from '@nodebug/axios'

const client = new Axios('https://api.example.com')

// Query parameters via URL
const response = await client.get('/users?page=1&limit=10')

// Or via config params object
const response = await client.get('/users', {
  params: {
    page: 1,
    limit: 10,
    sort: 'name',
  },
})
```

### Uploading Files

```js
import { Axios } from '@nodebug/axios'
import FormData from 'form-data'
import fs from 'fs'

const client = new Axios('https://api.example.com')

// Create form data
const form = new FormData()
form.append('file', fs.createReadStream('path/to/file.pdf'))
form.append('description', 'My PDF file')

// Upload with form data headers
const response = await client.post('/upload', form, {
  headers: form.getHeaders(),
})
```

### Manual Request with Retry Configuration

```js
import { Axios } from '@nodebug/axios'

const client = new Axios('https://api.example.com')

// Make a request with custom retry attempts (default: 3)
// This means: 1 initial attempt + 5 retries = 6 total attempts
const response = await client.request(
  {
    method: 'post',
    url: '/login',
    data: { username: 'user', password: 'pass' },
    headers: { 'Content-Type': 'application/json' },
  },
  5,
)

// No retries - fail fast
const response = await client.request(
  {
    method: 'get',
    url: '/quick-check',
  },
  0,
)
```

### Dynamic Base URL Changes

```js
import { Axios } from '@nodebug/axios'

const client = new Axios('https://api-v1.example.com')

// Make requests to v1
const v1Response = await client.get('/users')

// Switch to v2
client.url = 'https://api-v2.example.com'

// Subsequent requests use v2
const v2Response = await client.get('/users')
```

### Pagination Example

```js
import { Axios } from '@nodebug/axios'

const client = new Axios('https://api.example.com')

async function getAllUsers() {
  const allUsers = []
  let page = 1
  let hasMore = true

  while (hasMore) {
    const response = await client.get('/users', {
      params: { page, limit: 100 },
    })

    allUsers.push(...response.data.users)

    // Check if there are more pages
    hasMore = response.data.pagination.hasNextPage
    page++
  }

  return allUsers
}

const users = await getAllUsers()
console.log(`Total users: ${users.length}`)
```

### Request with Timeout

```js
import { Axios } from '@nodebug/axios'

const client = new Axios('https://api.example.com')

// Request with 5 second timeout
const response = await client.get('/slow-endpoint', {
  timeout: 5000,
})

// POST with timeout
const response = await client.post(
  '/data',
  { data: 'value' },
  { timeout: 3000 },
)
```

### Parallel Requests

```js
import { Axios } from '@nodebug/axios'

const client = new Axios('https://api.example.com')

// Make multiple requests in parallel
const [users, posts, comments] = await Promise.all([
  client.get('/users'),
  client.get('/posts'),
  client.get('/comments'),
])

console.log('Users:', users.data)
console.log('Posts:', posts.data)
console.log('Comments:', comments.data)
```

### Sequential Requests with Dependency

```js
import { Axios } from '@nodebug/axios'

const client = new Axios('https://api.example.com')

// Get user first
const userResponse = await client.get('/users/123')
const userId = userResponse.data.id

// Then get their posts
const postsResponse = await client.get(`/users/${userId}/posts`)
console.log(postsResponse.data)

// Then get comments on first post
if (postsResponse.data.length > 0) {
  const commentsResponse = await client.get(
    `/posts/${postsResponse.data[0].id}/comments`,
  )
  console.log(commentsResponse.data)
}
```

### Custom Content Types

```js
import { Axios } from '@nodebug/axios'

const client = new Axios('https://api.example.com')

// Send XML
const xmlResponse = await client.post('/data', xmlString, {
  headers: {
    'Content-Type': 'application/xml',
  },
})

// Send plain text
const textResponse = await client.post('/log', logText, {
  headers: {
    'Content-Type': 'text/plain',
  },
})

// Send CSV
const csvResponse = await client.post('/import', csvData, {
  headers: {
    'Content-Type': 'text/csv',
  },
})
```

### Debugging and Logging

```js
import { Axios } from '@nodebug/axios'

const client = new Axios('https://api.example.com')

// Log request and response
const response = await client.get('/users')

console.log('Status:', response.status)
console.log('Headers:', response.headers)
console.log('Data:', response.data)

// Get all cookies for current URL
const cookies = await client.jar.getCookies('https://api.example.com')
console.log('Active cookies:', cookies)
```

### Retry Logic

Requests automatically retry with exponential backoff when they fail:

```js
// Default: 1 initial attempt + 3 retries (4 total attempts)
await client.request(config)

// Custom: 1 initial attempt + 5 retries (6 total attempts)
await client.request(config, 5)

// No retries: 1 initial attempt only
await client.request(config, 0)

// Negative retry counts: No requests made
await client.request(config, -1)
```

Backoff timing between retries:

- After 1st failure: Wait 1 second (2^0 × 1000ms)
- After 2nd failure: Wait 2 seconds (2^1 × 1000ms)
- After 3rd failure: Wait 4 seconds (2^2 × 1000ms)

## API

### `new Axios(url, rejectUnauthorized = true)`

Creates a new axios client instance.

- `url` - Base URL for all requests
- `rejectUnauthorized` - Whether to validate TLS certificates (default: `true`)

### Properties

| Property     | Type            | Description               |
| ------------ | --------------- | ------------------------- |
| `url`        | `string`        | Base URL for requests     |
| `jar`        | `CookieJar`     | Cookie jar instance       |
| `connection` | `AxiosInstance` | Underlying axios instance |

### Methods

| Method                            | Description                              |
| --------------------------------- | ---------------------------------------- |
| `request(config, maxRetries = 3)` | Make a request with configurable retries |
| `get(url, config)`                | Make a GET request                       |
| `post(url, data, config)`         | Make a POST request                      |
| `put(url, data, config)`          | Make a PUT request                       |
| `delete(url, config)`             | Make a DELETE request                    |

### Static Exports

| Export      | Type    | Description            |
| ----------- | ------- | ---------------------- |
| `Axios`     | `class` | Main Axios class       |
| `CookieJar` | `class` | tough-cookie CookieJar |

## Version History

- **v2.0.1** - Added comprehensive test suite with 48 tests, 100% statement coverage
- **v2.0.0** - Complete rewrite with modern Node.js standards
- **v1.0.0** - Initial release

## License

This project is licensed under the MPL-2.0 License - see the [LICENSE](LICENSE) file for details.
