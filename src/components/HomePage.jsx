import React from 'react';
import Navbar from './Navbar.jsx';
import HeroSection from './HeroSection.jsx';
import ProductGrid from './ProductGrid.jsx';
import Footer from './Footer.jsx';
import ChatBot from './ChatBot.jsx';
import CreatedBy from './CreatedBy.jsx';

const HomePage = ({ username, isAuthenticated,handleAddToCart,cart }) => {
  return (
    <div>
      <Navbar username={username} isAuthenticated={isAuthenticated} cart={cart} />
      
      <HeroSection />
      <ProductGrid handleAddToCart={handleAddToCart} />
      <ChatBot />
      {/* <ProductGrid /> */}
      <CreatedBy/>
      <Footer />
    </div>
  );
};

export default HomePage;
