import './App.css';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Hero from './components/sections/Hero';
import Services from './components/sections/Services';

function App() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Services />
        {/* Other sections will be added here */}
      </main>
      <Footer />
    </>
  );
}

export default App;