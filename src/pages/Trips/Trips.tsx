import type React from 'react';
import './Trips.css';

const Trips: React.FC = () => {
  return (
    <>
      <section className='create-trip'>
        <div className='container-max text-center'>
          <h2>Create Trip</h2>
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
