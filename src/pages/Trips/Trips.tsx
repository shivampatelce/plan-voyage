import type React from 'react';
import './Trips.css';
import CreateTrip from '../../components/CreateTrip/CreateTrip';

const Trips: React.FC = () => {
  return (
    <>
      <section className='create-trip'>
        <div className='container-max text-center'>
          <CreateTrip />
        </div>
      </section>
      <section className='trip-list'>
        <div className='container-max text-center'>
          <h2>Trip List</h2>
        </div>
      </section>
    </>
  );
};

export default Trips;
