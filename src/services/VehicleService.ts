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
      const response = await axios.post('http://127.0.0.1:8000/admin/get-vehicle-details', {
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

  // Function to save vehicle data to the database
//   saveVehicleData = async (vehicleData: VehicleData): Promise<MappedVehicleData> => {
//     try {
//         const mappedData: MappedVehicleData = {
//             registration_number: vehicleData.registration_number,
//             tax_status: vehicleData.tax_status,
//             mot_status: vehicleData.mot_status,
//             make: vehicleData.make,
//             year_of_manufacture: vehicleData.year_of_manufacture,
//             engine_capacity: vehicleData.engine_capacity,
//             co2_emissions: vehicleData.co2_emissions,
//             fuel_type: vehicleData.fuel_type,
//             marked_for_export: vehicleData.marked_for_export,
//             colour: vehicleData.colour,
//             type_approval: vehicleData.type_approval,
//             date_of_last_v5c_issued: vehicleData.date_of_last_v5c_issued,
//             mot_expiry_date: vehicleData.mot_expiry_date,
//             wheelplan: vehicleData.wheelplan,
//             month_of_first_registration: parseInt(vehicleData.month_of_first_registration),
//           };
          
//       const response = await axios.post('http://127.0.0.1:8000/admin/vehicle-details', mappedData);
//       console.log('Vehicle data saved to database:', response.data);
//     //   this.getVehicleByReg(response.data.registration_number)
//       return mappedData;
//     } catch (error) {
//       console.error(error);
//       throw error;
//     }
//   };

  // Function to fetch a single vehicle by ID
  getVehicleByReg = async (registrationNumber: any): Promise<VehicleData> => {
    try {
      const response = await axios.get(`http://127.0.0.1:8000/admin/vehicle-details/${registrationNumber}`);
      console.log('Fetched vehicle data by Registration from db:', response.data);
      return response.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };
  getDvsaVehicleByReg = async (registrationNumber: any) => {
    try {
      const response = await axios.get(`http://127.0.0.1:8000/admin/dvsa-vehicle-details/${registrationNumber}`);

      console.log('Fetched vehicle data by Registration from dvsa data:', response.data);
      return response.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };
}

export default new VehicleService();
