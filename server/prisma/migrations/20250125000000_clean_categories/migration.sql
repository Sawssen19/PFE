-- Migration pour nettoyer les catégories redondantes et ajouter les nouvelles

-- 1. Supprimer les catégories redondantes
-- Note: On ne peut pas supprimer directement à cause des contraintes de clé étrangère
-- Il faut d'abord réassigner les cagnottes à d'autres catégories

-- Réassigner les cagnottes de "Urgence" vers "Urgences"
UPDATE "Cagnotte" 
SET "categoryId" = (SELECT id FROM "Category" WHERE name = 'Urgences')
WHERE "categoryId" = (SELECT id FROM "Category" WHERE name = 'Urgence');

-- Réassigner les cagnottes de "Sportif" vers "Sport"
UPDATE "Cagnotte" 
SET "categoryId" = (SELECT id FROM "Category" WHERE name = 'Sport')
WHERE "categoryId" = (SELECT id FROM "Category" WHERE name = 'Sportif');

-- Réassigner les cagnottes de "Social" vers "Solidarité"
UPDATE "Cagnotte" 
SET "categoryId" = (SELECT id FROM "Category" WHERE name = 'Solidarité')
WHERE "categoryId" = (SELECT id FROM "Category" WHERE name = 'Social');

-- Réassigner les cagnottes de "Test" vers "Autre"
UPDATE "Cagnotte" 
SET "categoryId" = (SELECT id FROM "Category" WHERE name = 'Autre')
WHERE "categoryId" = (SELECT id FROM "Category" WHERE name = 'Test');

-- 2. Supprimer les catégories redondantes
DELETE FROM "Category" WHERE name IN ('Urgence', 'Sportif', 'Social', 'Test');

-- 3. Ajouter les nouvelles catégories
INSERT INTO "Category" (id, name, description) VALUES
(gen_random_uuid(), 'Religion', 'Projets religieux et spirituels'),
(gen_random_uuid(), 'Famille', 'Cagnottes familiales et événements personnels'),
(gen_random_uuid(), 'Événements', 'Fêtes, anniversaires et célébrations'),
(gen_random_uuid(), 'Voyages', 'Voyages d''études, pèlerinages et déplacements'),
(gen_random_uuid(), 'Bénévolat', 'Projets de bénévolat et associations caritatives');
