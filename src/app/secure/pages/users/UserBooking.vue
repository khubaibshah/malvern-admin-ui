<template>
    <div class="surface-section px-4 py-4 md:px-6 lg:px-8 mt-3">
    <div class="mb-3 lg:mb-0 ">
          <div class="text-3xl font-medium text-900 mb-3">Your Bookings</div>
          <div class="text-500 mr-0 md:mr-3">Your booking details</div>
        </div>
        <PrimeDivider></PrimeDivider>

<ul class="list-none p-0 m-0 flex flex-column md:flex-row">
    <li class="relative mr-0 md:mr-8 flex-auto">
        <div class="border-1 border-300 border-round p-3 surface-card flex flex-column md:flex-row align-items-center z-1">
            <i class="pi pi-check-circle text-green-500 text-2xl md:text-4xl mb-2 md:mb-0 mr-0 md:mr-3"></i>
            <div>
                <div class="text-900 font-medium mb-1">Booking Created</div>
                <span class="text-600 text-sm hidden md:block">Your booking has been created for {{ $filters.formatDate(Date()) }}</span>
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
                <span class="text-600 text-sm hidden md:block">We will let you know when your car is ready</span>
            </div>
        </div>
    </li>
</ul>

    </div>


</template>