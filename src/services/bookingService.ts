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
      // New method to create a booking
  createBooking = async (userBooking: any, token: string | null) => {
    try {
      const response = await axios.post('http://127.0.0.1:8000/api/bookings', userBooking, {
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