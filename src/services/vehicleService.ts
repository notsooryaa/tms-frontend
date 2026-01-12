import api from './api';
import type { Vehicle, CreateVehicleDTO, UpdateVehicleDTO } from '../types/vehicle';

export const vehicleService = {
  getVehicles: async (): Promise<Vehicle[]> => {
    return api.get<Vehicle[]>('/vechicle-types');
  },

  getVehicleById: async (id: string): Promise<Vehicle> => {
    return api.get<Vehicle>(`/vechicle-types/${id}`);
  },

  createVehicle: async (data: CreateVehicleDTO): Promise<Vehicle> => {
    return api.post<Vehicle>('/vechicle-types', data);
  },

  updateVehicle: async (id: string, data: UpdateVehicleDTO): Promise<Vehicle> => {
    return api.put<Vehicle>(`/vechicle-types/${id}`, data);
  },

  deleteVehicle: async (id: string): Promise<void> => {
    return api.delete<void>(`/vechicle-types/${id}`);
  },
};

export default vehicleService;
