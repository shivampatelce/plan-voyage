import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Flight, Menu, Close } from '@mui/icons-material';
import './Navbar.css';
import { useLocation, useNavigate } from 'react-router';
import { ROUTE_PATH } from '../../../const/RoutePath';
import keycloak from '../../../keycloak-config';

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const logout = () => {
    keycloak
      .logout()
      .then(() => {
        navigate(ROUTE_PATH.HOME);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const navigateToCreateTrip = () => {
    if (keycloak.authenticated) {
      return navigate(ROUTE_PATH.CREATE_TRIP);
    }
    keycloak.login();
  };

  return (
    <header className='header'>
      <div className='header-content'>
        <div className='header-inner'>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className='logo'>
            <div className='logo-icon-wrapper'>
              <Flight className='logo-icon' />
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
                className='logo-spinner'
              />
            </div>
            <span className='logo-text gradient-text'>Plan Voyage</span>
          </motion.div>

          <nav className='nav-desktop'>
            {location.pathname === '/' && (
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className='nav-button'
                onClick={navigateToCreateTrip}>
                Get Started
              </motion.button>
            )}

            {location.pathname !== '/' && (
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className='nav-button'
                onClick={() => {
                  navigate(ROUTE_PATH.HOME);
                }}>
                Home
              </motion.button>
            )}

            {keycloak.authenticated ? (
              <>
                <motion.button
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className='nav-button'
                  onClick={() => {
                    navigate(ROUTE_PATH.TRIPS);
                  }}>
                  Your Trips
                </motion.button>
                <motion.button
                  className='nav-button logout-button'
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    logout();
                  }}>
                  Logout
                </motion.button>
              </>
            ) : (
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className='nav-button'
                onClick={() => {
                  keycloak.login();
                }}>
                Log In
              </motion.button>
            )}
          </nav>

          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className='mobile-menu-btn'>
            {isMenuOpen ? (
              <Close style={{ width: '24px', height: '24px' }} />
            ) : (
              <Menu style={{ width: '24px', height: '24px' }} />
            )}
          </button>
        </div>
      </div>
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className='mobile-nav'>
            <div className='mobile-nav-content'>
              {/* Display Get started button for home page only */}
              {location.pathname === '/' ? (
                <button
                  className='mobile-nav-button'
                  onClick={navigateToCreateTrip}>
                  Get Started
                </button>
              ) : (
                <button
                  className='mobile-nav-button'
                  onClick={() => {
                    navigate(ROUTE_PATH.HOME);
                  }}>
                  Home
                </button>
              )}

              {keycloak.authenticated ? (
                <>
                  <button
                    className='mobile-nav-button'
                    onClick={() => {
                      navigate(ROUTE_PATH.TRIPS);
                    }}>
                    Your Trips
                  </button>
                  <button
                    className='mobile-nav-button logout-button'
                    onClick={() => {
                      logout();
                    }}>
                    Logout
                  </button>
                </>
              ) : (
                <button
                  className='mobile-nav-button'
                  onClick={() => {
                    keycloak.login();
                  }}>
                  Log In
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;
