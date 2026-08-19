# 🎯 KOLLECTA - Plateforme de Cagnottes Collaboratives

## 📋 Description

**KOLLECTA** est une plateforme moderne de financement participatif basée sur le système de **promesses de don**. Développée avec React, Node.js et PostgreSQL, la plateforme permet aux utilisateurs de créer des campagnes de financement (cagnottes), de s'engager via des promesses de don, et de gérer leurs comptes avec des fonctionnalités avancées de sécurité et de vérification d'identité.

### Concept Innovant : Les Promesses de Don

Contrairement aux plateformes traditionnelles, KOLLECTA fonctionne sur un système de **promesses de don** où les contributeurs s'engagent moralement à soutenir une cause. Les promesses sont comptabilisées dans le montant total de la cagnotte, créant ainsi un engagement communautaire fort avant même la réalisation effective des dons.

---

## 🏗️ Architecture Technique

### Frontend (React + Vite)
- **Framework** : React 18 avec TypeScript
- **Build Tool** : Vite pour un développement rapide
- **Styling** : Tailwind CSS + CSS Modules
- **State Management** : Redux Toolkit
- **UI Components** : Material-UI (MUI)
- **Icons** : Lucide React
- **Routing** : React Router v7

### Backend (Node.js + Express)
- **Runtime** : Node.js
- **Framework** : Express.js avec TypeScript
- **Database** : PostgreSQL avec Prisma ORM
- **Authentication** : JWT (JSON Web Tokens)
- **Email Service** : SendGrid
- **OCR & IA** : Tesseract.js, Google Gemini AI
- **File Upload** : Multer avec Sharp pour l'optimisation d'images

### Base de Données
- **SGBD** : PostgreSQL
- **ORM** : Prisma
- **Migrations** : Prisma Migrate
- **Schéma** : Modèles relationnels pour Users, Cagnottes, Promises, KYC, Reports, Notifications

---

## 🚀 Fonctionnalités Principales

### 💝 Système de Promesses de Don
- ✅ Création de promesses de don pour soutenir des cagnottes
- ✅ Gestion des statuts : PENDING, PAID, CANCELLED
- ✅ Suivi personnel de toutes les promesses
- ✅ Possibilité de marquer une promesse comme honorée
- ✅ Messages personnalisés avec chaque promesse
- ✅ Option d'anonymat pour les contributeurs
- ✅ Les promesses comptent dans le montant total de la cagnotte

### 🎁 Gestion des Cagnottes
- ✅ Création de cagnottes avec workflow en plusieurs étapes
- ✅ 17 catégories disponibles (Santé, Éducation, Urgences, Animaux, etc.)
- ✅ Upload d'images et vidéos de couverture
- ✅ Gestion des bénéficiaires (soi-même ou tiers)
- ✅ Suivi en temps réel du montant collecté
- ✅ Statuts : DRAFT, PENDING, ACTIVE, CLOSED, SUCCESS, FAILED, SUSPENDED
- ✅ Système de brouillons pour finaliser avant publication
- ✅ Découverte par catégories avec pages dédiées

### 👤 Gestion des Comptes Utilisateurs
- ✅ Inscription et connexion sécurisées
- ✅ Profils personnalisables avec photo et description
- ✅ Gestion des paramètres de sécurité
- ✅ Vérification d'email
- ✅ Désactivation temporaire de compte (récupérable)
- ✅ Suppression définitive de compte (irréversible)
- ✅ Gestion des préférences de notifications
- ✅ Support multilingue (FR/EN/AR)

### 🔐 Vérification d'Identité (KYC)
- ✅ Système de vérification KYC complet
- ✅ Upload de documents d'identité (Carte d'identité, Passeport)
- ✅ Analyse OCR avec Tesseract.js (support FR/EN/AR)
- ✅ Détection de faux documents avec Google Gemini AI
- ✅ Calcul de score de risque
- ✅ Vérification AML (Anti-Money Laundering)
- ✅ Audit trail complet des vérifications
- ✅ Statuts : PENDING, VERIFIED, REJECTED, BLOCKED, EXPIRED

### 🛡️ Modération et Signalements
- ✅ Système de signalement de cagnottes
- ✅ Analyse automatique des signalements avec IA
- ✅ Classification par type : FRAUD, INAPPROPRIATE, SPAM, DUPLICATE, COMMENT, OTHER
- ✅ Priorisation automatique : LOW, MEDIUM, HIGH, URGENT
- ✅ Gestion des signalements par les administrateurs
- ✅ Actions disponibles : Investigation, Résolution, Rejet, Blocage, Suppression

### 👨‍💼 Tableau de Bord Administrateur
- ✅ Dashboard avec statistiques en temps réel
- ✅ Gestion des utilisateurs (approbation, suspension, activation)
- ✅ Gestion des cagnottes (approbation, modification, suspension)
- ✅ Gestion des signalements avec workflow complet
- ✅ Analytics et rapports détaillés
- ✅ Logs d'administration pour traçabilité
- ✅ Paramètres système (maintenance, sécurité, notifications)

