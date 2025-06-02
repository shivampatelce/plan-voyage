import { Outlet } from 'react-router';
import './App.css';
import Navbar from './components/ui/Navbar/Navbar';
import Footer from './components/ui/Footer/Footer';
import ScrollToTop from './util/ScrollToTop';

function App() {
  return (
    <>
      <ScrollToTop />
      <div className='container'>
        <Navbar />
        <Outlet />
        <Footer />
      </div>
    </>
  );
}

export default App;
