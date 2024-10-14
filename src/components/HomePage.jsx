import React from 'react';
import Navbar from './Navbar.jsx';
import HeroSection from './HeroSection.jsx';
import ProductGrid from './ProductGrid.jsx';
import Footer from './Footer.jsx';

const HomePage = () => {
    return (
        <div>
            
            <Navbar />
            <HeroSection />
            <ProductGrid />
            
            <Footer />
        </div>
    );
};

export default HomePage;
