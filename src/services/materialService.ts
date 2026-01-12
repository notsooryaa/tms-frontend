import api from './api';
import type { Material, MaterialCategory, CreateMaterialDTO, UpdateMaterialDTO } from '../types/material';

export const materialService = {
  getMaterials: async (): Promise<Material[]> => {
    return api.get<Material[]>('/materials');
  },

  getMaterialById: async (id: string): Promise<Material> => {
    return api.get<Material>(`/materials/${id}`);
  },

  getMaterialCategories: async (): Promise<MaterialCategory[]> => {
    return api.get<MaterialCategory[]>('/material-categories');
  },

  createMaterial: async (data: CreateMaterialDTO): Promise<Material> => {
    return api.post<Material>('/materials', data);
  },

  updateMaterial: async (id: string, data: UpdateMaterialDTO): Promise<Material> => {
    return api.put<Material>(`/materials/${id}`, data);
  },

  deleteMaterial: async (id: string): Promise<void> => {
    return api.delete<void>(`/materials/${id}`);
  },
};

export default materialService;
