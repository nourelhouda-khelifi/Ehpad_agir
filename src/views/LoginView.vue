<script setup>
import { ref } from 'vue'
import logoAgir from '../assets/logoagir .png'

const email = ref('')
const password = ref('')
const showPassword = ref(false)
const emailError = ref('')
const passwordError = ref('')

const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value
}

const validateEmail = (emailValue) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(emailValue)
}

const validatePassword = (passwordValue) => {
  return passwordValue.trim().length > 0
}

const handleLogin = async () => {
  emailError.value = ''
  passwordError.value = ''

  let isValid = true

  if (!email.value) {
    emailError.value = 'Veuillez entrer votre identifiant'
    isValid = false
  } else if (!validateEmail(email.value)) {
    emailError.value = 'Veuillez entrer une adresse email valide'
    isValid = false
  }

  if (!validatePassword(password.value)) {
    passwordError.value = 'Veuillez entrer votre mot de passe'
    isValid = false
  }

  if (isValid) {
    console.log('Connexion:', { email: email.value, password: password.value })
  }
}

const handleKeyPress = (event) => {
  if (event.key === 'Enter') {
    handleLogin()
  }
}
</script>

<template>
  <div class="login-container">
    <div class="login-left">
      <div class="login-form-wrapper">
        <h1 class="login-title">
          Bienvenue sur Agir
          <span class="wave-emoji">👋</span>
        </h1>

        <form @submit.prevent="handleLogin" class="login-form">
          <div class="form-group">
            <label for="email" class="form-label">Identifiant</label>
            <input
              id="email"
              v-model="email"
              type="email"
              placeholder="email"
              class="form-input"
              @keypress="handleKeyPress"
              @focus="emailError = ''"
            />
            <span v-if="emailError" class="error-message">{{ emailError }}</span>
          </div>

          <div class="form-group">
            <label for="password" class="form-label">Mot de passe</label>
            <div class="password-input-wrapper">
              <input
                id="password"
                v-model="password"
                :type="showPassword ? 'text' : 'password'"
                placeholder="Entrez votre mot de passe"
                class="form-input password-input"
                @keypress="handleKeyPress"
                @focus="passwordError = ''"
              />
              <button
                type="button"
                class="password-toggle"
                @click="togglePasswordVisibility"
                :aria-label="showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'"
              >
                <svg v-if="!showPassword" class="eye-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
                <svg v-else class="eye-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                  <line x1="1" y1="1" x2="23" y2="23" />
                </svg>
              </button>
            </div>
            <span v-if="passwordError" class="error-message">{{ passwordError }}</span>
          </div>

          <button type="submit" class="login-button">Connexion</button>
        </form>
      </div>
    </div>

    <div class="login-right">
      <div class="logo-wrapper">
        <img :src="logoAgir" alt="Logo Agir" class="logo-image" />
      </div>
    </div>
  </div>
</template>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.login-container {
  display: flex;
  height: 100vh;
  width: 100%;
  overflow: hidden;
  background: transparent;
}

.login-left {
  flex: 0 0 50%;
  background: linear-gradient(135deg, #1f5fa8 0%, #2a5caa 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  animation: slideFromLeft 0.8s ease-out;
}

.login-right {
  flex: 0 0 50%;
  background-color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  animation: slideFromRight 0.8s ease-out;
}

@keyframes slideFromLeft {
  from {
    transform: translateX(-100%);
  }
  to {
    transform: translateX(0);
  }
}

@keyframes slideFromRight {
  from {
    transform: translateX(100%);
  }
  to {
    transform: translateX(0);
  }
}

@keyframes fadeInUp {
  from {
    transform: translateY(30px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

@keyframes wave {
  0%, 100% {
    transform: rotate(-20deg);
  }
  50% {
    transform: rotate(20deg);
  }
}

@keyframes float {
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
}

.login-form-wrapper {
  width: 100%;
  max-width: 340px;
  animation: fadeInUp 0.7s ease-out 0.4s backwards;
}

.login-title {
  font-size: 28px;
  font-weight: 600;
  color: #ffffff;
  margin: 0 0 2.5rem 0;
  text-align: center;
  letter-spacing: -0.5px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
}

.wave-emoji {
  display: inline-block;
  animation: wave 2s ease-in-out infinite;
  margin-left: 0.5rem;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 1.8rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
}

.form-label {
  font-size: 13px;
  font-weight: 600;
  color: #ffffff;
  opacity: 0.95;
  text-transform: none;
  letter-spacing: 0.3px;
}

.form-input {
  width: 100%;
  padding: 13px 18px;
  border: none;
  border-radius: 28px;
  font-size: 15px;
  background-color: #ffffff;
  color: #333333;
  transition: all 0.3s ease;
  outline: none;
  font-family: inherit;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.form-input::placeholder {
  color: #cccccc;
}

.form-input:focus {
  transform: scale(1.02);
  box-shadow: 0 4px 16px rgba(31, 95, 168, 0.2);
}

.password-input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.password-input {
  padding-right: 2.75rem;
}

.password-toggle {
  position: absolute;
  right: 1rem;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.2s ease;
  color: #999999;
}

.password-toggle:hover {
  color: #1f5fa8;
}

.eye-icon {
  width: 1.2rem;
  height: 1.2rem;
  stroke: currentColor;
}

.error-message {
  font-size: 12px;
  color: #ffcccc;
  margin-top: -0.4rem;
}

.login-button {
  padding: 13px 36px;
  margin-top: 0.5rem;
  border: none;
  border-radius: 28px;
  font-size: 15px;
  font-weight: 600;
  background-color: #ffffff;
  color: #1f5fa8;
  cursor: pointer;
  transition: all 0.3s ease;
  outline: none;
  font-family: inherit;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  align-self: center;
}

.login-button:hover {
  transform: scale(1.05);
  box-shadow: 0 6px 20px rgba(31, 95, 168, 0.25);
}

.login-button:active {
  transform: scale(0.98);
}

.logo-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
}

.logo-image {
  max-width: 55%;
  max-height: 55%;
  width: auto;
  height: auto;
  animation: float 3.5s ease-in-out infinite;
  transition: transform 0.3s ease;
}

.logo-image:hover {
  transform: scale(1.05);
}

@media (max-width: 768px) {
  .login-container {
    flex-direction: column;
    height: auto;
  }

  .login-left,
  .login-right {
    flex: none;
    width: 100%;
    min-height: 50vh;
  }

  .login-title {
    font-size: 24px;
  }

  .form-input {
    padding: 12px 16px;
    font-size: 14px;
  }

  .login-button {
    padding: 12px 32px;
  }

  .logo-image {
    max-width: 65%;
  }
}

@media (max-width: 480px) {
  .login-left,
  .login-right {
    padding: 1.5rem;
    min-height: 50vh;
  }

  .login-form-wrapper {
    max-width: 100%;
  }

  .login-title {
    font-size: 20px;
    margin-bottom: 2rem;
  }

  .login-form {
    gap: 1.4rem;
  }

  .form-input,
  .login-button {
    font-size: 14px;
  }

  .logo-image {
    max-width: 75%;
  }
}
</style>
