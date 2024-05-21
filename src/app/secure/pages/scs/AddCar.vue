<template>
    <div>
      <PrimeToast />
      <div class="surface-section px-5 py-5 md:px-6 lg:px-8">
        <div
          class="flex md:align-items-center md:justify-content-between flex-column md:flex-row pb-4 border-bottom-1 surface-border"
        >
          <div class="mb-3 lg:mb-0">
            <div class="text-3xl font-medium text-900 mb-3">Add Car listing</div>
            <div class="text-500 mr-0 md:mr-3">
              Add Car Listing below.
            </div>
          </div>
          <span class="p-input-icon-left w-full md:w-auto">
            <i class="pi pi-search"></i>
            <InputText type="text" placeholder="Search" class="w-full md:w-auto" />
          </span>
        </div>
        <div class="grid mt-5">
          <div class="col-12 md:col-6">
            <div class="p-fluid pr-0 md:pr-6">
              <div class="field">
                <label for="name" class="font-medium">Full name</label>
                <InputText v-model="name" id="name" type="text" class="py-3 px-2 text-lg" />
              </div>
              <div class="field">
                <label for="company" class="font-medium">Phone number</label>
                <InputText v-model="phoneNumber" id="company" type="text" class="py-3 px-2 text-lg" />
              </div>
              <div class="field">
                <label for="email" class="font-medium">Email</label>
                <InputText v-model="email" id="email" type="text" class="py-3 px-2 text-lg" />
              </div>
              <div class="field">
                <label for="message" class="font-medium">Vehicle make & model</label>
                <InputText
                  v-model="vehicleMakeModel"
                  id="message"
                  :rows="6"
                  class="py-3 px-2 text-lg"
                ></InputText>
              </div>
              <div class="field">
                <label for="message" class="font-medium">Notes</label>
                <PrimeTextarea v-model="notes" id="notes" class="pb-3"></PrimeTextarea>
              </div>
            </div>
          </div>
          <div class="col-12 md:col-6 bg-no-repeat bg-right-bottom">
            <div class="text-900 text-2xl font-medium mb-3">Please pick a date and Time</div>
            <PrimeCalendar v-model="date" inline showTime hourFormat="12" />
          </div>
          <div class="col-12 md:col-6">
            <PrimeButton
              label="Create Booking"
              icon="pi pi-send"
              class="w-auto"
              @click="createBooking"
            ></PrimeButton>
          </div>
        </div>
      </div>
    </div>
  </template>