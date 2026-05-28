<template>
  <div class="patients-container">
    <h1>Gestion des Patients</h1>

    <!-- États de chargement et erreurs -->
    <div v-if="loading" class="loading">⏳ Chargement...</div>
    <div v-if="error" class="error">❌ Erreur: {{ error }}</div>

    <!-- Formulaire de création -->
    <form @submit.prevent="handleCreatePatient" class="patient-form">
      <h2>Ajouter un patient</h2>
      
      <input
        v-model="formData.numeroChambre"
        type="text"
        placeholder="Numéro de chambre"
        required
      />
      
      <input
        v-model="formData.nom"
        type="text"
        placeholder="Nom"
        required
      />
      
      <input
        v-model="formData.prenom"
        type="text"
        placeholder="Prénom"
        required
      />
      
      <input
        v-model.number="formData.etage"
        type="number"
        placeholder="Étage"
        required
      />
      
      <select v-model="formData.statut" required>
        <option value="">-- Sélectionnez un statut --</option>
        <option value="AMBULATOIRE">Ambulatoire</option>
        <option value="CONGE">Congé</option>
        <option value="HOSPITALISE">Hospitalisé</option>
        <option value="DECES">Décès</option>
      </select>
      
      <button type="submit">Créer le patient</button>
    </form>

    <!-- Liste des patients -->
    <div class="patients-list">
      <h2>Liste des patients ({{ patients.length }})</h2>
      
      <table v-if="patients.length > 0">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nom</th>
            <th>Prénom</th>
            <th>Chambre</th>
            <th>Étage</th>
            <th>Statut</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="patient in patients" :key="patient.id">
            <td>{{ patient.id }}</td>
            <td>{{ patient.nom }}</td>
            <td>{{ patient.prenom }}</td>
            <td>{{ patient.numeroChambre }}</td>
            <td>{{ patient.etage }}</td>
            <td>{{ patient.statut }}</td>
            <td>
              <button @click="handleDeletePatient(patient.id)">Supprimer</button>
            </td>
          </tr>
        </tbody>
      </table>
      
      <p v-else class="no-patients">Aucun patient trouvé</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { usePatients } from '../composables/usePatients.js'

// Utiliser le composable
const { patients, loading, error, loadPatients, createPatient, deletePatient } = usePatients()

// État du formulaire
const formData = ref({
  numeroChambre: '',
  nom: '',
  prenom: '',
  etage: 1,
  statut: 'AMBULATOIRE',
  categorie: 'CAT1',
  profil: 'Nouveau patient',
  tempsToiletteLit: 20,
  tempsToiletteVasque: 15,
  tempsToiletteMoyen: 17,
  tempsWcMoyen: 10,
  tempsCoucherMoyen: 15,
  aideSoignant: false,
  petitDejeunerAide: false,
  sansDouche: false
})

// Charger les patients au montage du composant
onMounted(() => {
  loadPatients()
})

// Créer un patient
const handleCreatePatient = async () => {
  try {
    await createPatient(formData.value)
    
    // Réinitialiser le formulaire
    formData.value = {
      numeroChambre: '',
      nom: '',
      prenom: '',
      etage: 1,
      statut: 'AMBULATOIRE',
      categorie: 'CAT1',
      profil: 'Nouveau patient',
      tempsToiletteLit: 20,
      tempsToiletteVasque: 15,
      tempsToiletteMoyen: 17,
      tempsWcMoyen: 10,
      tempsCoucherMoyen: 15,
      aideSoignant: false,
      petitDejeunerAide: false,
      sansDouche: false
    }
    
    alert('✅ Patient créé avec succès!')
  } catch (err) {
    console.error('Erreur:', err)
  }
}

// Supprimer un patient
const handleDeletePatient = async (id) => {
  if (confirm('Êtes-vous sûr de vouloir supprimer ce patient ?')) {
    try {
      await deletePatient(id)
      alert('✅ Patient supprimé!')
    } catch (err) {
      console.error('Erreur:', err)
    }
  }
}
</script>

<style scoped>
.patients-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

h1 {
  color: #333;
  border-bottom: 3px solid #007bff;
  padding-bottom: 10px;
}

h2 {
  color: #555;
  margin-top: 30px;
}

.loading, .error {
  padding: 15px;
  border-radius: 5px;
  margin: 20px 0;
  font-weight: bold;
}

.loading {
  background: #e3f2fd;
  color: #1976d2;
}

.error {
  background: #ffebee;
  color: #c62828;
}

.patient-form {
  background: #f5f5f5;
  padding: 20px;
  border-radius: 8px;
  margin: 20px 0;
  display: grid;
  gap: 15px;
}

input, select {
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
}

input:focus, select:focus {
  outline: none;
  border-color: #007bff;
  box-shadow: 0 0 5px rgba(0, 123, 255, 0.3);
}

button {
  padding: 10px 20px;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
}

button:hover {
  background: #0056b3;
}

button.delete {
  background: #dc3545;
}

button.delete:hover {
  background: #c82333;
}

table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
  background: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

th, td {
  padding: 12px;
  text-align: left;
  border-bottom: 1px solid #ddd;
}

th {
  background: #007bff;
  color: white;
  font-weight: bold;
}

tr:hover {
  background: #f9f9f9;
}

.no-patients {
  text-align: center;
  color: #999;
  padding: 30px;
  font-style: italic;
}
</style>
