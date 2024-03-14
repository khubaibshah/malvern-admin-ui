import axios from 'axios'

class UserService {
  getCookie = async () => {
    const apiCall = 'http://127.0.0.1:8000/sanctum/csrf-cookie'
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
//     const apiCall = 'http://127.0.0.1:8000/api/login'
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
    const apiCall = 'http://127.0.0.1:8000/api/user'
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
    const apiCall = 'http://127.0.0.1:8000/api/logout'
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
      const apiCall = 'http://127.0.0.1:8000/api/users'
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
//     const apiCall = 'http://127.0.0.1:8000/api/register'
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
