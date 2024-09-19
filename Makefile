build-web1-prod: ## Build the server docker container.
	docker compose -f docker-compose.yml-prod build nx_nextjs_auth_buy_step_product_c 

build-api1-prod: ## Build the server docker container.
	docker compose -f docker-compose-prod.yml build nx_nextjs_auth_buy_step_product_c 
	
start-web1-prod: ## Start the server docker container.
	docker compose -f docker-compose.yml up -d nx_nextjs_auth_buy_step_product_c 

start-api1-prod: ## Start the server docker container.
	docker compose -f docker-compose.yml up -d nx_nextjs_auth_buy_step_product_c 

start-full-dev: ## Start the full docker container.
	docker compose -f docker-compose-dev.yml up -d

rm-b-cache: ## Remove build cache.
	docker buildx prune -f