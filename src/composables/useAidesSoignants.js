/**
 * Composable pour gérer les aides-soignants
 */

import { ref } from 'vue'
import { aideSoignantService } from '../api/services/aideSoignantService.js'

/**
 * Composable pour gérer les aides-soignants
 */
export const useAidesSoignants = () => {
  const aidesSoignants = ref([])
  const loading = ref(false)
  const error = ref(null)

  /**
   * Charger tous les aides-soignants
   */
  const loadAidesSoignants = async () => {
    loading.value = true
    error.value = null

    try {
      aidesSoignants.value = await aideSoignantService.getAll()
    } catch (err) {
      error.value = err.message
      console.error('Erreur lors du chargement des aides-soignants:', err)
    } finally {
      loading.value = false
    }
  }

  /**
   * Créer un nouveau aide-soignant
   */
  const createAideSoignant = async (aideSoignantData) => {
    loading.value = true
    error.value = null

    try {
      const newAideSoignant = await aideSoignantService.create(aideSoignantData)
      aidesSoignants.value.push(newAideSoignant)
      return newAideSoignant
    } catch (err) {
      error.value = err.message
      console.error('Erreur lors de la création de l\'aide-soignant:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  /**
   * Mettre à jour un aide-soignant
   */
  const updateAideSoignant = async (id, aideSoignantData) => {
    loading.value = true
    error.value = null

    try {
      const updatedAideSoignant = await aideSoignantService.update(id, aideSoignantData)
      const index = aidesSoignants.value.findIndex(as => as.id === id)
      if (index !== -1) {
        aidesSoignants.value[index] = updatedAideSoignant
      }
      return updatedAideSoignant
    } catch (err) {
      error.value = err.message
      console.error('Erreur lors de la mise à jour de l\'aide-soignant:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  /**
   * Supprimer un aide-soignant
   */
  const deleteAideSoignant = async (id) => {
    loading.value = true
    error.value = null

    try {
      await aideSoignantService.delete(id)
      aidesSoignants.value = aidesSoignants.value.filter(as => as.id !== id)
    } catch (err) {
      error.value = err.message
      console.error('Erreur lors de la suppression de l\'aide-soignant:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    aidesSoignants,
    loading,
    error,
    loadAidesSoignants,
    createAideSoignant,
    updateAideSoignant,
    deleteAideSoignant
  }
}

export default useAidesSoignants
