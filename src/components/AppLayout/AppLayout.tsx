import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router';
import { AppSidebar } from './AppSidebar';
import AppNav from './AppNav';
import { SidebarProvider } from '@/components/ui/sidebar';
import ScrollToTop from '@/util/ScrollToTop';
import { ROUTE_PATH } from '@/consts/RoutePath';

const AppLayout: React.FC = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(true);
  const location = useLocation();

  return (
    <div className='min-h-screen flex flex-col'>
      <header className='bg-background border-b sticky top-0 z-50'>
        <AppNav />
      </header>

      <div className='flex flex-1'>
        <ScrollToTop />
        <SidebarProvider>
          {location.pathname.startsWith(`/${ROUTE_PATH.PLAN_TRIP}`) && (
            <>
              <div
                className={`
              transition-all duration-300 ease-in-out overflow-hidden
              ${isSidebarCollapsed ? 'w-12 opacity-100' : 'w-50 opacity-100'}
            `}>
                <div>
                  <AppSidebar
                    isSidebarCollapsed={isSidebarCollapsed}
                    onSidebarCollapse={() => {
                      setIsSidebarCollapsed(!isSidebarCollapsed);
                    }}
                  />
                </div>
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
