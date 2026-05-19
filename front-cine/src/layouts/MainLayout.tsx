// MainLayout.tsx
import type { ReactNode } from 'react';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { ToastContainer } from 'react-toastify';

interface MainLayoutProps {
  children: ReactNode;
}

export const MainLayout = ({ children }: MainLayoutProps) => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-900 text-white">
      <ToastContainer />
      <Navbar />
      <main className="flex-grow">{children}</main>
      <Footer />
    </div>
  );
};
