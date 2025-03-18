# Allumer Docker avant d'exécuter cette commande
start:
	docker-compose up -d
	npx prisma migrate reset
	npx prisma migrate dev --name init
	type prisma\populate.sql | docker exec -i prisma_postgres_container psql -U postgres -d bmarket
	npm run dev