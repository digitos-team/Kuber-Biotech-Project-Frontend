// src/App.jsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { LanguageProvider } from './context/LanguageContext';

// Import Layout/Common Components
import Header from './components/common/header';
import Footer from './components/common/footer';

// Import Page Components
import Home from './pages/home';
import AboutUs from './pages/aboutUs';
import Products from './pages/products';
import Gallery from './pages/gallery';
import Contact from './pages/contact';
import Login from './pages/login';
import AdminDashboard from './pages/admindashboard';


const App = () => {
  return (
    <LanguageProvider>
      <div className="min-h-screen bg-white font-sans antialiased text-gray-800">
        <Header />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<AboutUs />} />
            <Route path="/products" element={<Products />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/admin" element={<Login />} />
            <Route path="/admindashboard" element={<AdminDashboard />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </LanguageProvider>
  );
};

export default App;