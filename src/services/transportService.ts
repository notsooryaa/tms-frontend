import api from './api';
import type { Transport, CreateTransportDTO, UpdateTransportDTO } from '../types/transport';

export const transportService = {
  getTransports: async (): Promise<Transport[]> => {
    return api.get<Transport[]>('/transport-types');
  },

  getTransportById: async (id: string): Promise<Transport> => {
    return api.get<Transport>(`/transport-types/${id}`);
  },

  createTransport: async (data: CreateTransportDTO): Promise<Transport> => {
    return api.post<Transport>('/transport-types', data);
  },

  updateTransport: async (id: string, data: UpdateTransportDTO): Promise<Transport> => {
    return api.put<Transport>(`/transport-types/${id}`, data);
  },
  deleteTransport: async (id: string): Promise<void> => {
    return api.delete<void>(`/transport-types/${id}`);
  },
};

export default transportService;
