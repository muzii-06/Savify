import React from 'react';
import ProductCard from './ProductCard';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Productgrid.css';

import { products } from './products';



const ProductGrid = ({handleAddToCart}) => {
    return (
      <>
      
        {/* <Sidebar/> */}
        <div className="col-lg-10 p-2 my-5 shadow m-auto">
            <div className="row">
            {products.map((item, index) => {
    return (
        <ProductCard 
            key={index} 
            {...item} 
            handleAddToCart={handleAddToCart}
        />
    );
})}

            </div>
                </div>
       
                </>
    );
};

export default ProductGrid;
