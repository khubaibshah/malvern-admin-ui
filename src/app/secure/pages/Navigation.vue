<script setup lang="ts">
import axios from 'axios'
import { ref, onMounted } from 'vue';
import { useRouter } from "vue-router";
import { useAuthStore } from '@/stores/authStore';
import { useUserStore } from '@/stores/userStore';
import { useToast } from 'primevue/usetoast';
import UserService from '../../../services/userService'

const toast = useToast();
const userStore = useUserStore();
const router = useRouter();
const authStore = useAuthStore();
const seshId = sessionStorage.getItem('token')
const name = ref();
const me = ref();

const logout = async () => {
try {
    await UserService.logout(seshId);
    sessionStorage.clear()
    authStore.clearToken(); // Clear token from store
    authStore.setAuthenticated(false); // Set user authentication status to false
    userStore.clearUser();
    router.push({ name: 'login' }) // Redirect to home page
} catch (error) {
    console.error('logout failed', error);

}
}

const getUser = async () => {
  try {
    if (!userStore.hasUser) {
        const user = await UserService.getUser(seshId);
        me.value = user;
        userStore.setUser(me.value)
        console.log('no user data stored, should only show on first load and reload.')
    } else {
        me.value = UserService.getUser(seshId)
        console.log('user data from store, should show everytime i nav away and back')
    }
  } catch (error) {
    console.error('Error fetching user:', error);
  }
}
    onMounted(() => {
        getUser()
});

</script>

