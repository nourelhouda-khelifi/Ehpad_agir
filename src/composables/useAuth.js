import { ref, computed } from 'vue'

const TOKEN_KEY = 'ehpad_token'
const USER_KEY  = 'ehpad_user'

// État global partagé entre composants
const token = ref(localStorage.getItem(TOKEN_KEY) || null)
const user  = ref(JSON.parse(localStorage.getItem(USER_KEY) || 'null'))

export function useAuth() {
  const isAuthenticated = computed(() => !!token.value)
  const currentUser     = computed(() => user.value)

  const setAuth = (tokenValue, userData) => {
    token.value = tokenValue
    user.value  = userData
    localStorage.setItem(TOKEN_KEY, tokenValue)
    localStorage.setItem(USER_KEY, JSON.stringify(userData))
  }

  const clearAuth = () => {
    token.value = null
    user.value  = null
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(USER_KEY)
  }

  const getToken = () => token.value

  return { isAuthenticated, currentUser, setAuth, clearAuth, getToken }
}
