# Module Cagnottes - Sprint 2

## 📋 Description

Le module Cagnottes gère la création, la gestion et le suivi des cagnottes collaboratives sur la plateforme KOLLECTA.

## 🏗️ Architecture

```
cagnottes/
├── cagnottes.controller.ts    # Contrôleur - Gestion des requêtes HTTP
├── cagnottes.service.ts       # Service - Logique métier
├── cagnottes.routes.ts        # Routes - Définition des endpoints
├── cagnotte.model.ts          # Types et interfaces TypeScript
└── README.md                  # Documentation
```

## 🚀 Endpoints API

### Routes Publiques (Lecture seule)
- `GET /api/cagnottes` - Récupérer toutes les cagnottes
- `GET /api/cagnottes/:id` - Récupérer une cagnotte par ID

### Routes Protégées (Authentification requise)
- `POST /api/cagnottes` - Créer une nouvelle cagnotte
- `PUT /api/cagnottes/:id` - Mettre à jour une cagnotte
- `DELETE /api/cagnottes/:id` - Supprimer une cagnotte
- `GET /api/cagnottes/user/my-cagnottes` - Récupérer les cagnottes de l'utilisateur

## 📊 Modèle de Données

### Cagnotte
```typescript
{
  id: string;
  title: string;
  description: string;
  goalAmount: number;
  currentAmount: number;
  startDate: Date;
  endDate: Date;
  status: 'DRAFT' | 'ACTIVE' | 'CLOSED' | 'SUCCESS' | 'FAILED' | 'PENDING' | 'REJECTED';
  creatorId: string;
  beneficiaryId: string;
  categoryId: string;
  coverImage?: string;
  coverVideo?: string;
  mediaType?: string;
  mediaFilename?: string;
  createdAt: Date;
  updatedAt: Date;
}
```

### Catégories Prédéfinies
- Solidarité
- Éducation
- Santé
- Environnement
- Culture
- Sport
- Entrepreneuriat
- Urgence
- Autre

## 🔧 Fonctionnalités

### ✅ Implémentées
- ✅ CRUD complet des cagnottes
- ✅ Pagination et filtres
- ✅ Gestion des autorisations (créateur uniquement)
- ✅ Calcul automatique des montants
- ✅ Gestion des catégories
- ✅ Vérification des cagnottes expirées

### 🚧 À venir (Sprint 3)
- 🚧 Gestion des promesses de dons
- 🚧 Système de notifications
- 🚧 Upload de médias (images/vidéos)
- 🚧 Système de rapports
- 🚧 Analytics et statistiques

## 🔐 Sécurité

- Authentification requise pour les opérations de modification
- Vérification des autorisations (seul le créateur peut modifier/supprimer)
- Validation des données d'entrée
- Protection contre les injections SQL (Prisma ORM)

## 📝 Exemples d'Utilisation

### Créer une cagnotte
```typescript
const newCagnotte = await cagnottesService.createCagnotte({
  title: "Aide pour les sinistrés",
  description: "Collecte pour aider les victimes des inondations",
  targetAmount: 5000,
  endDate: new Date("2024-12-31"),
  category: "Urgence",
  createdBy: "user-id"
});
```

### Récupérer les cagnottes avec filtres
```typescript
const cagnottes = await cagnottesService.getAllCagnottes({
  page: 1,
  limit: 10,
  category: "Solidarité",
  status: "ACTIVE"
});
```

## 🧪 Tests

Pour tester le module :

```bash
# Tester la création
curl -X POST http://localhost:5000/api/cagnottes \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test Cagnotte",
    "description": "Description de test",
    "targetAmount": 1000,
    "endDate": "2024-12-31",
    "category": "Solidarité"
  }'

# Tester la récupération
curl http://localhost:5000/api/cagnottes
```

## 🔗 Intégration

Le module s'intègre avec :
- **Module Auth** : Authentification et autorisation
- **Module KYC** : Vérification des utilisateurs
- **Module Admin** : Gestion administrative
- **Module Promesses** : Gestion des promesses de dons (à venir)

## 📈 Métriques

- Nombre total de cagnottes créées
- Montant total collecté
- Taux de réussite des cagnottes
- Temps moyen de collecte
- Catégories les plus populaires 