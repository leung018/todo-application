# backend

## Technical Stack

TypeScript, Node.js, Express.js, PostgreSQL

## Features

- CRUD APIs for duties. Also an api for delete all duties that is useful for e2e testings.
- Validation for duties input.
  - Name of duties can't be empty and too long.
- Auto trimming for duties input.

### Utilities for error handling

1. By default, `express` can't handle errors thrown from async request handler. So defined [RouteService](./src/route/route.ts) to handle it.
2. Defined [RouteErrorHandler](./src/route/util.ts) to handle error and return the desired response to client.

## Testing strategy

Have unit tests that don't involve external dependencies and integration tests that involve PostgreSQL. See [below section](#useful-commands) for how to run them.

### Explanation for `createNull` convention

In this project, some classes have creation methods like `Xyz.create` and `Xyz.createNull` respectively. It is a pattern learnt from [Testing Without Mocks: A Pattern Language](https://www.jamesshore.com/v2/projects/nullables/testing-without-mocks) by James Shore. `Xyz.create` is the creation method for production code. `Xyz.createNull` is the creation method for test code that support parameterless instantiation and provided some fake implementation for some external dependencies to make unit tests easier.

## Local Development

See [README of root](../README.md#local-development) for how to setup.

### Useful Commands

#### `make dev-with-db`

Start the backend server in development mode and a local postgres database. The database will be started in a docker container.

#### `make run-db-and-integration-test`

Start a local postgres database in a docker container and run integration tests that involved postgres.

#### `make clean-db`

Reset and clean up the local postgres image. Noted that some setting of postgres image can't be reset if simply using `docker compose down` but this command can.

#### `yarn test:watch`

Run unit tests in watch mode. Noted that this excludes integration tests.

See package.json for more details and different commands.
