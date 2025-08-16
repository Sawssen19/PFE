# 🚀 Configuration SendGrid pour Kollecta

## 📋 Étapes de configuration

### 1. Créer un compte SendGrid
- Allez sur [https://sendgrid.com](https://sendgrid.com)
- Créez un compte gratuit (100 emails/jour)
- Vérifiez votre email

### 2. Générer une clé API
- Dans SendGrid Dashboard : **Settings > API Keys**
- Cliquez sur **"Create API Key"**
- Choisissez **"Restricted Access"** avec **"Mail Send"** activé
- Copiez la clé API générée

### 3. Vérifier votre domaine d'expédition
- Dans SendGrid Dashboard : **Settings > Sender Authentication**
- Suivez les étapes pour vérifier votre domaine
- Ou utilisez un email temporaire pour les tests

### 4. Configurer les variables d'environnement
Créez un fichier `.env` dans le dossier `server/` avec :

```env
# Configuration SendGrid
SENDGRID_API_KEY="votre-clé-api-ici"
FROM_EMAIL="votre-email-verifie@votre-domaine.com"

# Autres configurations
DATABASE_URL="postgresql://username:password@localhost:5432/kollecta_db"
JWT_SECRET="kollecta-super-secret-jwt-key-2025"
FRONTEND_URL="http://localhost:3000"
PORT=5000
NODE_ENV="development"
```

### 5. Tester la configuration
```bash
cd server
npx ts-node src/scripts/test-email-config.ts
```

## 🔧 Dépannage

### Erreur "Unauthorized"
- Vérifiez que votre clé API est correcte
- Assurez-vous que l'accès "Mail Send" est activé

### Erreur "Forbidden"
- Vérifiez que votre domaine d'expédition est authentifié
- Utilisez un email temporaire pour les tests

### Erreur "Bad Request"
- Vérifiez le format de l'email d'expédition
- Assurez-vous que FROM_EMAIL est correct

## 💡 Conseils

- **Pour le développement** : Utilisez un email temporaire
- **Pour la production** : Vérifiez votre propre domaine
- **Sécurité** : Ne partagez jamais votre clé API
- **Monitoring** : Vérifiez les logs SendGrid pour le débogage

## 📞 Support

- [Documentation SendGrid](https://docs.sendgrid.com/)
- [Support SendGrid](https://support.sendgrid.com/)
- [Statut SendGrid](https://status.sendgrid.com/) 