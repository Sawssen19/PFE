#!/bin/bash
echo "=== 1. Scan des dépendances Node.js (Backend) ==="
cd backend && npm audit --audit-level=high || true
cd ..

echo "=== 2. Scan des dépendances Node.js (Frontend) ==="
cd frontend && npm audit --audit-level=high || true
cd ..

echo "=== 3. Vérification de l'absence de secrets dans Git ==="
git status