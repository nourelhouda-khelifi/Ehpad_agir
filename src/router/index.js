import { createRouter, createWebHistory } from 'vue-router'
import { useAuth } from '@/composables/useAuth.js'
import LoginView from '../views/LoginView.vue'
import DashboardView from '../views/DashboardView.vue'
import PatientsListView from '../views/PatientsListView.vue'
import PatientProfileView from '../views/PatientProfileView.vue'
import PlanningWeeklyView from '../views/PlanningWeeklyView.vue'
import PlanningDailyView from '../views/PlanningDailyView.vue'
import AidesSoignantsView from '../views/AidesSoignantsView.vue'

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', name: 'Login', component: LoginView, meta: { public: true } },
  { path: '/dashboard',         name: 'Dashboard',    component: DashboardView },
  { path: '/patients',          name: 'Patients',     component: PatientsListView },
  { path: '/patients/:id',      name: 'PatientProfile', component: PatientProfileView },
  { path: '/activites',         name: 'Activites',    component: PlanningWeeklyView },
  { path: '/planning/quotidien', name: 'PlanningDaily', component: PlanningDailyView },
  { path: '/aides-soignants',   name: 'AidesSoignants', component: AidesSoignantsView },
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Guard global : toute route non publique nécessite un token
router.beforeEach((to, _from, next) => {
  const { isAuthenticated } = useAuth()
  if (to.meta.public) return next()
  if (!isAuthenticated.value) return next({ name: 'Login' })
  next()
})

export default router
