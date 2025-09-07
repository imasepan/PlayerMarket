# Docker Compose arguments
CONFIG = docker-compose.yml

all: run

run:
	docker compose -f $(CONFIG) up -d --build

clean:
	docker compose -f $(CONFIG) down --rmi all --remove-orphans