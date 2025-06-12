<template>
    <PrimeToast />
    <div>
        <div class="surface-section px-5 py-5 md:px-6 lg:px-8">
            <div class="text-3xl font-medium text-900 mb-4">HPI Report</div>
           
            <FileUpload name="pdf" :auto="true" mode="basic" choose-label="Upload HPI PDF" accept="application/pdf"
                customUpload @uploader="handleUpload" :disabled="isUploading" />
            <div v-if="pdfPreviewUrl" class="grid my-5">
                <div class="col-12 lg:col-8">
                     <div v-if="isUploading" class="mt-4">
                <ProgressBar mode="indeterminate" />
            </div>
                    <h4 class="text-xl mb-2 font-medium">PDF Preview</h4>
                    <iframe :src="pdfPreviewUrl" class="w-full border border-gray-300 rounded-lg"
                        style="min-height: 600px;"></iframe>
                </div>
                <div class="col-12 lg:col-4">

                    <div v-if="hpiData" class=" mt-5">
                        <div class=" mb-3">
                            <label class="block font-medium text-gray-700">Registration</label>
                            <InputText v-model="hpiData.registration" class="w-full" readonly />
                        </div>

                        <div class=" mb-3">
                            <label class="block font-medium text-gray-700">VIN</label>
                            <InputText v-model="hpiData.vin" class="w-full" readonly />
                        </div>

                        <div class=" mb-3">
                            <label class="block font-medium text-gray-700">Engine Number</label>
                            <InputText v-model="hpiData.engine_number" class="w-full" readonly />
                        </div>

                        <div class=" mb-3">
                            <label class="block font-medium text-gray-700">Make</label>
                            <InputText v-model="hpiData.make" class="w-full" readonly />
                        </div>

                        <div class=" mb-3">
                            <label class="block font-medium text-gray-700">Model</label>
                            <InputText v-model="hpiData.model" class="w-full" readonly />
                        </div>

                        <div class=" mb-3">
                            <label class="block font-medium text-gray-700">Body Type</label>
                            <InputText v-model="hpiData.body_type" class="w-full" readonly />
                        </div>

                        <div class=" mb-3">
                            <label class="block font-medium text-gray-700">Transmission</label>
                            <InputText v-model="hpiData.transmission" class="w-full" readonly />
                        </div>

                        <div class=" mb-3">
                            <label class="block font-medium text-gray-700">V5C Issue Date</label>
                            <InputText :value="formatDate(hpiData.current_v5c_issue_date)" class="w-full" readonly />
                        </div>

                        <div class=" mb-3">
                            <label class="block font-medium text-gray-700">Number of Previous Owners</label>
                            <InputText v-model="hpiData.previous_owners" class="w-full" readonly />
                        </div>

                        <div class=" mb-3">
                            <label class="block font-medium text-gray-700">Mileage</label>
                            <InputText v-model="hpiData.mileage" class="w-full" readonly />
                        </div>

                        <div>
                            <label class="block font-medium text-gray-700">Advisories</label>
                            <Textarea v-model="hpiData.advisories" class="w-full" rows="6" readonly />
                        </div>
                    </div>
                </div>




            </div>





        </div>
    </div>
</template>



<script setup lang="ts">
import { ref } from 'vue';
import axios from 'axios';
import { useToast } from 'primevue/usetoast';

const toast = useToast();
const hpiData = ref<any>(null);
const isUploading = ref(false);
const pdfPreviewUrl = ref<string | null>(null);

const formatDate = (raw: string) => {
    if (!raw) return '';
    const [day, month, year] = raw.split(/[-\/]/);
    const date = new Date(`${year}-${month}-${day}`);
    return isNaN(date.getTime()) ? raw : date.toLocaleDateString('en-GB', {
        day: '2-digit', month: 'long', year: 'numeric'
    });
};

const handleUpload = async ({ files }: { files: File[] }) => {
    if (!files.length) return;

    const file = files[0];
    pdfPreviewUrl.value = URL.createObjectURL(file); // <-- this is the preview step

    const formData = new FormData();
    formData.append('pdf', file);

    try {
        isUploading.value = true;
        const res = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/admin/hpi-report`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });

        hpiData.value = res.data;
        toast.add({ severity: 'contrast', summary: 'HPI Parsed', detail: 'Data loaded successfully', life: 3000 });
    } catch (err) {
        toast.add({ severity: 'secondary', summary: 'Error', detail: 'Failed to parse HPI report', life: 3000 });
        console.error(err);
    } finally {
        isUploading.value = false;
    }
};

</script>
