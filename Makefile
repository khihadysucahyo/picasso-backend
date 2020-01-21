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

# ==================================== SERVICE DB ======================================================
compose-service-database=docker-compose -f docker-compose.database.yml -p service_database
start-service-database:
	@$(compose-service-database) up -d
stop-service-database:
	@$(compose-service-database) stop

# ==================================== SERVICE NODEJS ======================================================
compose-service-nodejs=docker-compose -f docker-compose.nodejs.yml -p service_nodejs
start-service-nodejs:
	@$(compose-service-nodejs) up -d
stop-service-nodejs:
	@$(compose-service-nodejs) stop

# ==================================== SERVICE PYTHON ======================================================
compose-service-python=docker-compose -f docker-compose.python.yml -p service_python
start-service-python:
	@$(compose-service-python) up -d
stop-service-python:
	@$(compose-service-python) stop

start-all: start-service-database start-service-nodejs start-service-python

stop-all: stop-service-database stop-service-nodejs stop-service-python

clean:
	@./scripts/clean.sh

install: clean setup
