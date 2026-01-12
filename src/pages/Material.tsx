import { useState, useEffect } from 'react';
import Table from '../components/Common/Table';
import Modal from '../components/Common/Modal';
import type { Material as MaterialType, MaterialCategory, CreateMaterialDTO } from '../types/material';
import materialService from '../services/materialService';

const Material = () => {
  const [materialData, setMaterialData] = useState<MaterialType[]>([]);
  const [categories, setCategories] = useState<MaterialCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState<CreateMaterialDTO>({
    name: '',
    description: '',
    category: '',
    weightPerUnit: 0,
    volumePerUnit: 0,
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchMaterials();
    fetchCategories();
  }, []);

  const fetchMaterials = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await materialService.getMaterials();
      setMaterialData(data);
    } catch (err) {
      setError('Failed to fetch material data. Please try again later.');
      console.error('Error fetching materials:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const data = await materialService.getMaterialCategories();
      setCategories(data);
    } catch (err) {
      console.error('Error fetching categories:', err);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'weightPerUnit' || name === 'volumePerUnit' ? parseFloat(value) || 0 : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      await materialService.createMaterial(formData);
      setIsModalOpen(false);
      setFormData({ name: '', description: '', category: '', weightPerUnit: 0, volumePerUnit: 0 });
      fetchMaterials();
    } catch (err) {
      console.error('Error creating material:', err);
      alert('Failed to create material. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setFormData({ name: '', description: '', category: '', weightPerUnit: 0, volumePerUnit: 0 });
  };

  const columns = [
    { header: 'Material Name', accessor: 'name' as keyof MaterialType },
    { header: 'Description', accessor: 'description' as keyof MaterialType },
    { 
      header: 'Category', 
      accessor: (row: MaterialType) => 
        typeof row.category === 'string' ? row.category : row.category.name,
    },
    {
      header: 'Weight/Unit (kg)',
      accessor: (row: MaterialType) => row.weightPerUnit.toFixed(2),
    },
    {
      header: 'Volume/Unit (CFT)',
      accessor: (row: MaterialType) => row.volumePerUnit.toFixed(3),
    },
  ];

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Material</h1>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Material Inventory</h2>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            + Add Material
          </button>
        </div>
        {loading && <p className="text-gray-600 text-center py-4">Loading materials...</p>}
        {error && <p className="text-red-600 text-center py-4">{error}</p>}
        {!loading && !error && <Table data={materialData} columns={columns} />}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title="Add New Material"
        size="md"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Material Name *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter material name"
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Description *
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              required
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter material description"
            />
          </div>

          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
              Category *
            </label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Select a category</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="weightPerUnit" className="block text-sm font-medium text-gray-700 mb-1">
              Weight Per Unit (kg) *
            </label>
            <input
              type="number"
              id="weightPerUnit"
              name="weightPerUnit"
              value={formData.weightPerUnit}
              onChange={handleInputChange}
              required
              min="0"
              step="0.01"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter weight per unit"
            />
          </div>

          <div>
            <label htmlFor="volumePerUnit" className="block text-sm font-medium text-gray-700 mb-1">
              Volume Per Unit (CFT) *
            </label>
            <input
              type="number"
              id="volumePerUnit"
              name="volumePerUnit"
              value={formData.volumePerUnit}
              onChange={handleInputChange}
              required
              min="0"
              step="0.001"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter volume per unit"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={handleCloseModal}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-400 disabled:cursor-not-allowed"
            >
              {submitting ? 'Creating...' : 'Create Material'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Material;
