<script setup lang="ts">
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { useAuthStore } from '../../../../stores/authStore';
const authStore = useAuthStore();

// Access the token
const token = authStore.getToken();
const bookings = ref()

const getAllUsers = async () => {
  try {
    const response = await axios.get('http://127.0.0.1:8000/api/users',{
      headers: {
        'Authorization': "Bearer "+token,
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    })
    bookings.value = response.data
  } catch (error) {
    console.error('Error fetching bookings:', error)
  }
}
onMounted(async () => {
  getAllUsers()
})
</script>

<template>
    <div>
    <div class="surface-section px-4 py-5 md:px-6 lg:px-8 mt-3">
      <div
        class="flex md:align-items-center md:justify-content-between flex-column md:flex-row pb-4 border-bottom-1 surface-border"
      >
        <div class="mb-3 lg:mb-0">
          <div class="text-3xl font-medium text-900 mb-3">Users</div>
          <div class="text-500 mr-0 md:mr-3">Below are all the Users </div>
        </div>
        <span class="p-input-icon-left w-full md:w-auto">
          <i class="pi pi-search"></i>
          <InputText type="text" placeholder="Search" class="w-full md:w-auto" />
        </span>
      </div>
    </div>

    <div class="surface-section md:px-7 lg:px-8">
      <!-- <router-link to="/">Go to Home</router-link> -->

      <DataTable :value="bookings" sortField="id" :sortOrder="-1" paginator :rows="6" >
        <!-- <template #header>
                <div class="flex justify-content-end">
                    <IconField iconPosition="left">
                        <InputIcon>
                            <i class="pi pi-search" />
                        </InputIcon>
                        <InputText v-model="filters['global'].value" placeholder="Keyword Search" />
                    </IconField>
                </div>
        </template> -->
        <PrimeColumn field="id" header="User Id" style="width: 8%" sortable ></PrimeColumn>
        <PrimeColumn field="name" header="Name" sortable></PrimeColumn>
        <PrimeColumn field="email" header="Email" sortable></PrimeColumn>
        <PrimeColumn field="created_at" header="Created" sortable>
          <template v-slot:body="rowData">
          {{ $filters.formatDateTime(rowData.data.created_at) }}
        </template>
        </PrimeColumn>
      </DataTable>
    </div>
  </div>
</template>