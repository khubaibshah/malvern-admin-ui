<script setup lang="ts">
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { FilterMatchMode } from 'primevue/api';
import { useRouter } from 'vue-router';
import VehicleService from '@/services/VehicleService';
import { useToast } from 'primevue/usetoast';

const toast = useToast();
const seshId = sessionStorage.getItem('token')
const cars = ref([]);
const selectedCar = ref(null);

const filters = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS }
});

const router = useRouter();

const goToCarDetail = (event: any) => {
  const car = event.data;
  router.push({ name: 'car-detail', params: { id: car.id } });
};

const getCars = async (refresh = false) => {
  try {
    cars.value = await VehicleService.fetchAllVehicles(refresh);
  } catch (error) {
    console.error('Failed to fetch cars', error);
    toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to load cars.', life: 4000 });
  }
};



const clearFilter = () => {
  filters.value = {
    global: { value: null, matchMode: FilterMatchMode.CONTAINS }
  };
};


onMounted(getCars);

</script>

<template>
  <div>
    <div class="surface-section px-5 py-5 md:px-6 lg:px-8">
      <div class="text-3xl font-medium text-900 mb-4">Vehicle list</div>
      <DataTable v-model:filters="filters" v-model:selection="selectedCar" :value="cars" selectionMode="single"
        dataKey="id" filterDisplay="row"
        :globalFilterFields="['make', 'model', 'variant', 'price', 'mileage', 'registration']" sortField="id"
        :sortOrder="-1" paginator :rows="10" :metaKeySelection="false" @rowSelect="goToCarDetail">
        
        <template #header>

          <div class="flex justify-content-between">

            <PrimeButton type="button" icon="pi pi-filter-slash" label="Clear" outlined @click="clearFilter" />
            
            <IconField iconPosition="left">
              
              <InputIcon><i class="pi pi-search" /></InputIcon>
              <InputText v-model="filters['global'].value" placeholder="Search Cars" />
                                    <PrimeButton
    icon="pi pi-refresh"
    class="p-button-sm ml-4"
    @click="() => getCars(true)"
  />
            </IconField>
            
          </div>
        </template>
        <PrimeColumn field="registration" header="Registration" sortable />
        <PrimeColumn field="make" header="Make" sortable />
        <PrimeColumn field="model" header="Model" sortable />
        <PrimeColumn field="variant" header="Variant" sortable />
        <PrimeColumn field="vehicle_status" header="Vehicle Status" sortable />
        <PrimeColumn field="price" header="Price (£)" sortable>
          <template #body="{ data }">
            £{{ data.price ?? 'N/A' }}
          </template>
        </PrimeColumn>
        <PrimeColumn field="mileage" header="Mileage" sortable>
          <template #body="{ data }">
            {{ data.mileage ?? 'N/A' }} miles
          </template>
        </PrimeColumn>
      </DataTable>
    </div>
  </div>
</template>