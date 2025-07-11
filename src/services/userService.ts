import axios from 'axios'

class UserService {
  getCookie = async () => {
    const apiCall = `${import.meta.env.VITE_API_BASE_URL}/sanctum/csrf-cookie`
    const config = {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    }
    try {
      const response = await axios.get(apiCall, config)
      console.log('cookie from service', response)
      return response.data
    } catch (error) {
      console.log(error)
      throw error.response.data
    }
  }
//   getLogin = async (userDetails) => {
//     const apiCall = '${import.meta.env.VITE_API_BASE_URL}/api/login'
//     const config = {
//       headers: {
//         'Content-Type': 'application/json',
//         'Access-Control-Allow-Origin': '*'
//       }
//     }
//     try {
//       const response = await axios.post(apiCall, userDetails, config)
//       authStore.setAuthenticated(true)
//       authStore.setToken(response.data.token) // Store token in authStore
//       sessionStorage.setItem('token', response.data.token)
//       user.value = data
//       userStore.setUser(user.value)
//     } catch (error) {
//       console.log(error)
//       throw error.response.data
//     }
//   }
  getUser = async (token: string | null) => {
    const apiCall = `${import.meta.env.VITE_API_BASE_URL}/api/user`
    const config = {
      headers: {
        Authorization: 'Bearer ' + token,
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    }

    try {
      const response = await axios.get(apiCall, config)
      return response.data
    } catch (error) {
      console.log(error)
      throw error.response.data
    }
  }
  logout = async (token: string | null) => {
    const apiCall = `${import.meta.env.VITE_API_BASE_URL}/api/logout`
    const config = {
      headers: {
        Authorization: 'Bearer ' + token,
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    }
    try {
      const response = await axios.post(apiCall, null, config)
      console.log('User logged out successfully', response.data)
      sessionStorage.clear()
      return response.data
    } catch (error: any) {
      console.error('Login failed', error)
    }
  }
  getAllUsers = async (token: string | null) => {
    try {
      const apiCall = `${import.meta.env.VITE_API_BASE_URL}/api/users`
      const config = {
        headers: {
          'Authorization': "Bearer "+token,
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      }
      const response = await axios.get(apiCall, config)
      return response.data
      console.log('all users from service', response.data)
    } catch (error) {
      console.error('Error fetching bookings:', error)
    }
  }
//   register = async () =>{
//     const apiCall = '${import.meta.env.VITE_API_BASE_URL}/api/register'
//         const config = {
//           headers: {
//             'Content-Type': 'application/json',
//             'Access-Control-Allow-Origin': '*'
//           }
//         }
//         try {
//             const response = await axios.post(apiCall, config)
//             console.log('User logged out successfully', response.data)
//             sessionStorage.clear()
//             return response.data
//           } catch (error: any) {
//             console.error('Login failed', error)
//           }
//     }
}
export default new UserService()
