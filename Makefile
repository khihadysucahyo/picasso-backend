# =========================================== SETTINGS =========================================

setup:
	@./scripts/setup.sh

# ==================================== CREATE NETWORK ==========================================
create-network:
	@docker network create gateway || true

remove-network:
	@docker network rm gateway

build:
	@docker-compose build

# ==================================== SERVICE MONITORING ======================================
compose-service-monitoring=docker-compose -f docker-compose.monitoring.yml -p service_monitoring
start-service-monitoring:
	@$(compose-service-monitoring) up -d
stop-service-monitoring:
	@$(compose-service-monitoring) stop

# ==================================== SERVICE DB ==============================================
compose-service-database=docker-compose -f docker-compose.database.yml -p service_database
start-service-database:
	@$(compose-service-database) up -d
stop-service-database:
	@$(compose-service-database) stop

# ==================================== SERVICE PYTHON ==========================================
compose-service-python=docker-compose -f docker-compose.python.yml -p service_python
start-service-python:
	@$(compose-service-python) up -d
stop-service-python:
	@$(compose-service-python) stop

# ==================================== SERVICE NODEJS ==========================================
compose-service-nodejs=docker-compose -f docker-compose.nodejs.yml -p service_nodejs
start-service-nodejs:
	@$(compose-service-nodejs) up -d
stop-service-nodejs:
	@$(compose-service-nodejs) stop

# ==================================== SERVICE GOLANG ==========================================
compose-service-golang=docker-compose -f docker-compose.golang.yml -p service_golang
start-service-golang:
	@$(compose-service-golang) up -d
stop-service-golang:
	@$(compose-service-golang) stop

# ==================================== SERVICE TRAEFIK =========================================
compose-service-traefik=docker-compose -f docker-compose.traefik.yml -p service_traefik
start-service-traefik:
	@$(compose-service-traefik) up -d
stop-service-traefik:
	@$(compose-service-traefik) stop


start-all: start-service-database start-service-python start-service-golang start-service-nodejs start-service-monitoring

stop-all: stop-service-database stop-service-python stop-service-golang stop-service-nodejs stop-service-monitoring

clean:
	@./scripts/clean.sh

install: clean setup
