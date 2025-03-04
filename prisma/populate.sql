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
VALUES 
  ('cat1', 'Boeuf', NOW(), NOW()),
  ('cat2', 'Agneau', NOW(), NOW()),
  ('cat3', 'Volaille', NOW(), NOW()),
  ('cat4', 'Épices', NOW(), NOW()),
  ('cat5', 'Épicerie', NOW(), NOW());

-- Insérer des articles
INSERT INTO "Article" (id, name, unit, price, image, description, "createdAt", "updatedAt", "categoryName")
VALUES 
  -- Boeuf
  ('art1', 'Entrecôte de boeuf', 'kg', 39.90, 'entrecote.jpg', 'Entrecôte de boeuf maturée.', NOW(), NOW(), 'Boeuf'),
  ('art2', 'Steak haché', 'kg', 15.90, 'steak_hache.jpg', 'Steak haché pur boeuf.', NOW(), NOW(), 'Boeuf'),
  ('art3', 'Boeuf à bourguignon', 'kg', 16.90, 'bourguignon.jpg', 'Morceaux de boeuf pour bourguignon.', NOW(), NOW(), 'Boeuf'),
  ('art4', 'Côtelettes d''agneau', 'kg', 29.90, 'cotelettes_agneau.jpg', 'Côtelettes d''agneau fraîches.', NOW(), NOW(), 'Agneau'),
  ('art5', 'Gigot d''agneau', 'kg', 24.90, 'gigot.jpg', 'Gigot d''agneau entier.', NOW(), NOW(), 'Agneau'),
  ('art6', 'Poulet entier', 'pièce', 12.90, 'poulet.jpg', 'Poulet fermier entier.', NOW(), NOW(), 'Volaille'),
  ('art7', 'Escalopes de poulet', 'kg', 15.90, 'escalopes.jpg', 'Escalopes de poulet fraîches.', NOW(), NOW(), 'Volaille'),
  ('art8', 'Mélange Ras el hanout', '100g', 3.50, 'ras_el_hanout.jpg', 'Mélange d''épices traditionnel.', NOW(), NOW(), 'Épices'),
  ('art9', 'Cumin moulu', '100g', 2.50, 'cumin.jpg', 'Cumin moulu de qualité.', NOW(), NOW(), 'Épices'),
  ('art10', 'Semoule fine', 'kg', 3.90, 'semoule.jpg', 'Semoule fine de qualité supérieure.', NOW(), NOW(), 'Épicerie'),
  ('art11', 'Huile d''olive', 'litre', 8.90, 'huile_olive.jpg', 'Huile d''olive extra vierge.', NOW(), NOW(), 'Épicerie');

-- Insérer des utilisateurs
INSERT INTO "User" (id, name, email, password, role, "createdAt", "updatedAt", "cartId")
VALUES 
  ('user1', 'Mohammed Benali', 'mohammed.benali@example.com', 'hashedpassword1', 'user', NOW(), NOW(), 'cart1'),
  ('user2', 'Sarah Dubois', 'sarah.dubois@example.com', 'hashedpassword2', 'user', NOW(), NOW(), 'cart2');

-- Insérer les paniers
INSERT INTO "Cart" (id, "userId", "createdAt", "updatedAt")
VALUES 
  ('cart1', 'user1', NOW(), NOW()),
  ('cart2', 'user2', NOW(), NOW());

-- Insérer des articles dans les paniers
INSERT INTO "CartItem" (id, "cartId", "articleId", quantity)
VALUES 
  ('ci1', 'cart1', 'art1', 2),
  ('ci2', 'cart1', 'art8', 1),
  ('ci3', 'cart2', 'art7', 1);

-- Insérer des commandes avec différents statuts
INSERT INTO "Order" (id, "userId", total, status, "createdAt", "updatedAt")
VALUES 
  ('order1', 'user1', 98.70, 'CONFIRMED', NOW() - INTERVAL '5 days', NOW() - INTERVAL '5 days'),
  ('order2', 'user2', 45.60, 'PENDING', NOW() - INTERVAL '3 days', NOW() - INTERVAL '3 days'),
  ('order3', 'user1', 87.90, 'PENDING_PAYMENT', NOW() - INTERVAL '2 days', NOW() - INTERVAL '2 days'),
  ('order4', 'user2', 64.30, 'CANCELLED', NOW() - INTERVAL '1 day', NOW() - INTERVAL '1 day'),
  ('order5', 'user1', 122.10, 'CONFIRMED', NOW(), NOW());

-- Insérer des articles dans les commandes
INSERT INTO "OrderItem" (id, "orderId", "articleId", quantity, price)
VALUES
  ('oi1', 'order1', 'art1', 2, 79.80),  -- 2kg Entrecôte
  ('oi2', 'order1', 'art8', 3, 10.50),  -- 3x Ras el hanout
  ('oi3', 'order1', 'art9', 2, 8.40),   -- 2x Cumin
  ('oi4', 'order2', 'art6', 2, 25.80),  -- 2 Poulets
  ('oi5', 'order2', 'art8', 1, 3.50),   -- 1x Ras el hanout
  ('oi6', 'order2', 'art10', 2, 7.80),  -- 2kg Semoule
  ('oi7', 'order3', 'art4', 2, 59.80),  -- 2kg Côtelettes
  ('oi8', 'order3', 'art11', 2, 17.80), -- 2L Huile d'olive
  ('oi9', 'order3', 'art8', 1, 3.50),   -- 1x Ras el hanout
  ('oi10', 'order4', 'art2', 2, 31.80), -- 2kg Steak haché
  ('oi11', 'order4', 'art7', 1, 15.90), -- 1kg Escalopes
  ('oi12', 'order4', 'art10', 3, 11.70),-- 3kg Semoule
  ('oi13', 'order5', 'art5', 2, 49.80), -- 2kg Gigot
  ('oi14', 'order5', 'art7', 3, 47.70), -- 3kg Escalopes
  ('oi15', 'order5', 'art11', 2, 17.80),-- 2L Huile d'olive
  ('oi16', 'order5', 'art8', 2, 7.00);  -- 2x Ras el hanout