import React from 'react';
import { useNavigate } from 'react-router-dom';
import './ProductCard.css';

const ProductCard = ({ id, name, price, image, handleAddToCart }) => {
  const navigate = useNavigate();

  const product = { id, name, price, image, quantity: 1 };

  return (
    <div className="col-lg-2 col-md-4 col-sm-6 mb-4 border m-3 p-3">
      <div
        className="product-card shadow-sm rounded"
        onClick={() => navigate(`/product/${id}`)} // Navigate to the product page
        style={{ cursor: 'pointer' }}
      >
        <img src={image} alt={name} width="100%" height="150px" className="rounded-top" />
        <div className="card-body">
          <h5 className="card-title text-center">{name}</h5>
          <p className="card-text text-center">Rs {price}</p>
          <button
  className="btn btn-primary w-100 rounded-pill mt-3"
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
      </div>
    </div>
  );
};

export default ProductCard;
