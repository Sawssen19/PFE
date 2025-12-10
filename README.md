# 🚀 **KOLLECTA - Plateforme de Crowdfunding**

## 📋 **Description**

Kollecta est une plateforme moderne de crowdfunding inspirée de KOLLECTA, développée avec React, Node.js, et PostgreSQL. La plateforme permet aux utilisateurs de créer des campagnes de financement, faire des dons, et gérer leurs comptes avec des fonctionnalités avancées de sécurité.

## 🏗️ **Architecture**

### **Frontend (React + Vite)**
- **Framework** : React 18 avec TypeScript
- **Build Tool** : Vite
- **Styling** : Tailwind CSS + CSS Modules
- **State Management** : Redux Toolkit
- **UI Components** : Material-UI (MUI)
- **Icons** : Lucide React

### **Backend (Node.js + Express)**
- **Runtime** : Node.js
- **Framework** : Express.js
- **Language** : TypeScript
- **Database** : PostgreSQL avec Prisma ORM
- **Authentication** : JWT (JSON Web Tokens)
- **Email Service** : SendGrid

### **Base de Données**
- **SGBD** : PostgreSQL
- **ORM** : Prisma
- **Migrations** : Prisma Migrate

## 🚀 **Fonctionnalités Principales**

### **👤 Gestion des Comptes**
- ✅ Inscription et connexion sécurisées
- ✅ Profils personnalisables
- ✅ Gestion des paramètres de sécurité
- ✅ **Désactivation temporaire de compte** (récupérable)
- ✅ **Suppression définitive de compte** (irréversible)

### **🔐 Sécurité Avancée**
- ✅ Authentification JWT
- ✅ Hachage des mots de passe (bcrypt)
- ✅ Validation des emails
- ✅ Gestion des sessions sécurisées
- ✅ Blocage des comptes en cours de suppression

### **📧 Système de Notifications**
- ✅ Emails automatiques via SendGrid
- ✅ Notifications en temps réel
- ✅ Alertes pour l'équipe Kollecta
- ✅ Confirmations de demandes de compte

### **🎨 Interface Utilisateur**
- ✅ Design moderne de KOLLECTA
- ✅ Interface responsive (mobile-first)
- ✅ Animations et transitions fluides
- ✅ Thème personnalisable
- ✅ Support multilingue (FR/EN/AR)

## 🛠️ **Installation et Configuration**

### **Prérequis**
- Node.js 18+ 
- PostgreSQL 14+
- npm ou yarn

### **1. Cloner le Repository**
```bash
git clone https://github.com/Sawssen19/PFE.git
cd PFE
```

### **2. Installer les Dépendances**
```bash
# Frontend
cd kollecta
npm install

# Backend
cd ../server
npm install
```

### **3. Configuration de la Base de Données**
```bash
cd server
npx prisma generate
npx prisma db push
```

### **4. Variables d'Environnement**
Créer un fichier `.env` dans le dossier `server` :
```env
DATABASE_URL="postgresql://username:password@localhost:5432/kollecta"
JWT_SECRET="your-secret-key"
SENDGRID_API_KEY="your-sendgrid-api-key"
```

### **5. Démarrer l'Application**
```bash
# Terminal 1 - Backend
cd server
npm run dev

# Terminal 2 - Frontend
cd kollecta
npm run dev
```

## 🌐 **URLs d'Accès**
- **Frontend** : http://localhost:3000
- **Backend** : http://localhost:5000
- **Base de Données** : localhost:5432

## 📱 **Fonctionnalités de Compte**

### **Désactivation Temporaire**
- ✅ L'utilisateur peut désactiver son compte temporairement
- ✅ Déconnexion automatique après désactivation
- ✅ Possibilité de se reconnecter à tout moment
- ✅ Message de bienvenue lors de la reconnexion
- ✅ Notification à l'équipe Kollecta

### **Suppression Définitive**
- ✅ Processus de suppression sécurisé
- ✅ Confirmation en deux étapes (texte + mot de passe)
- ✅ Blocage immédiat de la connexion
- ✅ Notification à l'équipe Kollecta
- ✅ Processus irréversible

## 🔧 **Structure du Projet**

```
PFE/
├── kollecta/                 # Frontend React
│   ├── src/
│   │   ├── components/       # Composants React
│   │   ├── services/         # Services API
│   │   ├── store/           # Redux store
│   │   └── styles/          # Fichiers CSS
│   └── package.json
├── server/                   # Backend Node.js
│   ├── src/
│   │   ├── modules/         # Modules de l'application
│   │   ├── services/        # Services (email, etc.)
│   │   ├── middleware/      # Middleware Express
│   │   └── app.ts          # Point d'entrée
│   ├── prisma/              # Schéma et migrations DB
│   └── package.json
└── README.md
```

## 🧪 **Tests**

### **Scripts de Test Disponibles**
- `test-deactivation.js` - Test de désactivation de compte
- `test-login-logic.js` - Test de la logique de connexion
- `emergency-unblock.js` - Déblocage d'urgence d'un compte

## 🚨 **Gestion des Erreurs**

### **Comptes Bloqués**
- ✅ Détection automatique des demandes en cours
- ✅ Messages d'erreur clairs et informatifs
- ✅ Redirection appropriée selon le type de demande
- ✅ Logs détaillés pour le débogage

### **Récupération d'Urgence**
- ✅ Scripts de déblocage automatique
- ✅ Nettoyage des demandes orphelines
- ✅ Restauration de l'accès utilisateur

## 🤝 **Contribution**

1. Fork le projet
2. Créer une branche feature (`git checkout -b feature/AmazingFeature`)
3. Commit les changements (`git commit -m 'Add some AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

## 📄 **Licence**

Ce projet est développé dans le cadre du Projet de Fin d'Études (PFE).

## 👨‍💻 **Auteur**

**Sawssen Yazidi** - [GitHub](https://github.com/Sawssen19)

## 📞 **Support**

Pour toute question ou problème :
- 📧 Email : sawssen.yazidi@sesame.com.tn
- 🐛 Issues : [GitHub Issues](https://github.com/Sawssen19/PFE/issues)

---

**⭐ N'oubliez pas de donner une étoile au projet si vous l'aimez !** 