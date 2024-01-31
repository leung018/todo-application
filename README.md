# Todo-toy-project

A simple todo toy application for todo duties management that can add/edit/complete the duties.

## How to run

### Prerequisites

`Docker` and `Docker Compose` are required. Recommend the newest version of Docker and Docker Compose.

The exact minimum versions that can run this project has not been tested. However, they must be at least the versions that support `include` syntax in `docker-compose.yml` is required. See [Docker Docs on include](https://docs.docker.com/compose/multiple-compose-files/include/).

### Steps

1. Build the docker images needed and run the containers with the below command.

```bash
make build-and-run
```

2. Open the browser and go to http://localhost. Done!

## Engineering Practices

### Continuous Integration

This project has setup github workflows for CI. Formatting / linting / unit tests for both frontend and backend, integration tests for backend, and end to end tests for the entire application.

See `.github/workflows` directory for more details.

### Small Pull Request and Focused Commits

This project has a convention that each pull request should be manageable in size and each commit should be focused on the change as described in the commit message.

No direct pushes to main branch and all changes should be made via pull request.

## Local Development

### Prerequisites

- Node v20

### Setup

Install the node dependencies needed with the below command.

```bash
make local-install
```

### Architecture

- `backend/` directory is for backend code.\
  See [README of backend](./backend/README.md) for more details.
- `frontend/` directory is for frontend code.\
  See [README of frontend](./frontend/README.md) for more details.
- `e2e/` directory contains end-to-end test code using `Cypress`.\
  See [below command](#make-e2e-dev) for shortcut to run `cypress` in this project. Also can refer to the official document of `cypress` for further details.

### Useful Commands

Noted that term of `development mode` below means that the application will be reloaded automatically when the code is changed.

#### `make backend-dev`

Run the backend server in development mode.

#### `make e2e-dev`

Run both frontend and `cypress` in development mode. Also have to run `make backend-dev` in another terminal.

See [makefile](./makefile) for more details.\
[README of backend](./backend/README.md) and [README of frontend](./frontend/README.md) for more specific commands of both frontend and backend during development.
