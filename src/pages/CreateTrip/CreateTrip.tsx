import type React from 'react';
import './CreateTrip.css';
import CreateTripForm from '../../components/CreateTripForm/CreateTripForm';

const CreateTrip: React.FC = () => {
  return (
    <section className='create-trip'>
      <div className='container-max text-center'>
        <CreateTripForm />
      </div>
    </section>
  );
};

export default CreateTrip;