### 📧 Système de Notifications
- ✅ Notifications en temps réel
- ✅ Emails automatiques via SendGrid
- ✅ Notifications pour nouvelles promesses
- ✅ Rappels automatiques pour promesses en attente
- ✅ Alertes pour l'équipe KOLLECTA
- ✅ Préférences de notifications personnalisables
- ✅ Historique complet des notifications

### 🔍 Recherche et Découverte
- ✅ Recherche de cagnottes par mots-clés
- ✅ Filtrage par catégories
- ✅ Pages de découverte par catégorie
- ✅ Affichage des cagnottes populaires
- ✅ Navigation intuitive avec menu catégories

### 🎨 Interface Utilisateur
- ✅ Design moderne et élégant
- ✅ Interface responsive (mobile-first)
- ✅ Animations et transitions fluides
- ✅ Thème cohérent avec la charte graphique KOLLECTA
- ✅ Support multilingue
- ✅ Accessibilité optimisée

### 🔒 Sécurité Avancée
- ✅ Authentification JWT sécurisée
- ✅ Hachage des mots de passe avec bcrypt
- ✅ Validation des emails
- ✅ Gestion des sessions sécurisées
- ✅ Protection CSRF
- ✅ Rate limiting
- ✅ Blocage des comptes en cours de suppression
- ✅ Vérification KYC obligatoire pour certaines actions

---

## 📦 Installation et Configuration

### Prérequis
- Node.js 18+
- PostgreSQL 14+
- npm ou yarn
- Git

### 1. Cloner le Repository

```bash
git clone https://github.com/Sawssen19/PFE.git
cd PFE
```

### 2. Installer les Dépendances

Frontend :
```bash
cd kollecta
npm install
```

Backend :
```bash
cd ../server
npm install
```

### 3. Configuration de la Base de Données

Initialiser Prisma :
```bash
cd server
npx prisma generate
npx prisma db push
```

Optionnel — Seed de la base de données :
```bash
npm run seed
```

### 4. Variables d'Environnement

Créer un fichier `.env` dans le dossier `server` :

```env
# Base de données
DATABASE_URL="postgresql://username:password@localhost:5432/kollecta"

# JWT
JWT_SECRET="your-secret-key-change-in-production"

# SendGrid (Email)
SENDGRID_API_KEY="your-sendgrid-api-key"
SENDGRID_FROM_EMAIL="noreply@kollecta.com"

# Google Gemini AI (pour KYC)
GEMINI_API_KEY="your-gemini-api-key"

# Serveur
PORT=5000
NODE_ENV=development

# URLs
FRONTEND_URL="http://localhost:3000"
BACKEND_URL="http://localhost:5000"
```

### 5. Démarrer l'Application

Terminal 1 — Backend :
```bash
cd server
npm run dev
```

Terminal 2 — Frontend :
```bash
cd kollecta
npm run dev
```

---

## 🌐 URLs d'Accès

| Service | URL |
|---|---|
| Frontend | http://localhost:3000 |
| Backend API | http://localhost:5000 |
| Base de Données | localhost:5432 |
| Prisma Studio | `npx prisma studio` (dans le dossier `server`) |

---

## 📁 Structure du Projet

```
PFE/
├── .github/
│   └── workflows/            # Pipeline CI/CD GitHub Actions
│       └── ci-cd.yml
├── k8s/                      # Manifests Kubernetes Déclaratifs
│   ├── 00-namespace.yaml
│   ├── postgres.yaml
│   ├── backend.yaml
│   └── frontend.yaml
├── kollecta/                 # Frontend React
│   ├── src/
│   │   ├── components/       # Composants React réutilisables
│   │   ├── features/         # Services et logique métier
│   │   ├── pages/            # Pages de l'application
│   │   ├── router/           # Configuration routing
│   │   ├── store/            # Redux store
│   │   └── styles/           # Styles globaux
│   ├── Dockerfile            # Multi-stage build Nginx
│   └── package.json
├── server/                   # Backend Node.js
│   ├── src/
│   │   ├── modules/          # Modules de l'application
│   │   ├── services/         # Services métier
│   │   ├── middleware/       # Middleware Express
│   │   └── app.ts            # Point d'entrée
│   ├── prisma/
│   │   ├── schema.prisma     # Schéma Prisma
│   │   └── migrations/       # Migrations
│   ├── Dockerfile            # Multi-stage build Node
│   └── package.json
├── docker-compose.yml        # Orchestration locale
└── README.md
```

---

## 🎯 Développement en 5 Sprints

Le développement de KOLLECTA a été organisé en 5 sprints itératifs :

