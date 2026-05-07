<template>
  <div class="aides-view">
    <!-- Header de page -->
    <div class="page-title-bar">
      <div>
        <h1 class="page-title">Équipe Aides-Soignants</h1>
        <p class="page-subtitle">
          {{ aides.length }} AS actifs · Semaine 19
        </p>
      </div>
      <div class="page-actions">
        <button class="btn btn-secondary">📅 Gérer absences</button>
        <button class="btn btn-primary">➕ Ajouter AS</button>
      </div>
    </div>

    <!-- Cards AS -->
    <div class="cards-grid">
      <ASCard
        v-for="as in aides"
        :key="as.id"
        :as="as"
        @click="openDetail(as)"
      />

      <!-- Card "Ajouter" -->
      <div class="add-card">
        <span class="add-icon">➕</span>
        <div class="add-label">Ajouter un AS</div>
      </div>
    </div>

    <!-- Recommandation d'équilibrage -->
    <div v-if="recommandation" class="reco-banner">
      <div class="reco-content">
        <div class="reco-header">
          <span class="reco-icon">⚠️</span>
          <span class="reco-title">Recommandation d'équilibrage</span>
        </div>
        <p class="reco-message">{{ recommandation.message }}</p>
        <div class="reco-suggestions">
          <strong>Suggestions :</strong>
          <ul>
            <li v-for="(suggestion, i) in recommandation.suggestions" :key="i">
              Transférer <strong>{{ suggestion.nbPatients }} patients</strong>
              de <strong>{{ suggestion.from }}</strong> vers
              <strong>{{ suggestion.to }}</strong>
              ({{ suggestion.gain }})
            </li>
          </ul>
        </div>
      </div>
      <button class="btn-reco">Voir suggestions de transfert</button>
    </div>

    <!-- Heatmap charge -->
    <SectionCard title="Heatmap charge — Semaine 19" icon="📅">
      <ChargeHeatmap
        :aides="aides"
        :charge="chargeJour"
        :show-values="true"
      />
    </SectionCard>

    <!-- Modal détail -->
    <ASDetailModal
      v-if="modalAS"
      :as="modalAS"
      :charge-jour="chargeJour[modalAS.code] || {}"
      :patients="patientsParAS[modalAS.code] || []"
      @close="modalAS = null"
    />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

import { mockAidesSoignants } from '@/data/mockAides.js'
import { mockChargeJour, mockPatientsParAS } from '@/data/mockChargeJour.js'

import ASCard from '@/components/aides/ASCard.vue'
import ChargeHeatmap from '@/components/aides/ChargeHeatmap.vue'
import ASDetailModal from '@/components/aides/ASDetailModal.vue'
import SectionCard from '@/components/ui/SectionCard.vue'

const chargeJour = ref(mockChargeJour)
const patientsParAS = ref(mockPatientsParAS)
const modalAS = ref(null)

// Calcul des AS avec leur niveau
const aides = computed(() => {
  return mockAidesSoignants.map(as => {
    const charge = as.chargeMinutes
    let niveau = 'leger'
    if (charge >= 120) niveau = 'surcharge'
    else if (charge >= 90) niveau = 'eleve'
    else if (charge >= 60) niveau = 'normal'
    return { ...as, niveau }
  })
})

// Logique de recommandation d'équilibrage
const recommandation = computed(() => {
  const surcharges = aides.value.filter(as => as.niveau === 'surcharge')
  const sousCharges = aides.value.filter(as => as.niveau === 'leger')

  if (surcharges.length === 0) return null

  const surchargeAS = surcharges[0]
  const moyenne = aides.value.reduce((sum, as) => sum + as.chargeMinutes, 0) / aides.value.length

  return {
    message: `${surchargeAS.code} est surchargé (${surchargeAS.chargeMinutes} min, soit ${Math.round(((surchargeAS.chargeMinutes - moyenne) / moyenne) * 100)}% au-dessus de la moyenne). Considérez transférer 2-3 patients vers les AS les moins chargés pour rééquilibrer la charge.`,
    suggestions: sousCharges.slice(0, 2).map(as => {
      const ecart = surchargeAS.chargeMinutes - as.chargeMinutes
      return {
        from: surchargeAS.code,
        to: as.code,
        nbPatients: 2,
        gain: `réduit l'écart de ${Math.round(ecart / 2)}min`
      }
    })
  }
})

