import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Flight, Menu, Close } from '@mui/icons-material';
import './Navbar.css';
import { useNavigate } from 'react-router';
import { ROUTE_PATH } from '../../../const/RoutePath';

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

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
            {['Log in'].map((item, index) => (
              <motion.a
                key={item}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                href={`#${item.toLowerCase()}`}
                className='nav-link'>
                {item}
              </motion.a>
            ))}
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className='nav-button'
              onClick={() => {
                navigate(`/${ROUTE_PATH.TRIPS}`);
              }}>
              Get Started
            </motion.button>
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
              {['Features', 'About', 'Contact'].map((item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  className='mobile-nav-link'
                  onClick={() => setIsMenuOpen(false)}>
                  {item}
                </a>
              ))}
              <button className='mobile-nav-button'>Get Started</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;
