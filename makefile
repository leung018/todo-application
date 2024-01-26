build-and-run: # Build and run the application
	docker compose up --build frontend backend -d
e2e-tests:
	./e2e_tests.sh
local-install: # Install dependencies for local development
	cd frontend && yarn install
	cd backend && yarn install
