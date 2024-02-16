<script setup lang="ts">
import router from '@/router'

</script>
<template>
    <div class="surface-section px-4 py-4 md:px-6 lg:px-8 mt-3">
        <div
        class="flex md:align-items-center md:justify-content-between flex-column md:flex-row pb-4 border-bottom-1 surface-border mb-5">
        <div class="mb-3 lg:mb-0">
          <div class="text-3xl font-medium text-900 mb-3">Your Bookings</div>
          <div class="text-500 mr-0 md:mr-3">
            Your booking details
          </div>
        </div>
        <span class="p-input-icon-left w-full md:w-auto">
          <i class="pi pi-search"></i>
          <!-- <InputText type="text" placeholder="Search" class="w-full md:w-auto" /> -->
          <PrimeButton
            label="Back to user"
            icon="pi pi-angle-left"
            class="w-auto"
            @click="router.push({name: 'User'})"
          ></PrimeButton>
        </span>
      </div>

<ul class="list-none p-0 m-0 flex flex-column md:flex-row">
    <li class="relative mr-0 md:mr-8 flex-auto">
        <div class="border-1 border-300 border-round p-3 surface-card flex flex-column md:flex-row align-items-center z-1">
            <i class="pi pi-check-circle text-green-500 text-2xl md:text-4xl mb-2 md:mb-0 mr-0 md:mr-3"></i>
            <div>
                <div class="text-900 font-medium mb-1">Booking Created</div>
                <span class="text-600 text-sm hidden md:block">Your booking has been created for the {{ $filters.formatDate(Date()) }}</span>
            </div>
        </div>
        <div class="w-full absolute top-50 left-100 surface-300 hidden md:block" style="transform: translateY(-50%); height: 2px"></div>
    </li>
    <li class="relative mr-0 md:mr-8 flex-auto">
        <div class="border-2 border-blue-500 border-round p-3 surface-card flex flex-column md:flex-row align-items-center z-1">
            <i class="pi pi-credit-card text-blue-600 text-2xl md:text-4xl mb-2 md:mb-0 mr-0 md:mr-3"></i>
            <div>
                <div class="text-blue-600 font-medium mb-1">Payment</div>
                <span class="text-600 text-sm hidden md:block">Payment will be taking upon collection</span>
            </div>
        </div>
        <div class="w-full absolute top-50 left-100 surface-300 hidden md:block" style="transform: translateY(-50%); height: 2px"></div>
    </li>
    <li class="relative flex-auto">
        <div class="border-1 border-300 border-round p-3 surface-50 flex flex-column md:flex-row align-items-center z-1">
            <i class="pi pi-check-circle text-600 text-2xl md:text-4xl mb-2 md:mb-0 mr-0 md:mr-3"></i>
            <div>
                <div class="text-900 font-medium mb-1">Confirmation</div>
                <span class="text-600 text-sm hidden md:block">We will let you know when your car is ready for pickup</span>
            </div>
        </div>
    </li>
</ul>

    </div>


</template>