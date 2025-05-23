import axios from 'axios';

class BookingService {
     getBookings = async (token: string | null) => {
        try {
          const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/admin-bookings`, {
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
      // New method to create a booking
  createBooking = async (userBooking: any, token: string | null) => {
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/admin-bookings`, userBooking, {
        headers: {
          Authorization: 'Bearer ' + token,
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      });
      console.log('Booking response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error creating booking:', error);
      throw error; // Rethrow the error to handle it in the component
    }
  }
}

export default new BookingService()