-- Script pour ajouter le champ notificationPreferences à la table User
-- Ce script est sûr et n'affecte pas les données existantes

ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "notificationPreferences" JSONB;

-- Vérification que la colonne a été ajoutée
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'User' AND column_name = 'notificationPreferences';

