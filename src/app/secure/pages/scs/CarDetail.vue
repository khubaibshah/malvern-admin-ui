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

const fetchCar = async () => {
  try {
    const id = route.params.id;
    const res = await axios.get(`http://127.0.0.1:8000/api/get-car-by-id/${id}`);
    car.value = res.data;
    form.value = { ...res.data }; // Pre-fill editable form
    if (car.value.images?.length) {
      mainImage.value = `data:image/jpeg;base64,${car.value.images[0].car_image}`;
    }
  } catch (err) {
    console.error('Failed to load car data', err);
  }
};

const setMainImage = (index: number) => {
  activeIndex.value = index;
  mainImage.value = `data:image/jpeg;base64,${car.value.images[index].car_image}`;
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
  Object.keys(form.value).forEach((key) => formData.append(key, form.value[key]));
  newImages.value.forEach((file, i) => formData.append(`car_images[${i}]`, file));

  try {
    await axios.post(`http://127.0.0.1:8000/api/update-car/${car.value.id}`, formData);
    alert('Car updated successfully');
  } catch (err) {
    console.error('Update failed', err);
    alert('Failed to update car');
  }
};

onMounted(fetchCar);
</script>

<template>
  <div class="surface-section px-4 pt-5 md:px-6 lg:px-8 car-details-container">
    <div
      class="flex md:align-items-center md:justify-content-between flex-column md:flex-row pb-4 border-bottom-1 surface-border ">
      <h2 class="text-2xl font-light">Edit Car Listing <span class="font-bold">{{ form.make +' '+ form.model + ' ' +form.variant}}</span></h2>
    </div>
  </div>

  <div class="p-6 md:p-8">

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <!-- Image section -->
      <div class="card flex justify-center">
        <!-- Image section using PrimeImage -->
        <div class="flex flex-wrap gap-4 mb-6">
          <!-- Existing images from DB -->
          <PrimeImage v-for="(img, index) in car?.images" :key="'existing-' + index" preview
            width="250" :alt="`Car image ${index + 1}`"
            :src="`data:image/jpeg;base64,${img.car_image}`" />

          <!-- Preview of newly uploaded images -->
          <PrimeImage v-for="(url, index) in previewUrls" :key="'new-' + index" preview
            width="250" :alt="`New image ${index + 1}`" :src="url" />
        </div>

      </div>
      <div>
        <InputText type="file" multiple @change="onImageUpload" />
      </div>

      <!-- Editable Form -->
      <div class="space-y-4">
        <div><label>Make</label>
          <InputText v-model="form.make" class="input" />
        </div>
        <div><label>Model</label>
          <InputText v-model="form.model" class="input" />
        </div>
        <div><label>Variant</label>
          <InputText v-model="form.variant" class="input" />
        </div>
        <div><label>Price</label>
          <InputText v-model="form.price" type="number" class="input" />
        </div>
        <div><label>Was Price</label>
          <InputText v-model="form.was_price" type="number" class="input" />
        </div>
        <div><label>Mileage</label>
          <InputText v-model="form.mileage" type="number" class="input" />
        </div>
        <div><label>Fuel Type</label>
          <InputText v-model="form.fuel_type" class="input" />
        </div>
        <div><label>Doors</label>
          <InputText v-model="form.doors" type="number" class="input" />
        </div>
        <div><label>Vehicle Type</label>
          <InputText v-model="form.veh_type" class="input" />
        </div>
        <div><label>Body Style</label>
          <InputText v-model="form.body_style" class="input" />
        </div>
        <div><label>Colour</label>
          <InputText v-model="form.colour" class="input" />
        </div>
        <div><label>Year</label>
          <InputText v-model="form.year" class="input" />
        </div>
        <div><label>Subtitle</label>
          <InputText v-model="form.subtitle" class="input" />
        </div>
        <div><label>Description</label>
          <PrimeTextarea v-model="form.description" class="input"></PrimeTextarea>
        </div>
      </div>
    </div>

    <div class="mt-6">
      <PrimeButton class="bg-blue-600 text-white px-4 py-2 rounded" @click="submitUpdate">Update Listing</PrimeButton>
    </div>
  </div>
</template>

<style scoped>
.input {
  @apply w-full border border-gray-300 rounded px-3 py-2;
}
</style>
