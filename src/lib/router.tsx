import { createBrowserRouter, Navigate } from 'react-router-dom';
import MainLayout from '../components/Layout/MainLayout';
import Home from '../pages/Home';
import Transport from '../pages/Transport';
import Vehicle from '../pages/Vehicle';
import Material from '../pages/Material';
import Shipment from '../pages/Shipment';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: 'transport',
        element: <Transport />,
      },
      {
        path: 'vehicle',
        element: <Vehicle />,
      },
      {
        path: 'material',
        element: <Material />,
      },
      {
        path: 'shipment',
        element: <Shipment />,
      },
      {
        path: '*',
        element: <Navigate to="/" replace />,
      },
    ],
  },
]);