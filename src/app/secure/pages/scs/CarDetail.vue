<template>
  <PrimeToast />
  <PrimeDialog v-model:visible="confirm" modal header="Delete" :style="{ width: '50vw' }"
    :breakpoints="{ '1199px': '75vw', '575px': '90vw' }">
    <span class="text-surface-500 dark:text-surface-400 block mb-8">Are you sure you want to remove this image?</span>
    <div class="flex justify-end gap-2">
      <PrimeButton type="button" severity="success" label="Cancel" @click="confirm = false"></PrimeButton>
      <PrimeButton type="button" severity="danger" label="Delete" @click="confirmRemoveImage"></PrimeButton>
    </div>
  </PrimeDialog>

  <div class="surface-section px-5 py-5 md:px-6 lg:px-8">
    <h2 class="text-2xl font-light">Edit Car Listing for <span class="font-bold">{{ form.registration }}</span></h2>
    <div class="grid">
      <div class="col-12 lg:col-6">
        <!-- Upload New Images -->
        <div class="p-4 border-round shadow-2  border-2 border-dashed border-surface-200 text-gray-600 mb-4">

          <h3 class="text-lg font-semibold mb-2">Upload New Images</h3>
          <FileUpload name="images[]" customUpload :auto="false" :multiple="true" accept="image/*"
            @uploader="handleFileSelect" chooseLabel="Add Images">
            <template #empty>
              <span>Drag and drop files here to upload.</span>
              <!-- <div v-if="previewUrls.length" class="mt-3 grid grid-cols-3 gap-2">
                <div v-for="(url, index) in previewUrls" :key="index" class="relative group"
                  @click="setMainImage(index)">
                  <PrimeImage :src="url" width="160px" height="161px" preview
                    class="border-2 transition-all duration-200 cursor-pointer"
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
              </div> -->
            </template>
          </FileUpload>
        </div>
        <div v-if="car?.images?.length" class="mt-3">
          <!-- <h3 class="text-lg font-semibold mb-2">Image Gallery</h3> -->
          <PrimeTabView>
           <PrimeTabPanel header="Existing Gallery">
  <div class=" overflow-hidden">
    <swiper
      class="mySwiper"
      :modules="modules"
      :slides-per-view="3"
      :space-between="20"
      :breakpoints="{ 600: { slidesPerView: 2 }, 900: { slidesPerView: 3 }, 1200: { slidesPerView: 4 } }"
      navigation
      pagination
      @swiper="onSwiper"
      @slideChange="onSlideChange"
    >
      <swiper-slide
        v-for="(img, index) in car?.images"
        :key="index"
        class="flex items-center justify-center"
      >
        <img
          :src="img"
          class="object-cover rounded-lg shadow-md  h-[15rem]"
          :alt="`Car Image ${index + 1}`"
        />
      </swiper-slide>
    </swiper>
  </div>
