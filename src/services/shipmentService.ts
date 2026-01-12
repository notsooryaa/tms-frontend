import api from './api';
import type { Shipment, CreateShipmentDTO, UpdateShipmentDTO } from '../types/shipment';

export const shipmentService = {
  getShipments: async (): Promise<Shipment[]> => {
    return api.get<Shipment[]>('/shipments');
  },

  getShipmentById: async (id: string): Promise<Shipment> => {
    return api.get<Shipment>(`/shipments/${id}`);
  },

  getShipmentSummaryById: async (id: string): Promise<Shipment> => {
    return api.get<Shipment>(`/shipments/status-summary/${id}`);
  },

  createShipment: async (data: CreateShipmentDTO): Promise<Shipment> => {
    return api.post<Shipment>('/shipments', data);
  },

  updateShipment: async (id: string, data: UpdateShipmentDTO): Promise<Shipment> => {
    return api.put<Shipment>(`/shipments/${id}`, data);
  },

  deleteShipment: async (id: string): Promise<void> => {
    return api.delete<void>(`/shipments/${id}`);
  },
};

export default shipmentService;
