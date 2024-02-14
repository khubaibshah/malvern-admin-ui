<template>
  <Navigation>
    
    <template v-slot:default>
      <div
        class="pb-5 flex flex-column flex-auto surface-ground border-round overflow-y-auto"
        style="background-color: #ffffff !important"
      >
        <RouterView />
      </div>
    </template>
  </Navigation>

</template>

<script lang="ts" setup>

import Navigation from './Navigation.vue'
import { useAuthStore } from '../../../stores/authStore'

const authStore = useAuthStore()
const isAuthenticated = authStore.isAuthenticated

console.log('authenticated?', isAuthenticated)

</script>
