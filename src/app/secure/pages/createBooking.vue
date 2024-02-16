<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useToast } from 'primevue/usetoast'
import { useAuthStore } from '@/stores/authStore'
import BookingService from '@/services/bookingService'
import axios from 'axios'
import router from '@/router'

const name = ref('')
const email = ref('')
const phoneNumber = ref('')
const vehicleMakeModel = ref('')
const notes = ref('')

const date = ref()
const formattedDate = ref('')
const successMessage = ref('')
const errorMessage = ref('')

const authStore = useAuthStore()
// Access the token

const seshId = sessionStorage.getItem('token')
const toast = useToast()

const createBooking = async () => {
  try {
    const userBooking = {
      name: name.value,
      email: email.value,
      phone_number: phoneNumber.value,
      vehicle_make_model: vehicleMakeModel.value,
      booking_datetime: formatDate(date.value), // Format the date before sending
      notes: notes.value // Format the date before sending
    };

    // Call the createBooking method from BookingService
    await BookingService.createBooking(userBooking, seshId);

    // Optionally, you can reset the form fields after successful submission
    name.value = '';
    email.value = '';
    phoneNumber.value = '';
    vehicleMakeModel.value = '';
    date.value = null;
    notes.value = '';

    // Set success message
    toast.add({
      severity: 'success',
      summary: 'Info',
      detail: 'Booking created successfully',
      life: 3000
    });

    // Clear any previous error message
    router.push({ name: 'UserBooking' });
  } catch (error) {
    console.error('Error creating booking:', error);
    // Set error message
    toast.add({
      severity: 'error',
      summary: 'Info',
      detail: 'Booking couldn\'t be created. Please try again',
      life: 3000
    });
  }
};

const formatDate = (date: any) => {
  if (date) {
    const formattedDate = new Date(date)
    const year = formattedDate.getFullYear()
    const month = String(formattedDate.getMonth() + 1).padStart(2, '0')
    const day = String(formattedDate.getDate()).padStart(2, '0')
    const hours = String(formattedDate.getHours()).padStart(2, '0')
    const minutes = String(formattedDate.getMinutes()).padStart(2, '0')
    const seconds = String(formattedDate.getSeconds()).padStart(2, '0')

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
  }
  return ''
}

onMounted(async () => {})
</script>
<template>
  <div>
    <PrimeToast />
    <div class="surface-section px-4 py-5 md:px-6 lg:px-8 mt-3">
      <div
        class="flex md:align-items-center md:justify-content-between flex-column md:flex-row pb-4 border-bottom-1 surface-border"
      >
        <div class="mb-3 lg:mb-0">
          <div class="text-3xl font-medium text-900 mb-3">Create a booking</div>
          <div class="text-500 mr-0 md:mr-3">
            The garage is open between 9am and 5:30pm, Monday to Friday. Only 1 booking is allowed
            per slot.
          </div>
        </div>
        <span class="p-input-icon-left w-full md:w-auto">
          <i class="pi pi-search"></i>
          <InputText type="text" placeholder="Search" class="w-full md:w-auto" />
        </span>
      </div>
      <div class="grid mt-5">
        <div class="col-12 md:col-6">
          <div class="p-fluid pr-0 md:pr-6">
            <div class="field">
              <label for="name" class="font-medium">Full name</label>
              <InputText v-model="name" id="name" type="text" class="py-3 px-2 text-lg" />
            </div>
            <div class="field">
              <label for="company" class="font-medium">Phone number</label>
              <InputText v-model="phoneNumber" id="company" type="text" class="py-3 px-2 text-lg" />
            </div>
            <div class="field">
              <label for="email" class="font-medium">Email</label>
              <InputText v-model="email" id="email" type="text" class="py-3 px-2 text-lg" />
            </div>
            <div class="field">
              <label for="message" class="font-medium">Vehicle make & model</label>
              <InputText
                v-model="vehicleMakeModel"
                id="message"
                :rows="6"
                class="py-3 px-2 text-lg"
              ></InputText>
            </div>
            <div class="field">
              <label for="message" class="font-medium">Notes</label>
              <PrimeTextarea v-model="notes" id="notes" class="pb-3"></PrimeTextarea>
            </div>
          </div>
        </div>
        <div class="col-12 md:col-6 bg-no-repeat bg-right-bottom">
          <div class="text-900 text-2xl font-medium mb-3">Please pick a date and Time</div>
          <PrimeCalendar v-model="date" inline showTime hourFormat="12" />
        </div>
        <div class="col-12 md:col-6">
          <PrimeButton
            label="Create Booking"
            icon="pi pi-send"
            class="w-auto"
            @click="createBooking"
          ></PrimeButton>
        </div>
      </div>
    </div>
  </div>
</template>
