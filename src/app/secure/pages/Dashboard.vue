<template>
  <Navigation>
    
    <template v-slot:default>
      <div
        class="surface-section flex flex-column flex-auto border-round overflow-y-auto"
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
