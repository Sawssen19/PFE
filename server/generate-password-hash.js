// Script temporaire pour générer un hash de mot de passe
const bcrypt = require('bcrypt');

async function generateHash() {
  const password = process.argv[2] || 'password123';
  const hash = await bcrypt.hash(password, 10);
  console.log('\n✅ Hash généré pour le mot de passe:', password);
  console.log('📋 Hash à utiliser dans SQL:');
  console.log(hash);
  console.log('\n');
}

generateHash();

