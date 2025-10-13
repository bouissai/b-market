-- Nettoyer toutes les tables existantes
TRUNCATE "OrderItem" CASCADE;
TRUNCATE "Order" CASCADE;
TRUNCATE "CartItem" CASCADE;
TRUNCATE "Cart" CASCADE;
TRUNCATE "Article" CASCADE;
TRUNCATE "Category" CASCADE;
TRUNCATE "User" CASCADE;
TRUNCATE "PromoCode" CASCADE;

-- Insérer des catégories de produits
INSERT INTO "Category" (id, name, image, featured, description, "createdAt", "updatedAt")
VALUES ('cat1', 'Boeuf', 'https://res.cloudinary.com/ddqrywesr/image/upload/v1743627027/eg5ec1vc9bscz1gimopj.png', true,
        'Côtes, entrecôtes, bavettes, filets et autres morceaux nobles de bœuf, toujours frais et halal.', NOW(),
        NOW()),
       ('cat2', 'Agneau', 'https://res.cloudinary.com/ddqrywesr/image/upload/v1743626541/hcutdkicydtpwwt5epcj.png',
        true, 'Gigots savoureux, côtelettes tendres et épaule d''agneau pour vos plats mijotés.', NOW(), NOW()),
       ('cat3', 'Volaille', 'https://res.cloudinary.com/ddqrywesr/image/upload/v1743627357/bq5g4kl4eka5b7s9gcih.png',
        true, 'Poulet fermier, dinde, pintade et canard pour des recettes traditionnelles ou festives.', NOW(), NOW()),
       ('cat4', 'Épices', 'https://res.cloudinary.com/ddqrywesr/image/upload/v1743632470/rn3bmgelf47dbfvm8mcn.png',
        true, 'Un assortiment d''épices authentiques pour relever vos viandes et plats maison.', NOW(), NOW()),
       ('cat5', 'Veau', 'https://res.cloudinary.com/ddqrywesr/image/upload/v1760002096/laglrvpk94jhc5xssyj3.png',
        true, 'Nos viandes de veau et plats maison.', NOW(), NOW());

-- Insérer des articles
INSERT INTO "Article" (id, name, unit, price, image, description, "createdAt", "updatedAt", "categoryId")
VALUES
    -- Boeuf
    ('art1', 'Entrecôte de boeuf', 'kg', 39.90, 'https://res.cloudinary.com/ddqrywesr/image/upload/v1760002156/g7xdahozfjf37yzmkiri.png', 'Entrecôte de boeuf maturée.', NOW(), NOW(),
     'cat1'),
    ('art2', 'Steak haché', 'kg', 15.90, '/images/no-img.png', 'Steak haché pur boeuf.', NOW(), NOW(), 'cat1'),
    ('art3', 'Boeuf à bourguignon', 'kg', 16.90, '/images/no-img.png', 'Morceaux de boeuf pour bourguignon.', NOW(),
     NOW(), 'cat1'),
    ('art4', 'Côtelettes d''agneau', 'kg', 29.90, '/images/no-img.png', 'Côtelettes d''agneau fraîches.', NOW(), NOW(),
     'cat2'),
    ('art5', 'Gigot d''agneau', 'kg', 24.90, '/images/no-img.png', 'Gigot d''agneau entier.', NOW(), NOW(), 'cat2'),
    ('art6', 'Poulet entier', 'pièce', 12.90, '/images/no-img.png', 'Poulet fermier entier.', NOW(), NOW(), 'cat3'),
    ('art7', 'Escalopes de poulet', 'kg', 15.90, '/images/no-img.png', 'Escalopes de poulet fraîches.', NOW(), NOW(),
     'cat3'),
    ('art8', 'Mélange Ras el hanout', '100g', 3.50, '/images/no-img.png', 'Mélange d''épices traditionnel.', NOW(),
     NOW(), 'cat4'),
    ('art9', 'Cumin moulu', '100g', 2.50, '/images/no-img.png', 'Cumin moulu de qualité.', NOW(), NOW(), 'cat4'),
    ('art10', 'Semoule fine', 'kg', 3.90, '/images/no-img.png', 'Semoule fine de qualité supérieure.', NOW(), NOW(),
     'cat4'),
    ('art11', 'Huile d''olive', 'litre', 8.90, '/images/no-img.png', 'Huile d''olive extra vierge.', NOW(), NOW(),
     'cat4');

-- Insérer des codes promos
INSERT INTO "PromoCode" (id, code, discount, "startDate", "endDate", "maxUses", "useCount", active, "createdAt", "updatedAt")
VALUES ('promo1', 'PROMO10', 10, NOW(), NOW() + INTERVAL '30 days', 100, 0, true, NOW(), NOW()),
       ('promo2', 'PROMO20', 20, NOW(), NOW() + INTERVAL '15 days', 50, 0, true, NOW(), NOW());

-- Insérer des utilisateurs (avec mot de passe hashé)
INSERT INTO "User" (id, firstname, lastname, email, phone, password, "isAdmin", "createdAt", "updatedAt")
VALUES ('user1', 'Mohammed', 'Benali', 'mohammed.benali@example.com', '+33123456789', '$2a$12$LQV3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPHAF9fLJgJ2.', false, NOW(), NOW()),
       ('user2', 'Sarah', 'Dubois', 'sarah.dubois@example.com', '+33987654321', '$2a$12$LQV3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPHAF9fLJgJ2.', false, NOW(), NOW()),
       ('user3', 'Admin', 'User', 'admin@example.com', '+33123123123', '$2a$12$LQV3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPHAF9fLJgJ2.', true, NOW(), NOW());

-- Insérer les paniers
-- Insérer des commandes
INSERT INTO "Order" (id, "userId", total, status, "createdAt", "updatedAt", firstname, lastname, email, phone, "promoCodeId")
VALUES (1, 'user1', 95.70, 'PENDING', NOW(), NOW(), 'Mohammed', 'Benali', 'mohammed.benali@example.com', '+33123456789', 'promo1'),
       (2, 'user2', 47.85, 'COMPLETED', NOW() - INTERVAL '1 day', NOW() - INTERVAL '1 day', 'Sarah', 'Dubois', 'sarah.dubois@example.com', '+33987654321', 'promo2');

-- Insérer des articles dans les commandes