</PrimeTabPanel>

            <PrimeTabPanel header="New Uploads">
              <!-- New selected images will be added to the gallery below. -->
              <div class="flex ">

                <PrimeGalleria v-model:activeIndex="galleriaActiveIndex" v-model:visible="displayCustom"
                  :value="newImages" :numVisible="7" containerStyle="max-width: 850px" :circular="true"
                  :fullScreen="true" :showItemNavigators="false" :showThumbnails="false">



                  <template #item="slotProps">
                    <div class=" flex justify-center items-center w-full h-full">
                      <img :src="slotProps.item.itemImageSrc" :alt="slotProps.item.alt"
                        class="max-w-full max-h-[80vh] object-contain rounded-xl" />
                    </div>
                  </template>


                  <template #thumbnail="slotProps">
                    <img :src="slotProps.item.thumbnailImageSrc" :alt="slotProps.item.alt" style="display: block" />
                  </template>
                </PrimeGalleria>

                <div v-if="newImages.length" class="grid">
                  <div v-for="(image, index) of newImages" :key="index"
                    class="col-12 md:col-6 flex justify-content-center mb-3">
                    <img :src="image.thumbnailImageSrc" :alt="image.alt"
                      style="cursor: pointer; width: 18rem; height: 15rem; object-fit: cover"
                      @click="openNewImagePreview(index)" />
                  </div>
                </div>

              </div>
            </PrimeTabPanel>

          </PrimeTabView>

        </div>

      </div>

      <!-- Car Info -->

      <div class="col-12 md:col-6">
        <div class="p-4 border-round shadow-2 bg-white mb-4">
          <h3 class="text-xl text-gray-600 font-medium ">Archive Vehicle</h3>

          <!-- <PrimeInputSwitch v-model="archiveVehicleSwitch" /> -->
          <PrimeToggleButton v-model="archiveVehicleSwitch" class="w-6rem" onLabel="On" offLabel="Off" />
        </div>
        <div class="p-4 border-round shadow-2 bg-white mb-4">
          <h3 class="text-xl text-gray-600 font-medium ">Vehicle Details</h3>

          <InputGroup class="w-full h-4rem flex justify-center mb-3">
            <InputGroupAddon style="background-color: #00309a; color: #fbe90a">
              GB
            </InputGroupAddon>
            <InputText v-model="registration" style="background-color: #fbe90a; border-color: #00309a" placeholder="REG"
              inputClass="'bg-transparent text-900 border-400 border-blue-500'"
              class="text-5xl w-full text-100 font-bold" @input="registration.toUpperCase()" />
          </InputGroup>

        </div>
        <div class="border-round shadow-2  text-black-700 mb-4">
          <div class="flex mb-3 gap-2 justify-end">
            <PrimeButton @click="active = 0" rounded label="1" class="w-2rem h-2rem p-0" :outlined="active !== 0" />
            <PrimeButton @click="active = 1" rounded label="2" class="w-2rem h-2rem p-0" :outlined="active !== 1" />
            <PrimeButton @click="active = 2" rounded label="3" class="w-2rem h-2rem p-0" :outlined="active !== 2" />
            <PrimeButton @click="active = 3" rounded label="4" class="w-2rem h-2rem p-0" :outlined="active !== 3" />
          </div>
          <PrimeAccordion v-model:activeIndex="active">
            <!-- Basic Info -->
            <PrimeAccordionTab header="Basic Information">
              <div class="grid">
                <div class="col-12 lg:col-6">

                  <div class="field"><label>Make</label>
                    <InputText v-model="make" class="w-full" />
                  </div>
                  <div class="field"><label>Model</label>
                    <InputText v-model="model" class="w-full" />
                  </div>
                  <div class="field"><label>Variant</label>
                    <InputText v-model="variant" class="w-full" />
                  </div>
                </div>
                <div class="col-12 lg:col-6">

                  <div class="field"><label>Year</label>
                    <InputText v-model="year" class="w-full" />
                  </div>
                  <div class="field"><label>Registration Date</label>
                    <InputText v-model="registration_date" type="date" class="w-full" />
                  </div>
                </div>
              </div>
            </PrimeAccordionTab>
            <!-- Pricing and Mileage -->
            <PrimeAccordionTab header="Pricing">
              <div class="field">
                <label>Price (£)</label>
                <InputText v-model="price" class="w-full" />
              </div>
            </PrimeAccordionTab>
            <!-- Vehicle Details / Features -->
            <PrimeAccordionTab header="Vehicle Details / Features">
              <div class="grid">
                <div class="col-12 lg:col-6">
                  <div class="field"><label>Mileage</label>
                    <InputText v-model="mileage" class="w-full" />
                  </div>
                  <div class="field"><label>Fuel Type</label>
                    <PrimeDropDown v-model="fuel_type" class="w-full"
                      :options="['Petrol', 'Diesel', 'Hybrid', 'Electric']" placeholder="Select Fuel Type" />
                  </div>
                  <div class="field"><label>Colour</label>
                    <InputText v-model="colour" class="w-full" />
                  </div>
                  <div class="field"><label>Body Style</label>
                    <PrimeDropDown v-model="body_style" :options="BODY_STYLE_OPTIONS" class="w-full"
                      placeholder="Select body style" />
                  </div>
                  <div class="field"><label>Vehicle Type</label>
                    <InputText v-model="veh_type" class="w-full" />
                  </div>
                </div>
                <div class="col-12 lg:col-6">
                  <div class="field"><label>Doors</label>
                    <PrimeDropDown v-model="doors" :options="DOOR_OPTIONS" class="w-full" placeholder="Select doors" />
                  </div>
                  <div class="field"><label>Number of Keys</label>
                    <PrimeDropDown v-model="keys" :options="KEY_OPTIONS" class="w-full" placeholder="Select keys" />
                  </div>
                  <div class="field"><label>Gearbox</label>
                    <PrimeDropDown v-model="gearbox" :options="GEARBOX_OPTIONS" class="w-full"
                      placeholder="Select gearbox" />
                  </div>
                  <div class="field"><label>Engine Size</label>
                    <InputText v-model="engineSize" class="w-full" />
                  </div>
                </div>
              </div>
            </PrimeAccordionTab>
            <!-- description -->
            <PrimeAccordionTab header="Description">
              <div class="field">
                <label>Car Description</label>

                <PrimeTextarea v-model="description" class="w-full bg-gray-800" rows="15" />
              </div>
            </PrimeAccordionTab>
          </PrimeAccordion>
          <div class="field">
          </div>
        </div>

        <PrimeButton label="Update Car Listing" icon="pi pi-check" class="mt-3 w-full" @click="updateCar"
          :loading="isUploading" />
      </div>

    </div>


  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';

