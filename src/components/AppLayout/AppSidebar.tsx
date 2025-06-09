import {
  Calendar,
  CheckCheck,
  ChevronLeft,
  ChevronRight,
  DollarSign,
  Files,
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
import { NavLink } from 'react-router';

const items = [
  {
    title: 'Setting',
    url: ROUTE_PATH.SETTING,
    icon: Settings,
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
    title: 'Packaging List',
    url: ROUTE_PATH.PACKAGING_LIST,
    icon: ListCheck,
  },
  {
    title: 'To-Do List',
    url: ROUTE_PATH.TO_DO_LIST,
    icon: CheckCheck,
  },
  {
    title: 'Budget',
    url: ROUTE_PATH.BUDGET,
    icon: DollarSign,
  },
  {
    title: 'Chat',
    url: ROUTE_PATH.CHAT,
    icon: MessageSquare,
  },
  {
    title: 'Documents',
    url: ROUTE_PATH.DOCUMENTS,
    icon: Files,
  },
];

export function AppSidebar({
  isSidebarCollapsed,
  onSidebarCollapse,
}: {
  isSidebarCollapsed: boolean;
  onSidebarCollapse: () => void;
}) {
  return (
    <Sidebar
      className={`h-full ${isSidebarCollapsed ? 'w-12' : 'w-50'}`}
      collapsible='icon'>
      <SidebarHeader>
        {isSidebarCollapsed ? (
          <Button
            className=''
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
                    <NavLink to={item.url}>
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
