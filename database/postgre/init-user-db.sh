#!/bin/bash
set -o errexit

create_user() {
  psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" <<-EOSQL
    CREATE USER adminpostgre WITH PASSWORD 'plokijuh';
    ALTER ROLE adminpostgre SET client_encoding TO 'utf8';
    ALTER ROLE adminpostgre SET default_transaction_isolation TO 'read committed';
    ALTER ROLE adminpostgre SET timezone TO 'Asia/Jakarta';
    ALTER ROLE adminpostgre WITH PASSWORD 'plokijuh';
    ALTER USER adminpostgre WITH SUPERUSER;
EOSQL
}


create_database() {
	local database=$1
	echo "  Creating user and database '$database'"
	psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" <<-EOSQL
	    CREATE DATABASE $database;
	    GRANT ALL PRIVILEGES ON DATABASE $database TO "adminpostgre";
EOSQL
}

main() {
  create_user
  if [ -n "$POSTGRES_MULTIPLE_DATABASES" ]; then
  	echo "Multiple database creation requested: $POSTGRES_MULTIPLE_DATABASES"
  	for db in $(echo $POSTGRES_MULTIPLE_DATABASES | tr ',' ' '); do
  		create_database $db
  	done
  	echo "Multiple databases created"
  fi
}

main "$@"
