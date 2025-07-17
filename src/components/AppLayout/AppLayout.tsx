import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router';
import { AppSidebar } from './AppSidebar';
import AppNav from './AppNav';
import { SidebarProvider, useSidebar } from '@/components/ui/sidebar';
import ScrollToTop from '@/util/ScrollToTop';
import { ROUTE_PATH } from '@/consts/RoutePath';
import { Toaster } from 'sonner';
import { Button } from '../ui/button';
import { PanelLeft } from 'lucide-react';

const Layout: React.FC = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const location = useLocation();
  const { isMobile, setOpenMobile } = useSidebar();

  return (
    <>
      {location.pathname.startsWith(`/${ROUTE_PATH.PLAN_TRIP}`) && (
        <>
          <div
            className={`
              transition-all duration-300 ease-in-out overflow-hidden
              ${
                !isMobile
                  ? isSidebarCollapsed
                    ? 'w-12 opacity-100'
                    : 'w-50 opacity-100'
                  : 'w-0'
              }
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

          {isMobile && (
            <Button
              onClick={() => {
                setOpenMobile(true);
              }}
              className="fixed left-4 bottom-4 z-30 h-8 w-8 rounded-full shadow-lg bg-primary hover:bg-primary/90 md:hidden"
              size="icon">
              <PanelLeft size={8} />
            </Button>
          )}
        </>
      )}

      <main
        className={`
              flex-1 p-6 transition-all duration-300 ease-in-out
              ${isSidebarCollapsed ? 'ml-0' : 'ml-0'}
            `}>
        <Outlet />
      </main>
    </>
  );
};

const AppLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Toaster position="top-right" />
      <header className="bg-background border-b sticky top-0 z-50">
        <AppNav />
      </header>

      <div className="flex flex-1">
        <ScrollToTop />
        <SidebarProvider>
          <Layout />
        </SidebarProvider>
      </div>
    </div>
  );
};

export default AppLayout;
