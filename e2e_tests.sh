#!/bin/bash

docker compose --env-file e2e.env build
docker compose --env-file e2e.env run e2e_tests
docker compose down
