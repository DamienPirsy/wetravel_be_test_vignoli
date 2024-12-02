.PHONY: run up down logs status test-unit help
.DEFAULT_GOAL := help
run-docker-compose = docker compose -f docker-compose.yml

run: # Start dev container and show logs
	${run-docker-compose} up

up: # Start dev containers
	$(run-docker-compose) up -d

down: # Stop all containers
	$(run-docker-compose) down --remove-orphans

logs: # Tail container logs
	$(run-docker-compose) logs -f app

status: # Show status of all containers
	$(run-docker-compose) ps

test-unit: # Launch unit tests
ifdef filter
	$(run-docker-compose) exec app npm run test:unit -- --testNamePattern=$(filter) --verbose
else ifdef path
	$(run-docker-compose) exec app npm run test:unit -- --testPathPattern=$(path) --verbose
else
	$(run-docker-compose) exec app npm run test:unit --verbose
endif

help: # make help
	@awk 'BEGIN {FS = ":.*#"; printf "\nUsage:\n  make \033[36m<target>\033[0m\n"} /^[a-zA-Z0-9_-]+:.*?#/ { printf "  \033[36m%-27s\033[0m %s\n", $$1, $$2 } /^##@/ { printf "\n\033[1m%s\033[0m\n", substr($$0, 5) } ' $(MAKEFILE_LIST)