import { useToast } from 'primevue/usetoast';
import axios from 'axios';
import { Swiper, SwiperSlide } from 'swiper/vue';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Navigation, Pagination } from 'swiper/modules';
const modules = [Navigation, Pagination];

const onSwiper = (swiper: any) => {
  console.log('Swiper initialized', swiper);
};

const onSlideChange = () => {
  console.log('Slide changed');
};

import {
  DOOR_OPTIONS,
  KEY_OPTIONS,
  GEARBOX_OPTIONS,
  BODY_STYLE_OPTIONS
} from '@/constants/enums';
const route = useRoute();
const toast = useToast();
const confirm = ref(false);
const seshId = sessionStorage.getItem('token');

// Image state
const localFiles = ref<File[]>([]);
const previewUrls = ref<string[]>([]);
const mainImageIndex = ref(0);
const position = ref('bottom');
// Car data
const car = ref<any>(null);
const form = ref<any>({});
const removedImages = ref<string[]>([]);
const mainImage = ref<string>('');
const archiveVehicleSwitch = ref(false);
const active = ref(0);
// Form fields
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
const imageToRemove = ref<string>('');
const gearbox = ref('');
const engineSize = ref('');
const keys = ref('');
const registration_date = ref(''); // ISO string like "2024-09-01"
const body_style = ref('');
const deleted_at = ref('');
const isUploading = ref(false);
const galleriaActiveIndex = ref(0);
const galleriaImages = ref<any[]>([]);
const newImages = ref<any[]>([]);
const displayCustom = ref(false);


const responsiveOptions = ref([
  {
    breakpoint: '1300px',
    numVisible: 4
  },
  {
    breakpoint: '575px',
    numVisible: 1
  }
]);


// Handlers
const handleFileSelect = (event: any) => {
  if (event?.files?.length) {
    for (const file of event.files) {
      if (file instanceof File) {
        const url = URL.createObjectURL(file);
        localFiles.value.push(file);
        previewUrls.value.push(url);
        newImages.value.push({
          itemImageSrc: url,
          thumbnailImageSrc: url,
          alt: file.name
        });

        galleriaImages.value.push({
          itemImageSrc: url,
          thumbnailImageSrc: url,
          alt: file.name,
          isNew: true  // 👈 This flag helps us tag it as a new image
        });
      }
    }

    if (localFiles.value.length === event.files.length) {
      mainImageIndex.value = 0;
    }
  }
};


const openNewImagePreview = (index: number) => {
  galleriaActiveIndex.value = index;
  displayCustom.value = true;
};


const prepareGalleriaImages = () => {
  if (Array.isArray(car.value?.images)) {
    galleriaImages.value = car.value.images.map((img: string) => ({
      itemImageSrc: img,
      thumbnailImageSrc: img,
      alt: `${car.value.make} ${car.value.model}`,
      isNew: false // existing image
    }));
  }
};




