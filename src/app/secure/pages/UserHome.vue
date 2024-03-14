<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useBookingsStore } from '@/stores/bookingsStore'
import { FilterMatchMode } from 'primevue/api'

import BookingService from '../../../services/bookingService'

const bookingsStore = useBookingsStore()
const seshId = sessionStorage.getItem('token')
const bookings = ref()
const bookingsForTomorrow = ref([])
const displayTomorrowBookings = ref(false) // Reactive variable to toggle between today's and tomorrow's bookings
const isRefreshing = ref(false); // Reactive variable to control the visibility of the progress bar

const filters = ref({
  name: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
  email: { value: null, matchMode: FilterMatchMode.CONTAINS },
  phone_number: { value: null, matchMode: FilterMatchMode.CONTAINS },
  booking_datetime: { value: null, matchMode: FilterMatchMode.CONTAINS },
  created_at: { value: null, matchMode: FilterMatchMode.CONTAINS },
  vehicle_make_model: { value: null, matchMode: FilterMatchMode.CONTAINS }
})

const setBookingDateTimeForTomorrow = () => {
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  filters.value.booking_datetime.value = tomorrow.toISOString().substring(0, 10)
}
const clearFilter = () => {
  for (const key in filters.value) {
    filters.value[key].value = null
  }
}

const refreshBookingData = async () => {
  try {
    isRefreshing.value = true; // Show the progress bar
    const response = await BookingService.getBookings(seshId)
    bookings.value = response
    bookingsStore.setBookings(bookings.value)
    isRefreshing.value = false; // Hide the progress bar after data has been updated
  } catch (error) {
    console.error('Error fetching bookings:', error)
  }
}
const getDashboardBookings = async () => {
  try {
    if (!bookingsStore.hasBooking()) {
      refreshBookingData()
      console.log('no booking data stored, should only show on first load and reload.')
    } else {
      bookings.value = bookingsStore.getBookings
      console.log('booking data from store, should show everytime i nav away and back')
    }
  } catch (error) {
    console.error('Error fetching bookings:', error)
  }
}

onMounted(async () => {
  getDashboardBookings()
})
</script>

