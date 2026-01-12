export interface Vehicle {
  _id?: string;
  name: string;
  weight: number;
  volume: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateVehicleDTO {
  name: string;
  weight: number;
  volume: number;
}

export interface UpdateVehicleDTO {
  name?: string;
  weight?: number;
  volume?: number;
}
