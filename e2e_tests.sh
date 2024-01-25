#!/bin/bash

docker compose build
docker compose run e2e_test
docker compose down
