import {
  CheckCheck,
  ChevronLeft,
  ChevronRight,
  DollarSign,
  Files,
  Info,
  ListCheck,
  LocateIcon,
  MapPlus,
  MessageSquare,
  Phone,
  Settings,
  UserPlus,
} from 'lucide-react';

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar';
import { Button } from '../ui/button';
import { ROUTE_PATH } from '@/consts/RoutePath';
import { NavLink, useParams } from 'react-router';

const items = [
  {
    title: 'Overview',
    url: ROUTE_PATH.OVERVIEW,
    icon: Info,
  },
  {
    title: 'Invite',
    url: ROUTE_PATH.INVITE,
    icon: UserPlus,
  },
  {
    title: 'Itinerary',
    url: ROUTE_PATH.ITINERARY,
    icon: MapPlus,
  },
  {
    title: 'Trip List',
    url: ROUTE_PATH.TRIP_LIST,
    icon: ListCheck,
  },
  {
    title: 'To-Do List',
    url: ROUTE_PATH.TO_DO_LIST,
    icon: CheckCheck,
  },
  {
    title: 'Chat',
    url: ROUTE_PATH.CHAT,
    icon: MessageSquare,
  },
  {
    title: 'Group Call',
    url: ROUTE_PATH.GROUP_CALL,
    icon: Phone,
  },
  {
    title: 'Manage Expenses',
    url: ROUTE_PATH.MANAGE_EXPENSES,
    icon: DollarSign,
  },
  {
    title: 'Documents',
    url: ROUTE_PATH.DOCUMENTS,
    icon: Files,
  },
  {
    title: 'Location Sharing',
    url: ROUTE_PATH.LOCATION_SHARING,
    icon: LocateIcon,
  },
  {
    title: 'Settings',
    url: ROUTE_PATH.SETTINGS,
    icon: Settings,
  },
];

export function AppSidebar({
  isSidebarCollapsed,
  onSidebarCollapse,
}: {
  isSidebarCollapsed: boolean;
  onSidebarCollapse: () => void;
}) {
  const { tripId } = useParams<{ tripId: string }>();
  const { isMobile, setOpenMobile } = useSidebar();

  return (
    <Sidebar
      className={`h-full ${isSidebarCollapsed ? 'w-12' : 'w-50'}`}
      collapsible="icon">
      <SidebarHeader>
        {!isMobile &&
          (isSidebarCollapsed ? (
            <Button
              className=""
              onClick={onSidebarCollapse}>
              <ChevronRight size={16} />
            </Button>
          ) : (
            <Button onClick={onSidebarCollapse}>
              <span>Hide Sidebar</span>
              <ChevronLeft size={16} />
            </Button>
          ))}
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink to={`${item.url}/${tripId}`}>
                      <item.icon />
                      <span>{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        {isMobile && (
          <Button
            className="w-full"
            onClick={() => setOpenMobile(false)}>
            <span>Hide Sidebar</span>
            <ChevronLeft size={16} />
          </Button>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
