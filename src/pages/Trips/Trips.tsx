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
    </>
  );
};

export default Trips;