const removeImage = (index: number) => {
  confirm.value = true;
  previewUrls.value.splice(index, 1);
  localFiles.value.splice(index, 1);
  if (mainImageIndex.value === index) {
    mainImageIndex.value = 0;
  } else if (mainImageIndex.value > index) {
    mainImageIndex.value--;
  }
  toast.add({ severity: 'info', summary: 'Image Removed', detail: 'The image has been removed', life: 3000 });
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

const selectMainImage = (imgUrl: string) => {
  mainImage.value = imgUrl;
};

const showConfirmDialog = (img: string) => {
  const isLocal = img.startsWith('blob:');

  if (isLocal) {
    // Remove from local preview + galleria
    const localIndex = galleriaImages.value.findIndex((i) => i.itemImageSrc === img);
    if (localIndex !== -1) {
      galleriaImages.value.splice(localIndex, 1);
      previewUrls.value.splice(localIndex, 1);
      localFiles.value.splice(localIndex, 1);
    }

    toast.add({
      severity: 'info',
      summary: 'Image Removed',
      detail: 'Local image has been removed',
      life: 3000
    });

    // If it was mainImage, reset
    if (mainImage.value === img) {
      mainImageIndex.value = 0;
    }

  } else {
    // Existing image – require confirmation
    imageToRemove.value = img;
    confirm.value = true;
  }
};


const confirmRemoveImage = async () => {
  try {
    await axios.post(`${import.meta.env.VITE_API_BASE_URL}/admin/delete-s3-image`, {
      image_url: imageToRemove.value
    }, {
      headers: { Authorization: 'Bearer ' + seshId }
    });

    car.value.images = car.value.images.filter((img: string) => img !== imageToRemove.value);
    removedImages.value.push(imageToRemove.value);
    galleriaImages.value = galleriaImages.value.filter(img => img.itemImageSrc !== imageToRemove.value);

    toast.add({ severity: 'success', summary: 'Deleted', detail: 'Image removed', life: 3000 });
    confirm.value = false;
  } catch (error) {
    toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to delete image from S3', life: 3000 });
  }
};


const fetchCar = async () => {
  try {
    const id = route.params.id;
    const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/get-vehicle-by-id/${id}`, {
      headers: { Authorization: 'Bearer ' + seshId }
    });

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
    gearbox.value = form.value.gearbox || '';
    engineSize.value = form.value.engine_size || '';
    keys.value = form.value.keys !== null ? parseInt(form.value.keys) : null;
    registration_date.value = form.value.registration_date || '';
    body_style.value = form.value.body_style || '';
    deleted_at.value = form.value.deleted_at;

    // ✅ Then set archive switch
    archiveVehicleSwitch.value = deleted_at.value !== null && deleted_at.value !== ''; prepareGalleriaImages();

    if (Array.isArray(car.value.images) && car.value.images.length > 0) {
      mainImage.value = car.value.main_image || car.value.images[0];
    }
  } catch (err) {
    console.error('Failed to load car data', err);
  }
};

const updateCar = async () => {
  try {
    const uploadedKeys: string[] = [];

    for (const file of localFiles.value) {
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
      main_image: uploadedKeys.length ? uploadedKeys[mainImageIndex.value] : mainImage.value,
      keys: keys.value,
      gearbox: gearbox.value,
      engine_size: engineSize.value,
      body_style: body_style.value,
      registration_date: registration_date.value,
      deleted_at: archiveVehicleSwitch.value ? (deleted_at.value || new Date().toISOString()) : null
    };

    await axios.put(`${import.meta.env.VITE_API_BASE_URL}/admin/update-car/${car.value.id}`, payload, {
      headers: { Authorization: `Bearer ${seshId}` }
    });

    toast.add({ severity: 'success', summary: 'Updated', detail: 'Vehicle updated successfully', life: 3000 });
    await fetchCar();
    prepareGalleriaImages(); // <— call this after setting car.value

  } catch (err) {
    console.error('Update failed', err);
    toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to update car', life: 3000 });
  }
};

onMounted(fetchCar);
</script>

<style scoped>
.mySwiper {
  width: 100%;
  height: 250px;
}



.mySwiper {
  width: 100%;
  padding: 1rem 0;
}

/* ::v-deep(.p-galleria .p-galleria-item-prev, .p-galleria .p-galleria-item-next) {
  z-index: 50;
  background-color: rgba(0, 0, 0, 0.5);
  width: 2.5rem;
  height: 2.5rem;
  top: 50%;
  transform: translateY(-50%);
} */

/* ::v-deep(.p-galleria .p-galleria-item-prev) {
  left: 1rem;
}

::v-deep(.p-galleria .p-galleria-item-next) {
  right: 1rem;
} */

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
</style>
