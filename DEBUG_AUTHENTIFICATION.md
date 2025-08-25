# 🔐 Guide de Débogage - Problème d'Authentification

## 🎯 Problème Identifié
Vous ne pouvez pas modifier les champs de votre profil sur `http://localhost:3000/profile/edit` à cause d'un problème d'authentification global.

## ✅ Corrections Apportées

### 1. Middleware d'Authentification Corrigé
- **Fichier** : `server/src/middleware/auth.middleware.ts`
- **Problèmes corrigés** :
  - Double vérification JWT + base de données
  - Vérification stricte des IDs utilisateur
  - Logs de débogage insuffisants

### 2. Service de Profil Frontend Amélioré
- **Fichier** : `kollecta/src/frontend/services/profile/profileService.ts`
- **Améliorations** :
  - Mapping correct des champs (`visibility` → `profileVisibility`, `description` → `profileDescription`)
  - Logs de débogage détaillés pour chaque requête
  - Gestion d'erreur améliorée avec Axios

## 🔍 Étapes de Débogage

### Étape 1 : Vérifier que le Serveur Fonctionne
```bash
# Le serveur doit être démarré sur le port 5000
cd server
npm run dev
```

### Étape 2 : Tester l'API Publique
```bash
# Cette route doit fonctionner
Invoke-WebRequest -Uri "http://localhost:5000/api" -Method GET
```

### Étape 3 : Tester l'API Protégée (sans token)
```bash
# Cette route doit renvoyer "Token manquant"
Invoke-WebRequest -Uri "http://localhost:5000/api/users/test/profile" -Method GET
```

### Étape 4 : Vérifier le Frontend
1. Ouvrez `http://localhost:3000/profile/edit`
2. Ouvrez les **DevTools** (F12)
3. Allez dans l'onglet **Console**
4. Essayez de modifier un champ et sauvegarder

## 📋 Logs à Vérifier

### Dans la Console Frontend
Vous devriez voir des logs comme :
```
🔍 profileService.updateProfile - Début de la requête
  - userId: 7cd8f52f-707d-4c0d-8b78-d2e094bf9d1e
  - token présent: OUI
  - token (début): eyJhbGciOiJIUzI1NiIs...
  - token (longueur): 123
  - données à envoyer: {firstName: "John", lastName: "Doe", ...}
  - URL complète: http://localhost:5000/api/users/7cd8f52f-707d-4c0d-8b78-d2e094bf9d1e/profile
```

### Dans la Console Backend (Terminal)
Vous devriez voir des logs comme :
```
🔍 Auth Middleware - Headers reçus: {authorization: "Bearer eyJhbGciOiJIUzI1NiIs...", 'content-type': 'application/json'}
🔍 Token extrait: eyJhbGciOiJIUzI1NiIs...
✅ JWT décodé avec succès: {userId: "7cd8f52f-707d-4c0d-8b78-d2e094bf9d1e", email: "user@example.com"}
✅ Authentification réussie pour: {id: "7cd8f52f-707d-4c0d-8b78-d2e094bf9d1e", email: "user@example.com", role: "USER"}
```

## 🚨 Problèmes Possibles et Solutions

### Problème 1 : Token Manquant
**Symptôme** : `{"message":"Token manquant"}`
**Solution** : Vérifiez que vous êtes bien connecté et que le token est stocké dans localStorage

### Problème 2 : Token Invalide
**Symptôme** : `{"message":"Token JWT invalide ou expiré"}`
**Solution** : Reconnectez-vous pour obtenir un nouveau token

### Problème 3 : Token Expiré
**Symptôme** : `{"message":"Token expiré"}`
**Solution** : Reconnectez-vous pour obtenir un nouveau token

### Problème 4 : Utilisateur Non Trouvé
**Symptôme** : `{"message":"Utilisateur non trouvé"}`
**Solution** : Vérifiez que l'ID utilisateur dans l'URL correspond à votre ID

## 🧪 Test Manuel

### Test avec Postman ou cURL
```bash
# Remplacez TOKEN_ICI par votre vrai token JWT
curl -H "Authorization: Bearer TOKEN_ICI" \
     -H "Content-Type: application/json" \
     -X GET \
     "http://localhost:5000/api/users/VOTRE_USER_ID/profile"
```

## 📝 Prochaines Étapes

1. **Redémarrez le serveur backend** si ce n'est pas déjà fait
2. **Reconnectez-vous** sur le frontend pour obtenir un nouveau token
3. **Ouvrez les DevTools** et vérifiez les logs dans la console
4. **Testez la modification du profil** et regardez les logs
5. **Vérifiez la console backend** pour voir les logs d'authentification

## 🔧 Si le Problème Persiste

1. **Vérifiez la base de données** : Le token est-il bien stocké ?
2. **Vérifiez les logs backend** : Y a-t-il des erreurs ?
3. **Vérifiez le token JWT** : Est-il valide sur jwt.io ?
4. **Vérifiez les headers** : Le token est-il bien envoyé ?

## 📞 Support

Si le problème persiste après avoir suivi ce guide, partagez :
- Les logs de la console frontend
- Les logs de la console backend
- L'erreur exacte reçue
- Le token JWT (partiellement pour la sécurité) 