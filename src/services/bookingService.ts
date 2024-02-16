import axios from 'axios';

class BookingService {
     getBookings = async (token: string | null) => {
        try {
          const response = await axios.get('http://127.0.0.1:8000/api/bookings', {
            headers: {
              Authorization: 'Bearer ' + token,
              'Content-Type': 'application/json',
              'Access-Control-Allow-Origin': '*'
            }
          })
          return response.data
        } catch (error) {
          console.error('Error fetching bookings:', error)
        }
      }
}

export default new BookingService()