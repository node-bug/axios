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
- Configurable via `@nodebug/config` package

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

### Configuration Options

The Axios constructor accepts two parameters:
1. `url` (string) - Base URL for requests
2. `rejectUnauthorized` (boolean) - Whether to reject unauthorized TLS certificates (default: true)

Additional configuration can be set through the `@nodebug/config` package when it's integrated.

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

### Configuration

This package is designed to be compatible with the `@nodebug/config` package for configuration management. While the current implementation doesn't directly use it, the package is included as a dependency to support future integration.

To set up configuration:

1. Install the config package (optional, for future use):

```bash
npm install @nodebug/config
```

2. Create a configuration file (e.g., `config.js` or `config.json`) in your project root:

```js
// config.js
export default {
  axios: {
    baseURL: 'https://api.example.com',
    rejectUnauthorized: true,
    // Add other axios config options here
  },
}
```

3. The configuration will be automatically loaded and used by the Axios instance when integration is implemented.

## API

### `new Axios(url, rejectUnauthorized = true)`

Creates a new axios client instance.

- `url` - Base URL for all requests
- `rejectUnauthorized` - Whether to reject unauthorized TLS certificates (default: true)

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

[MPL-2.0](LICENSE)
