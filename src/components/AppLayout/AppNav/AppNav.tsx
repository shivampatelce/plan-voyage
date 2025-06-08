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
import { Menu, X } from 'lucide-react';

export default function AppNav() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
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
                <a
                  href='#'
                  className='px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors'>
                  <div className='font-medium'>Home</div>
                </a>
              </NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuTrigger>Get Started</NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className='grid w-[200px] gap-2 p-4'>
                  <li>
                    <NavigationMenuLink asChild>
                      <a
                        href='#'
                        className='block p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors'>
                        <div className='font-medium'>Create New Trip</div>
                      </a>
                    </NavigationMenuLink>
                  </li>
                  <li>
                    <NavigationMenuLink asChild>
                      <a
                        href='#'
                        className='block p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors'>
                        <div className='font-medium'>Your Trips List</div>
                      </a>
                    </NavigationMenuLink>
                  </li>
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink asChild>
                <button className='font-medium text-red-600 hover:text-red-700 px-4 py-2 rounded-md hover:bg-red-50 dark:hover:bg-red-950 transition-colors'>
                  Logout
                </button>
              </NavigationMenuLink>
            </NavigationMenuItem>
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
            <a
              href='#'
              className='block px-3 py-2 font-medium hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors'
              onClick={() => setIsMobileMenuOpen(false)}>
              Home
            </a>

            <div className='px-3 py-2'>
              <div className='font-medium text-gray-600 dark:text-gray-400 text-sm mb-2'>
                Get Started
              </div>
              <div className='pl-4 space-y-1'>
                <a
                  href='#'
                  className='block px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors'
                  onClick={() => setIsMobileMenuOpen(false)}>
                  Create Your Trip
                </a>
                <a
                  href='#'
                  className='block px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors'
                  onClick={() => setIsMobileMenuOpen(false)}>
                  Your Trip List
                </a>
              </div>
            </div>

            <button
              className='block w-full text-left px-3 py-2 font-medium text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950 rounded-md transition-colors'
              onClick={() => setIsMobileMenuOpen(false)}>
              Logout
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
