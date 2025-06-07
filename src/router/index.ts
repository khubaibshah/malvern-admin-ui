import { createRouter, createWebHistory } from 'vue-router'
import loginformVue from '@/app/public/pages/loginform.vue'
import DashboardVue from '@/app/secure/pages/Dashboard.vue'
import UserHome from '@/app/secure/pages/UserHome.vue'
import Bookings from '@/app/secure/pages/Bookings.vue'
import Create from '@/app/secure/pages/createBooking.vue'
import Users from '@/app/secure/pages/users/AllUsers.vue'
import User from '@/app/secure/pages/users/User.vue'
import UserBooking from '@/app/secure/pages/users/UserBooking.vue'
import AddCar from '@/app/secure/pages/scs/AddCar.vue'
import ViewAllCarsVue from '@/app/secure/pages/scs/ViewAllCars.vue'
import CarDetail from '@/app/secure/pages/scs/CarDetail.vue'
import FeaturedVehicle from '@/app/secure/pages/scs/FeaturedVehicle.vue'
import ArchiveDelete from '@/app/secure/pages/scs/ArchiveDelete.vue'
import { useAuthStore } from '@/stores/authStore'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'login',
      component: loginformVue,
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: DashboardVue,
      children: [
        {
          path: 'home',
          name: 'Userhome',
          component: UserHome,
          meta: { requiresAuth: true }
        },
        {
          path: 'bookings',
          name: 'booking',
          component: Bookings,
          meta: { requiresAuth: true }
        },
        {
          path: 'create',
          name: 'Create',
          component: Create,
          meta: { requiresAuth: true }
        },
        {
          path: 'users',
          name: 'Users',
          component: Users,
          meta: { requiresAuth: true }
        },
        {
          path: 'user',
          name: 'User',
          component: User,
          meta: { requiresAuth: true }
        },
        {
          path: 'booking',
          name: 'UserBooking',
          component: UserBooking,
          meta: { requiresAuth: true }
        },
        {
          path: 'scs',
          name: 'scs',
          component: AddCar,
          meta: { requiresAuth: true }
        },
        {
          path: 'view-listings',
          name: 'scs-car-listings',
          component: ViewAllCarsVue,
          meta: { requiresAuth: true }
        },
        {
          path: '/archive-delete',
          name: 'archive-delete',
          component: ArchiveDelete,
          meta: { requiresAuth: true }
        },
        {
          path: '/cars/:id',
          name: 'car-detail',
          component: CarDetail,
          meta: { requiresAuth: true }
        },
        {
          path: '/cars/featured-vehicle',
          name: 'featured-vehicle',
          component: FeaturedVehicle,
          meta: { requiresAuth: true }
        }
      ],
      meta: { requiresAuth: true }
    }
  ]
})

// ✅ Navigation guard to restore token from sessionStorage and check auth
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()

  if (!authStore.token && sessionStorage.getItem('token')) {
    authStore.setToken(sessionStorage.getItem('token')!)
  }

  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next({ name: 'login' })
  } else {
    next()
  }
})

export default router
