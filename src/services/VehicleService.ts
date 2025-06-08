import axios from 'axios'
import type { VehicleData } from '../interfaces/VehicleData'
// import type  DVSAVehicleData  from '../interfaces/DvsaVehicleData';
import { useVehicleStore } from '@/stores/vehicleData' // adjust path as needed
interface MappedVehicleData {
  registration_number: string
  tax_status: string
  mot_status: string
  make: string
  year_of_manufacture: number
  engine_capacity: number
  co2_emissions: number
  fuel_type: string
  marked_for_export: boolean
  colour: string
  type_approval: string
  date_of_last_v5c_issued: string
  mot_expiry_date: string
  wheelplan: string
  month_of_first_registration: number
}

class VehicleService {
  // Function to fetch vehicle details from DVLA API
  getVehicleDetails = async (registrationNumber: string): Promise<VehicleData> => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/admin/get-vehicle-details`,
        {
          registrationNumber: registrationNumber
        }
      )

      // Assuming the response contains the vehicle details
      console.log(response.data)
      //   this.saveVehicleData(response.data)
      return response.data
    } catch (error) {
      console.error(error)
      throw error
    }
  }

  getVehicleByReg = async (registrationNumber: any): Promise<VehicleData> => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/admin/vehicle-details/${registrationNumber}`
      )
      console.log('Fetched vehicle data by Registration from db:', response.data)
      return response.data
    } catch (error) {
      console.error(error)
      throw error
    }
  }
  getDvsaVehicleByReg = async (registrationNumber: any) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/admin/dvsa-vehicle-details/${registrationNumber}`
      )

      console.log('Fetched vehicle data by Registration from dvsa data:', response.data)
      return response.data
    } catch (error) {
      console.error(error)
      throw error
    }
  }
  fetchAllVehicles = async (forceRefresh = false) => {
    const store = useVehicleStore()

    if (!forceRefresh && store.vehData && store.vehData.length > 0) {
      return store.vehData
    }

    try {
      const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/admin/get-all-vehicles`, {
        headers: {
          Authorization: 'Bearer ' + sessionStorage.getItem('token'),
          'Content-Type': 'application/json'
        }
      })

      const cars = res.data.cars || []
      store.setVehicleData(cars)
      return cars
    } catch (error) {
      console.error('Failed to fetch vehicles', error)
      throw error
    }
  }

  setFeaturedVehicle = async (carId: number) => {
    await axios.post(
      `${import.meta.env.VITE_API_BASE_URL}/admin/featured-vehicle`,
      { id: carId },
      {
        headers: {
          Authorization: 'Bearer ' + sessionStorage.getItem('token'),
          'Content-Type': 'application/json'
        }
      }
    )
  }

archiveVehicles = async (payload: { vehicle_ids: number[]; action: string }) => {
  try {
    const res = await axios.post(
      `${import.meta.env.VITE_API_BASE_URL}/admin/archive-vehicles`,
      payload,
      {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
      }
    );

    return res.data;
  } catch (error) {
    console.error('Failed to archive vehicles:', error);
    throw error;
  }
}

getArchivedVehicles = async () => {
  try {
    const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/admin/archived-vehicles`, {
      headers: {
        Authorization: 'Bearer ' + sessionStorage.getItem('token'),
      }
    });

    return res.data.vehicles;
  } catch (error) {
    console.error('Failed to fetch archived vehicles:', error);
    throw error;
  }
}

deleteVehicles = async (vehicleIds: number[]) => {
  return await axios.post(`${import.meta.env.VITE_API_BASE_URL}/admin/delete-vehicles`, {
    vehicle_ids: vehicleIds
  }, {
    headers: {
      Authorization: 'Bearer ' + sessionStorage.getItem('token'),
      'Content-Type': 'application/json'
    }
  });
}

}

export default new VehicleService()
