import { defineStore } from 'pinia';

export interface Booking {
  id: number;
  date: string;
  // Add other booking properties here
}

export const useBookingsStore = defineStore('bookings', {
  state: () => ({
    bookings: [] as Booking[],
  }),
  actions: {
    setBookings(bookings: Booking[]) {
      this.bookings = bookings;
    },
    addBooking(booking: Booking) {
      this.bookings.push(booking);
    },
    clearBookings() {
      this.bookings = [];
    },
    hasBooking(): boolean {
      return this.bookings.length > 0;
    },
  },
  getters: {
    getBookings(): Booking[] {
      return this.bookings;
    },
  },
});
