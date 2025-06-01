<script setup lang="ts">
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { useToast } from 'primevue/usetoast';
import VehicleService from "@/services/VehicleService";
import { useVehicleStore } from "@/stores/vehicleData";

const toast = useToast();
const vehicleStore = useVehicleStore();
const vehicleData = ref();

// Form fields
const registrationNumber = ref("");
const reg = ref('');
const make = ref('');
const model = ref('');
const variant = ref('');
const year = ref('');
const price = ref('');
const was_price = ref('');
const mileage = ref('');
const fuel_type = ref('');
const body_style = ref('');
const colour = ref('');
const doors = ref('');
const veh_type = ref('Car');
const description = ref('');
const mileageRange = ref(50000);
const registrationSuccess = ref(false);
const seshId = sessionStorage.getItem('token');

// Image handling
const previewUrls = ref<string[]>([]);
const s3ImageKeys = ref<string[]>([]); // Store uploaded S3 image keys
const isUploading = ref(false); // Track upload state

const localFiles = ref<File[]>([]); // New: files stored for delayed upload

const onUpload = (event: any) => {
  const newFiles: File[] = event.files;

  newFiles.forEach(file => {
    localFiles.value.push(file);

    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        previewUrls.value.push(e.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  });
};


const clearImages = () => {
  previewUrls.value = [];
  s3ImageKeys.value = [];
  localFiles.value = [];
  toast.add({
    severity: 'info',
    summary: 'Cleared',
    detail: 'Images have been cleared',
    life: 3000
  });
};


const normalizeFuelType = (type: string) => {
  const val = type.toLowerCase();
  if (val.includes('diesel')) return 'Diesel';
  if (val.includes('petrol') || val.includes('gasoline')) return 'Petrol';
  if (val.includes('hybrid')) return 'Hybrid';
  if (val.includes('electric')) return 'Electric';
  return '';
};

const populateVehicleFields = () => {
  if (!vehicleData.value) return;
  reg.value = vehicleData.value.registration;
  make.value = vehicleData.value.make;
  model.value = vehicleData.value.model;
  year.value = vehicleData.value.manufactureDate?.split("-")[0] || '';
  fuel_type.value = normalizeFuelType(vehicleData.value.fuelType || '');
  colour.value = vehicleData.value.primaryColour;
  registrationNumber.value = vehicleData.value.registration;
  mileage.value = vehicleData.value.motTests?.[0]?.odometerValue?.replace(/[^0-9]/g, '') || '';
  mileageRange.value = parseInt(mileage.value) || 0;
};

const handleRegistrationNumberChange = async () => {
  try {
    const res = await VehicleService.getDvsaVehicleByReg(registrationNumber.value);
    vehicleData.value = res;
    vehicleStore.setVehicleData(res);
    registrationSuccess.value = true;
    populateVehicleFields();
  } catch (error) {
    toast.add({
      severity: "warn",
      summary: "Please Check Registration Entered",
      detail: "Error fetching vehicle data",
      life: 4000,
    });
    registrationSuccess.value = false;
  }
};

const validateForm = () => {
  const requiredFields = [
    { value: reg.value, name: 'Registration' },
    { value: make.value, name: 'Make' },
    { value: model.value, name: 'Model' },
    { value: price.value, name: 'Price' }
  ];

  const missingFields = requiredFields.filter(field => !field.value).map(field => field.name);

  if (missingFields.length > 0 || previewUrls.value.length === 0) {
    const missingMessage = missingFields.length > 0 
      ? `Missing fields: ${missingFields.join(', ')}. ` 
      : '';
    const imageMessage = previewUrls.value.length === 0 ? 'Please select at least one image.' : '';
    
    toast.add({
      severity: 'warn',
      summary: 'Missing Information',
      detail: missingMessage + imageMessage,
      life: 3000
    });
    return false;
  }
  return true;
};

const submitCar = async () => {
  if (!validateForm()) return;

  isUploading.value = true;
  s3ImageKeys.value = [];

  try {
    for (const file of localFiles.value) {
      const presignRes = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/admin/s3-presigned-url`,
        {
          filename: file.name,
          contentType: file.type,
          registration: registrationNumber.value
        },
        {
          headers: {
            Authorization: `Bearer ${seshId}`,
            'Content-Type': 'application/json'
          }
        }
      );

      const { url, key } = presignRes.data;

      await axios.put(url, file, {
        headers: {
          'Content-Type': file.type,
        }
      });

      s3ImageKeys.value.push(key);
    }

    const formData = new FormData();
    formData.append('make', make.value);
    formData.append('model', model.value);
    formData.append('variant', variant.value);
    formData.append('year', year.value);
    formData.append('price', price.value);
    formData.append('mileage', mileageRange.value.toString());
    formData.append('fuel_type', fuel_type.value);
    formData.append('colour', colour.value);
    formData.append('door', doors.value);
    formData.append('veh_type', veh_type.value);
    formData.append('description', description.value);
    formData.append('registration', registrationNumber.value);

    s3ImageKeys.value.forEach((key, index) => {
      formData.append(`car_images[${index}]`, key);
    });

    const response = await axios.post(
      `${import.meta.env.VITE_API_BASE_URL}/admin/vehicle-upload`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${seshId}`,
          'Content-Type': 'multipart/form-data'
        }
      }
    );

    if (response.status === 201) {
      toast.add({
        severity: 'success',
        summary: 'Success',
        detail: 'Car added successfully',
        life: 3000
      });
      // Reset everything
      clearImages();
      localFiles.value = [];
      reg.value = '';
      make.value = '';
      model.value = '';
      variant.value = '';
      year.value = '';
      price.value = '';
      was_price.value = '';
    }

  } catch (error) {
    console.error('Upload error:', error);
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: error.response?.data?.message || 'Failed to upload car data',
      life: 3000
    });
  } finally {
    isUploading.value = false;
  }
};


