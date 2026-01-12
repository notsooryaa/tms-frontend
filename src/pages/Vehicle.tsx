import { useState, useEffect } from 'react';
import Table from '../components/Common/Table';
import Modal from '../components/Common/Modal';
import type { Vehicle as VehicleType, CreateVehicleDTO } from '../types/vehicle';
import vehicleService from '../services/vehicleService';

const Vehicle = () => {
  const [vehicleData, setVehicleData] = useState<VehicleType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState<CreateVehicleDTO>({
    name: '',
    weight: 0,
    volume: 0,
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchVehicles();
  }, []);

  const fetchVehicles = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await vehicleService.getVehicles();
      setVehicleData(data);
    } catch (err) {
      setError('Failed to fetch vehicle data. Please try again later.');
      console.error('Error fetching vehicles:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'name' ? value : parseFloat(value) || 0,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      await vehicleService.createVehicle(formData);
      setIsModalOpen(false);
      setFormData({ name: '', weight: 0, volume: 0 });
      fetchVehicles();
    } catch (err) {
      console.error('Error creating vehicle:', err);
      alert('Failed to create vehicle. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setFormData({ name: '', weight: 0, volume: 0 });
  };

  const columns = [
    { header: 'Vehicle Name', accessor: 'name' as keyof VehicleType },
    { 
      header: 'Weight (kg)', 
      accessor: (row: VehicleType) => row.weight.toLocaleString(),
    },
    { 
      header: 'Volume (CFT)', 
      accessor: (row: VehicleType) => row.volume.toFixed(2),
    },
    {
      header: 'Created At',
      accessor: (row: VehicleType) => 
        row.createdAt ? new Date(row.createdAt).toLocaleDateString() : 'N/A',
    },
  ];

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Vehicle</h1>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Vehicle Types</h2>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            + Add Vehicle Type
          </button>
        </div>
        {loading && <p className="text-gray-600 text-center py-4">Loading vehicles...</p>}
        {error && <p className="text-red-600 text-center py-4">{error}</p>}
        {!loading && !error && <Table data={vehicleData} columns={columns} />}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title="Add New Vehicle Type"
        size="md"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Vehicle Name *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter vehicle name"
            />
          </div>

          <div>
            <label htmlFor="weight" className="block text-sm font-medium text-gray-700 mb-1">
              Weight (kg) *
            </label>
            <input
              type="number"
              id="weight"
              name="weight"
              value={formData.weight}
              onChange={handleInputChange}
              required
              min="0"
              step="0.01"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter weight in kg"
            />
          </div>

          <div>
            <label htmlFor="volume" className="block text-sm font-medium text-gray-700 mb-1">
              Volume (CFT) *
            </label>
            <input
              type="number"
              id="volume"
              name="volume"
              value={formData.volume}
              onChange={handleInputChange}
              required
              min="0"
              step="0.01"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter volume in cubic feet"
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
              {submitting ? 'Creating...' : 'Create Vehicle'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Vehicle;
