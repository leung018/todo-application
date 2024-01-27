clean-db:
	docker compose down -v postgres
run-db-and-integration-test:
	docker compose up -d postgres
	yarn integration-test
dev-with-db:
	docker compose up -d postgres
	yarn dev