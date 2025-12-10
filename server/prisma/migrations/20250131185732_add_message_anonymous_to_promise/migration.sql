-- AlterTable
-- Cette migration ajoute les colonnes message et isAnonymous à la table Promise
-- SANS supprimer aucune donnée existante

-- Ajouter la colonne message (optionnelle)
ALTER TABLE "Promise" ADD COLUMN IF NOT EXISTS "message" TEXT;

-- Ajouter la colonne isAnonymous (par défaut false)
ALTER TABLE "Promise" ADD COLUMN IF NOT EXISTS "isAnonymous" BOOLEAN NOT NULL DEFAULT false;

