const removeImage = (index: number) => {
  previewUrls.value.splice(index, 1);
  s3ImageKeys.value.splice(index, 1);
  toast.add({
    severity: 'info',
    summary: 'Image Removed',
    detail: 'The image has been removed',
    life: 3000
  });
};

onMounted(() => {
  const storeData = vehicleStore.getVehicleData;
  if (storeData) {
    vehicleData.value = storeData;
    registrationNumber.value = storeData.registration || "";
    registrationSuccess.value = !!registrationNumber.value;
    populateVehicleFields();
  }
});
</script>

<template>
  <div>
    <PrimeToast />
    <div class="surface-section px-5 py-5 md:px-6 lg:px-8">
      <div class="text-3xl font-medium text-900 mb-4">Add New Car Listing</div>
      <div class="grid">
        <div class="col">
          <div>
            <div class="card">
              <FileUpload name="car_images" customUpload :auto="false" @uploader="onUpload" :multiple="true"
                accept="image/*" :disabled="isUploading">
                <template #empty>
                  <p>Drag and drop or browse to upload car images.</p>
                  <div v-if="previewUrls.length" class="mt-3 grid grid-cols-3 gap-2">
                    <div v-for="(url, index) in previewUrls" :key="index" class="relative">
                      <img :src="url" alt="Preview" class="w-full h-24 object-contain border-round bg-gray-100 p-1"
                        style="max-width: 120px; max-height: 161px;" />
                      <PrimeButton icon="pi pi-times"
                        class="absolute top-0 right-0 p-1 w-2rem h-2rem bg-white border-circle shadow-2"
                        @click.stop="removeImage(index)" />
                    </div>
                  </div>
                </template>
                <template #footer v-if="isUploading">
                  <ProgressBar mode="indeterminate" style="height: 6px" />
                </template>
              </FileUpload>
            </div>
          </div>
        </div>
        <div class="col">
          <InputGroup class="mb-5">
            <InputText v-model="registrationNumber" style="background-color: #fbe90a; border-color: #00309a"
              placeholder="REG" inputClass="'bg-transparent text-900 border-400 border-blue-500'"
              class="text-2xl text-500 font-bold" />
            <PrimeButton label="Type and click me" text @click="handleRegistrationNumberChange" />
          </InputGroup>
          <div class="field mt-2"><label>Registration</label>
            <InputText v-model="reg" class="w-full mt-2" />
          </div>
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
            <InputText v-model="year" class="w-full" />
          </div>
          <div class="field"><label>Price (£)</label>
            <InputText v-model="price" class="w-full" />
          </div>
          <div class="field"><label>Was Price (£)</label>
            <InputText v-model="was_price" class="w-full" />
          </div>
          <div class="field">
            <label>Mileage</label>
            <PrimeSlider v-model="mileageRange" :min="0" :max="200000" :step="1000" class="w-full mb-2" />
            <InputText v-model="mileageRange" class="w-full" />
          </div>
          <div class="field"><label>Fuel Type</label>
            <PrimeDropDown v-model="fuel_type" class="w-full" :options="['Petrol', 'Diesel', 'Hybrid', 'Electric']"
              placeholder="Select Fuel Type" />
          </div>
          <div class="field"><label>Body Style</label>
            <InputText v-model="body_style" class="w-full" />
          </div>
          <div class="field"><label>Colour</label>
            <InputText v-model="colour" class="w-full" />
          </div>
          <div class="field"><label>Doors</label>
            <InputText v-model="doors" class="w-full" />
          </div>
          <div class="field"><label>Vehicle Type</label>
            <InputText v-model="veh_type" class="w-full" />
          </div>
          <div class="field col-span-2"><label>Description</label>
            <PrimeTextarea v-model="description" class="w-full" rows="3" />
          </div>
          <PrimeButton label="Submit Car Listing" icon="pi pi-check" class="mt-3 w-full" @click="submitCar" 
            :loading="isUploading" />
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