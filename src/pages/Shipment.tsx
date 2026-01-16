import { useState, useEffect, useRef } from 'react';
import Table from '../components/Common/Table';
import Slider from '../components/Common/Slider';
import Modal from '../components/Common/Modal';
import type { Shipment as ShipmentType, CreateShipmentDTO, ShipmentSummary, UpdateShipmentDTO } from '../types/shipment';
import type { Transport } from '../types/transport';
import type { Vehicle } from '../types/vehicle';
import type { Material } from '../types/material';
import shipmentService from '../services/shipmentService';
import transportService from '../services/transportService';
import vehicleService from '../services/vehicleService';
import materialService from '../services/materialService';

const Shipment = () => {
  const [shipmentData, setShipmentData] = useState<ShipmentType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedShipment, setSelectedShipment] = useState<ShipmentType | null>(null);
  const [shipmentSummary, setShipmentSummary] = useState<ShipmentSummary | null>(null);
  const [loadingSummary, setLoadingSummary] = useState(false);
  const [isSliderOpen, setIsSliderOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [updateStatus, setUpdateStatus] = useState<'pending' | 'in-transit' | 'completed' | 'cancelled'>('pending');
  
  const [updateFormData, setUpdateFormData] = useState<UpdateShipmentDTO>({
    transportType: '',
    vehicleType: '',
    groupId: 0,
    additionalSources: [],
    additionalDestinations: [],
    additionalMaterials: [],
  });
  
  const [transports, setTransports] = useState<Transport[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [materials, setMaterials] = useState<Material[]>([]);
  const [currentOrderNumber, setCurrentOrderNumber] = useState<number>(0);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [uploadTransportType, setUploadTransportType] = useState('');
  const [uploadVehicleType, setUploadVehicleType] = useState('');
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [formData, setFormData] = useState<CreateShipmentDTO>({
    source: [''],
    destination: [''],
    transportType: '',
    vehicleType: '',
    materials: [{ materialId: '', quantity: 0 }],
    orderNumber: [],
    groupId: 0,
  });

  useEffect(() => {
    fetchShipments();
    fetchTransports();
    fetchVehicles();
    fetchMaterials();
  }, []);

  const fetchShipments = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await shipmentService.getShipments();
      setShipmentData(data);
    } catch (err) {
      setError('Failed to fetch shipment data. Please try again later.');
      console.error('Error fetching shipments:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchTransports = async () => {
    try {
      const data = await transportService.getTransports();
      setTransports(data);
    } catch (err) {
      console.error('Error fetching transports:', err);
    }
  };

  const fetchVehicles = async () => {
    try {
      const data = await vehicleService.getVehicles();
      setVehicles(data);
    } catch (err) {
      console.error('Error fetching vehicles:', err);
    }
  };

  const fetchMaterials = async () => {
    try {
      const data = await materialService.getMaterials();
      setMaterials(data);
    } catch (err) {
      console.error('Error fetching materials:', err);
    }
  };

  const generateUniqueOrderNumber = () => {
    const uuid = crypto.randomUUID();
    const numericPart = uuid.replace(/-/g, '').substring(0, 13);
    return parseInt(numericPart, 16);
  };

  const generateUniqueGroupId = () => {
    return Date.now() + Math.floor(Math.random() * 10000);
  };

  const handleSourceChange = (index: number, value: string) => {
    setFormData((prev) => ({
      ...prev,
      source: prev.source.map((s, i) => (i === index ? value : s)),
    }));
  };

  const handleDestinationChange = (index: number, value: string) => {
    setFormData((prev) => ({
      ...prev,
      destination: prev.destination.map((d, i) => (i === index ? value : d)),
    }));
  };

  const handleAddMaterial = () => {
    setFormData((prev) => ({
      ...prev,
      materials: [...prev.materials, { materialId: '', quantity: 0 }],
    }));
  };

  const handleRemoveMaterial = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      materials: prev.materials.filter((_, i) => i !== index),
    }));
  };

  const handleMaterialChange = (index: number, field: 'materialId' | 'quantity', value: string | number) => {
    setFormData((prev) => ({
      ...prev,
      materials: prev.materials.map((m, i) =>
        i === index ? { ...m, [field]: value } : m
      ),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      
      const validSources = formData.source.filter(s => s.trim());
      const validDestinations = formData.destination.filter(d => d.trim());
      const validMaterials = formData.materials.filter(m => m.materialId && m.quantity > 0);
      
      if (validSources.length === 0 || validDestinations.length === 0) {
        alert('Please provide at least one source and one destination');
        setSubmitting(false);
        return;
      }
      
      if (validMaterials.length === 0) {
        alert('Please add at least one material with quantity');
        setSubmitting(false);
        return;
      }
      
      if (!formData.transportType || !formData.vehicleType) {
        alert('Please select transport type and vehicle type');
        setSubmitting(false);
        return;
      }
      
      const orderCount = Math.max(validSources.length, validDestinations.length);
      const orderNumbers = Array.from({ length: orderCount }, () => generateUniqueOrderNumber());
      const groupId = generateUniqueGroupId();
      
      const submitData = {
        source: validSources,
        destination: validDestinations,
        transportType: formData.transportType,
        vehicleType: formData.vehicleType,
        materials: validMaterials,
        orderNumber: orderNumbers,
        groupId,
      };
      
      console.log('Submitting shipment data:', submitData);
      
      await shipmentService.createShipment(submitData);
      setIsModalOpen(false);
      setFormData({
        source: [''],
        destination: [''],
        transportType: '',
        vehicleType: '',
        materials: [{ materialId: '', quantity: 0 }],
        orderNumber: [],
        groupId: 0,
      });
      fetchShipments();
      alert('Shipment created successfully!');
    } catch (err) {
      console.error('Error creating shipment:', err);
      alert('Failed to create shipment. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setFormData({
      source: [''],
      destination: [''],
      transportType: '',
      vehicleType: '',
      materials: [{ materialId: '', quantity: 0 }],
      orderNumber: [],
      groupId: 0,
    });
  };

  const handleRowClick = async (shipment: ShipmentType) => {
    setSelectedShipment(shipment);
    setIsSliderOpen(true);
    if (shipment._id) {
      try {
        setLoadingSummary(true);
        const summary = await shipmentService.getShipmentSummaryById(shipment._id);
        setShipmentSummary(summary as unknown as ShipmentSummary);
      } catch (err) {
        console.error('Error fetching shipment summary:', err);
      } finally {
        setLoadingSummary(false);
      }
    }
  };

  const closeSlider = () => {
    setIsSliderOpen(false);
    setShipmentSummary(null);
    setIsEditMode(false);
    setTimeout(() => setSelectedShipment(null), 300);
  };

  const handleUpdateShipment = async () => {
    if (!selectedShipment?._id) return;
    
    try {
      setUpdating(true);
      
      const updateData: UpdateShipmentDTO = {};
      if (updateFormData.transportType) updateData.transportType = updateFormData.transportType;
      if (updateFormData.vehicleType) updateData.vehicleType = updateFormData.vehicleType;
      if (updateFormData.groupId) updateData.groupId = updateFormData.groupId;
      if (updateFormData.additionalSources && updateFormData.additionalSources.length > 0) {
        updateData.additionalSources = updateFormData.additionalSources.filter(s => s.location && s.orderNumber);
      }
      if (updateFormData.additionalDestinations && updateFormData.additionalDestinations.length > 0) {
        updateData.additionalDestinations = updateFormData.additionalDestinations.filter(d => d.location && d.orderNumber);
      }
      if (updateFormData.additionalMaterials && updateFormData.additionalMaterials.length > 0) {
        updateData.additionalMaterials = updateFormData.additionalMaterials.filter(m => m.materialId && m.quantity && m.orderNumber);
      }
      
      await shipmentService.updateShipment(selectedShipment._id, updateData);
      
      await fetchShipments();
      if (selectedShipment._id) {
        const summary = await shipmentService.getShipmentSummaryById(selectedShipment._id);
        setShipmentSummary(summary as unknown as ShipmentSummary);
      }
      
      setIsEditMode(false);
      alert('Shipment updated successfully!');
    } catch (err) {
      console.error('Error updating shipment:', err);
      alert('Failed to update shipment. Please try again.');
    } finally {
      setUpdating(false);
    }
  };

  const handleEditClick = () => {
    if (selectedShipment) {
      setUpdateStatus(selectedShipment.status);
      setUpdateFormData({
        transportType: typeof selectedShipment.transportType === 'object' ? selectedShipment.transportType._id : selectedShipment.transportType,
        vehicleType: typeof selectedShipment.vehicleType === 'object' ? selectedShipment.vehicleType._id : selectedShipment.vehicleType,
        groupId: selectedShipment.groupId,
        additionalSources: [],
        additionalDestinations: [],
        additionalMaterials: [],
      });
      setCurrentOrderNumber(generateUniqueOrderNumber());
      setIsEditMode(true);
    }
  };

  const handleAddSource = () => {
    setUpdateFormData((prev) => ({
      ...prev,
      additionalSources: [...(prev.additionalSources || []), { location: '', orderNumber: currentOrderNumber }],
    }));
  };

  const handleRemoveSource = (index: number) => {
    setUpdateFormData((prev) => ({
      ...prev,
      additionalSources: prev.additionalSources?.filter((_, i) => i !== index),
    }));
  };

  const handleSourceLocationChange = (index: number, value: string) => {
    setUpdateFormData((prev) => ({
      ...prev,
      additionalSources: prev.additionalSources?.map((s, i) => (i === index ? { ...s, location: value } : s)),
    }));
  };

  const handleAddDestination = () => {
    setUpdateFormData((prev) => ({
      ...prev,
      additionalDestinations: [...(prev.additionalDestinations || []), { location: '', orderNumber: currentOrderNumber }],
    }));
  };

  const handleRemoveDestination = (index: number) => {
    setUpdateFormData((prev) => ({
      ...prev,
      additionalDestinations: prev.additionalDestinations?.filter((_, i) => i !== index),
    }));
  };

  const handleDestinationLocationChange = (index: number, value: string) => {
    setUpdateFormData((prev) => ({
      ...prev,
      additionalDestinations: prev.additionalDestinations?.map((d, i) => (i === index ? { ...d, location: value } : d)),
    }));
  };

  const handleAddUpdateMaterial = () => {
    setUpdateFormData((prev) => ({
      ...prev,
      additionalMaterials: [...(prev.additionalMaterials || []), { materialId: '', quantity: 0, orderNumber: currentOrderNumber }],
    }));
  };

  const handleRemoveUpdateMaterial = (index: number) => {
    setUpdateFormData((prev) => ({
      ...prev,
      additionalMaterials: prev.additionalMaterials?.filter((_, i) => i !== index),
    }));
  };

  const handleUpdateMaterialChange = (index: number, field: 'materialId' | 'quantity', value: string | number) => {
    setUpdateFormData((prev) => ({
      ...prev,
      additionalMaterials: prev.additionalMaterials?.map((m, i) =>
        i === index ? { ...m, [field]: value } : m
      ),
    }));
  };

  const handleFileUpload = async (file: File | undefined) => {
    if (!file) return;
    try {
      await shipmentService.uploadExcel(file, {
        transportType: uploadTransportType,
        vehicleType: uploadVehicleType,
      });
      alert('Excel uploaded successfully!');
      fetchShipments();
      setIsUploadModalOpen(false);
      setUploadTransportType('');
      setUploadVehicleType('');
    } catch (err) {
      console.error('Error uploading Excel:', err);
      alert('Failed to upload Excel. Please try again.');
    }
  };

  const columns = [
    { header: 'Group ID', accessor: 'groupId' as keyof ShipmentType },
    { 
      header: 'Source', 
      accessor: (row: ShipmentType) => {
        if (!row.sourceDetails || row.sourceDetails.length === 0) return 'N/A';
        const sources = row.sourceDetails.map(s => s.sourceLocation);
        return (
          <div className="group relative">
            <span>
              {sources[0]}
              {sources.length > 1 && (
                <span className="ml-2 text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                  +{sources.length - 1}
                </span>
              )}
            </span>
            {sources.length > 1 && (
              <div className="absolute left-0 top-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg p-3 invisible group-hover:visible z-10 min-w-50">
                <p className="text-xs font-medium text-gray-500 mb-2">All Sources:</p>
                {sources.map((src, idx) => (
                  <p key={idx} className="text-sm text-gray-700 py-1">
                    {idx + 1}. {src}
                  </p>
                ))}
              </div>
            )}
          </div>
        );
      },
    },
    { 
      header: 'Destination', 
      accessor: (row: ShipmentType) => {
        if (!row.destinationDetails || row.destinationDetails.length === 0) return 'N/A';
        const destinations = row.destinationDetails.map(d => d.destinationLocation);
        return (
          <div className="group relative">
            <span>
              {destinations[destinations.length - 1]}
              {destinations.length > 1 && (
                <span className="ml-2 text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                  +{destinations.length - 1}
                </span>
              )}
            </span>
            {destinations.length > 1 && (
              <div className="absolute left-0 top-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg p-3 invisible group-hover:visible z-10 min-w-50">
                <p className="text-xs font-medium text-gray-500 mb-2">All Destinations:</p>
                {destinations.map((dest, idx) => (
                  <p key={idx} className="text-sm text-gray-700 py-1">
                    {idx + 1}. {dest}
                  </p>
                ))}
              </div>
            )}
          </div>
        );
      },
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
      <div className="bg-white p-6 rounded-lg shadow-md h-screen">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Active Shipments</h2>
          <div className="flex gap-2">
            <button
              onClick={() => setIsUploadModalOpen(true)}
              className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
            >
              Upload Excel
            </button>
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              + Create Shipment
            </button>
          </div>
        </div>
        <input
          type="file"
          ref={fileInputRef}
          accept=".xlsx,.xls"
          style={{ display: 'none' }}
          onChange={(e) => handleFileUpload(e.target.files?.[0])}
        />
        {loading && <p className="text-gray-600 text-center py-4">Loading shipments...</p>}
        {error && <p className="text-red-600 text-center py-4">{error}</p>}
        {!loading && !error && (
          <div 
            className="cursor-pointer h-full"
            onClick={(e) => {
              const target = e.target as HTMLElement;
              const row = target.closest('tr');
              if (row && row.parentElement?.tagName === 'TBODY') {
                const rowIndex = Array.from(row.parentElement.children).indexOf(row);
                if (rowIndex >= 0) {
                  handleRowClick(shipmentData[rowIndex]);
                }
              }
            }}
          >
            <Table data={shipmentData} columns={columns} className='h-full' />
          </div>
        )}
      </div>

      <Slider
        isOpen={isSliderOpen}
        onClose={closeSlider}
        title={`Shipment Details - Group ${selectedShipment?.groupId || ''}`}
      >
        {selectedShipment && (
          <div className="space-y-6">
            <div className="flex justify-between items-center pb-4 border-b">
              <div className="flex items-center gap-3">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  selectedShipment.status === 'in-transit'
                    ? 'bg-blue-100 text-blue-800'
                    : selectedShipment.status === 'pending'
                    ? 'bg-yellow-100 text-yellow-800'
                    : selectedShipment.status === 'completed'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                }`}>
                  {selectedShipment.status.charAt(0).toUpperCase() + selectedShipment.status.slice(1)}
                </span>
                {isEditMode && (
                  <select
                    value={updateStatus}
                    onChange={(e) => setUpdateStatus(e.target.value as 'pending' | 'in-transit' | 'completed' | 'cancelled')}
                    className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="pending">Pending</option>
                    <option value="in-transit">In Transit</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                )}
              </div>
              <div className="flex gap-2">
                {!isEditMode ? (
                  <button
                    onClick={handleEditClick}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                  >
                    Edit Shipment
                  </button>
                ) : (
                  <>
                    <button
                      onClick={() => setIsEditMode(false)}
                      className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors text-sm"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleUpdateShipment}
                      disabled={updating}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:bg-green-400 disabled:cursor-not-allowed text-sm"
                    >
                      {updating ? 'Updating...' : 'Save Changes'}
                    </button>
                  </>
                )}
              </div>
            </div>

            {isEditMode && (
              <div className="space-y-4 border border-blue-200 bg-blue-50 p-4 rounded-lg">
                <h3 className="font-semibold text-lg text-blue-900">Update Shipment Details</h3>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Transport Type
                    </label>
                    <select
                      value={updateFormData.transportType}
                      onChange={(e) => setUpdateFormData((prev) => ({ ...prev, transportType: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Keep current</option>
                      {transports.map((transport) => (
                        <option key={transport._id} value={transport._id}>
                          {transport.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Vehicle Type
                    </label>
                    <select
                      value={updateFormData.vehicleType}
                      onChange={(e) => setUpdateFormData((prev) => ({ ...prev, vehicleType: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Keep current</option>
                      {vehicles.map((vehicle) => (
                        <option key={vehicle._id} value={vehicle._id}>
                          {vehicle.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Add New Pickup Locations
                    </label>
                    <button
                      type="button"
                      onClick={handleAddSource}
                      className="text-sm text-blue-600 hover:text-blue-700"
                    >
                      + Add Pickup
                    </button>
                  </div>
                  {updateFormData.additionalSources?.map((source, index) => (
                    <div key={index} className="flex gap-2 mb-2">
                      <input
                        type="text"
                        value={source.location}
                        onChange={(e) => handleSourceLocationChange(index, e.target.value)}
                        placeholder="Enter pickup location"
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      <input
                        type="number"
                        value={source.orderNumber}
                        readOnly
                        className="w-32 px-3 py-2 border border-gray-300 rounded-lg bg-gray-100"
                        placeholder="Order #"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveSource(index)}
                        className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Add New Drop Locations
                    </label>
                    <button
                      type="button"
                      onClick={handleAddDestination}
                      className="text-sm text-blue-600 hover:text-blue-700"
                    >
                      + Add Drop
                    </button>
                  </div>
                  {updateFormData.additionalDestinations?.map((destination, index) => (
                    <div key={index} className="flex gap-2 mb-2">
                      <input
                        type="text"
                        value={destination.location}
                        onChange={(e) => handleDestinationLocationChange(index, e.target.value)}
                        placeholder="Enter drop location"
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      <input
                        type="number"
                        value={destination.orderNumber}
                        readOnly
                        className="w-32 px-3 py-2 border border-gray-300 rounded-lg bg-gray-100"
                        placeholder="Order #"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveDestination(index)}
                        className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Add New Materials
                    </label>
                    <button
                      type="button"
                      onClick={handleAddUpdateMaterial}
                      className="text-sm text-blue-600 hover:text-blue-700"
                    >
                      + Add Material
                    </button>
                  </div>
                  {updateFormData.additionalMaterials?.map((material, index) => (
                    <div key={index} className="flex gap-2 mb-2">
                      <select
                        value={material.materialId}
                        onChange={(e) => handleUpdateMaterialChange(index, 'materialId', e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="">Select material</option>
                        {materials.map((mat) => (
                          <option key={mat._id} value={mat._id}>
                            {mat.name}
                          </option>
                        ))}
                      </select>
                      <input
                        type="number"
                        value={material.quantity}
                        onChange={(e) => handleUpdateMaterialChange(index, 'quantity', parseFloat(e.target.value) || 0)}
                        min="1"
                        placeholder="Quantity"
                        className="w-24 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      <input
                        type="number"
                        value={material.orderNumber}
                        readOnly
                        className="w-32 px-3 py-2 border border-gray-300 rounded-lg bg-gray-100"
                        placeholder="Order #"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveUpdateMaterial(index)}
                        className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
              <div>
                <p className="text-sm text-gray-500">Source</p>
                <div className="group relative">
                  <p className="font-semibold">
                    {selectedShipment.sourceDetails?.[0]?.sourceLocation || 'N/A'}
                    {selectedShipment.sourceDetails && selectedShipment.sourceDetails.length > 1 && (
                      <span className="ml-2 text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                        +{selectedShipment.sourceDetails.length - 1}
                      </span>
                    )}
                  </p>
                  {selectedShipment.sourceDetails && selectedShipment.sourceDetails.length > 1 && (
                    <div className="absolute left-0 top-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg p-3 invisible group-hover:visible z-10 min-w-50">
                      <p className="text-xs font-medium text-gray-500 mb-2">All Sources:</p>
                      {selectedShipment.sourceDetails.map((src, idx) => (
                        <p key={idx} className="text-sm text-gray-700 py-1">
                          {idx + 1}. {src.sourceLocation}
                        </p>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-500">Destination</p>
                <div className="group relative">
                  <p className="font-semibold">
                    {selectedShipment.destinationDetails?.[selectedShipment.destinationDetails.length - 1]?.destinationLocation || 'N/A'}
                    {selectedShipment.destinationDetails && selectedShipment.destinationDetails.length > 1 && (
                      <span className="ml-2 text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                        +{selectedShipment.destinationDetails.length - 1}
                      </span>
                    )}
                  </p>
                  {selectedShipment.destinationDetails && selectedShipment.destinationDetails.length > 1 && (
                    <div className="absolute left-0 top-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg p-3 invisible group-hover:visible z-10 min-w-50">
                      <p className="text-xs font-medium text-gray-500 mb-2">All Destinations:</p>
                      {selectedShipment.destinationDetails.map((dest, idx) => (
                        <p key={idx} className="text-sm text-gray-700 py-1">
                          {idx + 1}. {dest.destinationLocation}
                        </p>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-500">Total Weight</p>
                <p className="font-semibold">{shipmentSummary?.weight.toLocaleString() || selectedShipment.totalWeight.toLocaleString()} kg</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Total Volume</p>
                <p className="font-semibold">{shipmentSummary?.volume.toFixed(2) || selectedShipment.totalVolume.toFixed(2)} CFT</p>
              </div>
            </div>

            {loadingSummary && (
              <p className="text-gray-600 text-center py-4">Loading order details...</p>
            )}

            {!loadingSummary && shipmentSummary && shipmentSummary.orders && shipmentSummary.orders.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Order Details</h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full bg-white border border-gray-200 rounded-lg">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Source</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Destination</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order No</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Material</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {shipmentSummary.orders.map((order) => ({
                        source: order.pickups[0]?.location || 'N/A',
                        destination: order.drops[0]?.location || 'N/A',
                        orderNumber: order.orderNumber,
                        materials: order.materials,
                        totalQuantity: order.materials.reduce((sum, mat) => sum + mat.quantity, 0),
                      })).map((row) => (
                        <tr key={row.orderNumber} className="hover:bg-gray-50">
                          <td className="px-4 py-3 text-sm text-gray-900">{row.source}</td>
                          <td className="px-4 py-3 text-sm text-gray-900">{row.destination}</td>
                          <td className="px-4 py-3 text-sm font-medium text-blue-600">{row.orderNumber}</td>
                          <td className="px-4 py-3 text-sm text-gray-900">
                            <div className="group relative">
                              <span>
                                {row.materials[0]?.materialName}
                                {row.materials.length > 1 && (
                                  <span className="ml-2 text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                                    +{row.materials.length - 1}
                                  </span>
                                )}
                              </span>
                              {row.materials.length > 1 && (
                                <div className="absolute left-0 top-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg p-3 invisible group-hover:visible z-10 min-w-50">
                                  <p className="text-xs font-medium text-gray-500 mb-2">All Materials:</p>
                                  {row.materials.map((mat, idx) => (
                                    <p key={idx} className="text-sm text-gray-700 py-1">
                                      {mat.materialName} ({mat.quantity})
                                    </p>
                                  ))}
                                </div>
                              )}
                            </div>
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-900">{row.totalQuantity}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}
      </Slider>

      <Modal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        title="Upload Excel - Select Types"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Transport Type *
            </label>
            <select
              value={uploadTransportType}
              onChange={(e) => setUploadTransportType(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Select transport</option>
              {transports.map((transport) => (
                <option key={transport._id} value={transport._id}>
                  {transport.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Vehicle Type *
            </label>
            <select
              value={uploadVehicleType}
              onChange={(e) => setUploadVehicleType(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Select vehicle</option>
              {vehicles.map((vehicle) => (
                <option key={vehicle._id} value={vehicle._id}>
                  {vehicle.name}
                </option>
              ))}
            </select>
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t">
            <button
              type="button"
              onClick={() => setIsUploadModalOpen(false)}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => {
                if (!uploadTransportType || !uploadVehicleType) {
                  alert('Please select both transport type and vehicle type');
                  return;
                }
                fileInputRef.current?.click();
              }}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Select Excel File
            </button>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title="Create New Shipment"
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="transportType" className="block text-sm font-medium text-gray-700 mb-1">
                Transport Type *
              </label>
              <select
                id="transportType"
                value={formData.transportType}
                onChange={(e) => setFormData((prev) => ({ ...prev, transportType: e.target.value }))}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select transport</option>
                {transports.map((transport) => (
                  <option key={transport._id} value={transport._id}>
                    {transport.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="vehicleType" className="block text-sm font-medium text-gray-700 mb-1">
                Vehicle Type *
              </label>
              <select
                id="vehicleType"
                value={formData.vehicleType}
                onChange={(e) => setFormData((prev) => ({ ...prev, vehicleType: e.target.value }))}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select vehicle</option>
                {vehicles.map((vehicle) => (
                  <option key={vehicle._id} value={vehicle._id}>
                    {vehicle.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-medium text-gray-700">
                Source Locations *
              </label>
              <button
                type="button"
                onClick={handleAddSource}
                className="text-sm text-blue-600 hover:text-blue-700"
              >
                + Add Source
              </button>
            </div>
            {formData.source.map((source, index) => (
              <div key={index} className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={source}
                  onChange={(e) => handleSourceChange(index, e.target.value)}
                  required
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter source location"
                />
                {formData.source.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveSource(index)}
                    className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg"
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-medium text-gray-700">
                Destination Locations *
              </label>
              <button
                type="button"
                onClick={handleAddDestination}
                className="text-sm text-blue-600 hover:text-blue-700"
              >
                + Add Destination
              </button>
            </div>
            {formData.destination.map((destination, index) => (
              <div key={index} className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={destination}
                  onChange={(e) => handleDestinationChange(index, e.target.value)}
                  required
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter destination location"
                />
                {formData.destination.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveDestination(index)}
                    className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg"
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-medium text-gray-700">
                Materials *
              </label>
              <button
                type="button"
                onClick={handleAddMaterial}
                className="text-sm text-blue-600 hover:text-blue-700"
              >
                + Add Material
              </button>
            </div>
            {formData.materials.map((material, index) => (
              <div key={index} className="flex gap-2 mb-2">
                <select
                  value={material.materialId}
                  onChange={(e) => handleMaterialChange(index, 'materialId', e.target.value)}
                  required
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select material</option>
                  {materials.map((mat) => (
                    <option key={mat._id} value={mat._id}>
                      {mat.name}
                    </option>
                  ))}
                </select>
                <input
                  type="number"
                  value={material.quantity}
                  onChange={(e) => handleMaterialChange(index, 'quantity', parseFloat(e.target.value) || 0)}
                  required
                  min="1"
                  className="w-32 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Quantity"
                />
                {formData.materials.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveMaterial(index)}
                    className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg"
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
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
              {submitting ? 'Creating...' : 'Create Shipment'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Shipment;
