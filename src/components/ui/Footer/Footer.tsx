import React from 'react';
import { Flight } from '@mui/icons-material';
import './Footer.css';

const Footer: React.FC = () => {
  return (
    <footer className='footer'>
      <div className='container-max'>
        <div className='footer-content'>
          <div className='footer-logo'>
            <Flight className='footer-logo-icon' />
            <span className='footer-logo-text gradient-text'>Plan Voyage</span>
          </div>

          <div className='footer-info'>
            <span>© 2025 Plan Voyage Team</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