**Sprint 1 : Gestion des comptes**
- Architecture frontend/backend
- Authentification et gestion des utilisateurs
- Structure de base de données
- Interface de base

**Sprint 2 : Gestion des Cagnottes**
- Création et gestion des cagnottes
- Workflow multi-étapes
- Upload de médias
- Catégorisation

**Sprint 3 : Promesses de Don**
- Système de promesses de don
- Suivi des promesses
- Gestion des statuts
- Interface de contribution

**Sprint 4 : Notifications**
- Notifications avancées
- Emails via SendGrid

**Sprint 5 : Administration**
- Dashboard administrateur
- Analytics et statistiques
- Optimisations et polish

---

## 🧪 Scripts Disponibles

### Backend
```bash
npm run dev              # Démarrer en mode développement
npm run build            # Compiler TypeScript
npm start                # Démarrer en production
npm run seed              # Peupler la base de données
npm run prisma:generate   # Générer Prisma Client
npm run prisma:migrate    # Exécuter les migrations
npm run reminders:check   # Vérifier les rappels de promesses
```

### Frontend
```bash
npm run dev       # Démarrer le serveur de développement
npm run build     # Build de production
npm run preview   # Prévisualiser le build
npm run lint      # Linter le code
```

---

## 🔧 Technologies Utilisées

**Frontend**
- React 18
- TypeScript
- Vite
- Redux Toolkit
- Material-UI
- React Router
- Axios
- Lucide React

**Backend**
- Node.js
- Express.js
- TypeScript
- Prisma ORM
- PostgreSQL
- JWT
- SendGrid
- Tesseract.js
- Google Gemini AI
- Multer
- Sharp
- Node-cron

---

## 📊 Fonctionnalités Avancées

### Système de Rappels Automatiques
- Rappels automatiques pour promesses en attente
- Configuration via cron jobs
- Emails personnalisés

### Mode Maintenance
- Activation/désactivation du mode maintenance
- Page de maintenance personnalisable
- Bypass pour administrateurs

### Analytics et Reporting
- Statistiques en temps réel
- Suivi des performances
- Rapports détaillés pour administrateurs

---

## 🚀 DevOps & Infrastructure Cloud-Native

En complément du développement applicatif, KOLLECTA intègre une chaîne d'intégration et de livraison continues (CI/CD), une stratégie DevSecOps et une infrastructure d'orchestration et de monitoring de niveau entreprise.

### 🛠️ Architecture & Stack DevOps

```
 GitHub / Git  --->  GitHub Actions CI  --->  SonarCloud SAST
                                                     |
                                                     v
 Prometheus/Grafana <--- Minikube / K8s <--- Docker Hub (SemVer)
   (Monitoring)          (Deploy & Secrets)      Registry
```

### Outils & Technologies

- **Conteneurisation** : Docker, Builds Multi-stage, Docker Compose
- **CI/CD Pipeline** : GitHub Actions (Build, Test, Release SemVer v1.0.0)
- **DevSecOps** : SonarCloud (Analyse statique SAST), npm audit (Scan de dépendances SCA), Kubernetes Secrets
- **Orchestration** : Kubernetes (Minikube), Manifests déclaratifs (`k8s/`), PVC, Services (ClusterIP, NodePort)
- **Gestionnaire de Paquets** : Helm v3
- **Supervision & Observabilité** : Prometheus, Grafana, Node Exporter, Kube-State-Metrics

### ⚡ Déploiement DevOps Rapide

**1. Démarrage local avec Docker Compose**
```bash
docker-compose up --build -d
```

**2. Déploiement sur le cluster Kubernetes**
```bash
# Application des manifests Kubernetes
kubectl apply -f k8s/00-namespace.yaml
kubectl apply -f k8s/

# Migration de la base de données PostgreSQL
kubectl exec -it deployment/backend -n kollecta -- npx prisma db push
```

**3. Déploiement de la stack de Supervision (Prometheus & Grafana)**
```bash
# Installation via Helm
helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
helm repo update
helm install prometheus prometheus-community/kube-prometheus-stack -n monitoring

# Redirection de port pour accéder à Grafana
kubectl port-forward service/prometheus-grafana 3000:80 -n monitoring
```

---

## 🤝 Contribution

1. Fork le projet
2. Créer une branche feature (`git checkout -b feature/AmazingFeature`)
3. Commit les changements (`git commit -m 'Add some AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

---

## 📄 Licence

Ce projet est développé dans le cadre du Projet de Fin d'Études (PFE).

## 👨‍💻 Auteur

**Sawssen Yazidi** - [GitHub](https://github.com/Sawssen19)

## 📞 Support

Pour toute question ou problème :

- 📧 Email : sawssen.yazidi@hotmail.com
- 🐛 Issues : GitHub Issues

---

⭐ N'oubliez pas de donner une étoile au projet si vous l'aimez !
