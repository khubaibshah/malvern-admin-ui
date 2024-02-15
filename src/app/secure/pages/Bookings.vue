<script setup lang="ts">
import { useBookingsStore } from '@/stores/bookingsStore';
const bookingsStore = useBookingsStore();
const allbookings = bookingsStore.getBookings;
</script>

<!-- resources/js/components/About.vue -->
<template>
  <div>
    <div class="surface-section px-4 py-5 md:px-6 lg:px-8 mt-3">
      <div
        class="flex md:align-items-center md:justify-content-between flex-column md:flex-row pb-4 border-bottom-1 surface-border"
      >
        <div class="mb-3 lg:mb-0">
          <div class="text-3xl font-medium text-900 mb-3">Bookings</div>
          <div class="text-500 mr-0 md:mr-3">Below are all the bookings created</div>
        </div>
        <span class="p-input-icon-left w-full md:w-auto">
          <i class="pi pi-search"></i>
          <InputText type="text" placeholder="Search" class="w-full md:w-auto" />
        </span>
      </div>
    </div>

    <div class="surface-section md:px-7 lg:px-8">
      <!-- <router-link to="/">Go to Home</router-link> -->

      <DataTable :value="allbookings" sortField="id" :sortOrder="-1" paginator :rows="6" >
        <!-- <template #header>
                <div class="flex justify-content-end">
                    <IconField iconPosition="left">
                        <InputIcon>
                            <i class="pi pi-search" />
                        </InputIcon>
                        <InputText v-model="filters['global'].value" placeholder="Keyword Search" />
                    </IconField>
                </div>
        </template> -->
        <PrimeColumn field="id" header="User Id" style="width: 8%" sortable ></PrimeColumn>
        <PrimeColumn field="name" header="Name" sortable></PrimeColumn>
        <PrimeColumn field="email" header="Email" sortable></PrimeColumn>
        <PrimeColumn field="phone_number" header="Phone" sortable></PrimeColumn>
        <PrimeColumn field="vehicle_make_model" header="Vehicle" sortable></PrimeColumn>
        <PrimeColumn field="notes" header="Notes" sortable></PrimeColumn>
        <PrimeColumn field="booking_datetime" header="Booking Time" sortable>
          <template v-slot:body="rowData">
                        {{ $filters.formatDateTime(rowData.data.booking_datetime) }}
                        </template>

        </PrimeColumn>
        <PrimeColumn field="created_at" header="Booking created" sortable>
          <template v-slot:body="rowData">
                        {{ $filters.formatDateTime(rowData.data.created_at) }}
                        </template>
        </PrimeColumn>
        <PrimeColumn field="updated_at" header="Booking updated" sortable>
          <template v-slot:body="rowData">
                        {{ $filters.formatDateTime(rowData.data.updated_at) }}
                        </template>
        </PrimeColumn>
      </DataTable>
    </div>
  </div>
</template>
