# Allumer Docker avant d'exécuter cette commande
# TODO: Ajouter les commande de migration et generation avec better auth
start:
	docker-compose up -d
	npx prisma migrate reset
	npx prisma migrate dev --name init
	npx prisma generate
	type prisma\populate.sql | docker exec -i prisma_postgres_container psql -U postgres -d bmarket
	npm run dev