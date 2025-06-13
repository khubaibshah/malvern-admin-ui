// store/vehicleData.ts
import { defineStore } from 'pinia'

export const useVehicleStore = defineStore('vehicleData', {
  state: () => ({
    vehData: null,
    registrationNumber: null as string | null,
    vehicles: [] as any[],
    featuredVehicles: [] as any[],
    vehiclesLoaded: false, // flag to avoid refetching
  }),
  actions: {
    setVehicleData(data: any) {
      this.vehData = data
    },
    setVehicleReg(registrationNumber: string | null) {
      this.registrationNumber = registrationNumber
    },
    setVehicles(data: any[]) {
      this.vehicles = data
      this.featuredVehicles = data.filter(v => v.featured === 1)
      this.vehiclesLoaded = true
    }
  },
  getters: {
    getVehicleData: (state) => state.vehData,
    getVehicleReg: (state) => state.registrationNumber,
    hasVehicleData: (state) => state.vehData !== null,
    getVehicles: (state) => state.vehicles,
    getFeaturedVehicles: (state) => state.featuredVehicles,
  }
})
// This store manages vehicle data, including individual vehicle details, a list of vehicles,
// featured vehicles, and a registration number. It provides actions to set this data and getters
// to retrieve it. The `vehiclesLoaded` flag prevents unnecessary refetching of vehicle data.