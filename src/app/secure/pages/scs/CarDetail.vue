<script setup lang="ts">
import { onMounted, ref, computed } from 'vue';
import { useRoute } from 'vue-router';
import { useToast } from 'primevue/usetoast';
import axios from 'axios';

const route = useRoute();
const car = ref<any>(null);
const mainImage = ref('');
const activeIndex = ref(0);
const form = ref<any>({});
const seshId = sessionStorage.getItem('token');

// individual form fields
const make = ref('');
const model = ref('');
const variant = ref('');
const year = ref<number | null>(null);
const registration = ref('');
const price = ref<number | null>(null);
const mileage = ref<number | null>(null);
const fuel_type = ref('');
const colour = ref('');
const doors = ref<number | null>(null);
const veh_type = ref('');
const description = ref('');
const toast = useToast();
const files = ref<any[]>([]);

const fetchCar = async () => {
  try {
    const id = route.params.id;
    const config = {
      headers: {
        Authorization: 'Bearer ' + seshId,
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    };
    const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/get-vehicle-by-id/${id}`, config);
    car.value = res.data.car;
    form.value = { ...res.data.car };

    // set individual fields
    make.value = form.value.make || '';
    model.value = form.value.model || '';
    variant.value = form.value.variant || '';
    year.value = form.value.year || null;
    registration.value = form.value.registration || '';
    price.value = form.value.price || null;
    mileage.value = form.value.mileage || null;
    fuel_type.value = form.value.fuel_type || '';
    colour.value = form.value.colour || '';
    doors.value = form.value.doors || null;
    veh_type.value = form.value.veh_type || '';
    description.value = form.value.description || '';

    if (Array.isArray(car.value.images) && car.value.images.length > 0) {
      mainImage.value = car.value.images[0];
    }
  } catch (err) {
    console.error('Failed to load car data', err);
  }
};

const onUpload = async (event: any) => {
  // Prepare form data with all fields
  const formData = new FormData();
  formData.append('make', make.value);
  formData.append('model', model.value);
  formData.append('variant', variant.value);
  formData.append('year', year.value?.toString() || '');
  formData.append('registration', registration.value);
  formData.append('price', price.value?.toString() || '');
  formData.append('mileage', mileage.value?.toString() || '');
  formData.append('fuel_type', fuel_type.value);
  formData.append('colour', colour.value);
  formData.append('doors', doors.value?.toString() || '');
  formData.append('veh_type', veh_type.value);
  formData.append('description', description.value);

  // Add uploaded files to formData
  event.files.forEach((file: any) => {
    formData.append('car_images[]', file);
  });

  try {
    const config = {
      headers: {
        Authorization: 'Bearer ' + seshId,
        'Content-Type': 'multipart/form-data'
      }
    };

    const response = await axios.post(
      `${import.meta.env.VITE_API_BASE_URL}/admin/update-car/${car.value.id}`,
      formData,
      config
    );

    toast.add({ severity: 'info', summary: 'Success', detail: 'File Uploaded', life: 3000 });

    // Refresh car data after update
    await fetchCar();

  } catch (err) {
    console.error('Update failed', err);
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Failed to update car',
      life: 3000
    });
  }
};

const uploadUrl = computed(() => {
  return car.value?.id
    ? `${import.meta.env.VITE_API_BASE_URL}/admin/update-car/${car.value.id}`
    : '';
});
onMounted(fetchCar);
</script>

<template>
  <Toast />

  <div class="surface-section px-5 py-5 md:px-6 lg:px-8">
    <h2 class="text-2xl font-light">Edit Car Listing for <span class="font-bold">{{ form.registration }}</span></h2>
    <div class="grid">
      <div class="col-12 md:col-6 lg:col-6">
        <div class="card">
          <label>Images</label>
          <Toast />
          <FileUpload name="demo[]" :url="uploadUrl" @upload="onUpload($event)" :multiple="true" accept="image/*"
            :maxFileSize="1000000">
            <template #empty>
              <span>Drag and drop files to here to upload.</span>
            </template>
          </FileUpload>

        </div>
        <div class="mt-4">
          <h3 class="text-lg font-semibold mb-2">Gallery</h3>
          <div class="bg-white shadow rounded-md p-3">
            <div v-if="car?.images?.length" class="mb-6">
              <h4 class="font-medium mb-2">Existing Images</h4>
              <PrimeCarousel :value="car.images" :numVisible="1" :numScroll="1" :circular="true"
                class="carousel-container">
                <template #item="{ data }">
                  <div class="carousel-image-container">
                    <img :src="data" class="carousel-image" :alt="'Car image'" />
                  </div>
                </template>
              </PrimeCarousel>
            </div>
          </div>
        </div>
      </div>
      <div class="col-12 md:col-6 lg:col-6">

        <label>Registration</label>
        <InputGroup class="w-full h-4rem flex justify-center">
          <InputGroupAddon style="background-color: #00309a; color: #fbe90a">
            GB
          </InputGroupAddon>
          <InputText v-model="registration" style="background-color: #fbe90a; border-color: #00309a" placeholder="REG"
            inputClass="'bg-transparent text-900 border-400 border-blue-500'" class="text-5xl w-full text-100 font-bold"
            @input="registration.toUpperCase()" />
        </InputGroup>
        <div class="field"><label>Make</label>
          <InputText v-model="make" class="w-full" />
        </div>
        <div class="field"><label>Model</label>
          <InputText v-model="model" class="w-full" />
        </div>
        <div class="field"><label>Variant</label>
          <InputText v-model="variant" class="w-full" />
        </div>
        <div class="field"><label>Year</label>
          <InputText v-model="year" type="number" class="w-full" />
        </div>
        <div class="field"><label>Price</label>
          <InputText v-model="price" type="number" class="w-full" />
        </div>
        <div class="field"><label>Mileage</label>
          <InputText v-model="mileage" type="number" class="w-full" />
        </div>
        <div class="field"><label>Fuel Type</label>
          <InputText v-model="fuel_type" class="w-full" />
        </div>
        <div class="field"><label>Colour</label>
          <InputText v-model="colour" class="w-full" />
        </div>
        <div class="field"><label>Doors</label>
          <InputText v-model="doors" type="number" class="w-full" />
        </div>
        <div class="field"><label>Vehicle Type</label>
          <InputText v-model="veh_type" class="w-full" />
        </div>
        <div class="field col-span-2"><label>Description</label>
          <PrimeTextarea v-model="description" class="w-full" rows="3" />
        </div>

        <!-- <PrimeButton
            label="Submit Car Listing"
            icon="pi pi-check"
            class="mt-3 w-full"
            @click="submitCar"
            :loading="isUploading"
          /> -->
      </div>
    </div>




  </div>

</template>

<style scoped>
/* Your existing styles remain the same */
.thumbnail-image {
  width: 120px;
  height: 90px;
  object-fit: cover;
  border-radius: 4px;
}

.carousel-container {
  max-width: 600px;
  margin: 0 auto;
}

.carousel-image-container {
  width: 100%;
  height: 400px;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
}

.carousel-image {
  width: 100%;
  height: 100%;
  object-fit: contain;
  border-radius: 8px;
}

@media (max-width: 768px) {
  .carousel-image-container {
    height: 300px;
  }

  .thumbnail-image {
    width: 100px;
    height: 75px;
  }
}

.thumbnail-image {
  width: 120px;
  height: 120px;
  object-fit: cover;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
}

.remove-btn {
  position: absolute;
  top: -8px;
  right: -8px;
  width: 24px;
  height: 24px;
  background: rgb(0, 0, 0);
  border-radius: 50%;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  color: white;
}

@media (max-width: 480px) {
  .carousel-image-container {
    height: 250px;
  }
}

.input {
  @apply w-full border border-gray-300 rounded px-3 py-2;
}
</style>