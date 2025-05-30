<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <!-- <div id="particles-js"></div> -->
  
  <div class="login-bg surface-ground px-4 py-8 md:px-6 lg:px-8">
    
    <div class="flex flex-wrap shadow-2">
      <!-- <div class="w-full lg:w-6 px-0 py-4 lg:p-7 bg-blue-50">
        <PrimeCarousel :value="features">
          <template #item="slotProps">
            <div class="text-center mb-8">
              <div class="mx-auto font-medium text-xl mb-4 text-blue-900">
                {{ slotProps.data.title }}
              </div>
              <p class="m-0 text-blue-700 line-height-3">{{ slotProps.data.text }}</p>
            </div>
          </template>
        </PrimeCarousel>
      </div> -->

      <div class="w-full lg:w-6 p-4 lg:p-7 surface-card" style="border-radius: 25px;">
        <div v-if="!showRegisterForm">
          <div class="flex align-items-center justify-content-between mb-7">
          <span class="text-2xl font-medium text-900">Login to Malvern Autos</span>
          <a
            tabindex="0"
            class="font-medium text-blue-500 hover:text-blue-700 cursor-pointer transition-colors transition-duration-150"
            @click="showRegisterForm = true"
            >Sign up</a
          >
        </div>
        <PrimeToast />
        <div class="flex justify-content-between">
          <PrimeButton
            class="mr-2 w-6 font-medium border-1 surface-border surface-100 py-3 px-2 p-component hover:surface-200 active:surface-300 text-900 cursor-pointer transition-colors transition-duration-150 inline-flex align-items-center justify-content-center"
          >
            <i class="pi pi-facebook text-indigo-500 mr-2"></i>
            <span>Sign in With Facebook</span>
          </PrimeButton>
          <PrimeButton
            class="ml-2 w-6 font-medium border-1 surface-border surface-100 py-3 px-2 p-component hover:surface-200 active:surface-300 text-900 cursor-pointer transition-colors transition-duration-150 inline-flex align-items-center justify-content-center"
          >
            <i class="pi pi-google text-red-500 mr-2"></i>
            <span>Sign in With Google</span>
          </PrimeButton>
        </div>
        <PrimeDivider align="center" class="my-4">
          <span class="text-600 font-normal text-sm">OR</span>
        </PrimeDivider>
        
        <form @submit.prevent="submitForm">
          <label for="email4" class="block text-900 font-medium mb-2">Email</label>
          <InputText
            id="email4"
            type="text"
            placeholder="Email address"
            class="w-full mb-3 p-3"
            v-model="email"
            required
          />

          <label for="password4" class="block text-900 font-medium mb-2">Password</label>
          <InputText
            id="password4"
            type="password"
            placeholder="Password"
            class="w-full mb-3 p-3"
            v-model="password"
            required
          />

          <div class="flex align-items-center justify-content-between mb-6">
            <div class="flex align-items-center">
              <PrimeCheckbox
                id="rememberme4"
                :binary="true"
                v-model="checked4"
                class="mr-2"
              ></PrimeCheckbox>
              <label for="rememberme4">Remember me</label>
            </div>
            <a
              class="font-medium text-blue-500 hover:text-blue-700 cursor-pointer transition-colors transition-duration-150"
              >Forgot password?</a
            >
          </div>
          <PrimeButton label="Sign In" class="w-full py-3 font-medium" type="submit"></PrimeButton>
        </form>
        </div>
        <div v-else>
          <Register @register-form="handleRegisterForm" />

      </div>
        
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { ref, onMounted } from 'vue'

import { useRouter } from 'vue-router'
import { useAuthStore } from '../../../stores/authStore'
import { useUserStore } from '@/stores/userStore'
import { useToast } from 'primevue/usetoast'
import UserService from '../../../services/userService'
import Register from './Register.vue'
const showRegisterForm = ref(false)
import axios from 'axios'

const toast = useToast()
const authStore = useAuthStore()
const userStore = useUserStore()

const router = useRouter()

const features = ref([
  {
    title: 'Feature 1',
    text: 'Description of feature 1.'
  },
  {
    title: 'Feature 2',
    text: 'Description of feature 2.'
  },
  {
    title: 'Feature 3',
    text: 'Description of feature 3.'
  }
])

const checked4 = ref(false)
const email = ref('')
const password = ref('')
const user = ref()
const handleRegisterForm = (isVisible: boolean) => {
  showRegisterForm.value = isVisible
}

const submitForm = async () => {
  const userDetails = {
    email: email.value,
    password: password.value
  }

  try {
    await UserService.getCookie()
    const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/login`, userDetails, {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    })
    toast.add({ severity: 'success', summary: 'Info', detail: 'Logged in successfully', life: 3000 });
    authStore.setAuthenticated(true)
    authStore.setToken(response.data.token) // Store token in authStore
    sessionStorage.setItem('token', response.data.token)
    const seshId = sessionStorage.getItem('token')
    const data = await UserService.getUser(seshId)
    user.value = data
    userStore.setUser(user.value)
    
    if (user.value) {
      router.push({ name: 'Userhome' }) // Push to the correct route
    }
  } catch (error) {
    toast.add({ severity: 'error', summary: 'Info', detail: 'Logged in failed because '+ error, life: 10000 });
    console.error('Login failed', error)
  }
}
onMounted(async () => {})
</script>

<style>
.login-bg {
  background-color: #071155;
  -webkit-background-size: cover;
  -moz-background-size: cover;
  -o-background-size: cover;
  background-size: cover;
  min-height: 100vh;
  min-width: 100% !important;
  background-repeat: no-repeat;
  background-size: cover;
}
#particles-js {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}
</style>
