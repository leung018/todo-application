#!/bin/bash

docker compose build
docker compose run e2e_tests
docker compose down
