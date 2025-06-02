import type React from 'react';
import './Trips.css';
import TripList from '../../components/TripList/TripList';

const Trips: React.FC = () => {
  return (
    <section className='trip-list'>
      <div className='container-max text-center'>
        <TripList />
      </div>
    </section>
  );
};

export default Trips;