<template>
  <div class="surface-section p-5 flex flex-column flex-auto">
    <div class="grid">
      <div class="col-12">
        <div class="grid">
          <div class="col-12 md:col-6 lg:col-3 p-3">
            <a
              v-ripple
              class="flex flex-row lg:flex-column align-items-center cursor-pointer p-3 lg:justify-content-center bg-blue-500 hover:bg-blue-600 border-round text-gray-300 hover:text-black transition-duration-150 transition-colors p-ripple"
              @click="setBookingDateTimeForTomorrow"
            >
              <div class="p-2 text-center border-round">
                <span class="font-medium inline text-base lg:text-xs lg:block"
                  ><span
                    class="inline-flex justify-content-center align-items-center bg-blue-600 border-circle mb-3 p-3"
                  >
                    <i class="pi pi-car text-xl text-white"></i>
                  </span>
                  <div class="text-2xl font-medium text-white mb-2">Todays Bookings</div>
                </span>
              </div>
            </a>
          </div>
          <div class="col-12 md:col-6 lg:col-3 p-3">
            <div class="p-3 text-center bg-purple-500 border-round">
              <span
                class="inline-flex justify-content-center align-items-center bg-purple-600 border-circle mb-3 p-3"
              >
                <i class="pi pi-map-marker text-xl text-white"></i>
              </span>
              <div class="text-2xl font-medium text-white mb-2">23K</div>
              <span class="text-purple-100 font-medium">Check-ins</span>
            </div>
          </div>
          <div class="col-12 md:col-6 lg:col-3 p-3">
            <div class="p-3 text-center bg-indigo-500 border-round">
              <span
                class="inline-flex justify-content-center align-items-center bg-indigo-600 border-circle mb-3 p-3"
              >
                <i class="pi pi-file text-xl text-white"></i>
              </span>
              <div class="text-2xl font-medium text-white mb-2">23K</div>
              <span class="text-indigo-100 font-medium">Files</span>
            </div>
          </div>
          <div class="col-12 md:col-6 lg:col-3 p-3">
            <div class="p-3 text-center bg-orange-500 border-round">
              <span
                class="inline-flex justify-content-center align-items-center bg-orange-600 border-circle mb-3 p-3"
              >
                <i class="pi pi-users text-xl text-white"></i>
              </span>
              <div class="text-2xl font-medium text-white mb-2">40K</div>
              <span class="text-orange-100 font-medium">Users</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <ProgressBar mode="indeterminate" style="height: 4px" v-show="isRefreshing"></ProgressBar>
    <PrimeCard class="mb-1">
      <template #title>Bookings</template>
      <template #content>
        
        <DataTable
          v-model:filters="filters"
          :value="displayTomorrowBookings ? bookingsForTomorrow : bookings"
          filterDisplay="row"
          sortField="id"
          :sortOrder="-1"
          paginator
          :rows="6"
          :globalFilterFields="['name', 'email']"
        >
          <template #header>
            <div class="flex justify-content-between">
              <PrimeButton
                type="button"
                icon="pi pi-filter-slash"
                label="Clear"
                outlined
                @click="clearFilter()"
              />

              <PrimeButton icon="pi pi-refresh" rounded aria-label="Filter" @click="refreshBookingData()" />
            </div>
          </template>
          <PrimeColumn field="name" header="Name" style="width: 15%" sortable>
            <template #body="{ data }">
              {{ data.name }}
            </template>
            <template #filter="{ filterModel, filterCallback }">
              <InputText
                v-model="filterModel.value"
                type="text"
                @input="filterCallback()"
                class="p-column-filter"
                placeholder="Name"
              />
            </template>
          </PrimeColumn>
          <PrimeColumn field="email" header="Email" sortable>
            <template #body="{ data }">
              {{ data.email }}
            </template>
            <template #filter="{ filterModel, filterCallback }">
              <InputText
                v-model="filterModel.value"
                type="text"
                @input="filterCallback()"
                class="p-column-filter"
                placeholder="Email"
              />
            </template>
          </PrimeColumn>
          <PrimeColumn field="phone_number" header="Phone" sortable>
            <template #body="{ data }">
              {{ data.phone_number }}
            </template>
            <template #filter="{ filterModel, filterCallback }">
              <InputText
                v-model="filterModel.value"
                type="text"
                @input="filterCallback()"
                class="p-column-filter"
                placeholder="Phone"
              />
            </template>
          </PrimeColumn>
          <PrimeColumn field="vehicle_make_model" header="Vehicle" sortable style="width: 12%">
            <template v-slot:body="rowData">
              {{ rowData.data.vehicle_make_model }}
            </template>
            <template #filter="{ filterModel, filterCallback }">
              <InputText
                v-model="filterModel.value"
                type="text"
                @input="filterCallback()"
                class="p-column-filter"
              />
            </template>
          </PrimeColumn>
          <PrimeColumn field="notes" header="Notes" sortable></PrimeColumn>
          <PrimeColumn field="booking_datetime" header="Booking Time" sortable style="width: 10%">
            <template v-slot:body="rowData">
              {{ $filters.formatDate(rowData.data.booking_datetime) }}
            </template>
            <template #filter="{ filterModel, filterCallback }">
              <InputText
                v-model="filterModel.value"
                type="date"
                @input="filterCallback()"
                class="p-column-filter"
                placeholder="dd-mm-yyyy"
              />
            </template>
          </PrimeColumn>
          <PrimeColumn field="created_at" header="Booking created" sortable style="width: 12%">
            <template v-slot:body="rowData">
              {{ $filters.formatDateTime(rowData.data.created_at) }}
            </template>
            <template #filter="{ filterModel, filterCallback }">
              <InputText
                v-model="filterModel.value"
                type="date"
                @input="filterCallback()"
                class="p-column-filter"
                placeholder="dd-mm-yyyy"
              />
            </template>
          </PrimeColumn>
        </DataTable>
      </template>
    </PrimeCard>

    <!-- <TodaysBookings /> -->
  </div>
</template>
