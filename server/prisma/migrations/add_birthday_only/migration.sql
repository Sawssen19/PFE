-- 🎂 Migration pour AJOUTER SEULEMENT le champ birthday
-- Cette migration NE SUPPRIME AUCUNE DONNÉE existante

-- Ajouter le champ birthday à la table User
ALTER TABLE "User" ADD COLUMN "birthday" TIMESTAMP;

-- Ajouter un commentaire descriptif
COMMENT ON COLUMN "User"."birthday" IS 'Date de naissance de l''utilisateur'; 