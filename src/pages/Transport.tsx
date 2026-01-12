import Table from '../components/Common/Table';
import type { Transport as TransportType } from '../types/transport';

const Transport = () => {
  const transportData: TransportType[] = [
    {
      _id: '1',
      name: 'Express Logistics',
      vehicle_number: 'MH-01-AB-1234',
      address: 'Mumbai, Maharashtra',
      emailId: 'express@logistics.com',
      createdAt: '2026-01-10T10:00:00Z',
      updatedAt: '2026-01-12T10:00:00Z',
    },
    {
      _id: '2',
      name: 'Fast Transport Services',
      vehicle_number: 'DL-02-CD-5678',
      address: 'Delhi, NCR',
      emailId: 'fast@transport.com',
      createdAt: '2026-01-11T10:00:00Z',
      updatedAt: '2026-01-11T10:00:00Z',
    },
    {
      _id: '3',
      name: 'Swift Carriers',
      vehicle_number: 'TN-03-EF-9012',
      address: 'Chennai, Tamil Nadu',
      emailId: 'swift@carriers.com',
      createdAt: '2026-01-09T10:00:00Z',
      updatedAt: '2026-01-09T10:00:00Z',
    },
  ];

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
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
            + Add Transport
          </button>
        </div>
        <Table data={transportData} columns={columns} />
      </div>
    </div>
  );
};

export default Transport;
