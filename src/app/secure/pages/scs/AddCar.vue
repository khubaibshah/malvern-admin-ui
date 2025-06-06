<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import axios from 'axios';
import { useToast } from 'primevue/usetoast';
import VehicleService from "@/services/VehicleService";
import { useVehicleStore } from "@/stores/vehicleData";
import {
  DOOR_OPTIONS,
  KEY_OPTIONS,
  GEARBOX_OPTIONS,
  BODY_STYLE_OPTIONS
} from '@/constants/enums';
import { DEFAULT_CAR_DESCRIPTION } from '@/constants/defaultDescriptions';

import { getUkRegistrationLabel } from '@/utils/registration';
const doors = ref();
const numKeys = ref();
const gearbox = ref();
const bodyStyle = ref();
const engineSize = ref();

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
const colour = ref('');
const veh_type = ref('Car');
const description = ref('');
const mileageRange = ref(50000);
const registrationSuccess = ref(false);
const seshId = sessionStorage.getItem('token');

// Image handling
const previewUrls = ref<string[]>([]);
const localFiles = ref<File[]>([]);
const s3ImageKeys = ref<string[]>([]);
const isUploading = ref(false);
const mainImageIndex = ref(0); // Track main image index

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

const uploadImagesToS3 = async (): Promise<string[]> => {
  const uploadPromises = localFiles.value.map(async (file) => {
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
      headers: { 'Content-Type': file.type }
    });

    return key;
  });

  return Promise.all(uploadPromises);
};

const setMainImage = (index: number) => {
  mainImageIndex.value = index;
  toast.add({
    severity: 'success',
    summary: 'Main Image Set',
    detail: 'This image will be displayed as the primary image',
    life: 2000
  });
};

