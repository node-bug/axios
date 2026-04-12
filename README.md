# @nodebug/axios

A Node.js axios wrapper with cookie support and automatic retry logic.

[![License: MPL-2.0](https://img.shields.io/badge/License-MPL%202.0-blue.svg)](https://opensource.org/licenses/MPL-2.0)
[![Node.js](https://img.shields.io/badge/node->=24-green.svg)](https://nodejs.org/)

## Features

- Cookie jar support via `tough-cookie`
- Automatic cookie handling with `http-cookie-agent`
- Automatic retry logic with configurable attempts
- TLS certificate validation (configurable)
- HTTP/HTTPS keep-alive support
- TypeScript type definitions
- Modern ES module support
- Comprehensive test coverage

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
```

## Version History

- **v2.0.1** - Updated dependencies
- **v2.0.0** - Complete rewrite with modern Node.js standards
- **v1.0.0** - Initial release

// Or with TLS validation enabled (default)
const client = new Axios('https://api.example.com', true)

````

## Contributing

Please read our [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct, and the process for submitting pull requests.

## Security

If you discover any security vulnerabilities, please refer to our [SECURITY.md](SECURITY.md) for reporting procedures.

## License

This project is licensed under the MPL-2.0 License - see the [LICENSE](LICENSE) file for details.

### Using Cookies

```js
const { Axios, CookieJar } = require('@nodebug/axios')

const client = new Axios('https://api.example.com')

// Access the cookie jar
client.jar.setCookie('session_id=abc123', 'https://api.example.com')

// Cookies are automatically sent with subsequent requests
const response = await client.get('/profile')
````

### Manual Request

```js
const response = await client.request({
  method: 'post',
  url: '/login',
  data: { username: 'user', password: 'pass' },
  headers: { 'Content-Type': 'application/json' },
})
```

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

| Export             | Type       | Description                            |
| ------------------ | ---------- | -------------------------------------- |
| `Axios`            | `class`    | Main Axios class                       |
| `CookieJar`        | `class`    | tough-cookie CookieJar                 |
| `HttpCookieAgent`  | `class`    | HTTP cookie agent                      |
| `HttpsCookieAgent` | `class`    | HTTPS cookie agent                     |
| `createHttpAgent`  | `function` | Create HTTP agent with cookie support  |
| `createHttpsAgent` | `function` | Create HTTPS agent with cookie support |

## Running Tests

```bash
# Run tests
npm test

# Run with coverage
npm run test:coverage

# Lint
npm run lint

# Format
npm run format
```

## License

MPL-2.0 - See [LICENSE](LICENSE) for details.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests: `npm test`
5. Submit a pull request
