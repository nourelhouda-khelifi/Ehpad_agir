import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '../views/LoginView.vue'
import DashboardView from '../views/DashboardView.vue'
import PatientsListView from '../views/PatientsListView.vue'
import PatientProfileView from '../views/PatientProfileView.vue'
import PlanningWeeklyView from '../views/PlanningWeeklyView.vue'
import PlanningDailyView from '../views/PlanningDailyView.vue'
import AidesSoignantsView from '../views/AidesSoignantsView.vue'

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    name: 'Login',
    component: LoginView
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: DashboardView
  },
  {
    path: '/patients',
    name: 'Patients',
    component: PatientsListView
  },
  {
    path: '/patients/:id',
    name: 'PatientProfile',
    component: PatientProfileView
  },
  {
    path: '/planning/douches',
    name: 'PlanningHebdoDouches',
    component: PlanningWeeklyView
  },
  {
    path: '/planning/quotidien',
    name: 'PlanningDaily',
    component: PlanningDailyView
  },
  {
    path: '/aides-soignants',
    name: 'AidesSoignants',
    component: AidesSoignantsView
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
