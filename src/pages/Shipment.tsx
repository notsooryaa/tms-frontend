import Table from '../components/Common/Table';
import type { Shipment as ShipmentType } from '../types/shipment';

const Shipment = () => {
  const shipmentData: ShipmentType[] = [
    {
      _id: '1',
      transportType: 'Express Logistics',
      vehicleType: 'Heavy Duty Truck',
      totalWeight: 8500,
      totalVolume: 350,
      totalQuantity: 250,
      groupId: 1001,
      status: 'in-transit',
      createdAt: '2026-01-10T10:00:00Z',
      updatedAt: '2026-01-12T10:00:00Z',
    },
    {
      _id: '2',
      transportType: 'Fast Transport Services',
      vehicleType: 'Cargo Van',
      totalWeight: 2500,
      totalVolume: 120,
      totalQuantity: 100,
      groupId: 1002,
      status: 'pending',
      createdAt: '2026-01-11T10:00:00Z',
      updatedAt: '2026-01-11T10:00:00Z',
    },
    {
      _id: '3',
      transportType: 'Swift Carriers',
      vehicleType: 'Large Transport Truck',
      totalWeight: 12000,
      totalVolume: 480,
      totalQuantity: 350,
      groupId: 1003,
      status: 'completed',
      createdAt: '2026-01-09T10:00:00Z',
      updatedAt: '2026-01-11T10:00:00Z',
    },
  ];

  const columns = [
    { header: 'Group ID', accessor: 'groupId' as keyof ShipmentType },
    { 
      header: 'Transport', 
      accessor: (row: ShipmentType) => 
        typeof row.transportType === 'string' ? row.transportType : row.transportType.name,
    },
    { 
      header: 'Vehicle Type', 
      accessor: (row: ShipmentType) => 
        typeof row.vehicleType === 'string' ? row.vehicleType : row.vehicleType.name,
    },
    {
      header: 'Weight (kg)',
      accessor: (row: ShipmentType) => row.totalWeight.toLocaleString(),
    },
    {
      header: 'Volume (CFT)',
      accessor: (row: ShipmentType) => row.totalVolume.toFixed(2),
    },
    {
      header: 'Quantity',
      accessor: 'totalQuantity' as keyof ShipmentType,
    },
    {
      header: 'Status',
      accessor: (row: ShipmentType) => (
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${
            row.status === 'in-transit'
              ? 'bg-blue-100 text-blue-800'
              : row.status === 'pending'
              ? 'bg-yellow-100 text-yellow-800'
              : row.status === 'completed'
              ? 'bg-green-100 text-green-800'
              : 'bg-red-100 text-red-800'
          }`}
        >
          {row.status.charAt(0).toUpperCase() + row.status.slice(1)}
        </span>
      ),
    },
  ];

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Shipment</h1>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Active Shipments</h2>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
            + Create Shipment
          </button>
        </div>
        <Table data={shipmentData} columns={columns} />
      </div>
    </div>
  );
};

export default Shipment;
