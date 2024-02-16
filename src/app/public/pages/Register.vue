
<script setup lang="ts">
import { ref } from 'vue';
import { useToast } from 'primevue/usetoast';

import axios from 'axios';

const emit = defineEmits(['register-form'])

const fullName = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const checked = ref(false);
const toast = useToast();

const showRegistrationForm = () => {
  emit('register-form', false)
}

const register = async () => {
  const userDetails = {
    name: fullName.value,
    email: email.value,
    password: password.value,
    password_confirmation: confirmPassword.value
  }
  const response = await axios.post('http://127.0.0.1:8000/api/register', userDetails, {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    })
    try {
    console.log('Registration response:', response.data)
    fullName.value = ''
    email.value = ''
    password.value = ''
    confirmPassword.value = ''
    toast.add({ severity: 'success', summary: 'Info', detail: 'User successfully created', life: 3000 });
    showRegistrationForm()
    } catch (error) {
      console.error('Error creating booking:', error)
    // Set error message
      toast.add({ severity: 'error', summary: 'Info', detail: 'User couldnt be created. Please try again', life: 3000 });
    }
}
</script>
<template>
     <div class="flex align-items-center justify-content-between mb-7">
          <span class="text-2xl font-medium text-900">Register to Stanley Garage</span>
          <a
            tabindex="0"
            class="font-medium text-blue-500 hover:text-blue-700 cursor-pointer transition-colors transition-duration-150"
            @click="showRegistrationForm"
            >Sign in</a
          >
          </div>
          <form @submit.prevent="register">
            
          <label for="name" class="block text-900 font-medium mb-2">Full Name</label>
          <InputText
            id="name"
            type="text"
            placeholder="Full name"
            class="w-full mb-3 p-3"
            v-model="fullName"
            required
          />
          <label for="email" class="block text-900 font-medium mb-2">Email</label>
          <InputText
            id="email"
            type="text"
            placeholder="Email address"
            class="w-full mb-3 p-3"
            v-model="email"
            required
          />
          <label for="password" class="block text-900 font-medium mb-2">Password</label>
          <InputText
            id="password4"
            type="password"
            placeholder="Password"
            class="w-full mb-3 p-3"
            v-model="password"
            required
          />
          <label for="confirmPassword" class="block text-900 font-medium mb-2">Confirm Password</label>
          <InputText
            id="confirmPassword"
            type="Password"
            placeholder="Confirm Password"
            class="w-full mb-3 p-3"
            v-model="confirmPassword"
            required
          />

          <div class="flex align-items-center justify-content-between mb-6">
            <div class="flex align-items-center">
              <PrimeCheckbox
                id="rememberme4"
                :binary="true"
                v-model="checked"
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
</template>