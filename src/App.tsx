import { Outlet } from 'react-router';
import './App.css';
import Navbar from './components/ui/Navbar/Navbar';
import Footer from './components/ui/Footer/Footer';

function App() {
  return (
    <>
      <div className='container'>
        <Navbar />
        <Outlet />
        <Footer />
      </div>
    </>
  );
}

export default App;
