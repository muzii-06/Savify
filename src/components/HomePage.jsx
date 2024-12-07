import React from 'react';
import Navbar from './Navbar.jsx';
import HeroSection from './HeroSection.jsx';
import ProductGrid from './ProductGrid.jsx';
import Footer from './Footer.jsx';
import ChatBot from './ChatBot.jsx';

const HomePage = ({ username, isAuthenticated,handleAddToCart }) => {
  return (
    <div>
      <Navbar username={username} isAuthenticated={isAuthenticated} />
      
      <HeroSection />
      <ProductGrid handleAddToCart={handleAddToCart} />
      <ChatBot />
      {/* <ProductGrid /> */}
      <Footer />
    </div>
  );
};

export default HomePage;
