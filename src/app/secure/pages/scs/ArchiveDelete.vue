<template>
  <div class="p-4">
    <h2 class="text-2xl font-semibold mb-4">Archive & Delete</h2>

    <div class="grid">
      <!-- Archive Column -->
      <div class="col-12 md:col-6">
        <div class="p-4 border-round shadow-2 bg-white">
          <h3 class="text-xl font-medium mb-3">📦 Archive Items</h3>
          <p class="mb-3 text-sm text-gray-600">
            Archive vehicles that are no longer for sale but you want to keep for record.
          </p>

          <div class="grid">
            <div
              v-for="car in cars"
              :key="'archive-' + car.id"
              class="col-12"
            >
              <div
                class="p-3 border-1 border-round surface-border flex justify-content-between align-items-center transition-all cursor-pointer"
                :class="{
                  'bg-red-100': archiveSelection.includes(car),
                  'hover:bg-gray-100': !archiveSelection.includes(car)
                }"
                @click="toggleArchiveSelection(car)"
              >
                <div>
                  <h4 class="mb-1 text-md font-semibold text-gray-500">
                    {{ car.make }} {{ car.model }} ({{ car.registration }})
                  </h4>
                  <p class="text-sm text-gray-500 mb-0">
                    £{{ car.price }} • {{ car.engine_size }} • {{ car.year }}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <PrimeButton
            label="Archive Selected"
            icon="pi pi-box"
            class="p-button-warning w-full mt-3"
            @click="archiveSelected"
          />
        </div>
      </div>

      <!-- Delete Column -->
      <div class="col-12 md:col-6">
        <div class="p-4 border-round shadow-2 bg-white">
          <h3 class="text-xl font-medium mb-3">🗑️ Delete Permanently</h3>
          <p class="mb-3 text-sm text-gray-600">
            Permanently delete vehicles from the database. This cannot be undone.
          </p>

          <div class="grid">
            <div
              v-for="car in cars"
              :key="'delete-' + car.id"
              class="col-12"
            >
              <div
                class="p-3 border-1 border-round surface-border flex justify-content-between align-items-center transition-all cursor-pointer"
                :class="{
                  'bg-red-100': deleteSelection.includes(car),
                  'hover:bg-gray-100': !deleteSelection.includes(car)
                }"
                @click="toggleDeleteSelection(car)"
              >
                <div>
                  <h4 class="mb-1 text-md font-semibold text-gray-500">
                    {{ car.make }} {{ car.model }} ({{ car.registration }})
                  </h4>
                  <p class="text-sm text-gray-500 mb-0">
                    £{{ car.price }} • {{ car.engine_size }} • {{ car.year }}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <PrimeButton
            label="Delete Selected"
            icon="pi pi-trash"
            class="p-button-danger w-full mt-3"
            @click="deleteSelected"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import VehicleService from '@/services/VehicleService';
import PrimeButton from 'primevue/button';

const cars = ref([]);
const archiveSelection = ref([]);
const deleteSelection = ref([]);

onMounted(async () => {
  cars.value = await VehicleService.fetchAllVehicles();
});

const toggleArchiveSelection = (car) => {
  const index = archiveSelection.value.findIndex(c => c.id === car.id);
  if (index >= 0) {
    archiveSelection.value.splice(index, 1);
  } else {
    archiveSelection.value.push(car);
  }
};

const toggleDeleteSelection = (car) => {
  const index = deleteSelection.value.findIndex(c => c.id === car.id);
  if (index >= 0) {
    deleteSelection.value.splice(index, 1);
  } else {
    deleteSelection.value.push(car);
  }
};

const archiveSelected = () => {
  console.log('Archiving:', archiveSelection.value);
};

const deleteSelected = () => {
  console.log('Deleting:', deleteSelection.value);
};
</script>

<style scoped>
input[type="checkbox"] {
  width: 18px;
  height: 18px;
}
</style>
