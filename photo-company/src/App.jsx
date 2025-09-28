import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { LanguageProvider } from './contexts/LanguageContext';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Hero from './components/sections/Hero';
import Services from './components/sections/Services';
import Gallery from './components/sections/Gallery';
import Search from './components/sections/Search';
import About from './components/sections/About';
import Contact from './components/sections/Contact';
import AdminLayout from './components/admin/AdminLayout';
import Dashboard from './components/admin/dashboard/Dashboard';
import Upload from './components/admin/upload/Upload';
import Sessions from './components/admin/sessions/Sessions';
import Customers from './components/admin/customers/Customers';
import Login from './components/admin/login/Login';
import RequireAdmin from './components/admin/RequireAdmin';
import './App.css';

function App() {
  return (
    <LanguageProvider>
      <Router>
        <Routes>
        {/* Admin Auth */}
        <Route path="/admin/login" element={<Login />} />

        {/* Admin Routes (Protected) */}
        <Route path="/admin" element={<RequireAdmin><AdminLayout /></RequireAdmin>}>
          <Route index element={<Dashboard />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="upload" element={<Upload />} />
          <Route path="sessions" element={<Sessions />} />
          <Route path="customers" element={<Customers />} />
        </Route>
        
        {/* Main Website Routes */}
        <Route path="/" element={
          <>
            <Navbar />
            <main>
              <Search />
              <Hero />
              <Services />
              <Gallery />
              <About />
              <Contact />
            </main>
            <Footer />
          </>
        } />
        </Routes>
      </Router>
    </LanguageProvider>
  );
}

export default App;
