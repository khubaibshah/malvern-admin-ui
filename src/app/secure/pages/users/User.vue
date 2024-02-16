<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from "vue-router";

import UserService from '@/services/userService';

const router = useRouter();

const seshId = sessionStorage.getItem('token')
const name = ref();
const email = ref();
const getUser = () =>{
        UserService.getUser(seshId).then(me => {
        console.log('me', me);
        name.value = me.name 
        email.value = me.email 
    }).catch(error => {
        console.error('Error fetching user data:', error);
    });
    }
    onMounted(() => {
        getUser()
});
</script>

<template>
    <!-- {{ name }} -->
<div class="surface-section px-4 py-4 md:px-6 lg:px-8 mt-3">
    <div class="mb-3 lg:mb-0 ">
          <div class="text-3xl font-medium text-900 mb-3">User Account</div>
          <div class="text-500 mr-0 md:mr-3">Your user details</div>
        </div>
        <PrimeDivider></PrimeDivider>
    <div class="p-fluid flex flex-column lg:flex-row mt-7">
        <ul class="list-none m-0 p-0 flex flex-row lg:flex-column justify-content-evenly md:justify-content-between lg:justify-content-start mb-5 lg:pr-8 lg:mb-0">
            <li>
                <a v-ripple class="flex align-items-center cursor-pointer p-3 border-round text-800 hover:surface-hover transition-duration-150 transition-colors p-ripple">
                    <i class="pi pi-user md:mr-2"></i>
                    <span class="font-medium hidden md:block">Profile</span>
                </a>
            </li>
            <li>
                <a v-ripple class="flex align-items-center cursor-pointer p-3 border-round text-800 hover:surface-hover transition-duration-150 transition-colors p-ripple"
                @click="router.push({name: 'UserBooking'})">
                    <i class="pi pi-calendar md:mr-2"></i>
                    <span class="font-medium hidden md:block">Your Bookings</span>
                </a>
            </li>
            <li>
                <a v-ripple class="flex align-items-center cursor-pointer p-3 border-round text-800 hover:surface-hover transition-duration-150 transition-colors p-ripple">
                    <i class="pi pi-cog md:mr-2"></i>
                    <span class="font-medium hidden md:block">Account</span>
                </a>
            </li>
            <li>
                <a v-ripple class="flex align-items-center cursor-pointer p-3 border-round text-800 hover:surface-hover transition-duration-150 transition-colors p-ripple">
                    <i class="pi pi-palette md:mr-2"></i>
                    <span class="font-medium hidden md:block">Appearance</span>
                </a>
            </li>
            <li>
                <a v-ripple class="flex align-items-center cursor-pointer p-3 border-round text-800 hover:surface-hover transition-duration-150 transition-colors p-ripple">
                    <i class="pi pi-sun md:mr-2"></i>
                    <span class="font-medium hidden md:block">Accessibility</span>
                </a>
            </li>
            <li>
                <a v-ripple class="flex align-items-center cursor-pointer p-3 border-round text-800 hover:surface-hover transition-duration-150 transition-colors p-ripple">
                    <i class="pi pi-bell md:mr-2"></i>
                    <span class="font-medium hidden md:block">Notifications</span>
                </a>
            </li>
        </ul>
        <div class="surface-card p-5 shadow-2 border-round flex-auto">
            <div class="text-900 font-semibold text-lg mt-3">Profile</div>
            <PrimeDivider></PrimeDivider>
            <div class="flex gap-5 flex-column-reverse md:flex-row">
                <div class="flex-auto p-fluid">
                    <div class="mb-4">
                        <label for="name" class="block font-medium text-900 mb-2">Name</label>
                        <InputText id="name" type="text" v-model="name" readonly />
                    </div>
                    <div class="mb-4">
                        <label for="email" class="block font-medium text-900 mb-2">Email</label>
                        <InputText id="email" type="text" v-model="email" readonly />
                    </div>
                    <div class="mb-4">
                        <label for="bio" class="block font-medium text-900 mb-2">Bio</label>
                        <PrimeTextarea id="bio" type="text" rows="5" :autoResize="true"></PrimeTextarea>
                    </div>
                    <!-- <div class="mb-4">
                        <label for="website" class="block font-medium text-900 mb-2">URL</label>
                        <div class="p-inputgroup">
                            <span class="p-inputgroup-addon">https://</span>
                            <InputText id="website" type="text" />
                        </div>
                    </div>
                    <div class="mb-4">
                        <label for="state" class="block font-medium text-900 mb-2">Company</label>
                        <InputText id="state" type="text" />
                    </div>
                    <div>
                        <PrimeButton label="Update Profile" class="w-auto"></PrimeButton>
                    </div> -->
                </div>
                <div class="flex flex-column align-items-center flex-or">
                    <span class="font-medium text-900 mb-2">Profile Picture</span>
                    <img src="../../../../assets/img/favicon.png" class="h-10rem w-10rem" />
                    <PrimeButton type="button" icon="pi pi-pencil" class="p-button-rounded -mt-4"></PrimeButton>
                </div>
            </div>
        </div>
    </div>
</div>



</template>