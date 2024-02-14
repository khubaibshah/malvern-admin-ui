import { useAuthStore } from '../stores/authStore'

export function isAuthenticated(): boolean {
  const authStore = useAuthStore()
  return authStore.isAuthenticated
}
