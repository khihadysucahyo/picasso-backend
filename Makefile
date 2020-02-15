# =========================================== SETTINGS ======================================================

# ----------------------- SETUP -------------------------------------------------------------------
# Useful to configure a few things on the host machien to allow elasticsearch and metricbeat to work.
setup:
	@./scripts/setup.sh

# ==================================== CREATE NETWORK =======================================================
create-network:
	@docker network create gateway || true

remove-network:
	@docker network rm gateway

build:
	@docker-compose build

# ==================================== SERVICE DB =========================================================
compose-service-database=docker-compose -f docker-compose.database.yml -p service_database
start-service-database:
	@$(compose-service-database) up -d
stop-service-database:
	@$(compose-service-database) stop

# ==================================== SERVICE PYTHON ======================================================
compose-service-python=docker-compose -f docker-compose.python.yml -p service_python
start-service-python:
	@$(compose-service-python) up -d
stop-service-python:
	@$(compose-service-python) stop

# ==================================== SERVICE NODEJS ======================================================
compose-service-nodejs=docker-compose -f docker-compose.nodejs.yml -p service_nodejs
start-service-nodejs:
	@$(compose-service-nodejs) up -d
stop-service-nodejs:
	@$(compose-service-nodejs) stop

	# ==================================== SERVICE GOLANG ====================================================
	compose-service-golang=docker-compose -f docker-compose.golang.yml -p service_golang
	start-service-golang:
		@$(compose-service-golang) up -d
	stop-service-golang:
		@$(compose-service-golang) stop

start-all: start-service-database start-service-python start-service-nodejs start-service-golang

stop-all: stop-service-database stop-service-python stop-service-nodejs stop-service-golang

clean:
	@./scripts/clean.sh

install: clean setup
