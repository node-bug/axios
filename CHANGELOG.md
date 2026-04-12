# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [2.0.1] - 2026-04-13

### Changed

- Updated axios, tough-cookie, and http-cookie-agent dependencies to latest versions

## [2.0.0] - 2026-04-13

### Added

- Complete rewrite with modern Node.js standards
- Support for Node.js 24+
- TypeScript support
- Improved cookie handling with tough-cookie and http-cookie-agent
- Automatic retry logic
- TLS certificate validation (configurable)
- HTTP/HTTPS keep-alive support

### Changed

- Updated dependencies to latest versions
- Refactored code to use ES modules
- Updated ESLint and Prettier configurations
- Improved documentation

### Fixed

- Various bug fixes in cookie handling
- Improved error handling

## [1.0.0] - 2023-01-15

### Added

- Initial release of @nodebug/axios
- Basic axios wrapper with cookie support
- Automatic retry logic
- TLS certificate validation
