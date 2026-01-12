const Home = () => {
  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-6">
        Welcome to Transport Management System
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="text-4xl mb-4">🚚</div>
          <h2 className="text-xl font-semibold mb-2">Transport</h2>
          <p className="text-gray-600">
            Manage and track all transport operations efficiently.
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="text-4xl mb-4">🚗</div>
          <h2 className="text-xl font-semibold mb-2">Vehicle</h2>
          <p className="text-gray-600">
            Monitor your fleet and vehicle maintenance schedules.
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="text-4xl mb-4">📦</div>
          <h2 className="text-xl font-semibold mb-2">Material</h2>
          <p className="text-gray-600">
            Keep track of materials and inventory levels.
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="text-4xl mb-4">📮</div>
          <h2 className="text-xl font-semibold mb-2">Shipment</h2>
          <p className="text-gray-600">
            Manage shipments and delivery schedules.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Home;
