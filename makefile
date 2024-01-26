build-and-run: # Build and run the application
	docker compose up --build frontend backend -d
e2e-tests:
	./e2e_tests.sh
local-install: # Install dependencies for local development
	cd frontend && yarn install
	cd backend && yarn install
backend-dev:
	cd backend && yarn dev
frontend-dev:
	cd frontend && yarn dev
e2e-dev: # Run `make backend-dev` in separate terminal first.
	frontend-dev &
	cd e2e && yarn cypress open
