# Contributing to @nodebug/axios

Thank you for your interest in contributing to @nodebug/axios! This project welcomes contributions from the community.

## Development Workflow

1. Fork the repository
2. Create a new branch for your feature or bug fix
3. Make your changes
4. Write tests for your changes
5. Run the test suite with `npm test`
6. Lint your code with `npm run lint`
7. Submit a pull request

## Code Style

This project follows standard Node.js module practices with the following code style guidelines:

- Follow ESLint configuration with Prettier formatting
- Use JSDoc for function documentation
- Maintain consistent editor settings via `.editorconfig`
- All code must pass linting checks before submission

## Testing Requirements

All contributions must include tests. Please ensure that:

- Your code is well-tested
- All existing tests continue to pass
- New functionality is covered by tests
- Code coverage should not decrease
- Run `npm test` to verify all tests pass

## Commit Message Conventions

- Use clear, descriptive messages
- Format examples: "Add feature: brief description", "Fix bug: brief description", "Docs: update README"

## Pull Request Guidelines

- Provide clear descriptions of changes
- Reference related issues
- Ensure all tests pass and linting is clean
- Include tests for new functionality
- Update documentation if necessary

## Running Tests

To run the test suite:

```bash
npm test
```

To run tests with coverage:

```bash
npm run test:coverage
```

To lint the code:

```bash
npm run lint
```

To automatically fix linting issues:

```bash
npm run lint:fix
```

## Reporting Issues

If you find a bug or have a feature request, please open an issue on the GitHub repository.

## License

By contributing to this project, you agree that your contributions will be licensed under the MPL-2.0 license.
