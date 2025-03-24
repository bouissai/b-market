-- Nettoyer toutes les tables existantes
TRUNCATE "OrderItem" CASCADE;
TRUNCATE "Order" CASCADE;
TRUNCATE "CartItem" CASCADE;
TRUNCATE "Cart" CASCADE;
TRUNCATE "Article" CASCADE;
TRUNCATE "Category" CASCADE;
TRUNCATE "User" CASCADE;

-- Active: 1739726328662@@127.0.0.1@5433@bmarket
-- Insérer des catégories de produits
INSERT INTO "Category" (id, name, "createdAt", "updatedAt")
VALUES ('cat1', 'Boeuf', NOW(), NOW()),
       ('cat2', 'Agneau', NOW(), NOW()),
       ('cat3', 'Volaille', NOW(), NOW()),
       ('cat4', 'Épices', NOW(), NOW()),
       ('cat5', 'Épicerie', NOW(), NOW());

-- Insérer des articles
INSERT INTO "Article" (id, name, unit, price, image, description, "createdAt", "updatedAt", "categoryId")
VALUES
  -- Boeuf
  ('art1', 'Entrecôte de boeuf', 'kg', 39.90, 'entrecote.jpg', 'Entrecôte de boeuf maturée.', NOW(), NOW(), 'cat1'),
  ('art2', 'Steak haché', 'kg', 15.90, 'steak_hache.jpg', 'Steak haché pur boeuf.', NOW(), NOW(), 'cat1'),
  ('art3', 'Boeuf à bourguignon', 'kg', 16.90, 'bourguignon.jpg', 'Morceaux de boeuf pour bourguignon.', NOW(), NOW(), 'cat1'),
  ('art4', 'Côtelettes d''agneau', 'kg', 29.90, 'cotelettes_agneau.jpg', 'Côtelettes d''agneau fraîches.', NOW(), NOW(), 'cat2'),
  ('art5', 'Gigot d''agneau', 'kg', 24.90, 'gigot.jpg', 'Gigot d''agneau entier.', NOW(), NOW(), 'cat2'),
  ('art6', 'Poulet entier', 'pièce', 12.90, 'poulet.jpg', 'Poulet fermier entier.', NOW(), NOW(), 'cat3'),
  ('art7', 'Escalopes de poulet', 'kg', 15.90, 'escalopes.jpg', 'Escalopes de poulet fraîches.', NOW(), NOW(), 'cat3'),
  ('art8', 'Mélange Ras el hanout', '100g', 3.50, 'ras_el_hanout.jpg', 'Mélange d''épices traditionnel.', NOW(), NOW(), 'cat4'),
  ('art9', 'Cumin moulu', '100g', 2.50, 'cumin.jpg', 'Cumin moulu de qualité.', NOW(), NOW(), 'cat4'),
  ('art10', 'Semoule fine', 'kg', 3.90, 'semoule.jpg', 'Semoule fine de qualité supérieure.', NOW(), NOW(), 'cat5'),
  ('art11', 'Huile d''olive', 'litre', 8.90, 'huile_olive.jpg', 'Huile d''olive extra vierge.', NOW(), NOW(), 'cat5');

-- Insérer des utilisateurs
INSERT INTO "User" (id, name, email, phone, "createdAt", "updatedAt", password, image)
VALUES ('user0', 'Test Jule', 'test@example.com', '+33 1 11 11 11 00', NOW(), NOW(), 'hashed_password_0', NULL),
       ('user1', 'Mohammed Benali', 'mohammed.benali@example.com', '+33 0 00 00 00 00', NOW(), NOW(),
        'hashed_password_1', NULL),
       ('user2', 'Sarah Dubois', 'sarah.dubois@example.com', NULL, NOW(), NOW(), 'hashed_password_2', NULL),
       ('user3', 'Ilyass Bouissa', 'bouissailyass@gmail.com', '+33 6 95 50 90 33', NOW(), NOW(), 'hashed_password_3',
        NULL);
