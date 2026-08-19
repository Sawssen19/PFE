# 🎯 KOLLECTA — Plateforme Fullstack & DevOps CI/CD

[![CI/CD Pipeline](https://img.shields.io/badge/GitHub_Actions-CI%2FCD-blue?logo=githubactions)](https://github.com/Sawssen19/PFE/actions)
[![SonarCloud Quality Gate](https://img.shields.io/badge/SonarCloud-Passed-brightgreen?logo=sonarcloud)](https://sonarcloud.io)
[![Docker](https://img.shields.io/badge/Docker-Containers-2496ED?logo=docker)](https://hub.docker.com)
[![Kubernetes](https://img.shields.io/badge/Kubernetes-Cluster-326CE5?logo=kubernetes)](http://localhost:8080)

## 📋 Description

**KOLLECTA** est une plateforme moderne de financement participatif basée sur un système innovant de **promesses de don**. Développée avec React, Node.js et PostgreSQL, la plateforme permet aux utilisateurs de créer des campagnes de financement (cagnottes), de s'engager via des promesses morales de don, et de gérer leurs comptes avec des fonctionnalités avancées de sécurité et de vérification d'identité (KYC).

Ce dépôt contient l'application complète ainsi qu'une **infrastructure cloud-native d'entreprise**, intégrant une chaîne d'intégration et de livraison continues (**GitHub Actions**), une stratégie DevSecOps (**SonarCloud**, `npm audit`) et un cluster d'orchestration **Kubernetes** avec monitoring avancé (**Prometheus / Grafana**).

![Interface Frontend KOLLECTA](docs/screenshots/frontend-app.png)

### Concept Innovant : Les Promesses de Don

Contrairement aux plateformes traditionnelles, KOLLECTA fonctionne sur un système de **promesses de don** où les contributeurs s'engagent moralement à soutenir une cause. Les promesses sont comptabilisées dans le montant total de la cagnotte, créant ainsi un engagement communautaire fort avant même la réalisation effective des dons.

---

## 🏗️ Architecture Technique (Application)

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

## 🏗️ Architecture DevOps

```text
       +-------------------+       +--------------------+       +--------------------+
       |  GitHub / Git     | ----> | GitHub Actions CI  | ----> |  SonarCloud SAST   |
       +-------------------+       +--------------------+       +--------------------+
                                             |
                                             v
       +-------------------+       +--------------------+       +--------------------+
       | Prometheus/Grafana| <---- | Minikube / K8s     | <---- |  Docker Hub (SemVer)
       |   (Monitoring)    |       | (Deploy & Secrets) |       |   Registry         |
       +-------------------+       +--------------------+       +--------------------+
```

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

### 🔒 Sécurité Avancée (Application)
- ✅ Authentification JWT sécurisée
- ✅ Hachage des mots de passe avec bcrypt
- ✅ Validation des emails
- ✅ Gestion des sessions sécurisées
- ✅ Protection CSRF
- ✅ Rate limiting
- ✅ Blocage des comptes en cours de suppression
- ✅ Vérification KYC obligatoire pour certaines actions

### 📊 Fonctionnalités Avancées

**Système de Rappels Automatiques**
- Rappels automatiques pour promesses en attente
- Configuration via cron jobs
- Emails personnalisés

**Mode Maintenance**
- Activation/désactivation du mode maintenance
- Page de maintenance personnalisable
- Bypass pour administrateurs

**Analytics et Reporting**
- Statistiques en temps réel
- Suivi des performances
- Rapports détaillés pour administrateurs

---

## 🔧 Technologies Utilisées

### Application Fullstack
**Frontend** : React 18, TypeScript, Vite, Redux Toolkit, Material-UI, Tailwind CSS, React Router, Axios, Lucide React
**Backend** : Node.js, Express.js, TypeScript, Prisma ORM, PostgreSQL, JWT, Multer, Sharp, Node-cron
**Services IA/OCR** : Tesseract.js (OCR KYC), Google Gemini AI (détection de fraude)
**Emailing** : SendGrid

### DevOps, CI/CD & Cloud Native
- **CI/CD Orchestration** : GitHub Actions (`.github/workflows/ci-cd.yml`)
- **Code Quality & Security (SAST/SCA)** : SonarCloud, `npm audit`, `security-scan.sh`
- **Conteneurisation** : Docker, Builds Multi-stage, Docker Compose
- **Registre d'images** : Docker Hub (tags SemVer)
- **Orchestration** : Kubernetes (Minikube), Manifests déclaratifs (`k8s/`), PVC, Services (ClusterIP, NodePort)
- **Gestionnaire de Paquets** : Helm v3
- **Monitoring & Observabilité** : Prometheus, Grafana, Node Exporter, Kube-State-Metrics

---

## ⚡ Prérequis

Avant de démarrer le projet, assure-toi d'avoir installé :

- Node.js 18+ & npm / yarn
- PostgreSQL 14+
- Git
- Docker Engine v24+ & Docker Compose
- Un compte GitHub (pour déclencher les workflows GitHub Actions)
- Un compte SonarCloud lié au dépôt (pour l'analyse SAST)
- Kubernetes (Minikube ou cluster K8s) & kubectl
- Helm v3+

---

## 🚀 Installation & Configuration

### 1. Cloner le Repository

```bash
git clone https://github.com/Sawssen19/PFE.git
cd PFE
```

### 2. Variables d'Environnement

Créer un fichier `.env` dans le dossier `server` :

```env
# Base de données
DATABASE_URL="postgresql://username:password@localhost:5432/kollecta"

# JWT
JWT_SECRET="your-super-secret-jwt-key"

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

### 3. Installation Locale (sans Docker)

Backend :
```bash
cd server
npm install
npx prisma generate
npx prisma db push
npm run dev
```

Optionnel — Seed de la base de données :
```bash
npm run seed
```

Frontend (dans un autre terminal) :
```bash
cd kollecta
npm install
npm run dev
```

### 4. Démarrage rapide avec Docker Compose

```bash
docker-compose up --build -d
```

### 5. Déploiement sur le cluster Kubernetes (Minikube)

```bash
# Application des manifests K8s
kubectl apply -f k8s/00-namespace.yaml
kubectl apply -f k8s/

# Migration de la base de données PostgreSQL
kubectl exec -it deployment/backend -n kollecta -- npx prisma db push
```

---

## 🌐 URLs d'Accès

| Service | URL / Commande |
|---|---|
| Frontend Web | http://localhost:8080 (ou http://localhost:3000) |
| Backend API | http://localhost:5000 |
| Database | localhost:5432 (PostgreSQL) |
| Prisma Studio | `npx prisma studio` (dans `/server`) |
| GitHub Actions | https://github.com/Sawssen19/PFE/actions |
| SonarCloud | https://sonarcloud.io |
| Grafana Dashboard | `kubectl port-forward service/prometheus-grafana 3000:80 -n monitoring` |

---

## 📁 Structure du Projet

```
PFE/
├── .github/
│   └── workflows/            # Pipeline CI/CD GitHub Actions
│       └── ci-cd.yml
├── k8s/                      # Manifests Kubernetes Déclaratifs
│   ├── 00-namespace.yaml
│   ├── 01-config-secrets.yaml
│   ├── 02-postgres.yaml
│   ├── 03-backend.yaml
│   └── 04-frontend.yaml
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
├── docs/
│   └── screenshots/          # Captures d'écran (Actions, SonarCloud, Grafana...)
├── security-scan.sh          # Script de scan de dépendances (SCA)
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

## 🐳 Docker

L'application utilise des builds multi-stage pour optimiser la taille des images et la sécurité en production.

Commandes utiles :
```bash
# Voir les conteneurs en cours d'exécution
docker ps

# Consulter les logs backend / frontend
docker-compose logs -f backend
docker-compose logs -f frontend
```

---

## ⚙️ CI/CD Pipeline (GitHub Actions)

Le workflow GitHub Actions (`.github/workflows/ci-cd.yml`) automatise le cycle de vie applicatif :

1. **Lint & Test** : Validation du code React et Node.js.
2. **Security Scan (SAST & SCA)** : Analyse du code sur SonarCloud et scan de vulnérabilités des dépendances.
3. **Build & Push Docker** : Génération des images multi-stage et push sur Docker Hub (tags SemVer).
4. **Deploy to Kubernetes** : Application automatique des manifests déclaratifs K8s.

![GitHub Actions CI/CD Pipeline](docs/screenshots/github-actions.png)

---

## 🛡️ DevSecOps & Sécurité

- **SonarCloud** : Analyse statique continue (SAST) pour détecter bugs, Smells et vulnérabilités.
- **Dependency Scan** : Détection automatique des failles via `npm audit` et le script `security-scan.sh`.
- **Kubernetes Secrets** : Chiffrement et isolation des identifiants sensibles et clés d'API dans K8s.
- **Principe du moindre privilège** : Conteneurs exécutés sans privilèges root.

![SonarCloud Quality Gate](docs/screenshots/sonarcloud.png)

---

## 📦 Docker Hub

Docker Hub sert de registre public/privé d'images pour l'application :

- Images Frontend et Backend taguées par version (SemVer) à chaque build validé.
- Pull automatique par Kubernetes lors du déploiement (`Deploy to Kubernetes`).

---

## ☸️ Kubernetes

La stack est déployée dans un namespace isolé `kollecta` à l'aide de manifests Kubernetes déclaratifs.

Structure des manifests (`k8s/`) :

- `00-namespace.yaml` : Isolation du cluster
- `01-config-secrets.yaml` : ConfigMaps & Secrets (base de données, JWT, clés API)
- `02-postgres.yaml` : StatefulSet / Deployment PostgreSQL avec PVC (Persistent Volume Claim)
- `03-backend.yaml` : Deployment Backend Express + Service ClusterIP
- `04-frontend.yaml` : Deployment Frontend Nginx + Service NodePort

![Pods & Services Kubernetes](docs/screenshots/kubernetes-pods.png)

---

## 📊 Monitoring & Observabilité

Monitoring du cluster via la stack Prometheus & Grafana installée par Helm :

```bash
# Installation via Helm
helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
helm repo update
helm install prometheus prometheus-community/kube-prometheus-stack -n monitoring

# Accéder à Grafana
kubectl port-forward service/prometheus-grafana 3000:80 -n monitoring
```

Métriques suivies dans Grafana :
- Utilisation CPU / RAM des Pods Kubernetes.
- Taux de requêtes et latence HTTP du Backend.
- Santé et performances de la base de données PostgreSQL.

![Grafana Monitoring Dashboard](docs/screenshots/grafana-dashboard.png)

---

## 🔄 CI/CD Pipeline Summary

| Étape | Outil | Action |
|---|---|---|
| Source | GitHub | Déclenchement automatique sur push/commit |
| Build & Test | GitHub Actions / npm | Compilation TypeScript & exécution des tests |
| Quality Gate | SonarCloud | Scan de sécurité SAST/SCA & validation des seuils |
| Registry | Docker Hub | Tagging SemVer et stockage des images conteneurisées |
| CD / Orchestration | Kubernetes | Déploiement sans interruption de service (Rolling Update) |
| Observabilité | Prometheus / Grafana | Collecte de métriques et alertes en temps réel |

---

## 💡 Lessons Learned

Durant la réalisation et l'implémentation de ce projet DevOps fullstack, plusieurs compétences et retours d'expérience majeurs ont été acquis :

- **Automation CI/CD** : Mise en place d'une chaîne CI/CD fluide avec GitHub Actions, de la validation du code au déploiement.
- **DevSecOps** : Intégration de la sécurité dès le début de la chaîne avec SonarCloud et des scans automatiques de dépendances.
- **Conteneurisation & Kubernetes** : Maîtrise du déploiement conteneurisé multi-services (Frontend, Backend, PostgreSQL) et orchestration déclarative avec K8s.
- **Supervision** : Mise en place d'une observabilité complète du cluster avec Prometheus et Grafana.

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

- 📧 Email : sawssen.yazidi@sesame.com.tn
- 🐛 Issues : GitHub Issues

---

⭐ N'oubliez pas de donner une étoile au projet si vous l'aimez !

---

## 💻 Mettre à jour ce README sur ton dépôt

```bash
git add README.md docs/screenshots
git commit -m "docs: README final avec captures d'écran CI/CD et monitoring"
git push origin master
```
