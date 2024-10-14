import React from 'react';
import ProductCard from './ProductCard';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Productgrid.css';
import Sidebar from './Sidebar';
import { products } from './products';



const ProductGrid = () => {
    return (
      <>
      
        {/* <Sidebar/> */}
        <div className="col-lg-10 my-5 shadow m-auto">
            <div className="row">
            {products.map((item, index) => {
    return (
        <ProductCard 
            key={index} 
            {...item} 
        />
    );
})}

            </div>
                </div>
       
                </>
    );
};

export default ProductGrid;