-- Insérer les paniers
INSERT INTO "Cart" (id, "userId", "createdAt", "updatedAt")
VALUES ('cart0', 'user0', NOW(), NOW()),
       ('cart1', 'user1', NOW(), NOW()),
       ('cart2', 'user2', NOW(), NOW()),
       ('cart3', 'user3', NOW(), NOW());

-- Insérer des articles dans les paniers
INSERT INTO "CartItem" (id, "cartId", "articleId", quantity)
VALUES ('ci1', 'cart1', 'art1', 2),
       ('ci2', 'cart1', 'art8', 1),
       ('ci3', 'cart2', 'art7', 1);

-- Insérer des commandes avec différents statuts
-- Insérer des commandes avec différents statuts
INSERT INTO "Order" ( id, "userId", total, note, status, "createdAt", "updatedAt")
VALUES
  -- Commande passée hier (1 jour avant aujourd'hui)
  (1, 'user1', 33.8, 'Commande rapide', 'CONFIRMED', NOW() - INTERVAL '1 days', NOW() - INTERVAL '1 days'),
  -- Commande passée il y a 1 semaine
  (2 ,'user2', 67.7, 'Livraison demain', 'PENDING', NOW() - INTERVAL '7 days', NOW() - INTERVAL '7 days'),
  -- Commande passée il y a 32 jours (environ 1 mois)
  (3, 'user3', 41.3, 'Bonne qualité', 'PENDING_PAYMENT', NOW() - INTERVAL '32 days', NOW() - INTERVAL '32 days'),
  -- Commande très ancienne, passée il y a 365 jours (plus d'un an)
  (4, 'user1', 7.8, 'Au top', 'CONFIRMED', NOW() - INTERVAL '365 days', NOW() - INTERVAL '365 days'),
  -- Commande passée aujourd’hui
  (5, 'user1', 7.8, 'Au top', 'CANCELLED', NOW(), NOW()),
  -- Commande passée il y a 64 jours (un peu plus de 2 mois)
  (6, 'user1', 3.9, 'Rat yan', 'PENDING_PAYMENT', NOW() - INTERVAL '64 days', NOW() - INTERVAL '64 days');



-- Insérer des articles dans les commandes
INSERT INTO "OrderItem" (id, "orderId", "articleId", quantity, price)
VALUES
  ('oi1', 1, 'art1', 3, 39.9),
  ('oi2', 1, 'art2', 2, 15.90),
  ('oi3', 1, 'art3', 2, 16.9),
  -- Total 33,8  Commande passée hier (1 jour avant aujourd'hui)
  ('oi4', 2, 'art4', 1, 29.90),
  ('oi5', 2, 'art5', 1, 24.90),
  ('oi6', 2, 'art6', 1, 12.90),
  -- Total 67,7 Commande passée il y a 1 semaine
  ('oi7', 3, 'art7', 2, 15.90),
  ('oi8', 3, 'art8', 2, 3.50),
  ('oi9', 3, 'art9', 1, 2.50),
  -- Total 41,3 Commande passée il y a 32 jours
  ('oi10', 4, 'art10', 2, 3.9),
  -- Total 7.8 Commande très ancienne, passée il y a 365 jours (plus d'un an)
  ('oi11', 1, 'art10', 2, 3.9),
  -- Total 7.8  Commande passée aujourd’hu
  ('oi12', 5, 'art10', 1, 3.9);
  -- Total 3.9  Commande passée il y a 64 jours (un peu plus de 2 mois)


SELECT SUM(CASE WHEN "createdAt" >= CURRENT_DATE THEN total ELSE 0 END)                      AS total_today,
       SUM(CASE WHEN "createdAt" >= CURRENT_DATE - INTERVAL '7 days' THEN total ELSE 0 END)  AS total_week,
       SUM(CASE WHEN "createdAt" >= DATE_TRUNC('month', CURRENT_DATE) THEN total ELSE 0 END) AS total_month,
       SUM(CASE WHEN "createdAt" >= DATE_TRUNC('year', CURRENT_DATE) THEN total ELSE 0 END)  AS total_year
FROM "Order";
