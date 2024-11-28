import React from 'react';
import { useNavigate } from 'react-router-dom';
import './ProductCard.css';

const ProductCard = ({ id, name, price, image, handleAddToCart }) => {
  const navigate = useNavigate();

  const product = { id, name, price, image, quantity: 1 };

  return (
    <div className="col-lg-2 col-md-4 col-sm-6 mb-4 border m-3  bg-white rounded-3">
      <div
        className="pr-card"
        onClick={() => navigate(`/product/${id}`)} // Navigate to the product page
        style={{ cursor: 'pointer' }}
      >
        <img src={image} alt={name} width="100%"  className="rounded-3 product-image" />
        <div className="card-body">
          <p className="card-title  fs-4 ">{name}</p>
          <p className="card-text  fs-4">Rs {price}</p>
          


        </div>
      </div>
      <button
  className="btn buy  w-100  rounded-pill mt-3"
  onClick={(e) => {
    e.stopPropagation(); // Prevent navigation
    handleAddToCart({
      _id: id, // Pass unique identifier
      name,
      price,
      image, // Image URL
      quantity: 1, // Default quantity
    });
  }}
>
  Add to Cart
</button>
    </div>
  );
};

export default ProductCard;
