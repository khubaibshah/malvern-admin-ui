<template>
  <div class="p-4">
    <h2 class="text-2xl font-semibold mb-4">Archive</h2>

    <div class="grid">
      <!-- Archive Column -->
      <div class="col-12 md:col-6">
        <div class="p-4 border-round shadow-2 bg-white">
          <h3 class="text-xl font-medium mb-3">📦 Archive Items</h3>
          <p class="mb-3 text-sm text-gray-600">
            Archive vehicles that are no longer for sale but you want to keep for record.
          </p>

          <div class="grid">
            <div v-for="car in cars" :key="'archive-' + car.id" class="col-12">
              <div
                class="p-3 border-1 border-round surface-border flex justify-content-between align-items-center transition-all cursor-pointer"
                :class="{
                  'bg-red-100': archiveSelection.includes(car),
                  'hover:bg-gray-100': !archiveSelection.includes(car)
                }" @click="toggleArchiveSelection(car)">
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

          <PrimeButton label="Archive Selected" icon="pi pi-box" class="p-button-warning w-full mt-3"
            @click="archiveSelected()" />
        </div>
      </div>
      <!-- archived vehicle column -->
      <div class="col-12 md:col-6">
        <div class="p-4 border-round shadow-2 bg-white">
          <h3 class="text-xl font-medium mb-3">🗃️ Archived Vehicles</h3>
          <p class="mb-3 text-sm text-gray-600">Click a vehicle to restore it.</p>

          <div v-if="archivedCars.length">
            <div class="grid">
              <div v-for="car in archivedCars" :key="'archived-' + car.id" class="col-12">
                <div
                  class="p-3 border-1 border-round surface-border flex justify-content-between align-items-center transition-all cursor-pointer"
                  :class="{
                    'bg-green-100': restoreSelection.includes(car),
                    'hover:bg-gray-100': !restoreSelection.includes(car)
                  }" @click="toggleRestoreSelection(car)">

                  <div>
                    <h4 class="mb-1 text-md font-semibold text-gray-500">
                      {{ car.make }} {{ car.model }} ({{ car.registration }})
                    </h4>
                    <p class="text-sm text-gray-500 mb-0">
                      £{{ car.price }} • {{ car.engine_size }} • {{ car.year }}
                    </p>
                  </div>

                </div>
                <PrimeButton label="Restore Selected" icon="pi pi-refresh" class="p-button-warning w-full mt-3"
                  @click="restoreVehicle(car.id)" />
              </div>

            </div>

          </div>
          <div v-else class="text-sm text-gray-500">No archived vehicles found.</div>
        </div>
      </div>


      <!-- Delete Column -->
      <div class="col-12 md:col-6">
        <h2 class="text-2xl font-semibold mb-4">Delete</h2>
        <div class="p-4 border-round shadow-2 bg-white">
          <h3 class="text-xl font-medium mb-3">🗑️ Delete Permanently</h3>
          <p class="mb-3 text-sm text-gray-600">
            Permanently delete vehicles from the database. This cannot be undone.
          </p>

          <div class="grid">
            <div v-for="car in cars" :key="'delete-' + car.id" class="col-12">
              <div
                class="p-3 border-1 border-round surface-border flex justify-content-between align-items-center transition-all cursor-pointer"
                :class="{
                  'bg-red-100': deleteSelection.includes(car),
                  'hover:bg-gray-100': !deleteSelection.includes(car)
                }" @click="toggleDeleteSelection(car)">
                <div>
                  <h4 class="mb-1 text-md font-semibold text-gray-500">
                    {{ car.make }} {{ car.model }} ({{ car.registration }})
                  </h4>
                  <p class="text-sm text-gray-500 mb-0">
                    £{{ car.price }} • {{ car.engine_size }} • {{ car.year }}
                  </p>
                </div>
              </div>
              <PrimeButton label="Delete Selected" icon="pi pi-trash" class="p-button-danger w-full mt-3"
                @click="deleteSelected" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <PrimeDialog v-model:visible="confirmDeleteVisible" modal header="Confirm Deletion" :style="{ width: '400px' }">
    <p class="m-0 text-sm">
      Are you sure you want to permanently delete the selected vehicle(s)? This action cannot be undone.
    </p>

    <template #footer>
      <PrimeButton label="Cancel" icon="pi pi-times" class="p-button-text" @click="confirmDeleteVisible = false" />
      <PrimeButton label="Delete" icon="pi pi-trash" class="p-button-danger" @click="confirmDelete()" />
    </template>
  </PrimeDialog>

