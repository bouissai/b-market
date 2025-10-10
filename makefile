# Allumer Docker avant d'exécuter cette commande
# TODO: Ajouter les commande de migration et generation avec better auth
start:
	docker-compose up -d postgres
	npx prisma migrate reset
	npx prisma migrate dev --name init
	npx prisma generate
	cat prisma/populate.sql | docker exec -i b-market_postgres_1 psql -U postgres -d bmarket
	npm run dev