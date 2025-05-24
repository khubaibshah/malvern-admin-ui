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
const seshId = sessionStorage.getItem('token')
const fetchCar = async () => {
  try {
    const id = route.params.id;
    const config = {
      headers: {
        Authorization: 'Bearer ' + seshId,
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    }
    const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/get-vehicle-by-id/${id}`, config);
    car.value = res.data.car;
    form.value = { ...res.data.car }; // Pre-fill editable form
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
  Object.keys(form.value).forEach((key) => formData.append(key, form.value[key]));
  newImages.value.forEach((file, i) => formData.append(`car_images[${i}]`, file));

  try {
    const config = {
      headers: {
        Authorization: 'Bearer ' + token,
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    }
    await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/update-car/${car.value.id}`, formData, config);
    
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
    <div class="flex md:align-items-center md:justify-content-between flex-column md:flex-row pb-4 border-bottom-1 surface-border mb-3">
      <h2 class="text-2xl font-light">Edit Car Listing <span class="font-bold">{{ form.make + ' ' + form.model + ' ' + form.variant }}</span></h2>
    </div>
    <div class="grid">
      <div class="col">
        <label>Images</label>
        <InputText type="file" multiple @change="onImageUpload" class="w-full mt-2" />

        <div class="mt-3">
          <div v-if="mainImage">
            <PrimeImage :src="mainImage" alt="Main" 
             width="400"
             height="180"
            preview/>
          </div>

          <div class="flex gap-2 flex-wrap">
            <PrimeImage
              v-for="(img, index) in car?.images"
              :key="'existing-' + index"
              :src="img"
              :alt="'Car image ' + index"
              width="100"
              class="cursor-pointer border-round"
              @click="setMainImage(index)"
              preview
            />
          </div>

          <div class="mt-2">
            <div class="text-sm text-gray-500">New Images:</div>
            <div class="flex gap-2 flex-wrap mt-1">
              <PrimeImage
                v-for="(url, index) in previewUrls"
                :key="'new-' + index"
                :src="url"
                width="100"
                class="border-round"
                preview
              />
            </div>
          </div>
        </div>
      </div>

      <div class="col">
        <div class="field" v-for="(value, key) in form" :key="key" v-if="typeof value !== 'object'">
          <label :for="key">{{ key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) }}</label>
          <InputText v-model="form[key]" :type="typeof value === 'number' ? 'number' : 'text'" class="w-full input" />
        </div>
        <div class="field"><label>Description</label>
          <PrimeTextarea v-model="form.description" class="w-full input"></PrimeTextarea>
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
