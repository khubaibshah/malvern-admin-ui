import axios from 'axios';
import type { VehicleData } from '../interfaces/VehicleData';
// import type  DVSAVehicleData  from '../interfaces/DvsaVehicleData';

interface MappedVehicleData {
  registration_number: string;
  tax_status: string;
  mot_status: string;
  make: string;
  year_of_manufacture: number;
  engine_capacity: number;
  co2_emissions: number;
  fuel_type: string;
  marked_for_export: boolean;
  colour: string;
  type_approval: string;
  date_of_last_v5c_issued: string;
  mot_expiry_date: string;
  wheelplan: string;
  month_of_first_registration: number;
}

class VehicleService {
  
  // Function to fetch vehicle details from DVLA API
  getVehicleDetails = async (registrationNumber: string): Promise<VehicleData> => {
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/admin/get-vehicle-details`, {
        registrationNumber: registrationNumber,
      });
      
      // Assuming the response contains the vehicle details
      console.log(response.data);
    //   this.saveVehicleData(response.data)
      return response.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };


  getVehicleByReg = async (registrationNumber: any): Promise<VehicleData> => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/admin/vehicle-details/${registrationNumber}`);
      console.log('Fetched vehicle data by Registration from db:', response.data);
      return response.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };
  getDvsaVehicleByReg = async (registrationNumber: any) => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/admin/dvsa-vehicle-details/${registrationNumber}`);

      console.log('Fetched vehicle data by Registration from dvsa data:', response.data);
      return response.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };
}

export default new VehicleService();