const clearImages = () => {
  previewUrls.value = [];
  s3ImageKeys.value = [];
  localFiles.value = [];
  mainImageIndex.value = 0;
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
  engineSize.value = vehicleData.value.engineSize;
  if (!description.value) {
    description.value = DEFAULT_CAR_DESCRIPTION;
  }

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

  if (missingFields.length > 0 || localFiles.value.length === 0) {
    const missingMessage = missingFields.length > 0
      ? `Missing fields: ${missingFields.join(', ')}. `
      : '';
    const imageMessage = localFiles.value.length === 0 ? 'Please select at least one image.' : '';

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
const formattedRegistrationDate = computed(() => {
  if (!vehicleData.value?.registrationDate) return '';
  return getUkRegistrationLabel(vehicleData.value.registrationDate);
});
const submitCar = async () => {
  if (!validateForm()) return;
  isUploading.value = true;

  try {
    const uploadedKeys = await uploadImagesToS3();
    s3ImageKeys.value = uploadedKeys;

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
    formData.append('main_image_index', mainImageIndex.value.toString());
    formData.append('registration_date', vehicleData.value.registrationDate || '');
    formData.append('was_price', was_price.value || '');
    formData.append('body_style', bodyStyle.value || '');
    formData.append('doors', doors.value || '');
    formData.append('gearbox', gearbox.value || '');
    formData.append('keys', numKeys.value || '');
    formData.append('engine_size', engineSize.value || '');


    uploadedKeys.forEach((key, index) => {
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
      clearImages();
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
const engineSizeLitres = computed(() => {
  if (!engineSize.value) return '';
  const cc = parseInt(engineSize.value);
  if (isNaN(cc)) return '';
  return (cc / 1000).toFixed(1) + 'L';
});

const removeImage = (index: number) => {
  previewUrls.value.splice(index, 1);
  localFiles.value.splice(index, 1);

  // Adjust main image index if needed
  if (mainImageIndex.value === index) {
    mainImageIndex.value = 0; // Reset to first image
  } else if (mainImageIndex.value > index) {
    mainImageIndex.value--; // Decrement if main image was after the removed one
  }

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
    <!-- {{ $filters.formatDate(vehicleData.registrationDate) }} -->
    <div class="surface-section px-5 py-5 md:px-6 lg:px-8">
      <div class="text-3xl font-medium text-900 mb-4">Add New Car Listing</div>
      <div class="grid">
        <div class="col">
          <div class="card">
            <FileUpload name="car_images" customUpload :auto="false" @uploader="onUpload" :multiple="true"
              accept="image/*" :disabled="isUploading">
              <template #empty>
                <p>Drag and drop or browse to select car images. First image will be main by default.</p>
                <div v-if="previewUrls.length" class="mt-3 grid grid-cols-3 gap-2">
                  <div v-for="(url, index) in previewUrls" :key="index" class="relative group"
                    @click="setMainImage(index)">
                    <PrimeImage :src="url" width="305px" height="250px" preview
                      class="border-2 transition-all duration-200 cursor-pointer w-full"
                      :class="{ 'border-primary-500 border-4': index === mainImageIndex }" />
                    <div
                      class="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <PrimeButton v-if="index !== mainImageIndex" icon="pi pi-star"
                        class="p-1 w-2rem h-2rem bg-white border-circle shadow-2" @click.stop="setMainImage(index)"
                        severity="secondary" />
                    </div>
                    <PrimeButton icon="pi pi-times"
                      class="absolute top-0 right-0 p-1 w-2rem h-2rem bg-white border-circle shadow-2"
                      @click.stop="removeImage(index)" />
                    <div v-if="index === mainImageIndex"
                      class="absolute top-0 left-0 bg-primary-500 text-white text-xs px-2 py-1 rounded-br">
                      Main Image
                    </div>
                  </div>
                </div>
              </template>
              <template #footer v-if="isUploading">
                <ProgressBar mode="indeterminate" style="height: 6px" />
              </template>
            </FileUpload>
          </div>
        </div>

        <div class="col">
          <div class="field"><label>Enter Registration</label></div>
          <InputGroup class="w-full h-4rem flex justify-center mb-3">
            <InputGroupAddon style="background-color: #00309a; color: #fbe90a">
              GB
            </InputGroupAddon>
            <InputText v-model="registrationNumber" style="background-color: #fbe90a; border-color: #00309a"
              placeholder="REG" inputClass="'bg-transparent text-900 border-400 border-blue-500'"
              class="text-5xl w-full text-100 font-bold" @input="registrationNumber.toUpperCase()" />
          </InputGroup>
          <PrimeButton label="Generate Car details" @click="handleRegistrationNumberChange" class="w-full" />
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
          <div class="field">
            <label>Registration Date</label>
            <InputText :value="formattedRegistrationDate" class="w-full" disabled />
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

          <div class="field">
            <label>Fuel Type</label>
            <PrimeDropDown v-model="fuel_type" class="w-full" :options="['Petrol', 'Diesel', 'Hybrid', 'Electric']"
              placeholder="Select Fuel Type" />
          </div>
          <div class="field"><label>Colour</label>
            <InputText v-model="colour" class="w-full" />
          </div>
          <div class="field">
            <label>Doors</label>
            <PrimeDropDown v-model="doors" :options="DOOR_OPTIONS" class="w-full" placeholder="Select doors" />
          </div>
          <div class="field">
            <label>Number of Keys</label>
            <PrimeDropDown v-model="numKeys" :options="KEY_OPTIONS" class="w-full" placeholder="Select keys" />
          </div>
          <div class="field">
            <label>Gearbox</label>
            <PrimeDropDown v-model="gearbox" :options="GEARBOX_OPTIONS" class="w-full" placeholder="Select gearbox" />
          </div>
          <div class="field">
            <label>Engine Size</label>
            <InputText v-model="engineSizeLitres" class="w-full" />
          </div>


          <div class="field">
            <label>Body Style</label>
            <PrimeDropDown v-model="bodyStyle" :options="BODY_STYLE_OPTIONS" class="w-full"
              placeholder="Select body style" />
          </div>
          <div class="field"><label>Vehicle Type</label>
            <InputText v-model="veh_type" class="w-full" />
          </div>

          <div class="field col-span-2">
            <label>Description</label>
            <!-- <PrimeEditor v-model="description" editorStyle="height: 320px" /> -->
            <PrimeTextarea v-model="description" class="w-full" rows="10" />
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

.group:hover .group-hover\:opacity-100 {
  opacity: 1;
}
</style>