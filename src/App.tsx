import { Outlet } from 'react-router';
import './App.css';
import Navbar from './components/ui/Navbar/Navbar';
import Loader from './components/ui/Loading/Loader';
import { useEffect, useState } from 'react';

function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // TODO: Display logo intro on site load
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <Loader />;
  }

  return (
    <>
      <Navbar />
      <Outlet />
    </>
  );
}

export default App;
