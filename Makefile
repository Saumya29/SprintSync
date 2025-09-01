.PHONY: help build up down logs shell clean

help:
	@echo "Available commands:"
	@echo "  make build   - Build Docker images"
	@echo "  make up      - Start all services"
	@echo "  make down    - Stop all services"
	@echo "  make logs    - View logs"
	@echo "  make shell   - Access backend container"
	@echo "  make clean   - Remove containers and volumes"
	@echo "  make seed    - Run database seed"
	@echo "  make migrate - Run database migrations"

build:
	docker-compose build

up:
	docker-compose up -d
	@echo "Waiting for database to be ready..."
	@sleep 5
	@make migrate
	@echo "\n✅ Application is running!"
	@echo "Frontend: http://localhost:3000"
	@echo "Backend:  http://localhost:3001"

down:
	docker-compose down

logs:
	docker-compose logs -f

shell:
	docker-compose exec backend sh

clean:
	docker-compose down -v
	docker system prune -f

seed:
	docker-compose exec backend npm run seed

migrate:
	docker-compose exec backend npx prisma migrate deploy