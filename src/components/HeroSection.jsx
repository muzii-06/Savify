import React from 'react';
import './HeroSection.css'; // Optional, for custom styles

const HeroSection = () => {
    return (
        <div className="hero-section bg-light text-center px-3 mt-5">
            {/* <h1>Welcome to MyStore</h1>
            <p>Find the best products from multiple vendors, all in one place!</p> */}
            <img width={'100%'} src="https://img.lazcdn.com/us/lazgcp/6c70ea68-1711-4734-b00d-b0a726f975f0_PK-1188-400.png_1200x1200q80.png_.webp" alt="" />
        </div>
    );
};

export default HeroSection;
