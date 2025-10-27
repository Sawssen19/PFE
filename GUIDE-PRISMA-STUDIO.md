# 📖 GUIDE RAPIDE - Restauration des Images via Prisma Studio

## 🔗 Liens Importants

- **Prisma Studio** : http://localhost:5556
- **Voir une image** : http://localhost:5000/uploads/cagnottes/NOMFICHIER
- **Page de recherche** : http://localhost:3000/search

---

## ✍️ Ce qu'il faut remplir pour chaque cagnotte

Pour chaque cagnotte, vous devez remplir **3 champs** :

| Champ | Format | Exemple |
|-------|--------|---------|
| `coverImage` | `/uploads/cagnottes/NOMFICHIER` | `/uploads/cagnottes/cagnotte-1756762372300-783956777.jpg` |
| `mediaType` | `image` | `image` |
| `mediaFilename` | `NOMFICHIER` | `cagnotte-1756762372300-783956777.jpg` |

---

## 📋 LISTE DES 42 FICHIERS DISPONIBLES

### Images JPG (6 fichiers)
```
cagnotte-1756736024250-830349441.jpg    (190 KB)
cagnotte-1756741582578-570585745.jpg    (224 KB)
cagnotte-1756741942146-211819055.jpg    (224 KB)
cagnotte-1756742904446-78543671.jpg     (28 KB)
cagnotte-1756742982013-126028607.jpg    (351 KB)
cagnotte-1756762372300-783956777.jpg    (521 KB)
cagnotte-1756819001269-386167634.jpg    (1041 KB)
```

### Images PNG (10 fichiers)
```
cagnotte-1756763153902-474581180.png    (166 KB)
cagnotte-1756814268463-821699025.png    (327 KB)
cagnotte-1756814271764-74033342.png     (327 KB)
cagnotte-1756814272480-74340800.png     (327 KB)
cagnotte-1756814368651-170814819.png    (327 KB)
cagnotte-1756816346050-803171990.png    (1141 KB)
cagnotte-1756817280533-460824320.png    (5977 KB)
cagnotte-1756907958152-187289082.png    (1199 KB)
cagnotte-1758574631216-421657322.png    (1036 KB)
cagnotte-1758574644833-822046776.png    (1036 KB)
cagnotte-1758574649879-75542172.png     (1036 KB)
cagnotte-1758574655214-607194943.png    (1036 KB)
cagnotte-1758574657561-469015710.png    (1036 KB)
cagnotte-1758574657918-825005435.png    (1036 KB)
cagnotte-1758574664524-638329152.png    (1036 KB)
cagnotte-1758574669228-11152202.png     (1036 KB)
cagnotte-1758574670591-622292429.png    (1036 KB)
cagnotte-1758574670772-518676412.png    (1036 KB)
```

### Images WEBP (16 fichiers - 24 KB chacun)
```
cagnotte-1760444673853-830605882.webp
cagnotte-1760444675514-127621389.webp
cagnotte-1760444680093-717817457.webp
cagnotte-1760444682993-543755068.webp
cagnotte-1760444686425-580998618.webp
cagnotte-1760444688264-707842906.webp
cagnotte-1760444689912-955275396.webp
cagnotte-1760444693263-50649441.webp
cagnotte-1760444696231-618261027.webp
cagnotte-1760444704086-201526240.webp
cagnotte-1760444706197-66710083.webp
cagnotte-1760444711009-540539343.webp
cagnotte-1760444713762-641632825.webp
cagnotte-1760444718443-909492466.webp
cagnotte-1760444718511-49189955.webp
cagnotte-1760453170989-180016106.webp  ← "save my cat"
```

### Image JPEG (1 fichier)
```
cagnotte-1756908100803-773429667.jpeg   (76 KB)
```

---

## 💡 ASTUCE : Comment voir une image

Pour savoir à quoi ressemble un fichier, ouvrez dans votre navigateur :

```
http://localhost:5000/uploads/cagnottes/NOMFICHIER
```

**Exemple :**
```
http://localhost:5000/uploads/cagnottes/cagnotte-1756762372300-783956777.jpg
```

---

## ✅ PROCÉDURE ÉTAPE PAR ÉTAPE

1. **Ouvrir Prisma Studio** : http://localhost:5556
2. **Cliquer sur "Cagnotte"** dans le menu de gauche
3. **Chercher** votre cagnotte (utilisez la barre de recherche)
4. **Cliquer sur la ligne** de la cagnotte
5. **Remplir les 3 champs** :
   - `coverImage` : `/uploads/cagnottes/NOMFICHIER`
   - `mediaType` : `image`
   - `mediaFilename` : `NOMFICHIER`
6. **Cliquer sur "Save 1 change"** (bouton vert en bas)
7. **Vérifier** sur http://localhost:3000/search

---

## ⚠️ ATTENTION

- ✅ Copiez-collez les noms de fichiers (ne les tapez pas)
- ✅ N'oubliez pas `/uploads/cagnottes/` au début de `coverImage`
- ✅ Le nom dans `coverImage` et `mediaFilename` doit être EXACTEMENT le même
- ✅ `mediaType` est toujours `image` (sauf si c'est une vidéo)

---

## 🎯 EXEMPLE COMPLET

**Pour la cagnotte "SPORT" :**

| Champ | Valeur |
|-------|--------|
| `coverImage` | `/uploads/cagnottes/cagnotte-1756762372300-783956777.jpg` |
| `mediaType` | `image` |
| `mediaFilename` | `cagnotte-1756762372300-783956777.jpg` |

---

## 📊 SUIVI

Cochez au fur et à mesure que vous restaurez :

- [ ] save my cat ✅ (déjà fait)
- [ ] SPORT
- [ ] test 22
- [ ] CELEST
- [ ] Cagnotte test
- [ ] test 1
- [ ] beja education
- [ ] culture 01
- [ ] (autres cagnottes importantes...)

---

**Bon courage ! 💪 Ça ira plus vite que vous ne le pensez !**

