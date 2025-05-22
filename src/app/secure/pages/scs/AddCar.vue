<script setup lang="ts">
import { ref } from 'vue';
import axios from 'axios';
import { useToast } from 'primevue/usetoast';

const toast = useToast();

const make = ref('');
const model = ref('');
const variant = ref('');
const year = ref('');
const price = ref('');
const was_price = ref('');
const images = ref<File[]>([]);
const mileage = ref('');
const fuel_type = ref('');
const body_style = ref('');
const colour = ref('');
const doors = ref('');
const veh_type = ref('');
const subtitle = ref('');
const description = ref('');
const previewUrls = ref<string[]>([]);
const mileageRange = ref(50000);

const onUpload = (event: any) => {
  const newFiles: File[] = event.files;
  newFiles.forEach((file) => {
    images.value.push(file);
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        previewUrls.value.push(e.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  });
};

const submitCar = async () => {
  if (!make.value || !model.value || !price.value || images.value.length === 0) {
    toast.add({
      severity: 'warn',
      summary: 'Missing Fields',
      detail: 'Please fill all required fields and select at least one image.',
      life: 3000
    });
    return;
  }

  const formData = new FormData();
  formData.append('make', make.value);
  formData.append('model', model.value);
  formData.append('variant', variant.value);
  formData.append('year', year.value);
  formData.append('price', price.value);
  formData.append('was_price', was_price.value);
  formData.append('mileage', mileage.value);
  formData.append('fuel_type', fuel_type.value);
  formData.append('body_style', body_style.value);
  formData.append('colour', colour.value);
  formData.append('doors', doors.value);
  formData.append('veh_type', veh_type.value);
  formData.append('subtitle', subtitle.value);
  formData.append('description', description.value);

  images.value.forEach((file) => {
    formData.append('car_images[]', file);
  });


  try {
    const response = await axios.post('http://127.0.0.1:8000/api/upload-scs-car', formData);
    if (response.status === 201) {
      toast.add({ severity: 'success', summary: 'Success', detail: 'Car added successfully', life: 3000 });
      make.value = model.value = variant.value = year.value = price.value = was_price.value = '';
      images.value = [];
      previewUrls.value = [];
    }
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Failed to upload car data',
      life: 3000
    });
  }
};
</script>

<template>
  <div>
    <PrimeToast />
    <div class="surface-section px-5 py-5 md:px-6 lg:px-8">
      <div class="text-3xl font-medium text-900 mb-4">Add New Car Listing</div>
      <div class="grid">
        <!-- Image Upload -->
        <div class="col-12 md:col-6">
          <div class="card">
            <FileUpload name="car_images" customUpload :auto="true" @uploader="onUpload" :multiple="true"
              accept="image/*" :maxFileSize="5000000" previewWidth="100">
              <template #empty>
                <p>Drag and drop or browse to upload car images.</p>
              </template>
            </FileUpload>

            <div v-if="previewUrls.length" class="mt-3 grid grid-nogutter">
              <div v-for="(url, index) in previewUrls" :key="index" class="col-4 p-1">
                <img :src="url" alt="Preview" class="w-full border-round"
                  style="max-height: 150px; object-fit: cover;" />
              </div>
            </div>

            <PrimeButton label="Clear Images" icon="pi pi-times" severity="secondary" class="mt-2"
              @click="() => { images.value = []; previewUrls.value = [] }" />
          </div>
        </div>

        <!-- Car Info Form -->
        <div class="col-12 md:col-6">
          <div class="p-fluid">
            <div class="field">
              <label for="make">Make</label>
              <InputText v-model="make" id="make" class="w-full" />
            </div>
            <div class="field">
              <label for="model">Model</label>
              <InputText v-model="model" id="model" class="w-full" />
            </div>
            <div class="field">
              <label for="variant">Variant</label>
              <InputText v-model="variant" id="variant" class="w-full" />
            </div>
            <div class="field">
              <label for="year">Year</label>
              <InputText v-model="year" id="year" class="w-full" />
            </div>
            <div class="field">
              <label for="price">Price (£)</label>
              <InputText v-model="price" id="price" class="w-full" />
            </div>
            <div class="field">
              <label for="was_price">Was Price (£)</label>
              <InputText v-model="was_price" id="was_price" class="w-full" />
            </div>
            <div class="field">
              <label for="mileage">Mileage</label>
              <div class="w-56">
                <label for="mileage">Mileage</label>
                <PrimeSlider v-model="mileageRange" :min="0" :max="200000" :step="1000" class="w-full mb-2" />
                <InputText v-model="mileageRange" id="mileage" class="w-full" />
              </div>
            </div>
            <div class="field">
              <label for="fuel_type">Fuel Type</label>
              <PrimeDropDown v-model="fuel_type" :options="['Petrol', 'Diesel', 'Hybrid', 'Electric']"
                placeholder="Select Fuel Type" />
            </div>
            <div class="field">
              <label for="body_style">Body Style</label>
              <InputText v-model="body_style" id="body_style" class="w-full" />
            </div>
            <div class="field">
              <label for="colour">Colour</label>
              <InputText v-model="colour" id="colour" class="w-full" />
            </div>
            <div class="field">
              <label for="doors">Doors</label>
              <InputText v-model="doors" id="doors" class="w-full" />
            </div>
            <div class="field">
              <label for="veh_type">Vehicle Type</label>
              <InputText v-model="veh_type" id="veh_type" class="w-full" />
            </div>
            <div class="field">
              <label for="subtitle">Subtitle</label>
              <InputText v-model="subtitle" id="subtitle" class="w-full" />
            </div>
            <div class="field">
              <label for="description">Description</label>
              <PrimeTextarea v-model="description" id="description" class="w-full" rows="3" />
            </div>
            <PrimeButton label="Submit Car Listing" icon="pi pi-check" class="mt-3" @click="submitCar" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.surface-section {
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}
</style>