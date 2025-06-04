import { createRouter, createWebHistory } from 'vue-router'

import loginformVue from '@/app/public/pages/loginform.vue'
import DashboardVue from '@/app/secure/pages/Dashboard.vue'
import UserHome from '@/app/secure/pages/UserHome.vue'
import Bookings from '@/app/secure/pages/Bookings.vue'
import Create from '@/app/secure/pages/createBooking.vue'
import Users from '../app/secure/pages/users/AllUsers.vue'
import User from '../app/secure/pages/users/User.vue'
import UserBooking from '../app/secure/pages/users/UserBooking.vue'
import AddCar from '@/app/secure/pages/scs/AddCar.vue'
import { useAuthStore } from '../stores/authStore'
import { useUserStore } from '@/stores/userStore'
import ViewAllCarsVue from '@/app/secure/pages/scs/ViewAllCars.vue'
import CarDetail from '@/app/secure/pages/scs/CarDetail.vue'
import FeaturedVehicle from '@/app/secure/pages/scs/FeaturedVehicle.vue'

// const checkAuth = async (to, from, next) => {
//     if (authStore.isAuthenticated) next();
//     else next("/");
// }


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'login',
      component: loginformVue
    },
    {
      path: '/dashboard', // Match this path with the one used in router.push
      name: 'dashboard',
      component: DashboardVue,
      children: [
        {
          path: '/dashboard/home', // This represents the default child route of /test
          name: 'Userhome',
          component: UserHome,
          meta: { requiresAuth: true } 
        },
        {
          path: '/dashboard/bookings', // This represents the default child route of /test
          name: 'booking',
          component: Bookings,
          meta: { requiresAuth: true } 
        },
        {
          path: '/dashboard/create', // This represents the default child route of /test
          name: 'Create',
          component: Create,
          meta: { requiresAuth: true } 
        },
        {
          path: '/dashboard/users', // This represents the default child route of /test
          name: 'Users',
          component: Users,
          meta: { requiresAuth: true } 
        },
        {
          path: '/dashboard/user', // This represents the default child route of /test
          name: 'User',
          component: User,
          meta: { requiresAuth: true } 
        },
        {
          path: '/dashboard/booking', // This represents the default child route of /test
          name: 'UserBooking',
          component: UserBooking,
          meta: { requiresAuth: true } 
        },
        {
          path: '/dashboard/scs', // This represents the default child route of /test
          name: 'scs',
          component: AddCar,
          meta: { requiresAuth: true } 
        },
        {
          path: '/dashboard/view-listings',
          name: 'scs-car-listings',
          component: ViewAllCarsVue,
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
    },
    // {
    //   path: '/test', // Match this path with the one used in router.push
    //   name: 'test',
    //   component: test,
    //   meta: { requiresAuth: true }
    // },
    // {
    //   path: '/about',
    //   name: 'about',
    //   // route level code-splitting
    //   // this generates a separate chunk (About.[hash].js) for this route
    //   // which is lazy-loaded when the route is visited.
    //   component: () => import('../views/AboutView.vue')
    // }
  ]
})
// Add navigation guard to check authentication status before navigating to each route
// router.beforeEach((to, from, next) => {
//   console.log('to',to)
//   console.log('from', from)
//   const authStore = useAuthStore()

//   // Check if the route requires authentication
//   if (to.meta.requiresAuth) {
//     // If authentication is required and user is not authenticated, redirect to login page
//     if (!authStore.isAuthenticated) {
//       next({ name: 'login' }) // Redirect to login page
//     } else {
//       next() // Continue navigating to the requested route
//     }
//   } else {
//     next() // No authentication required, continue navigating to the requested route
//   }

// })
// const authStore = useAuthStore()
// const  authToken = authStore.token


// const userStore = useUserStore();
// const user = userStore.getUser()


// router.beforeEach((to, from, next) => {
//   if (from.name === 'dashboard' && to.name === null && from.name !== to.name) {
//     // console.log('token here', authToken)
//     // console.log('user here', user)
//     // User is going back from home page, redirect to home page
//     next({ name: 'dashboard' });
//   } else {
//     next();
//   }
// });
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();

  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next({ name: 'login' }); // Redirect unauthenticated users to login
  } else {
    next();
  }
});
export default router