</template>

<script setup>
import { ref, onMounted } from 'vue';
import VehicleService from '@/services/VehicleService';
import PrimeButton from 'primevue/button';
import { useToast } from 'primevue/usetoast';

const toast = useToast();
const cars = ref([]);
const archiveSelection = ref([]);
const deleteSelection = ref([]);
const archivedCars = ref([]);
const confirmDeleteVisible = ref(false); // dialog visibility
const restoreSelection = ref([]);


const fetchAllData = async (forceRefresh = false) => {
  try {
    cars.value = await VehicleService.fetchAllVehicles(forceRefresh); // force refresh upon change
    archivedCars.value = await VehicleService.getArchivedVehicles();
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: 'Load Failed',
      detail: 'Failed to load vehicle data.',
      life: 4000
    });
  }
};


onMounted(fetchAllData);

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

const restoreVehicle = async (carId) => {
  try {
    await VehicleService.archiveVehicles({
      vehicle_ids: [carId],
      action: 'restore'
    });

    const index = archivedCars.value.findIndex(c => c.id === carId);
    if (index !== -1) {
      const restoredCar = archivedCars.value.splice(index, 1)[0];
      cars.value.push(restoredCar); // 🔁 Add back to active cars
    }

    toast.add({
      severity: 'success',
      summary: 'Restored',
      detail: `Vehicle ID ${carId} has been restored.`,
      life: 3000
    });
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: 'Restore Failed',
      detail: 'Failed to restore vehicle.',
      life: 4000
    });
  }
};


const archiveSelected = async () => {
  if (!archiveSelection.value.length) return;

  const vehicleIds = archiveSelection.value.map(car => car.id);

  try {
    await VehicleService.archiveVehicles({
      vehicle_ids: vehicleIds,
      action: 'archive'
    });

    const names = archiveSelection.value.map(car => `${car.make} ${car.model}`).join(', ');
    toast.add({
      severity: 'success',
      summary: 'Archived',
      detail: `Archived: ${names}`,
      life: 4000
    });

    // Move archived cars from active to archived list
    archiveSelection.value.forEach(car => {
      const index = cars.value.findIndex(c => c.id === car.id);
      if (index !== -1) {
        cars.value.splice(index, 1);
        archivedCars.value.push(car);
      }
    });

    archiveSelection.value = [];
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: 'Archive Failed',
      detail: 'Failed to archive selected vehicles.',
      life: 4000
    });
  }
};



// Trigger dialog from button
const deleteSelected = () => {
  if (!deleteSelection.value.length) {
    toast.add({
      severity: 'warn',
      summary: 'No Selection',
      detail: 'Please select vehicle(s) to delete.',
      life: 3000
    });
    return;
  }

  // Log full vehicle objects
  console.log('Vehicles selected for deletion:', deleteSelection.value);

  confirmDeleteVisible.value = true;
};


// Handle confirm delete
const confirmDelete = async () => {
  try {
    const vehicleIds = deleteSelection.value.map(car => car.id);

    console.log('Deleting vehicle IDs:', vehicleIds);
    console.log('Full vehicle data:', deleteSelection.value);

    await VehicleService.deleteVehicles(vehicleIds);

    toast.add({
      severity: 'success',
      summary: 'Deleted',
      detail: 'Selected vehicle(s) have been deleted permanently.',
      life: 3000
    });

    // Remove deleted vehicles from the list
    deleteSelection.value.forEach(car => {
      const i = cars.value.findIndex(c => c.id === car.id);
      if (i !== -1) cars.value.splice(i, 1);
    });

    deleteSelection.value = [];
    confirmDeleteVisible.value = false;
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: 'Delete Failed',
      detail: 'Could not delete selected vehicles.',
      life: 4000
    });
  }
};


const toggleRestoreSelection = (car) => {
  const index = restoreSelection.value.findIndex(c => c.id === car.id);
  if (index >= 0) {
    restoreSelection.value.splice(index, 1);
  } else {
    restoreSelection.value.push(car);
  }
};

</script>



<style scoped>
input[type="checkbox"] {
  width: 18px;
  height: 18px;
}
</style>
