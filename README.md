# todo-toy-project

A simple todo toy application that can add/edit/complete the duties. Also can see the saved duties from the website.

## How to run

### Prerequisites

Docker and Docker Compose are required. Recommend the newest version of Docker and Docker Compose.
The minimum version that can run this project has not been tested exactly. However, at least the version that support `include` syntax in `docker-compose.yml` is required (See https://docs.docker.com/compose/multiple-compose-files/include/).

### Steps

1. Build the docker images needed and run the containers as below command

```bash
make build-and-run
```

2. Open the browser and go to http://localhost. Done!

## Continuous Integration

This project has setup github workflows for CI. Formatting / linting / unit tests of both frontend and backend, integration tests of backend, and end to end tests for whole application. See `.github/workflows` directory for more details.

## Local Development

### Prerequisites

- Node v20

### Setup

Install the node dependencies needed by below command

```bash
make local-install
```

### Architecture

- `backend/` directory is for backend codes. See [README of backend](./backend/README.md) for more details.
- `frontend/` directory is for frontend codes. See [README of frontend](./frontend/README.md) for more details.
- `e2e/` directory is for end to end test codes using `cypress`. See [below section](#useful-commands) for shortcuts to run cypress in this project. Also can refer to the official document of `cypress` for more detail.

### Useful Commands

Noted that term of development mode below means that the application will be reloaded automatically when the codes are changed.

#### `make backend-dev`

Run the backend server in development mode.

#### `make e2e-dev`

Run both frontend and cypress in development mode. Have to run `make backend-dev` in another terminal.

See [README of backend](./backend/README.md) and [README of frontend](./frontend/README.md) for more specific commands of both frontend and backend during development.
