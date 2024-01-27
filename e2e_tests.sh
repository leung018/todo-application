#!/bin/bash

docker compose down -v
docker compose --env-file e2e.env build

docker compose --env-file e2e.env run e2e_tests
status=$?

docker compose down -v

exit $status