// store/index.ts
import { defineStore } from 'pinia';

export const useVehicleStore = defineStore({
  id: 'vehicleData',
  state: () => ({
    vehData: null,
    registrationNumber: null as string | null, // Updated type to allow string or null
  }),
  actions: {
    setVehicleData(data: any) {
      this.vehData = data;
    },
    setVehicleReg(registrationNumber: string | null) { // Updated type to accept string or null
      this.registrationNumber = registrationNumber;
    },
  },
  getters: {
    getVehicleData(): any {
      return this.vehData;
    },
    getVehicleReg(): string | null {
      return this.registrationNumber;
    },
    hasVehicleData(): any {
      return this.vehData !== null;
    },
  },
});
