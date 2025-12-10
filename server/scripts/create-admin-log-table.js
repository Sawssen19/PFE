const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function createAdminLogTable() {
  try {
    console.log('📋 Création de la table AdminLog...\n');

    // Vérifier si la table existe déjà
    const tableExists = await prisma.$queryRaw`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'AdminLog'
      );
    `;

    if (tableExists[0].exists) {
      console.log('✅ La table AdminLog existe déjà. Aucune action nécessaire.');
      return;
    }

    console.log('1️⃣ Création des types ENUM...');
    
    // Créer les types ENUM s'ils n'existent pas
    await prisma.$executeRawUnsafe(`
      DO $$ BEGIN
        CREATE TYPE "public"."LogCategory" AS ENUM ('ADMIN', 'USER', 'CAGNOTTE', 'REPORT', 'SYSTEM', 'AUTH');
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
    `);

    await prisma.$executeRawUnsafe(`
      DO $$ BEGIN
        CREATE TYPE "public"."LogLevel" AS ENUM ('INFO', 'WARNING', 'ERROR', 'SECURITY', 'DEBUG');
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
    `);

    await prisma.$executeRawUnsafe(`
      DO $$ BEGIN
        CREATE TYPE "public"."LogSeverity" AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL');
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
    `);

    console.log('✅ Types ENUM créés\n');

    console.log('2️⃣ Création de la table AdminLog...');
    
    // Créer la table
    await prisma.$executeRawUnsafe(`
      CREATE TABLE "public"."AdminLog" (
        "id" TEXT NOT NULL,
        "adminId" TEXT NOT NULL,
        "action" TEXT NOT NULL,
        "category" "public"."LogCategory" NOT NULL DEFAULT 'ADMIN',
        "level" "public"."LogLevel" NOT NULL DEFAULT 'INFO',
        "severity" "public"."LogSeverity" NOT NULL DEFAULT 'LOW',
        "description" TEXT NOT NULL,
        "entityType" TEXT,
        "entityId" TEXT,
        "metadata" JSONB,
        "ipAddress" TEXT,
        "userAgent" TEXT,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT "AdminLog_pkey" PRIMARY KEY ("id")
      );
    `);

    console.log('✅ Table AdminLog créée\n');

    console.log('3️⃣ Création des index...');
    
    // Créer les index
    await prisma.$executeRawUnsafe(`
      CREATE INDEX "AdminLog_adminId_idx" ON "public"."AdminLog"("adminId");
    `);

    await prisma.$executeRawUnsafe(`
      CREATE INDEX "AdminLog_action_idx" ON "public"."AdminLog"("action");
    `);

    await prisma.$executeRawUnsafe(`
      CREATE INDEX "AdminLog_category_idx" ON "public"."AdminLog"("category");
    `);

    await prisma.$executeRawUnsafe(`
      CREATE INDEX "AdminLog_createdAt_idx" ON "public"."AdminLog"("createdAt");
    `);

    await prisma.$executeRawUnsafe(`
      CREATE INDEX "AdminLog_entityType_entityId_idx" ON "public"."AdminLog"("entityType", "entityId");
    `);

    console.log('✅ Index créés\n');

    console.log('4️⃣ Ajout de la clé étrangère...');
    
    // Ajouter la clé étrangère
    await prisma.$executeRawUnsafe(`
      ALTER TABLE "public"."AdminLog" 
      ADD CONSTRAINT "AdminLog_adminId_fkey" 
      FOREIGN KEY ("adminId") 
      REFERENCES "public"."User"("id") 
      ON DELETE RESTRICT 
      ON UPDATE CASCADE;
    `);

    console.log('✅ Clé étrangère ajoutée\n');

    console.log('✅✅✅ Table AdminLog créée avec succès ! ✅✅✅\n');
    console.log('📝 Aucune donnée existante n\'a été modifiée.\n');

  } catch (error) {
    console.error('❌ Erreur lors de la création de la table:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Exécuter le script
createAdminLogTable()
  .then(() => {
    console.log('✅ Script terminé avec succès');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Erreur:', error);
    process.exit(1);
  });


