export interface Shipment {
  _id?: string;
  transportType: string | {
    _id: string;
    name: string;
  };
  vehicleType: string | {
    _id: string;
    name: string;
  };
  totalWeight: number;
  totalVolume: number;
  totalQuantity: number;
  groupId: number;
  status: 'pending' | 'in-transit' | 'completed' | 'cancelled';
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateShipmentDTO {
  transportType: string;
  vehicleType: string;
  totalWeight: number;
  totalVolume: number;
  totalQuantity: number;
  groupId: number;
  status?: 'pending' | 'in-transit' | 'completed' | 'cancelled';
}

export interface UpdateShipmentDTO {
  transportType?: string;
  vehicleType?: string;
  totalWeight?: number;
  totalVolume?: number;
  totalQuantity?: number;
  groupId?: number;
  status?: 'pending' | 'in-transit' | 'completed' | 'cancelled';
}
