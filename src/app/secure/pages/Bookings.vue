<script setup lang="ts">
import { ref } from 'vue';
import { useBookingsStore } from '@/stores/bookingsStore';
import { FilterMatchMode } from 'primevue/api'
const bookingsStore = useBookingsStore();
const allbookings = bookingsStore.getBookings;
const filters = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  name: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
  email: { value: null, matchMode: FilterMatchMode.CONTAINS  },
  phone_number: { value: null, matchMode: FilterMatchMode.CONTAINS  },
  booking_datetime: { value: null, matchMode: FilterMatchMode.CONTAINS  },
  created_at: { value: null, matchMode: FilterMatchMode.CONTAINS  },
  vehicle_make_model: { value: null, matchMode: FilterMatchMode.CONTAINS  },
})
const clearFilter = () => {
    for (const key in filters.value) {
        filters.value[key].value = null;
    }
};
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

      <DataTable
          v-model:filters="filters"
          :value="allbookings"
          filterDisplay="row"
          sortField="id"
          :sortOrder="-1"
          paginator
          :rows="6"
          :globalFilterFields="['name', 'email']"
        >
        <template #header>
                <div class="flex justify-content-between">
                    <PrimeButton type="button" icon="pi pi-filter-slash" label="Clear" outlined @click="clearFilter()" />
                    <IconField iconPosition="left">
                        <InputIcon>
                            <i class="pi pi-search" />
                        </InputIcon>
                        <InputText v-model="filters['global'].value" placeholder="Keyword Search" />
                    </IconField>
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
          {{ $filters.formatDateTime(rowData.data.booking_datetime) }}
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
            <!-- <template v-slot:body="rowData">
              {{ $filters.formatDate(rowData.data.booking_datetime) }}
            </template> -->
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
          <!-- <PrimeColumn field="updated_at" header="Booking updated" sortable>
            <template v-slot:body="rowData">
              {{ $filters.formatDateTime(rowData.data.updated_at) }}
            </template>
          </PrimeColumn> -->
        </DataTable>
    </div>
  </div>
</template>
