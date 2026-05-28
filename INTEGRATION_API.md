# 🎯 Architecture API Frontend - Configuration Centralisée

## 📋 Vue d'ensemble

Cette architecture permet de :
- ✅ Garder une **base URL unique** (`http://localhost:8081`)
- ✅ Changer dynamiquement les **endpoints** (`/api/patients`, `/api/alertes`, etc.)
- ✅ Gérer facilement les **environnements** (dev, prod)
- ✅ Réutiliser les **appels API** dans toute l'application

---

## 📁 Structure des fichiers créés

```
src/
├── api/
│   ├── config.js                    # Configuration centralisée
│   ├── client.js                    # Client HTTP générique
│   └── services/
│       └── patientService.js        # Service Patient
├── composables/
│   ├── usePatients.js               # Composable Vue pour gérer les patients
│   └── useCharge.js                 # Existant
├── components/
│   └── PatientsManager.vue          # Exemple de composant
└── ...

.env.local                           # Var d'env développement
.env.production                      # Var d'env production
```

---

## 🚀 How to Use

### 1️⃣ Dans un composant Vue

```vue
<template>
  <div>
    <button @click="loadPatients">Charger les patients</button>
    <p v-if="loading">Chargement...</p>
    <ul>
      <li v-for="patient in patients" :key="patient.id">
        {{ patient.nom }} {{ patient.prenom }} (Chambre: {{ patient.numeroChambre }})
      </li>
    </ul>
  </div>
</template>

<script setup>
import { usePatients } from '@/composables/usePatients'

const { patients, loading, loadPatients } = usePatients()
</script>
```

### 2️⃣ Créer un patient

```javascript
import { usePatients } from '@/composables/usePatients'

const { createPatient } = usePatients()

const newPatient = {
  numeroChambre: '102',
  nom: 'Martin',
  prenom: 'Pierre',
  etage: 1,
  statut: 'AMBULATOIRE',
  categorie: 'CAT1',
  profil: 'Patient autonome',
  tempsToiletteLit: 20,
  tempsToiletteVasque: 15,
  // ... autres champs
}

await createPatient(newPatient)
```

### 3️⃣ Modifier une URL API

**Changez simplement dans `.env.local` :**

```env
# Développement local
VITE_API_BASE_URL=http://localhost:8081

# Production
VITE_API_BASE_URL=https://api.ehpad-agir.com
```

**Zéro changement de code requis !** ✅

---

## 🔧 Créer un service pour d'autres ressources

### Exemple : Service d'Alertes

```javascript
// src/api/services/alerteService.js

import { apiClient } from '../client.js'
import { API_CONFIG } from '../config.js'

export const alerteService = {
  getAll: () => apiClient.get(API_CONFIG.ENDPOINTS.ALERTES),
  getById: (id) => apiClient.get(API_CONFIG.ENDPOINTS.ALERTES, { id }),
  create: (data) => apiClient.post(API_CONFIG.ENDPOINTS.ALERTES, data),
  update: (id, data) => apiClient.put(API_CONFIG.ENDPOINTS.ALERTES, data, { id }),
  delete: (id) => apiClient.delete(API_CONFIG.ENDPOINTS.ALERTES, { id }),
  getUnresolved: () => apiClient.get(`${API_CONFIG.ENDPOINTS.ALERTES}/unresolved`),
  getResolved: () => apiClient.get(`${API_CONFIG.ENDPOINTS.ALERTES}/resolved`)
}

export default alerteService
```

### Puis créer un composable :

```javascript
// src/composables/useAlertes.js

import { ref } from 'vue'
import alerteService from '../api/services/alerteService.js'

export const useAlertes = () => {
  const alertes = ref([])
  const loading = ref(false)

  const loadAlertes = async () => {
    loading.value = true
    try {
      alertes.value = await alerteService.getAll()
    } finally {
      loading.value = false
    }
  }

  return { alertes, loading, loadAlertes }
}
```

---

## 📚 Endpoints disponibles

Tous les endpoints du backend sont disponibles dans `API_CONFIG.ENDPOINTS` :

```javascript
import { API_CONFIG } from '@/api/config.js'

console.log(API_CONFIG.ENDPOINTS)
// {
//   PATIENTS: '/patients',
//   ALERTES: '/alertes',
//   AIDES_SOIGNANTS: '/aides-soignants',
//   EXECUTIONS: '/executions',
//   PLANNINGS: '/plannings',
//   NOTES: '/notes',
//   TYPES_SOINS: '/types-soins',
//   PING: '/ping'
// }
```

---

## 🔑 Variables d'environnement

### `.env.local` (Développement)
```env
VITE_API_BASE_URL=http://localhost:8081
```

### `.env.production` (Production)
```env
VITE_API_BASE_URL=https://api.ehpad-agir.com
```

**Accédez-les dans le code :**
```javascript
const apiUrl = import.meta.env.VITE_API_BASE_URL
```

---

## ✨ Avantages de cette architecture

| Avantage | Description |
|----------|------------|
| **Centralisé** | Une seule source de vérité pour l'API |
| **Flexible** | Changez l'URL sans modifier le code |
| **Réutilisable** | Importez le service partout |
| **Maintenable** | Facile d'ajouter de nouveaux services |
| **Typé** | Bien structuré et documenté |
| **Scalable** | Prêt pour une grosse application |

---

## 🧪 Tester

Démarrez le frontend :

```bash
npm run dev
```

Accédez à http://localhost:5173 (Vite dev server)

L'API se connectera automatiquement à `http://localhost:8081` ✅

---

## 📝 Notes importantes

1. **CORS** : Assurez-vous que le backend accepte les requêtes du frontend
2. **En production** : Vérifiez que le domaine API en production est correct
3. **Erreurs** : Toutes les erreurs sont loggées dans la console
4. **Cache** : Pour ajouter du cache, modifiez `client.js`

---

## 🚀 Prochaines étapes

1. Créez d'autres services (AlerteService, NoteService, etc.)
2. Créez des composables correspondants
3. Intégrez dans vos composants Vue
4. Testez avec le backend EHPAD en cours d'exécution

Bon développement ! 🎉
