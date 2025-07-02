import {
  Calendar,
  CheckCheck,
  ChevronLeft,
  ChevronRight,
  DollarSign,
  Files,
  Info,
  ListCheck,
  MessageSquare,
  PersonStanding,
  Settings,
} from 'lucide-react';

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
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
    icon: PersonStanding,
  },
  {
    title: 'Itinerary',
    url: ROUTE_PATH.ITINERARY,
    icon: Calendar,
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

  return (
    <Sidebar
      className={`h-full ${isSidebarCollapsed ? 'w-12' : 'w-50'}`}
      collapsible="icon">
      <SidebarHeader>
        {isSidebarCollapsed ? (
          <Button
            className=""
            onClick={onSidebarCollapse}>
            <ChevronRight size={16} />
          </Button>
        ) : (
          <Button onClick={onSidebarCollapse}>
            <span>Collapse</span>
            <ChevronLeft size={16} />
          </Button>
        )}
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
    </Sidebar>
  );
}
