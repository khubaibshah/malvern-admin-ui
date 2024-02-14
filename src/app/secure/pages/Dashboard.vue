<template>
  <Navigation>
    <template v-slot:default>
      <div
        class="p-5 flex flex-column flex-auto surface-ground border-round"
        style="background-color: #ffffff !important"
      >
        <RouterView />
      </div>
    </template>
  </Navigation>

  <!-- <RouterView /> -->
</template>
<script lang="ts" setup>
import Navigation from './Navigation.vue'
import { useAuthStore } from '../../../stores/authStore'

const authStore = useAuthStore()
const isAuthenticated = authStore.isAuthenticated

console.log('authenticated?', isAuthenticated)
</script>
