import React from 'react';
import { Outlet } from 'react-router';

const PlanTrip: React.FC = () => {
  return (
    <div className='p-10'>
      <Outlet />
    </div>
  );
};

export default PlanTrip;
