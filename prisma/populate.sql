-- Nettoyer toutes les tables (enfants avant parents)
TRUNCATE "RecipeStep" CASCADE;
TRUNCATE "RecipeIngredient" CASCADE;
TRUNCATE "Recipe" CASCADE;
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
    -- Agneau
    ('art4', 'Côtelettes d''agneau', 'kg', 29.90, '/images/no-img.png', 'Côtelettes d''agneau fraîches.', NOW(), NOW(),
     'cat2'),
    ('art5', 'Gigot d''agneau', 'kg', 24.90, '/images/no-img.png', 'Gigot d''agneau entier.', NOW(), NOW(), 'cat2'),
    ('art12', 'Épaule d''agneau', 'kg', 22.90, '/images/no-img.png', 'Épaule d''agneau pour tajines et mijotés.', NOW(), NOW(), 'cat2'),
    ('art13', 'Merguez', 'kg', 18.90, '/images/no-img.png', 'Merguez épicées halal.', NOW(), NOW(), 'cat2'),
    -- Volaille
    ('art6', 'Poulet entier', 'pièce', 12.90, '/images/no-img.png', 'Poulet fermier entier.', NOW(), NOW(), 'cat3'),
    ('art7', 'Escalopes de poulet', 'kg', 15.90, '/images/no-img.png', 'Escalopes de poulet fraîches.', NOW(), NOW(),
     'cat3'),
    -- Épices et accompagnements
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

-- Insérer des commandes
INSERT INTO "Order" (id, "userId", total, status, "createdAt", "updatedAt", firstname, lastname, email, phone, "promoCodeId")
VALUES (1, 'user1', 95.70, 'PENDING', NOW(), NOW(), 'Mohammed', 'Benali', 'mohammed.benali@example.com', '+33123456789', 'promo1'),
       (2, 'user2', 47.85, 'COMPLETED', NOW() - INTERVAL '1 day', NOW() - INTERVAL '1 day', 'Sarah', 'Dubois', 'sarah.dubois@example.com', '+33987654321', 'promo2');

-- Insérer des recettes
INSERT INTO "Recipe" (id, title, description, image, category, "prepTime", "cookTime", servings, difficulty, tags, featured, "forEvents", calories, protein, carbs, fat, "createdAt", "updatedAt")
VALUES
    ('recipe1', 'Bœuf bourguignon',
     'Un classique de la cuisine française, tendre et savoureux, parfait pour les repas du quotidien.',
     'https://res.cloudinary.com/ddqrywesr/image/upload/v1760002156/g7xdahozfjf37yzmkiri.png',
     'plat-principal', 30, 180, 6, 'moyen',
     ARRAY['boeuf', 'français', 'mijoté'], true, false, 520, 38, 18, 28, NOW(), NOW()),

    ('recipe2', 'Poulet rôti aux épices',
     'Un poulet juteux et parfumé aux épices orientales, idéal pour un repas familial rapide.',
     '/images/no-img.png',
     'plat-principal', 15, 75, 4, 'facile',
     ARRAY['poulet', 'rôti', 'familial', 'oriental'], true, false, 380, 42, 2, 22, NOW(), NOW()),

    ('recipe3', 'Couscous royal',
     'Un plat convivial et généreux pour régaler famille et amis lors de vos grandes tablées.',
     '/images/no-img.png',
     'plat-principal', 45, 120, 8, 'difficile',
     ARRAY['agneau', 'poulet', 'merguez', 'oriental', 'événement'], false, true, 650, 45, 55, 28, NOW(), NOW()),

    ('recipe4', 'Tajine d''agneau aux pruneaux',
     'Un plat traditionnel marocain sucré-salé, savoureux et parfumé.',
     'https://res.cloudinary.com/ddqrywesr/image/upload/v1743626541/hcutdkicydtpwwt5epcj.png',
     'plat-principal', 30, 120, 4, 'moyen',
     ARRAY['agneau', 'oriental', 'mijoté'], true, false, 450, 35, 30, NULL, NOW(), NOW()),

    ('recipe5', 'Kefta grillée',
     'Boulettes de viande hachée aux épices, rapides à préparer pour l''apéritif ou le quotidien.',
     '/images/no-img.png',
     'entrée', 20, 10, 6, 'facile',
     ARRAY['boeuf', 'oriental', 'apéritif', 'rapide'], false, false, 280, 22, NULL, 18, NOW(), NOW());

