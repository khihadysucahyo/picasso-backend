# kepegawaian-apps

### Start/Stop all services

```bash
make start-all
make stop-all
```

### Start/Stop services one by one

#### services-database

* Compose file: [./docker-compose.service-database.yml](./docker-compose.service-database.yml)
* Start: `make start-service-database`
* Stop: `make stop-service-database`

#### services-nodejs

* Compose file: [./docker-compose.service-nodejs.yml](./docker-compose.service-nodejs.yml)
* Start: `make start-service-nodejs`
* Stop: `make stop-service-nodejs`

#### services-python

* Compose file: [./docker-compose.service-python.yml](./docker-compose.service-python.yml)
* Start: `make start-service-python`
* Stop: `make stop-service-python`
