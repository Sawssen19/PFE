-- Script SQL sûr pour ajouter les colonnes message et isAnonymous à Promise
-- EXÉCUTER CECI DIRECTEMENT SUR LA BASE DE DONNÉES
-- Cela n'affectera PAS les données existantes

-- Ajouter la colonne message (optionnelle)
ALTER TABLE "Promise" ADD COLUMN IF NOT EXISTS "message" TEXT;

-- Ajouter la colonne isAnonymous (par défaut false)
ALTER TABLE "Promise" ADD COLUMN IF NOT EXISTS "isAnonymous" BOOLEAN NOT NULL DEFAULT false;

















