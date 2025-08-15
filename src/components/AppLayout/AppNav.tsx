import { useEffect, useState } from 'react';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  ArrowRight,
  Menu,
  Plane,
  X,
  Bell,
  Users,
  MapPlus,
  CheckCheck,
  ListCheck,
  Files,
  DollarSign,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { NavLink, useNavigate } from 'react-router';
import { ROUTE_PATH } from '@/consts/RoutePath';
import keycloak from '@/keycloak-config';
import { Badge } from '../ui/badge';
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip';
import { apiRequest } from '@/util/apiRequest';
import { API_PATH } from '@/consts/ApiPath';
import type { Invitations } from '@/types/Invitations';
import { NOTIFICATION_TYPE } from '@/types/Notification';

interface Notification {
  notificationId: string;
  type: string;
  title: string;
  message: string;
  timestamp: Date;
  tripId: string;
  actionUrl?: string;
  seen: boolean;
}

interface NotificationRes {
  userId: string;
  notification: Notification;
  seen: boolean;
}

export default function AppNav() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [invitations, setInvitations] = useState<Invitations[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const navigate = useNavigate();

  const fetchInvitations = async () => {
    const email = keycloak.tokenParsed?.email;
    if (email) {
      const { data } = (await apiRequest<unknown, { data: Invitations[] }>(
        `${API_PATH.INVITATION_LIST}`,
        {
          method: 'POST',
          body: {
            email,
          },
        }
      )) as { data: Invitations[] };

      setInvitations(data);
    }
  };

  const fetchNotifications = async () => {
    try {
      const { data } = (await apiRequest<unknown, { data: NotificationRes[] }>(
        `${API_PATH.GET_NOTIFICATIONS}/${keycloak.subject}`,
        {
          method: 'GET',
        }
      )) as { data: NotificationRes[] };
      const notifications = data
        .map(({ notification, seen }) => ({
          ...notification,
          seen,
        }))
        .sort(
          (a, b) =>
            new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        );
      setNotifications(notifications);
    } catch (error) {
      console.error('Error while fetching notifications: ', error);
    }
  };

  useEffect(() => {
    if (keycloak.authenticated) {
      fetchInvitations();
      fetchNotifications();
    }
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const navigateToCreateTrip = () => {
    if (keycloak.authenticated) {
      return navigate(ROUTE_PATH.CREATE_TRIP);
    }
    keycloak.login();
  };

  const navigateToTripList = () => {
    if (keycloak.authenticated) {
      return navigate(ROUTE_PATH.TRIPS);
    }
    keycloak.login();
  };

  const markAsRead = async (notificationId: string) => {
    try {
      await apiRequest<unknown, void>(
        `${API_PATH.MARK_AS_SEEN}/${notificationId}/${keycloak.subject}`,
        {
          method: 'POST',
        }
      );

      setNotifications((prev) =>
        prev.map((notification) =>
          notification.notificationId === notificationId
            ? { ...notification, seen: true }
            : notification
        )
      );
    } catch (error) {
      console.error('Error while marking as seen notifications: ', error);
    }
  };

  const handleNotificationClick = (notification: Notification) => {
    markAsRead(notification.notificationId);
    setIsNotificationsOpen(false);
    if (notification.actionUrl) {
      navigate(notification.actionUrl);
    }
  };

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case NOTIFICATION_TYPE.INVITATION:
        return (
          <div
            className={`p-1 rounded-full bg-green-100 dark:bg-green-900/20 text-green-600'`}>
            <Users className="h-4 w-4" />
          </div>
        );

      case NOTIFICATION_TYPE.ITINERARY:
        return (
          <div
            className={`p-1 rounded-full bg-pink-100 dark:bg-pink-900/20 text-pink-600'`}>
            <MapPlus className="h-4 w-4" />
          </div>
        );

      case NOTIFICATION_TYPE.TO_DO_LIST:
        return (
          <div
            className={`p-1 rounded-full bg-purple-100 dark:bg-purple-900/20 text-purple-600'`}>
            <CheckCheck className="h-4 w-4" />
          </div>
        );

      case NOTIFICATION_TYPE.TRIP_LIST:
        return (
          <div
            className={`p-1 rounded-full bg-indigo-100 dark:bg-indigo-900/20 text-indigo-600'`}>
            <ListCheck className="h-4 w-4" />
          </div>
        );

      case NOTIFICATION_TYPE.DOCUMENT:
        return (
          <div
            className={`p-1 rounded-full bg-teal-100 dark:bg-teal-900/20 text-teal-600'`}>
            <Files className="h-4 w-4" />
          </div>
        );

      case NOTIFICATION_TYPE.MANAGE_EXPENSE:
        return (
          <div
            className={`p-1 rounded-full bg-yellow-100 dark:bg-yellow-900/20 text-yellow-600'`}>
            <DollarSign className="h-4 w-4" />
          </div>
        );

      default:
        return <Bell className="h-4 w-4" />;
    }
  };

  const formatTimestamp = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - new Date(timestamp).getTime();

    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 60) {
      return `${minutes}m ago`;
    } else if (hours < 24) {
      return `${hours}h ago`;
    } else {
      return `${days}d ago`;
    }
  };

  const unreadCount = notifications.filter((n) => !n.seen).length;

  return (
    <div className="flex items-center justify-between px-4 py-2 relative">
      <NavLink
        to="/"
        className="flex items-center gap-2 hover:opacity-80 transition-opacity">
        <div className="relative">
          <div className="w-10 h-10 rounded-lg flex items-center justify-center shadow-md">
            <Plane className="h-6 w-6" />
          </div>
        </div>
        <div className="font-bold">
          <h1 className="text-lg md:text-xl text-gray-900 dark:text-white">
            Plan Voyage
          </h1>
          <div className="text-xs text-gray-500 dark:text-gray-400 -mt-1 hidden sm:block">
            Adventure Planning
          </div>
        </div>
      </NavLink>

      <div className="hidden md:flex items-center gap-4">
        <NavigationMenu viewport={false}>
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuLink asChild>
                <NavLink
                  to={'/'}
                  className="px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors">
                  <div className="font-medium">Home</div>
                </NavLink>
              </NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuTrigger>Get Started</NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid w-[200px] gap-2 p-4">
                  <li>
                    <NavigationMenuLink asChild>
                      <Button
                        onClick={navigateToCreateTrip}
                        className="block p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors">
                        <div className="flex items-center font-medium">
                          Create New Trip <ArrowRight className="ml-2" />
                        </div>
                      </Button>
                    </NavigationMenuLink>
                  </li>
                  <li>
                    <NavigationMenuLink asChild>
                      <Button
                        onClick={navigateToTripList}
                        className="block p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors">
                        <div className="flex items-center font-medium">
                          Your Trips <Plane className="ml-2" />
                        </div>
                      </Button>
                    </NavigationMenuLink>
                  </li>
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
            {!!invitations.length && (
              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <NavLink
                    to={`/${ROUTE_PATH.INVITATIONS}`}
                    className="px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors">
                    <Tooltip>
                      <TooltipTrigger>
                        <div className="font-medium flex items-center gap-2">
                          Invitations
                          <Badge className="h-5 min-w-5 rounded-full px-1 font-mono tabular-nums">
                            {invitations.length}
                          </Badge>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        You have {invitations.length} invitation
                        {invitations.length !== 1 && 's'} for trip planning
                      </TooltipContent>
                    </Tooltip>
                  </NavLink>
                </NavigationMenuLink>
              </NavigationMenuItem>
            )}
            {/* Notifications Dropdown */}
            {keycloak.authenticated && (
              <NavigationMenuItem>
                <DropdownMenu
                  open={isNotificationsOpen}
                  onOpenChange={setIsNotificationsOpen}>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="relative p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors mr-2">
                      <Bell className="h-5 w-5" />
                      {unreadCount > 0 && (
                        <Badge className="absolute -top-1 -right-1 h-5 min-w-5 rounded-full px-1 font-mono tabular-nums text-xs">
                          {unreadCount}
                        </Badge>
                      )}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    className="w-80">
                    <DropdownMenuSeparator />
                    {notifications.length === 0 ? (
                      <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                        No notifications
                      </div>
                    ) : (
                      <div className="max-h-96 overflow-y-auto">
                        {notifications.map((notification) => (
                          <DropdownMenuItem
                            key={notification.notificationId}
                            className={`p-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 ${
                              !notification.seen
                                ? 'bg-blue-50 dark:bg-blue-900/20'
                                : ''
                            }`}
                            onClick={() =>
                              handleNotificationClick(notification)
                            }>
                            <div className="flex items-start gap-3 w-full">
                              {getNotificationIcon(notification.type)}
                              <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between">
                                  <div className="flex-1 min-w-0">
                                    <p className="font-medium text-sm truncate">
                                      {notification.title}
                                    </p>
                                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                                      {notification.message}
                                    </p>
                                  </div>
                                  <div className="flex items-center gap-1 ml-2">
                                    <span className="text-xs text-gray-500 whitespace-nowrap">
                                      {formatTimestamp(notification.timestamp)}
                                    </span>
                                    {!notification.seen && (
                                      <div className="w-2 h-2 bg-blue-500 rounded-full ml-1" />
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </DropdownMenuItem>
                        ))}
                      </div>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </NavigationMenuItem>
            )}
            {!keycloak.authenticated ? (
              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Button onClick={() => keycloak.login()}>Login</Button>
                </NavigationMenuLink>
              </NavigationMenuItem>
            ) : (
              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Button
                    variant="destructive"
                    onClick={() => keycloak.logout()}>
                    Logout
                  </Button>
                </NavigationMenuLink>
              </NavigationMenuItem>
            )}
          </NavigationMenuList>
        </NavigationMenu>
      </div>
      {/* Mobile Menu Button and Mode Toggle */}
      <div className="md:hidden flex items-center gap-2">
        {/* Mobile Notifications */}
        {keycloak.authenticated && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="relative p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors">
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-5 min-w-5 rounded-full px-1 font-mono tabular-nums text-xs">
                    {unreadCount}
                  </Badge>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-80">
              <DropdownMenuSeparator />
              {notifications.length === 0 ? (
                <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                  No notifications
                </div>
              ) : (
                <div className="max-h-96 overflow-y-auto">
                  {notifications.map((notification) => (
                    <DropdownMenuItem
                      key={notification.notificationId}
                      className={`p-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 ${
                        !notification.seen
                          ? 'bg-blue-50 dark:bg-blue-900/20'
                          : ''
                      }`}
                      onClick={() => handleNotificationClick(notification)}>
                      <div className="flex items-start gap-3 w-full">
                        {getNotificationIcon(notification.type)}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between">
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-sm truncate">
                                {notification.title}
                              </p>
                              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                                {notification.message}
                              </p>
                            </div>
                            <div className="flex items-center gap-1 ml-2">
                              <span className="text-xs text-gray-500 whitespace-nowrap">
                                {formatTimestamp(notification.timestamp)}
                              </span>
                              {!notification.seen && (
                                <div className="w-2 h-2 bg-blue-500 rounded-full ml-1" />
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </DropdownMenuItem>
                  ))}
                </div>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
        <button
          onClick={toggleMobileMenu}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors"
          aria-label="Toggle mobile menu">
          {isMobileMenuOpen ? (
            <X className="h-5 w-5" />
          ) : (
            <Menu className="h-5 w-5" />
          )}
        </button>
      </div>
      {isMobileMenuOpen && (
        <div className="absolute top-full left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 shadow-lg md:hidden z-50">
          <div className="px-4 py-2 space-y-1">
            <NavLink
              to={'/'}
              className="block px-3 py-2 font-medium hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}>
              Home
            </NavLink>

            <div className="px-3 py-2">
              <div className="font-medium text-gray-600 dark:text-gray-400 text-sm mb-2">
                Get Started
              </div>
              <div className="pl-4 space-y-1">
                <Button
                  className="block px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors"
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    navigateToCreateTrip();
                  }}>
                  Create Your Trip
                </Button>
                <Button
                  className="block px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors"
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    navigateToTripList();
                  }}>
                  Your Trips
                </Button>
              </div>
            </div>

            {!keycloak.authenticated ? (
              <Button onClick={() => keycloak.login()}>Login</Button>
            ) : (
              <Button
                variant="destructive"
                onClick={() => keycloak.logout()}>
                Logout
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
