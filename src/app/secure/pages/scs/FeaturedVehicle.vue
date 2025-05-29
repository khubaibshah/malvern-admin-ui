<script setup lang="ts">
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { FilterMatchMode } from 'primevue/api';
import { useRouter } from 'vue-router';


const seshId = sessionStorage.getItem('token')
const cars = ref([]);
const filters = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS }
});

const router = useRouter();

const getCars = async () => {
  try {
    const config = {
      headers: {
        Authorization: 'Bearer ' + seshId,
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    }
    const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/admin/get-all-vehicles`, config);
console.log('API response:', res.data);
cars.value = res.data.cars;   } catch (error) {
    console.error('Failed to fetch cars', error);
  }
};


// const products = ref();
// const getSeverity = (product) => {
//     switch (product.inventoryStatus) {
//         case 'INSTOCK':
//             return 'success';

//         case 'LOWSTOCK':
//             return 'warn';

//         case 'OUTOFSTOCK':
//             return 'danger';

//         default:
//             return null;
//     }
// };

onMounted(getCars);
</script>

  
<template>
  <div class="surface-section px-5 py-5 md:px-6 lg:px-12">
    <div class="text-3xl font-medium text-900 mb-4">Select Featured Vehicle</div>

    
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <PrimeCard
        v-for="(car, index) in cars"
        :key="index"
        class="shadow-2"
        style="width: 100%; max-width: 24rem"
      >
        <!-- Header (Image) -->
        <template #header>
          <img
            :src="car.images?.[0] || 'https://via.placeholder.com/300x180?text=No+Image'"
            :alt="`${car.make} ${car.model}`"
            class="w-full h-[180px] object-cover rounded-t"
          />
        </template>

        <!-- Title -->
        <template #title>
          {{ car.make }} {{ car.model }}
        </template>

        <!-- Subtitle -->
        <template #subtitle>
          {{ car.variant || 'No Variant' }} • {{ car.year || 'N/A' }}
        </template>

        <!-- Content -->
        <template #content>
          <p class="text-sm text-gray-600 mb-2">
            {{ car.description || 'No description available.' }}
          </p>
          <div class="flex gap-2 text-sm text-gray-800 font-medium flex-wrap">
            <span>Mileage: {{ car.mileage?.toLocaleString() || 'N/A' }} miles</span>
            <span>•</span>
            <span>£{{ parseFloat(car.price).toLocaleString() || 'N/A' }}</span>
          </div>
          <div class="mt-2 text-sm text-gray-600">
            Reg: {{ car.registration }} • Fuel: {{ car.fuel_type }} • {{ car.doors }} doors
          </div>
        </template>

        <!-- Footer -->
        <template #footer>
          <div class="flex gap-2">
            <PrimeButton icon="pi pi-heart" severity="secondary" outlined class="w-full" />
            <PrimeButton
              icon="pi pi-plus"
              label="Make Featured"
              class="w-full"
              @click="router.push(`/vehicles/${car.id}`)"
            />
          </div>
        </template>
      </PrimeCard>
    </div>
  </div>
</template>
