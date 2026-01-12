import { useState, useEffect } from 'react';
import Table from '../components/Common/Table';
import Modal from '../components/Common/Modal';
import type { Transport as TransportType, CreateTransportDTO } from '../types/transport';
import transportService from '../services/transportService';

const Transport = () => {
  const [transportData, setTransportData] = useState<TransportType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState<CreateTransportDTO>({
    name: '',
    vehicle_number: '',
    address: '',
    emailId: '',
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchTransports();
  }, []);

  const fetchTransports = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await transportService.getTransports();
      console.log(data)
      setTransportData(data);
    } catch (err) {
      setError('Failed to fetch transport data. Please try again later.');
      console.error('Error fetching transports:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      await transportService.createTransport(formData);
      setIsModalOpen(false);
      setFormData({ name: '', vehicle_number: '', address: '', emailId: '' });
      fetchTransports();
    } catch (err) {
      console.error('Error creating transport:', err);
      alert('Failed to create transport. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setFormData({ name: '', vehicle_number: '', address: '', emailId: '' });
  };

  const columns = [
    { header: 'Transport Name', accessor: 'name' as keyof TransportType },
    { header: 'Vehicle Number', accessor: 'vehicle_number' as keyof TransportType },
    { header: 'Address', accessor: 'address' as keyof TransportType },
    { header: 'Email', accessor: 'emailId' as keyof TransportType },
    {
      header: 'Created At',
      accessor: (row: TransportType) => 
        row.createdAt ? new Date(row.createdAt).toLocaleDateString() : 'N/A',
    },
  ];

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Transport</h1>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Transport Providers</h2>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            + Add Transport
          </button>
        </div>
        {loading && <p className="text-gray-600 text-center py-4">Loading transports...</p>}
        {error && <p className="text-red-600 text-center py-4">{error}</p>}
        {!loading && !error && <Table data={transportData} columns={columns} />}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title="Add New Transport"
        size="md"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Transport Name *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter transport name"
            />
          </div>

          <div>
            <label htmlFor="vehicle_number" className="block text-sm font-medium text-gray-700 mb-1">
              Vehicle Number *
            </label>
            <input
              type="text"
              id="vehicle_number"
              name="vehicle_number"
              value={formData.vehicle_number}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="e.g., MH-01-AB-1234"
            />
          </div>

          <div>
            <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
              Address *
            </label>
            <textarea
              id="address"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              required
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter complete address"
            />
          </div>

          <div>
            <label htmlFor="emailId" className="block text-sm font-medium text-gray-700 mb-1">
              Email *
            </label>
            <input
              type="email"
              id="emailId"
              name="emailId"
              value={formData.emailId}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="email@example.com"
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
              {submitting ? 'Creating...' : 'Create Transport'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Transport;
