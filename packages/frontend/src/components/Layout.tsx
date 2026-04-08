import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Toast from './Toast';
import AISidePanel from './AISidePanel';

export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <main className="flex-1 p-4 md:p-6 lg:p-8 max-w-7xl w-full mx-auto">
        <Outlet />
      </main>
      <Toast />
      <AISidePanel />
    </div>
  );
}
