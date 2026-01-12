export interface Material {
  _id?: string;
  name: string;
  description: string;
  category: string | MaterialCategory;
  weightPerUnit: number;
  volumePerUnit: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface MaterialCategory {
  _id: string;
  name: string;
}

export interface CreateMaterialDTO {
  name: string;
  description: string;
  category: string;
  weightPerUnit: number;
  volumePerUnit: number;
}

export interface UpdateMaterialDTO {
  name?: string;
  description?: string;
  category?: string;
  weightPerUnit?: number;
  volumePerUnit?: number;
}
