/**
 * Exemple d'utilisation du service Patient dans Vue
 */

import { ref } from 'vue'
import { patientService } from '../api/services/patientService.js'

/**
 * Composable pour gérer les patients
 */
export const usePatients = () => {
  const patients = ref([])
  const loading = ref(false)
  const error = ref(null)

  /**
   * Charger tous les patients
   */
  const loadPatients = async () => {
    loading.value = true
    error.value = null

    try {
      patients.value = await patientService.getAll()
    } catch (err) {
      error.value = err.message
      console.error('Erreur lors du chargement des patients:', err)
    } finally {
      loading.value = false
    }
  }

  /**
   * Créer un nouveau patient
   */
  const createPatient = async (patientData) => {
    loading.value = true
    error.value = null

    try {
      const newPatient = await patientService.create(patientData)
      patients.value.push(newPatient)
      return newPatient
    } catch (err) {
      error.value = err.message
      console.error('Erreur lors de la création du patient:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  /**
   * Modifier un patient
   */
  const updatePatient = async (id, patientData) => {
    loading.value = true
    error.value = null

    try {
      const updated = await patientService.update(id, patientData)
      const index = patients.value.findIndex(p => p.id === id)
      if (index !== -1) {
        patients.value[index] = updated
      }
      return updated
    } catch (err) {
      error.value = err.message
      console.error('Erreur lors de la modification du patient:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  /**
   * Supprimer un patient
   */
  const deletePatient = async (id) => {
    loading.value = true
    error.value = null

    try {
      await patientService.delete(id)
      patients.value = patients.value.filter(p => p.id !== id)
    } catch (err) {
      error.value = err.message
      console.error('Erreur lors de la suppression du patient:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    patients,
    loading,
    error,
    loadPatients,
    createPatient,
    updatePatient,
    deletePatient
  }
}

export default usePatients
