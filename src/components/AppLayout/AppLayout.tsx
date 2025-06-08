import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router';
import { AppSidebar } from './AppSidebar/AppSidebar';
import AppNav from './AppNav/AppNav';
import { SidebarProvider } from '@/components/ui/sidebar';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { PROTECTED_PATH } from '@/consts/ProtectedPath';

const AppLayout: React.FC = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(true);
  const location = useLocation();

  return (
    <div className='min-h-screen flex flex-col'>
      <header className='bg-background border-b sticky top-0 z-50'>
        <AppNav />
      </header>

      <div className='flex flex-1'>
        <SidebarProvider>
          {PROTECTED_PATH.includes(location.pathname) && (
            <>
              <div
                className={`
              transition-all duration-300 ease-in-out overflow-hidden
              ${isSidebarCollapsed ? 'w-0 opacity-0' : 'w-64 opacity-100'}
            `}>
                <div>
                  <AppSidebar />
                </div>
              </div>

              <div className='relative'>
                <button
                  onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
                  className={`
                fixed
                mt-2 ml-2 z-100 p-3 border border-gray-200 rounded-full 
                hover:shadow-xl transition-all duration-300
                transform hover:scale-105 active:scale-95
              `}
                  aria-label='Toggle sidebar'>
                  <div className='transition-transform duration-300 ease-in-out'>
                    {isSidebarCollapsed ? (
                      <ChevronRight size={16} />
                    ) : (
                      <ChevronLeft size={16} />
                    )}
                  </div>
                </button>
              </div>
            </>
          )}

          <main
            className={`
              flex-1 p-6 transition-all duration-300 ease-in-out
              ${isSidebarCollapsed ? 'ml-0' : 'ml-0'}
            `}>
            <Outlet />
          </main>
        </SidebarProvider>
      </div>
    </div>
  );
};

export default AppLayout;
