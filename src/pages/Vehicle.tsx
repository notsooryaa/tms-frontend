import Table from '../components/Common/Table';
import type { Vehicle as VehicleType } from '../types/vehicle';

const Vehicle = () => {
  const vehicleData: VehicleType[] = [
    {
      _id: '1',
      name: 'Heavy Duty Truck',
      weight: 10000,
      volume: 45,
      createdAt: '2026-01-05T10:00:00Z',
      updatedAt: '2026-01-05T10:00:00Z',
    },
    {
      _id: '2',
      name: 'Cargo Van',
      weight: 3000,
      volume: 15,
      createdAt: '2026-01-08T10:00:00Z',
      updatedAt: '2026-01-08T10:00:00Z',
    },
    {
      _id: '3',
      name: 'Large Transport Truck',
      weight: 15000,
      volume: 60,
      createdAt: '2026-01-02T10:00:00Z',
      updatedAt: '2026-01-02T10:00:00Z',
    },
  ];

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
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
            + Add Vehicle Type
          </button>
        </div>
        <Table data={vehicleData} columns={columns} />
      </div>
    </div>
  );
};

export default Vehicle;
