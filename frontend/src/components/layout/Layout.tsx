import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';
import { useUI } from '@/store';
import { cn } from '@/lib/utils';

export function Layout() {
  const { isSidebarOpen } = useUI();

  return (
    <div className="min-h-screen">
      <Navbar />
      <Sidebar />
      <main
        className={cn(
          'transition-all duration-200 ease-in-out',
          isSidebarOpen ? 'pl-64' : 'pl-0'
        )}
      >
        <div className="container mx-auto py-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}