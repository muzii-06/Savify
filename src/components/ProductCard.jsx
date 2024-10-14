import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './ProductCard.css'

const ProductCard = ({ name,price,image }) => {
    return (
        
        <div className="col-lg-2 col-md-4 col-sm-6 mb-4 mt-2">
            <div className="">
                <img width={'100%'} height={'100%'} src={image} className="m-auto d-block" alt={name} />
                <div className="card-body">
                    <h5 className="card-title text-center mt-2">{name}</h5>
                    <p className="card-text me-auto ">${price}</p>
                    <a href="/" className="btn  w-100 m-auto d-block buy">Buy Now</a>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;
