build-and-run: # Build and run the application
	docker compose up --build frontend backend -d
e2e-tests:
	./e2e_tests.sh
local-install: # Install dependencies for local development
	cd frontend && yarn install
	cd backend && yarn install
	cd e2e && yarn install
backend-dev:
	cd backend && yarn dev
e2e-dev: # Start backend first by backend-dev first
	cd frontend && yarn dev&
	cd e2e && yarn cypress open
