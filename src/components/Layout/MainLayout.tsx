import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

const MainLayout = () => {
  return (
    <div className="flex">
      <Sidebar />
      <main className="ml-64 flex-1 bg-gray-50 min-h-screen">
        <div className="p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default MainLayout;
