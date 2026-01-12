export interface Transport {
  _id?: string;
  name: string;
  vehicle_number: string;
  address: string;
  emailId: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateTransportDTO {
  name: string;
  vehicle_number: string;
  address: string;
  emailId: string;
}

export interface UpdateTransportDTO {
  name?: string;
  vehicle_number?: string;
  address?: string;
  emailId?: string;
}
