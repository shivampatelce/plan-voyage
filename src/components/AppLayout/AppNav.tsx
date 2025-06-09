import { useState } from 'react';
import { ModeToggle } from '@/components/mode-toggle';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu';
import { ArrowRight, Menu, Plane, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { NavLink, useNavigate } from 'react-router';
import { ROUTE_PATH } from '@/consts/RoutePath';
import keycloak from '@/keycloak-config';

export default function AppNav() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

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

  return (
    <div className='flex items-center justify-between px-4 py-2 relative'>
      <div className='font-medium'>
        <h1 className='text-lg md:text-xl'>Plan Voyage</h1>
      </div>

      <div className='hidden md:flex items-center gap-4'>
        <NavigationMenu viewport={false}>
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuLink asChild>
                <NavLink
                  to={'/'}
                  className='px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors'>
                  <div className='font-medium'>Home</div>
                </NavLink>
              </NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuTrigger>Get Started</NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className='grid w-[200px] gap-2 p-4'>
                  <li>
                    <NavigationMenuLink asChild>
                      <Button
                        onClick={navigateToCreateTrip}
                        className='block p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors'>
                        <div className='flex items-center font-medium'>
                          Create New Trip <ArrowRight className='ml-2' />
                        </div>
                      </Button>
                    </NavigationMenuLink>
                  </li>
                  <li>
                    <NavigationMenuLink asChild>
                      <Button
                        onClick={navigateToTripList}
                        className='block p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors'>
                        <div className='flex items-center font-medium'>
                          Your Trips <Plane className='ml-2' />
                        </div>
                      </Button>
                    </NavigationMenuLink>
                  </li>
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
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
                    variant='destructive'
                    onClick={() => keycloak.logout()}>
                    Logout
                  </Button>
                </NavigationMenuLink>
              </NavigationMenuItem>
            )}
          </NavigationMenuList>
        </NavigationMenu>
        <ModeToggle />
      </div>

      {/* Mobile Menu Button and Mode Toggle */}
      <div className='md:hidden flex items-center gap-2'>
        <ModeToggle />
        <button
          onClick={toggleMobileMenu}
          className='p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors'
          aria-label='Toggle mobile menu'>
          {isMobileMenuOpen ? (
            <X className='h-5 w-5' />
          ) : (
            <Menu className='h-5 w-5' />
          )}
        </button>
      </div>

      {isMobileMenuOpen && (
        <div className='absolute top-full left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 shadow-lg md:hidden z-50'>
          <div className='px-4 py-2 space-y-1'>
            <NavLink
              to={'/'}
              className='block px-3 py-2 font-medium hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors'
              onClick={() => setIsMobileMenuOpen(false)}>
              Home
            </NavLink>

            <div className='px-3 py-2'>
              <div className='font-medium text-gray-600 dark:text-gray-400 text-sm mb-2'>
                Get Started
              </div>
              <div className='pl-4 space-y-1'>
                <Button
                  className='block px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors'
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    navigateToCreateTrip();
                  }}>
                  Create Your Trip
                </Button>
                <Button
                  className='block px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors'
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
                variant='destructive'
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
