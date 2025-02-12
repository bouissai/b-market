-- Insérer des catégories de produits (ignorer si existe déjà)
INSERT INTO "Category" (id, name, "createdAt", "updatedAt")
VALUES 
  ('cat1', 'Viandes', NOW(), NOW()),
  ('cat2', 'Charcuterie', NOW(), NOW()),
  ('cat3', 'Plats préparés', NOW(), NOW())
ON CONFLICT (name) DO NOTHING;

-- Insérer des articles (mettre à jour si existe)
INSERT INTO "Article" (id, name, unit, price, image, description, "createdAt", "updatedAt", "categoryName")
VALUES 
  ('art1', 'Côte de boeuf', 'kg', 25.50, 'cote_boeuf.jpg', 'Une belle côte de boeuf maturée.', NOW(), NOW(), 'Viandes'),
  ('art2', 'Filet de poulet', 'kg', 12.80, 'filet_poulet.jpg', 'Filet de poulet fermier.', NOW(), NOW(), 'Viandes'),
  ('art3', 'Saucisson sec', 'pièce', 6.50, 'saucisson.jpg', 'Saucisson artisanal.', NOW(), NOW(), 'Charcuterie'),
  ('art4', 'Pâté de campagne', '100g', 2.80, 'pate_campagne.jpg', 'Pâté de campagne maison.', NOW(), NOW(), 'Charcuterie'),
  ('art5', 'Bœuf bourguignon', 'portion', 15.00, 'boeuf_bourguignon.jpg', 'Plat mijoté traditionnel.', NOW(), NOW(), 'Plats préparés')
ON CONFLICT (name) DO UPDATE SET price = EXCLUDED.price, "updatedAt" = NOW();

-- Insérer des utilisateurs (mettre à jour en cas de conflit sur l'email)
INSERT INTO "User" (id, name, email, password, role, "createdAt", "updatedAt", "cartId")
VALUES 
  ('user1', 'Jean Dupont', 'jean.dupont@example.com', 'hashedpassword1', 'user', NOW(), NOW(), 'cart1'),
  ('user2', 'Alice Martin', 'alice.martin@example.com', 'hashedpassword2', 'user', NOW(), NOW(), 'cart2')
ON CONFLICT (email) DO UPDATE SET name = EXCLUDED.name, "updatedAt" = NOW();

-- Insérer les paniers (ignorer si existe)
INSERT INTO "Cart" (id, "userId", "createdAt", "updatedAt")
VALUES 
  ('cart1', 'user1', NOW(), NOW()),
  ('cart2', 'user2', NOW(), NOW())
ON CONFLICT ("userId") DO NOTHING;

-- Insérer des articles dans les paniers (ignorer si déjà présent)
INSERT INTO "CartItem" (id, "cartId", "articleId", quantity)
VALUES 
  ('ci1', 'cart1', 'art1', 2),
  ('ci2', 'cart1', 'art3', 1),
  ('ci3', 'cart2', 'art5', 1)
ON CONFLICT ("cartId", "articleId") DO NOTHING;

-- Insérer des commandes (ignorer si déjà passée)
INSERT INTO "Order" (id, "userId", total, status, "createdAt", "updatedAt")
VALUES 
  ('order1', 'user1', 57.50, 'completed', NOW(), NOW()),
  ('order2', 'user2', 15.00, 'pending', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- Insérer des articles dans les commandes (ignorer si déjà présent)
INSERT INTO "OrderItem" (id, "orderId", "articleId", quantity, price)
VALUES 
  ('oi1', 'order1', 'art1', 2, 51.00),
  ('oi2', 'order1', 'art3', 1, 6.50),
  ('oi3', 'order2', 'art5', 1, 15.00)
ON CONFLICT ("orderId", "articleId") DO NOTHING;