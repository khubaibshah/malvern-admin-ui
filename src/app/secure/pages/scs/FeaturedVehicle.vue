<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useToast } from 'primevue/usetoast';
import VehicleService from '@/services/VehicleService';

const cars = ref([]);
const toast = useToast();
const router = useRouter();

const makeFeatured = async (carId: number) => {
  try {
    await VehicleService.setFeaturedVehicle(carId); // optional: abstract this too
    toast.add({ severity: 'success', summary: 'Success', detail: 'Featured vehicle updated!', life: 3000 });
    await getCars(true);
  } catch (error) {
    console.error('Failed to set featured car', error);
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Could not set featured vehicle. Please try again.',
      life: 4000
    });
  }
};

const getCars = async (refresh = false) => {
  try {
    cars.value = await VehicleService.fetchAllVehicles(refresh);
  } catch (error) {
    console.error('Failed to fetch cars', error);
    toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to load cars.', life: 4000 });
  }
};
const toggleFeatured = async (carId: number) => {
  const alreadyFeatured = cars.value.filter(car => car.featured === 1);
  const car = cars.value.find(c => c.id === carId);

  if (!car) return;

  const isCurrentlyFeatured = car.featured === 1;

  // Limit to 3 featured vehicles
  if (!isCurrentlyFeatured && alreadyFeatured.length >= 3) {
    toast.add({
      severity: 'warn',
      summary: 'Limit reached',
      detail: 'Only 3 vehicles can be featured at a time.',
      life: 3000
    });
    return;
  }

  try {
    await VehicleService.setFeaturedVehicle(carId);
    await getCars(true);

    toast.add({
      severity: 'success',
      summary: isCurrentlyFeatured ? 'Unfeatured' : 'Featured',
      detail: `${car.make} ${car.model} (${car.registration}) has been ${isCurrentlyFeatured ? 'removed from' : 'added to'} featured vehicles.`,
      life: 3000
    });
  } catch (error) {
    console.error('Toggle featured failed', error);
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Failed to update featured status.',
      life: 4000
    });
  }
};




onMounted(getCars);
</script>

<template>
  <PrimeToast />
  <div class="surface-section px-5 py-5 md:px-6 lg:px-12">
    <div class="flex items-center justify-between mb-4">
      <div class="text-3xl font-medium text-900">Select Featured Vehicle</div>
      <PrimeButton icon="pi pi-refresh" class="p-button-sm ml-4" @click="() => getCars(true)" />
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <PrimeCard v-for="(car, index) in cars" :key="index" class="shadow-2 relative"
        style="width: 100%; max-width: 24rem">
        <!-- Header (Image) -->
        <template #header>
          <PrimeTag v-if="car.featured === 1" value="Featured" severity="success" class="absolute top-2 left-2" />
          <img :src="car.images?.[0] || 'https://via.placeholder.com/300x180?text=No+Image'"
            :alt="`${car.make} ${car.model}`" class="w-full h-[180px] object-cover rounded-t" />
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
            <PrimeButton :icon="car.featured === 1 ? 'pi pi-check-square' : 'pi pi-plus'"
              :label="car.featured === 1 ? 'Unfeature' : 'Make Featured'" class="w-full"
              :severity="car.featured === 1 ? 'warning' : 'primary'" @click="toggleFeatured(car.id)" />

          </div>
        </template>
      </PrimeCard>
    </div>
  </div>
</template>
