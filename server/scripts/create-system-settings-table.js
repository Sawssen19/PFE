const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function createSystemSettingsTable() {
  try {
    console.log('📋 Création de la table SystemSettings...\n');

    // Vérifier si la table existe déjà
    const tableExists = await prisma.$queryRaw`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'SystemSettings'
      );
    `;

    if (tableExists[0].exists) {
      console.log('✅ La table SystemSettings existe déjà. Aucune action nécessaire.');
      return;
    }

    console.log('1️⃣ Création de la table SystemSettings...');
    await prisma.$executeRawUnsafe(`
      CREATE TABLE "public"."SystemSettings" (
          "id" TEXT NOT NULL DEFAULT 'system',
          "general" JSONB NOT NULL DEFAULT '{}',
          "security" JSONB NOT NULL DEFAULT '{}',
          "notifications" JSONB NOT NULL DEFAULT '{}',
          "performance" JSONB NOT NULL DEFAULT '{}',
          "database" JSONB NOT NULL DEFAULT '{}',
          "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
          "updatedBy" TEXT,
          CONSTRAINT "SystemSettings_pkey" PRIMARY KEY ("id")
      );
    `);
    console.log('✅ Table SystemSettings créée');

    console.log('2️⃣ Insertion des valeurs par défaut...');
    await prisma.$executeRawUnsafe(`
      INSERT INTO "public"."SystemSettings" (
        "id",
        "general",
        "security",
        "notifications",
        "performance",
        "database",
        "updatedAt"
      ) VALUES (
        'system',
        '{
          "siteName": "Kollecta",
          "siteDescription": "Plateforme de collecte de fonds collaborative",
          "timezone": "Africa/Tunis",
          "language": "fr",
          "maintenanceMode": false,
          "debugMode": false
        }'::jsonb,
        '{
          "sessionTimeout": 30,
          "maxLoginAttempts": 5,
          "passwordMinLength": 8,
          "passwordComplexity": true,
          "twoFactorRequired": false,
          "sslRequired": true,
          "ipWhitelist": []
        }'::jsonb,
        '{
          "emailEnabled": true,
          "smsEnabled": false,
          "pushEnabled": true,
          "adminEmail": "admin@kollecta.com",
          "adminPhone": "+33123456789",
          "notificationDelay": 5
        }'::jsonb,
        '{
          "cacheEnabled": true,
          "cacheTimeout": 3600,
          "maxFileSize": 10,
          "compressionEnabled": true,
          "cdnEnabled": false,
          "rateLimit": 100
        }'::jsonb,
        '{
          "connectionPool": 20,
          "queryTimeout": 30,
          "backupEnabled": true,
          "backupFrequency": 24,
          "backupRetention": 30
        }'::jsonb,
        CURRENT_TIMESTAMP
      )
      ON CONFLICT ("id") DO NOTHING;
    `);
    console.log('✅ Valeurs par défaut insérées');

    console.log('\n✅✅✅ Table SystemSettings créée avec succès ! ✅✅✅');
    console.log('\n📝 Aucune donnée existante n\'a été modifiée.');

  } catch (error) {
    console.error('❌ Erreur lors de la création de la table SystemSettings:', error);
  } finally {
    await prisma.$disconnect();
    console.log('\n✅ Script terminé');
  }
}

createSystemSettingsTable();

