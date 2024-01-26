build-and-run: # Build and run the application
	docker compose up --build frontend backend -d
e2e:
	docker compose --env-file e2e.env build
	docker compose --env-file e2e.env run e2e_tests
	docker compose down
local-install: # Install dependencies for local development
	cd frontend && yarn install
	cd backend && yarn install