const openDetail = (as) => {
  modalAS.value = as
}
</script>

<style scoped>
.aides-view {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 20px;
}

/* Page header */
.page-title-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.page-title {
  font-size: 24px;
  font-weight: 700;
  color: var(--color-text-primary);
  margin-bottom: 4px;
}

.page-subtitle {
  font-size: 13px;
  color: var(--color-text-secondary);
}

.page-actions {
  display: flex;
  gap: 8px;
}

.btn {
  padding: 9px 16px;
  border-radius: var(--radius-md);
  font-size: 13px;
  font-weight: 500;
  transition: all 0.15s ease;
}

.btn-secondary {
  background: white;
  border: 1px solid var(--color-border-light);
  color: var(--color-text-primary);
}

.btn-secondary:hover {
  border-color: var(--color-primary);
  color: var(--color-primary);
}

.btn-primary {
  background: var(--color-primary);
  color: white;
  border: 1px solid var(--color-primary);
}

.btn-primary:hover {
  background: var(--color-primary-dark);
}

/* Cards grid */
.cards-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
}

@media (max-width: 1024px) {
  .cards-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

/* Add card */
.add-card {
  background: var(--color-bg-secondary);
  border: 2px dashed var(--color-border);
  border-radius: var(--radius-lg);
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  min-height: 180px;
  transition: all 0.15s ease;
}

.add-card:hover {
  border-color: var(--color-primary);
  background: var(--color-primary-light);
}

.add-icon {
  font-size: 28px;
  color: var(--color-text-tertiary);
  margin-bottom: 8px;
}

.add-label {
  font-size: 13px;
  color: var(--color-text-secondary);
  font-weight: 500;
}

.add-card:hover .add-icon,
.add-card:hover .add-label {
  color: var(--color-primary);
}

/* Recommandation banner */
.reco-banner {
  background: var(--color-warning-light);
  border-left: 4px solid var(--color-warning);
  border-radius: var(--radius-md);
  padding: 16px 20px;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 16px;
}

.reco-content {
  flex: 1;
}

.reco-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 6px;
}

.reco-icon {
  font-size: 16px;
}

.reco-title {
  font-size: 14px;
  font-weight: 600;
  color: var(--color-warning-dark);
}

.reco-message {
  font-size: 13px;
  color: var(--color-warning-dark);
  line-height: 1.5;
  margin-bottom: 10px;
}

.reco-suggestions {
  font-size: 12px;
  color: var(--color-warning-dark);
}

.reco-suggestions ul {
  list-style: none;
  padding: 0;
  margin-top: 6px;
}

.reco-suggestions li {
  padding: 3px 0;
  position: relative;
  padding-left: 16px;
}

.reco-suggestions li::before {
  content: '→';
  position: absolute;
  left: 0;
  font-weight: 700;
}

.btn-reco {
  background: var(--color-warning);
  color: white;
  padding: 8px 14px;
  border-radius: var(--radius-md);
  font-size: 12px;
  font-weight: 600;
  white-space: nowrap;
  transition: background 0.15s ease;
}

.btn-reco:hover {
  background: #D88B12;
}

/* Responsive */
@media (max-width: 768px) {
  .page-title-bar {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }

  .page-actions {
    width: 100%;
    flex-direction: column;
  }

  .btn {
    width: 100%;
  }

  .cards-grid {
    grid-template-columns: 1fr;
  }

  .reco-banner {
    flex-direction: column;
    gap: 12px;
  }

  .btn-reco {
    width: 100%;
    text-align: center;
  }
}
</style>
