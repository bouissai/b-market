start:
	docker compose up -d --wait postgres
	pnpm exec prisma migrate reset --force
	docker compose exec -T postgres psql -U postgres -d bmarket < prisma/populate.sql
	pnpm run dev