import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './ProductCard.css'

const ProductCard = ({ id, name, price, image, handleAddToCart }) => {
    const product = { id, name, price, image };
    
    return (
      <div className="col-lg-2  col-md-4 col-sm-6 mb-4 mt-2 ">
        
        <img src={image} width={'100%'} className="m-auto d-block rounded-4" alt={name} />
        <h5 className='text-center p-0 mt-2'>{name}</h5>
        <p className='text-center p-0 m-0'>Rs {price}</p>
        <button onClick={() => handleAddToCart(product)} className="btn buy m-auto d-block w-75 rounded-pill">
          Add to Cart
        </button>
      </div>
    );
  };
  

export default ProductCard;