-- Ingrédients des recettes
INSERT INTO "RecipeIngredient" (id, "recipeId", name, "displayQuantity", position, "articleId", "cartQuantity")
VALUES
    -- Bœuf bourguignon
    ('ring1', 'recipe1', 'Bœuf à bourguignon', '1 kg', 1, 'art3', 1),
    ('ring2', 'recipe1', 'Carottes', '4', 2, NULL, NULL),
    ('ring3', 'recipe1', 'Oignons', '2', 3, NULL, NULL),
    ('ring4', 'recipe1', 'Ail', '3 gousses', 4, NULL, NULL),
    ('ring5', 'recipe1', 'Herbes de Provence', '1 sachet', 5, NULL, NULL),

    -- Poulet rôti aux épices
    ('ring6', 'recipe2', 'Poulet entier', '1 pièce', 1, 'art6', 1),
    ('ring7', 'recipe2', 'Mélange Ras el hanout', '2 cuillères à soupe', 2, 'art8', 1),
    ('ring8', 'recipe2', 'Huile d''olive', '3 cuillères à soupe', 3, 'art11', 1),
    ('ring9', 'recipe2', 'Thym', 'quelques branches', 4, NULL, NULL),
    ('ring10', 'recipe2', 'Citron', '1', 5, NULL, NULL),

    -- Couscous royal
    ('ring11', 'recipe3', 'Épaule d''agneau', '800 g', 1, 'art12', 1),
    ('ring12', 'recipe3', 'Poulet entier', '1 pièce', 2, 'art6', 1),
    ('ring13', 'recipe3', 'Merguez', '8 pièces', 3, 'art13', 1),
    ('ring14', 'recipe3', 'Semoule fine', '500 g', 4, 'art10', 1),
    ('ring15', 'recipe3', 'Légumes à couscous', 'assortiment', 5, NULL, NULL),
    ('ring16', 'recipe3', 'Pois chiches', '200 g', 6, NULL, NULL),

    -- Tajine d'agneau aux pruneaux
    ('ring17', 'recipe4', 'Épaule d''agneau', '800 g', 1, 'art12', 1),
    ('ring18', 'recipe4', 'Mélange Ras el hanout', '1 sachet', 2, 'art8', 1),
    ('ring19', 'recipe4', 'Cumin moulu', '1 cuillère à café', 3, 'art9', 1),
    ('ring20', 'recipe4', 'Huile d''olive', '3 cuillères à soupe', 4, 'art11', 1),
    ('ring21', 'recipe4', 'Pruneaux', '200 g', 5, NULL, NULL),
    ('ring22', 'recipe4', 'Miel', '2 cuillères à soupe', 6, NULL, NULL),
    ('ring23', 'recipe4', 'Oignons', '2', 7, NULL, NULL),

    -- Kefta grillée
    ('ring24', 'recipe5', 'Steak haché', '500 g', 1, 'art2', 1),
    ('ring25', 'recipe5', 'Cumin moulu', '1 cuillère à café', 2, 'art9', 1),
    ('ring26', 'recipe5', 'Oignon', '1', 3, NULL, NULL),
    ('ring27', 'recipe5', 'Persil', '1 bouquet', 4, NULL, NULL);

-- Étapes des recettes
INSERT INTO "RecipeStep" (id, "recipeId", description, position)
VALUES
    -- Bœuf bourguignon
    ('rstep1', 'recipe1', 'Coupez le bœuf en gros morceaux et faites-le revenir dans une cocotte avec un peu d''huile jusqu''à coloration.', 1),
    ('rstep2', 'recipe1', 'Ajoutez les oignons émincés, l''ail et les carottes coupées en rondelles. Faites revenir 5 minutes.', 2),
    ('rstep3', 'recipe1', 'Couvrez d''eau ou de bouillon, ajoutez les herbes et laissez mijoter à feu doux pendant 2h30 à 3h.', 3),
    ('rstep4', 'recipe1', 'Rectifiez l''assaisonnement et servez bien chaud avec des pommes de terre ou du pain.', 4),

    -- Poulet rôti aux épices
    ('rstep5', 'recipe2', 'Mélangez le Ras el hanout avec l''huile d''olive, le sel et le poivre pour former une marinade.', 1),
    ('rstep6', 'recipe2', 'Badigeonnez le poulet entier avec la marinade, en insistant sous la peau et à l''intérieur.', 2),
    ('rstep7', 'recipe2', 'Placez le thym et le citron dans la cavité du poulet.', 3),
    ('rstep8', 'recipe2', 'Enfournez à 180°C pendant 1h15, en arrosant régulièrement. Laissez reposer 10 minutes avant de servir.', 4),

    -- Couscous royal
    ('rstep9', 'recipe3', 'Faites revenir les morceaux d''agneau et le poulet dans une grande cocotte avec les épices.', 1),
    ('rstep10', 'recipe3', 'Ajoutez de l''eau et laissez mijoter 1h30. Ajoutez les merguez 15 minutes avant la fin.', 2),
    ('rstep11', 'recipe3', 'Préparez la semoule en la mouillant et en la travaillant à la vapeur trois fois.', 3),
    ('rstep12', 'recipe3', 'Disposez la semoule en couronne, placez les viandes et les légumes au centre. Servez chaud.', 4),

    -- Tajine d'agneau aux pruneaux
    ('rstep13', 'recipe4', 'Coupez l''épaule d''agneau en morceaux et faites-la dorer dans l''huile d''olive.', 1),
    ('rstep14', 'recipe4', 'Ajoutez les oignons émincés, le Ras el hanout et le cumin. Mélangez bien.', 2),
    ('rstep15', 'recipe4', 'Versez de l''eau chaude à mi-hauteur et laissez mijoter 1h30 à feu doux.', 3),
    ('rstep16', 'recipe4', 'Ajoutez les pruneaux et le miel, poursuivez la cuisson 30 minutes. Servez avec de la semoule.', 4),

    -- Kefta grillée
    ('rstep17', 'recipe5', 'Mélangez le steak haché avec l''oignon râpé, le cumin, le sel et le poivre.', 1),
    ('rstep18', 'recipe5', 'Formez des boulettes ou des brochettes avec la préparation.', 2),
    ('rstep19', 'recipe5', 'Faites griller à feu vif 8 à 10 minutes en retournant régulièrement.', 3),
    ('rstep20', 'recipe5', 'Servez chaud avec du persil frais et du pain pita.', 4);
