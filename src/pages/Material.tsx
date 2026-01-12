import Table from '../components/Common/Table';
import type { Material as MaterialType } from '../types/material';

const Material = () => {
  const materialData: MaterialType[] = [
    {
      _id: '1',
      name: 'Steel Bars',
      description: 'High-grade steel bars for construction',
      category: 'Raw Material',
      weightPerUnit: 25,
      volumePerUnit: 0.05,
      createdAt: '2026-01-10T10:00:00Z',
      updatedAt: '2026-01-10T10:00:00Z',
    },
    {
      _id: '2',
      name: 'Cement Bags',
      description: 'Portland cement bags 50kg each',
      category: 'Construction',
      weightPerUnit: 50,
      volumePerUnit: 0.033,
      createdAt: '2026-01-11T10:00:00Z',
      updatedAt: '2026-01-11T10:00:00Z',
    },
    {
      _id: '3',
      name: 'Packaging Boxes',
      description: 'Standard cardboard packaging boxes',
      category: 'Supplies',
      weightPerUnit: 0.5,
      volumePerUnit: 0.125,
      createdAt: '2026-01-09T10:00:00Z',
      updatedAt: '2026-01-09T10:00:00Z',
    },
  ];

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
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
            + Add Material
          </button>
        </div>
        <Table data={materialData} columns={columns} />
      </div>
    </div>
  );
};

export default Material;
