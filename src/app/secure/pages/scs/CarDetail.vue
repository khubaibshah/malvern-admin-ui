<script setup lang="ts">
import { onMounted, ref, computed } from 'vue';
import { useRoute } from 'vue-router';
import { useToast } from 'primevue/usetoast';
import axios from 'axios';

const route = useRoute();
const toast = useToast();
const seshId = sessionStorage.getItem('token');

const car = ref<any>(null);
const form = ref<any>({});

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

const newImages = ref<File[]>([]);
const removedImages = ref<string[]>([]);
const mainImage = ref<string>('');

const selectMainImage = (imgUrl: string) => {
  mainImage.value = imgUrl;
};

const fetchCar = async () => {
  try {
    const id = route.params.id;
    const config = {
      headers: {
        Authorization: 'Bearer ' + seshId,
        'Content-Type': 'application/json',
      }
    };
    const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/get-vehicle-by-id/${id}`, config);
    car.value = res.data.car;
    form.value = { ...res.data.car };

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
      mainImage.value = car.value.main_image || car.value.images[0];
    }
  } catch (err) {
    console.error('Failed to load car data', err);
  }
};

const handleFileSelect = (event: any) => {
  event.files.forEach((file: File) => newImages.value.push(file));
};

const updateCar = async () => {
  try {
    const uploadedKeys: string[] = [];
    for (const file of newImages.value) {
      const { data } = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/admin/s3-presigned-url`, {
        filename: file.name,
        contentType: file.type,
        registration: registration.value,
      }, {
        headers: { Authorization: `Bearer ${seshId}` }
      });

      await axios.put(data.url, file, { headers: { 'Content-Type': file.type } });
      uploadedKeys.push(data.key);
    }

    const updatedImages = [
      ...car.value.images.filter((img: string) => !removedImages.value.includes(img)),
      ...uploadedKeys
    ];

    const payload = {
      make: make.value,
      model: model.value,
      variant: variant.value,
      year: year.value,
      registration: registration.value,
      price: price.value,
      mileage: mileage.value,
      fuel_type: fuel_type.value,
      colour: colour.value,
      doors: doors.value,
      veh_type: veh_type.value,
      description: description.value,
      images: updatedImages,
      main_image: mainImage.value
    };

    await axios.put(`${import.meta.env.VITE_API_BASE_URL}/admin/update-car/${car.value.id}`, payload, {
      headers: { Authorization: `Bearer ${seshId}` }
    });

    toast.add({ severity: 'success', summary: 'Updated', detail: 'Vehicle updated successfully', life: 3000 });
    await fetchCar();
  } catch (err) {
    console.error('Update failed', err);
    toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to update car', life: 3000 });
  }
};

onMounted(fetchCar);
</script>


<template>
  <Toast />
  <div class="surface-section px-5 py-5 md:px-6 lg:px-8">
    <h2 class="text-2xl font-light">Edit Car Listing for <span class="font-bold">{{ form.registration }}</span></h2>
    <div class="grid">
      <div class="col-12">
        <div class="card mb-4">
          <h3 class="text-lg font-semibold mb-2">Upload New Images</h3>
          <FileUpload name="images[]" customUpload :auto="false" :multiple="true" accept="image/*"
                      @uploader="handleFileSelect" chooseLabel="Add Images">
            <template #empty>
              <span>Drag and drop files here to upload.</span>
            </template>
          </FileUpload>
        </div>

        <div class="card mb-4">
          <h3 class="text-lg font-semibold mb-2">Existing Gallery</h3>
          <div v-if="car?.images?.length" class="flex flex-wrap gap-3">
            <div v-for="(img, index) in car.images" :key="index" class="relative">
              <img :src="img" class="thumbnail-image" @click="selectMainImage(img)"
                   :class="{ 'ring-2 ring-blue-500': mainImage === img }">
              <button class="remove-btn" @click="removedImages.push(img)">x</button>
              <div v-if="mainImage === img" class="text-xs text-center text-blue-500 mt-1">Main Image</div>
            </div>
          </div>
        </div>

        <div class="grid">
          <div class="col-12 md:col-6">
            <div class="field">
              <label>Registration</label>
              <InputGroup class="w-full h-4rem flex justify-center">
                <InputGroupAddon style="background-color: #00309a; color: #fbe90a">
                  GB
                </InputGroupAddon>
                <InputText v-model="registration" style="background-color: #fbe90a; border-color: #00309a"
                  placeholder="REG" class="text-5xl w-full font-bold" @input="registration.toUpperCase()" />
              </InputGroup>
            </div>
            <div class="field"><label>Make</label><InputText v-model="make" class="w-full" /></div>
            <div class="field"><label>Model</label><InputText v-model="model" class="w-full" /></div>
            <div class="field"><label>Variant</label><InputText v-model="variant" class="w-full" /></div>
            <div class="field"><label>Year</label><InputText v-model="year" type="number" class="w-full" /></div>
            <div class="field"><label>Price</label><InputText v-model="price" type="number" class="w-full" /></div>
          </div>

          <div class="col-12 md:col-6">
            <div class="field"><label>Mileage</label><InputText v-model="mileage" type="number" class="w-full" /></div>
            <div class="field"><label>Fuel Type</label><InputText v-model="fuel_type" class="w-full" /></div>
            <div class="field"><label>Colour</label><InputText v-model="colour" class="w-full" /></div>
            <div class="field"><label>Doors</label><InputText v-model="doors" type="number" class="w-full" /></div>
            <div class="field"><label>Vehicle Type</label><InputText v-model="veh_type" class="w-full" /></div>
            <div class="field col-span-2"><label>Description</label><PrimeTextarea v-model="description" class="w-full" rows="3" /></div>
          </div>
        </div>

        <PrimeButton label="Update Car Listing" icon="pi pi-check" class="mt-3 w-full" @click="updateCar" />
      </div>
    </div>
  </div>
</template>


<style scoped>
.thumbnail-image {
  width: 120px;
  height: 120px;
  object-fit: cover;
  border-radius: 8px;
  border: 2px solid #e5e7eb;
  cursor: pointer;
}
.remove-btn {
  position: absolute;
  top: -8px;
  right: -8px;
  width: 24px;
  height: 24px;
  background: black;
  border-radius: 50%;
  color: white;
  text-align: center;
  line-height: 24px;
  font-size: 14px;
  cursor: pointer;
}
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