<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import axios from 'axios';

const route = useRoute();
const car = ref<any>(null);
const mainImage = ref('');
const activeIndex = ref(0);
const form = ref<any>({});
const newImages = ref<File[]>([]);
const previewUrls = ref<string[]>([]);
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

const setMainImage = (index: number) => {
  activeIndex.value = index;
  mainImage.value = car.value.images[index];
};

const onImageUpload = (event: Event) => {
  const files = (event.target as HTMLInputElement).files;
  if (files) {
    Array.from(files).forEach((file) => {
      newImages.value.push(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) previewUrls.value.push(e.target.result as string);
      };
      reader.readAsDataURL(file);
    });
  }
};

const submitUpdate = async () => {
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
  newImages.value.forEach((file, i) => formData.append(`car_images[${i}]`, file));

  try {
    const config = {
      headers: {
        Authorization: 'Bearer ' + seshId,
        'Content-Type': 'multipart/form-data',
        'Access-Control-Allow-Origin': '*'
      }
    };
    await axios.post(`${import.meta.env.VITE_API_BASE_URL}/admin/update-car/${car.value.id}`, formData, config);
    alert('Car updated successfully');
  } catch (err) {
    console.error('Update failed', err);
    alert('Failed to update car');
  }
};

onMounted(fetchCar);
</script>


<template>
  <div class="surface-section pt-5 md:px-6 lg:px-8 car-details-container">
    <div
      class="flex md:align-items-center md:justify-content-between flex-column md:flex-row pb-4 border-bottom-1 surface-border mb-3">
      <h2 class="text-2xl font-light">Edit Car Listing for <span class="font-bold">{{ form.registration }}</span></h2>
    </div>
    <div class="grid">
      <div class="col">
        <label>Images</label>
        <InputText type="file" multiple @change="onImageUpload" class="w-full mt-2" />

        <div class="mt-4">
          <h3 class="text-lg font-semibold mb-2">Gallery</h3>
          <div v-if="car?.images?.length" class="bg-white shadow rounded-md p-3">
            <PrimeCarousel :value="car.images" :numVisible="1" :numScroll="1" :circular="true" :autoplayInterval="4000"
              :responsiveOptions="[
                { breakpoint: '1400px', numVisible: 1, numScroll: 1 },
                { breakpoint: '1024px', numVisible: 1, numScroll: 1 },
                { breakpoint: '768px', numVisible: 1, numScroll: 1 }
              ]">
              <template #item="{ data, index }">
                <div class="relative cursor-pointer" @click="mainImage = data">
                  <PrimeImage :src="data"
                    class="w-full h-[280px] object-cover rounded-lg hover:scale-105 transition-transform duration-300"
                    :alt="'Image ' + index" />
                </div>
              </template>
            </PrimeCarousel>
          </div>
          <p v-else class="text-gray-500 italic mt-2">No images available for this vehicle.</p>
        </div>

      </div>

      <div class="col">
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
        <div class="field"><label>Registration</label>
          <InputText v-model="registration" class="w-full bg-gray-100" readonly />
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
        <PrimeButton class="w-full rounded" label="Update Listing" @click="submitUpdate"></PrimeButton>
      </div>
    </div>
  </div>
</template>

<style scoped>
.input {
  @apply w-full border border-gray-300 rounded px-3 py-2;
}
</style>
