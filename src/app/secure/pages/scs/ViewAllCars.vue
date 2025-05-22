<script setup lang="ts">
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { FilterMatchMode } from 'primevue/api';
import { useRouter } from 'vue-router';

const cars = ref([]);
const filters = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS }
});

const router = useRouter();

const getCars = async () => {
  try {
    const res = await axios.get('http://127.0.0.1:8000/api/scs-cars');
    cars.value = res.data;
  } catch (error) {
    console.error('Failed to fetch cars', error);
  }
};

const clearFilter = () => {
  filters.value = {
    global: { value: null, matchMode: FilterMatchMode.CONTAINS }
  };
};

// Navigate to detail page on row click
const goToCarDetail = (event: any) => {
  const car = event.data;
  router.push({ name: 'car-detail', params: { id: car.id } });
};


onMounted(getCars);

</script>

<template>
<div>
 <DataTable
  v-model:filters="filters"
  :value="cars"
  filterDisplay="row"
  sortField="id"
  :sortOrder="-1"
  paginator
  :rows="10"
  :globalFilterFields="['make', 'model', 'variant', 'price', 'mileage']"
  @row-click="goToCarDetail"
>

  <template #header>
    <div class="flex justify-content-between">
      <PrimeButton type="button" icon="pi pi-filter-slash" label="Clear" outlined @click="clearFilter" />
      <IconField iconPosition="left">
        <InputIcon><i class="pi pi-search" /></InputIcon>
        <InputText v-model="filters['global'].value" placeholder="Search Cars" />
      </IconField>
    </div>
  </template>

  <PrimeColumn field="make" header="Make" sortable />
  <PrimeColumn field="model" header="Model" sortable />
  <PrimeColumn field="variant" header="Variant" sortable />
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


</template>
<style>

:deep(.p-datatable-tbody > tr) {
  cursor: pointer;
}

</style>