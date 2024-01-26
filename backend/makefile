clean-db:
	docker compose down -v postgres
run-db-and-integration-test:
	docker compose up -d postgres
	yarn integration-test