<template>
    <!-- {{ me }} -->
    <div class="min-h-screen flex relative lg:static surface-ground">
        <div
            id="app-sidebar-5"
            class="bg-gray-900 h-screen hidden lg:block flex-shrink-0 absolute lg:static left-0 top-0 z-1 border-right-1 border-gray-800 w-18rem lg:w-7rem select-none"
        >
            <div class="flex flex-column h-full">
                <div
                    class="flex align-items-center justify-content-center flex-shrink-0 bg-blue-500"
                    style="height: 60px"
                >
                    <img src="../../../assets/img/favicon.png" alt="Image" height="30">
                    <!-- <i class="pi pi-spin pi-cog" style="font-size: 2rem"></i> -->
                </div>
                <div class="mt-3">
                    <ul class="list-none p-3 m-0">
                        <!-- <li>
                            <a
                                v-ripple
                                @click="router.push({name: 'Userhome'})"
                                class="flex flex-row lg:flex-column align-items-center cursor-pointer p-3 lg:justify-content-center hover:bg-gray-800 border-round text-gray-300 hover:text-white transition-duration-150 transition-colors p-ripple"
                            >
                                <i
                                    class="pi pi-home mr-2 lg:mr-0 mb-0 lg:mb-2 text-base lg:text-lg"
                                ></i>
                                <span
                                    class="font-medium inline text-base lg:text-xs lg:block"
                                    >Dashboard</span
                                >
                            </a>
                        </li> -->
                        <!-- <li>
                            <a
                                v-ripple
                                class="flex flex-row lg:flex-column align-items-center cursor-pointer p-3 lg:justify-content-center hover:bg-gray-800 border-round text-gray-300 hover:text-white transition-duration-150 transition-colors p-ripple"
                                @click="router.push({name: 'Create'})"
                            >
                                <i
                                    class="pi pi-calendar-times mr-2 lg:mr-0 mb-0 lg:mb-2 text-base lg:text-lg"
                                ></i>
                                <span
                                    class="font-medium inline text-base lg:text-xs lg:block"
                                    >Create</span
                                >
                            </a>
                        </li> -->
                        <!-- <li>
                            <a
                                v-ripple
                                class="flex flex-row lg:flex-column align-items-center cursor-pointer p-3 lg:justify-content-center hover:bg-gray-800 border-round text-gray-300 hover:text-white transition-duration-150 transition-colors p-ripple"
                                @click="router.push({name: 'booking'})"
                                >
                                <i
                                    class="pi pi-users mr-2 lg:mr-0 mb-0 lg:mb-2 text-base lg:text-lg"
                                ></i>
                                <span
                                    class="font-medium inline text-base lg:text-xs lg:block"
                                    >Bookings</span
                                >
                            </a>
                        </li> -->
                         <li>
                            <a
                            @click="router.push({name : 'scs-car-listings'})"
                                v-ripple
                                class="flex flex-row lg:flex-column align-items-center cursor-pointer p-3 lg:justify-content-center hover:bg-gray-800 border-round text-gray-300 hover:text-white transition-duration-150 transition-colors p-ripple"
                            >
                                <i
                                    class="pi pi-list mr-2 lg:mr-0 mb-0 lg:mb-2 text-base lg:text-lg"
                                ></i>
                                <span
                                    class="text-center font-medium inline text-base lg:text-xs lg:block"
                                    >Car list</span
                                >
                            </a>
                        </li>
                        <li>
                            <a
                            @click="router.push({name : 'scs'})"
                                v-ripple
                                class="flex flex-row lg:flex-column align-items-center cursor-pointer p-3 lg:justify-content-center hover:bg-gray-800 border-round text-gray-300 hover:text-white transition-duration-150 transition-colors p-ripple"
                            >
                                <i
                                    class="pi pi-car mr-2 lg:mr-0 mb-0 lg:mb-2 text-base lg:text-lg"
                                ></i>
                                <span
                                    class="text-center font-medium inline text-base lg:text-xs lg:block"
                                    >Add</span
                                >
                            </a>
                        </li>
                        <li>
                            <a
                            @click="router.push({name : 'featured-vehicle'})"
                                v-ripple
                                class="flex flex-row lg:flex-column align-items-center cursor-pointer p-3 lg:justify-content-center hover:bg-gray-800 border-round text-gray-300 hover:text-white transition-duration-150 transition-colors p-ripple"
                            >
                                <i
                                    class="pi pi-image mr-2 lg:mr-0 mb-0 lg:mb-2 text-base lg:text-lg"
                                ></i>
                                <span
                                    class="text-center font-medium inline text-base lg:text-xs lg:block"
                                    >Featured </span
                                >
                            </a>
                        </li>
                        
                        <li>
                            <a
                            @click="router.push({name : 'archive-delete'})"
                                v-ripple
                                class="flex flex-row lg:flex-column align-items-center cursor-pointer p-3 lg:justify-content-center hover:bg-gray-800 border-round text-gray-300 hover:text-white transition-duration-150 transition-colors p-ripple"
                            >
                                <i
                                    class="pi pi-trash mr-2 lg:mr-0 mb-0 lg:mb-2 text-base lg:text-lg"
                                ></i>
                                <span
                                    class="text-center font-medium inline text-base lg:text-xs lg:block"
                                    >Archive </span
                                >
                            </a>
                        </li>
                        <li>
                            <a
                            @click="router.push({name : 'hpi-report'})"
                                v-ripple
                                class="flex flex-row lg:flex-column align-items-center cursor-pointer p-3 lg:justify-content-center hover:bg-gray-800 border-round text-gray-300 hover:text-white transition-duration-150 transition-colors p-ripple"
                            >
                                <i
                                    class="pi pi-file mr-2 lg:mr-0 mb-0 lg:mb-2 text-base lg:text-lg"
                                ></i>
                                <span
                                    class="text-center font-medium inline text-base lg:text-xs lg:block"
                                    >Hpi Report </span
                                >
                            </a>
                        </li>
                        
                       
                        <li class="relative">
                            <a
                                v-ripple
                                class="flex flex-row lg:flex-column align-items-center cursor-pointer p-3 lg:justify-content-center hover:bg-gray-800 border-round text-gray-300 hover:text-white transition-duration-150 transition-colors p-ripple"
                                v-styleclass="{
                                    selector: '@next',
                                    enterClass: 'hidden',
                                    leaveToClass: 'hidden',
                                    hideOnOutsideClick: true,
                                }"
                            >
                                <i
                                    class="pi pi-users mr-2 lg:mr-0 mb-0 lg:mb-2 text-base lg:text-lg"
                                    v-badge.danger
                                ></i>
                                <span
                                    class="font-medium inline text-base lg:text-xs lg:block"
                                    >Users</span
                                >
                                <i
                                    class="pi pi-chevron-down ml-auto lg:hidden"
                                ></i>
                            </a>
                            <ul
                                class="list-none pl-3 pr-0 py-0 lg:p-3 m-0 lg:ml-3 hidden overflow-y-hidden transition-all transition-duration-400 transition-ease-in-out static border-round-right lg:absolute left-100 top-0 z-1 bg-gray-900 shadow-none lg:shadow-2 w-full lg:w-15rem"
                            >
                                <!-- <li>
                                    <a
                                        v-ripple
                                        class="flex align-items-center cursor-pointer p-3 hover:bg-gray-800 border-round text-gray-300 hover:text-white transition-duration-150 transition-colors p-ripple"
                                        v-styleclass="{
                                            selector: '@next',
                                            toggleClass: 'hidden',
                                        }"
                                    >
                                        <i class="pi pi-user mr-2"></i>
                                        <span class="font-medium">Search</span>
                                        <i
                                            class="pi pi-chevron-down ml-auto"
                                        ></i>
                                    </a>
                                    <ul
                                        class="list-none py-0 pl-3 pr-0 m-0 hidden overflow-y-hidden transition-all transition-duration-400 transition-ease-in-out"
                                    >
                                        <li>
                                            <a
                                                v-ripple
                                                class="flex align-items-center cursor-pointer p-3 hover:bg-gray-800 border-round text-gray-300 hover:text-white transition-duration-150 transition-colors p-ripple"
                                            >
                                                <i class="pi pi-table mr-2"></i>
                                                <span class="font-medium"
                                                    >View</span
                                                >
                                            </a>
                                        </li>
                                        <li>
                                            <a
                                                v-ripple
                                                class="flex align-items-center cursor-pointer p-3 hover:bg-gray-800 border-round text-gray-300 hover:text-white transition-duration-150 transition-colors p-ripple"
                                            >
                                                <i
                                                    class="pi pi-search mr-2"
                                                ></i>
                                                <span class="font-medium"
                                                    >Search</span
                                                >
                                            </a>
                                        </li>
                                    </ul>
                                </li> -->
                                <li>
                                    <a
                                        v-ripple
                                        class="flex align-items-center cursor-pointer p-3 hover:bg-gray-800 border-round text-gray-300 hover:text-white transition-duration-150 transition-colors p-ripple"
                                    >
                                        <i class="pi pi-search mr-2"></i>
                                        <span class="font-medium"
                                            >Search</span
                                        >
                                    </a>
                                </li>
                                <li>
                                    <a
                                        v-ripple
                                        class="flex align-items-center cursor-pointer p-3 hover:bg-gray-800 border-round text-gray-300 hover:text-white transition-duration-150 transition-colors p-ripple"
                                        @click="router.push({name: 'User'})"
                                        >
                                        <i class="pi pi-user mr-2"></i>
                                        <span class="font-medium"
                                            >{{ me?.name }}</span
                                        >
                                    </a>
                                </li>
                                <li>
                                    <a
                                        v-ripple
                                        class="flex align-items-center cursor-pointer p-3 hover:bg-gray-800 border-round text-gray-300 hover:text-white transition-duration-150 transition-colors p-ripple"
                                        @click="router.push({name: 'Users'})"                                    
                                        >
                                        <i class="pi pi-users mr-2"></i>
                                        <span class="font-medium"
                                            >User Accounts</span
                                        >
                                    </a>
                                </li>
                            </ul>
                        </li>
                    </ul>
                </div>
                <div class="mt-auto">
                    <hr
                        class="mb-3 mx-3 border-top-1 border-none border-gray-800"
                    />
                    <a
                        v-ripple
                        class="m-3 flex flex-row lg:flex-column align-items-center cursor-pointer p-3 lg:justify-content-center hover:bg-gray-800 border-round text-gray-300 hover:text-white transition-duration-150 transition-colors p-ripple"
                    >
                        <!-- <img src="images/blocks/avatars/circle/avatar-f-1.png" class="mr-2 lg:mr-0" style="width: 32px; height: 32px"/> -->
                        <span class="font-medium inline lg:hidden"
                            >Amy Elsner</span
                        >
                    </a>
                </div>
            </div>
        </div>
        <div class="min-h-screen flex flex-column relative flex-auto">
            <div
                class="flex justify-content-between align-items-center px-5 surface-section relative lg:static border-bottom-1 surface-border"
                style="height: 60px"
            >
                <div class="flex">
                    <a
                        v-ripple
                        class="cursor-pointer block lg:hidden text-700 mr-3 mt-1 p-ripple"
                        v-styleclass="{
                            selector: '#app-sidebar-5',
                            enterClass: 'hidden',
                            enterActiveClass: 'fadeinleft',
                            leaveToClass: 'hidden',
                            leaveActiveClass: 'fadeoutleft',
                            hideOnOutsideClick: true,
                        }"
                    >
                        <i class="pi pi-bars text-4xl"></i>
                    </a>
                    <span class="p-input-icon-left">
                        <i class="pi pi-search"></i>
                        <InputText
                            type="text"
                            class="border-none w-10rem sm:w-20rem"
                            placeholder="Search"
                        />
                    </span>
                </div>
                <a
                    v-ripple
                    class="cursor-pointer block lg:hidden text-700 p-ripple"
                    v-styleclass="{
                        selector: '@next',
                        enterClass: 'hidden',
                        enterActiveClass: 'fadein',
                        leaveToClass: 'hidden',
                        leaveActiveClass: 'fadeout',
                        hideOnOutsideClick: true,
                    }"
                >
                    <i class="pi pi-ellipsis-v text-2xl"></i>
                </a>
                <ul
                    class="list-none p-0 m-0 hidden lg:flex lg:align-items-center select-none lg:flex-row surface-section border-1 lg:border-none surface-border right-0 top-100 z-1 shadow-2 lg:shadow-none absolute lg:static"
                >
                <li class="border-top-1 surface-border lg:border-top-none">
                        <!-- <PrimeTag icon="pi pi-user" :value="me?.name" class="tag"></PrimeTag> -->
                        <PrimeButton icon="pi pi-user" :label="me?.name" severity="primary" raised @click="router.push({name: 'User'})"/>
                            <div class="block lg:hidden">
                                <div class="text-900 font-medium">
                                    Josephine Lillard
                                </div>
                                <span class="text-600 font-medium text-sm"
                                    >Marketing Specialist</span
                                >
                            </div>
                        <!-- </a> -->
                    </li>
                    <li>
                        <a
                            v-ripple
                            class="flex p-3 lg:px-3 lg:py-2 align-items-center text-600 hover:text-900 hover:surface-100 font-medium border-round cursor-pointer transition-duration-150 transition-colors p-ripple"
                        >
                            <i
                                class="pi pi-inbox text-base lg:text-2xl mr-2 lg:mr-0"
                            ></i>
                            <span class="block lg:hidden font-medium"
                                >Inbox</span
                            >
                        </a>
                    </li>
                    <li>
                        <a
                            v-ripple
                            class="flex p-3 lg:px-3 lg:py-2 align-items-center text-600 hover:text-900 hover:surface-100 font-medium border-round cursor-pointer transition-duration-150 transition-colors p-ripple"
                        >
                            <i
                                class="pi pi-bell text-base lg:text-2xl mr-2 lg:mr-0"
                                v-badge.danger
                            ></i>
                            <span class="block lg:hidden font-medium"
                                >Notifications</span
                            >
                        </a>
                    </li>
                    <li>
                        <a  @click="logout"
                            v-ripple
                            class="flex p-3 lg:px-3 lg:py-2 align-items-center text-600 hover:text-900 hover:surface-100 font-medium border-round cursor-pointer transition-duration-150 transition-colors p-ripple"
                        >
                            <i
                                class="pi pi-power-off text-base lg:text-2xl mr-2 lg:mr-0"
                                
                            ></i>
                            <span class="block lg:hidden font-medium"
                                >Log out</span
                            >
                        </a>
                    </li>
                    
                </ul>
            </div>
            <div class=" flex flex-column flex-auto" style=" overflow-y: auto;">
    <!-- <div class="scroll"> -->
    <slot>
    </slot>
    <!-- </div> -->
</div>
        </div>
    </div>
</template>
