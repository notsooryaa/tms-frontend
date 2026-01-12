export interface SourceDetail {
  _id: string;
  shipmentId: string;
  sourceLocation: string;
  orderNumber: number;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface DestinationDetail {
  _id: string;
  shipmentId: string;
  destinationLocation: string;
  orderNumber: number;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface ShipmentDetail {
  _id?: string;
  source: string;
  destination: string;
  material: string | {
    _id: string;
    name: string;
  };
  weight: number;
  volume: number;
  quantity: number;
  orderNo: string;
}

export interface Shipment {
  _id?: string;
  sourceDetails?: SourceDetail[];
  destinationDetails?: DestinationDetail[];
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
  details?: ShipmentDetail[];
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateShipmentDTO {
  source: string[];
  destination: string[];
  transportType: string;
  vehicleType: string;
  materials: Array<{
    materialId: string;
    quantity: number;
  }>;
  orderNumber: number[];
  groupId: number;
}

export interface UpdateShipmentDTO {
  transportType?: string;
  vehicleType?: string;
  groupId?: number;
  additionalSources?: Array<{
    location: string;
    orderNumber: number;
  }>;
  additionalDestinations?: Array<{
    location: string;
    orderNumber: number;
  }>;
  additionalMaterials?: Array<{
    materialId: string;
    quantity: number;
    orderNumber: number;
  }>;
}

export interface PickupLocation {
  id: string;
  location: string;
  status: string;
}

export interface DropLocation {
  id: string;
  location: string;
  status: string;
}

export interface OrderMaterial {
  id: string;
  materialId: string;
  materialName: string;
  quantity: number;
  weightPerUnit: number;
  volumePerUnit: number;
}

export interface Order {
  orderNumber: number;
  pickups: PickupLocation[];
  drops: DropLocation[];
  materials: OrderMaterial[];
}

export interface ShipmentSummary {
  shipment: {
    id: string;
    status: string;
    groupId: number;
  };
  orders: Order[];
  weight: number;
  volume: number;
  quantity: number;
}
