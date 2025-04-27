import React, { useState } from 'react';
import './HeroSection.css'; // Optional, for custom styles
import savify1 from './ssavify.png'; 
import savifyBanner1 from './sale savify web banner.png'
import ban2 from './hero.png'
import ban1 from './hero1.png'
import { GrNext } from "react-icons/gr";
import { GrPrevious } from "react-icons/gr";
const HeroSection = () => {
    const [index,setIndex]=useState(0); 
    const images = [ban1,ban2];
    const handleNext=()=>
    {
        setIndex(index+1);
        if(index>=images.length-1)
        {
            setIndex(0);
        }
    };
    const handlePrev=()=>
    {
        setIndex(index-1);
        if(index<=0)
        {
            setIndex(images.length-1);
        }
    };
    return (
        <div className="hero-section bg-light text-center px-3 mt-5 position-relative">
            {/* <h1>Welcome to MyStore</h1>
            
            <p>Find the best products from multiple vendors, all in one place!</p> */}
            
            <img width={'100%'} src={images[index]} alt="" />
            <GrNext onClick={handleNext} className='position-absolute top-50 end-0 mx-4 ' size={50} cursor="pointer" />
            <GrPrevious onClick={handlePrev}  className='position-absolute top-50 start-0 mx-4' size={50} cursor="pointer" />

        </div>
    );
};

export default HeroSection;
