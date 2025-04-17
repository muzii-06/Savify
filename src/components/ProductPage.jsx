import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Navbar from './Navbar';
import axios from 'axios';
import './ProductPage.css';

const ProductPage = ({ products, handleAddToCart, username, isAuthenticated, handleLogout,cart }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState('');
  const [rating, setRating] = useState(0);

  useEffect(() => {
    console.log("📌 Fetching Product ID:", id); // ✅ Log ID before making API request

    if (!id || id.length !== 24) {
        console.error("❌ Invalid Product ID:", id);
        return;
    }

    const fetchProduct = async () => {
        try {
            const response = await axios.get(`http://localhost:5000/api/products/${id}`);
            console.log("📌 Product Data Fetched:", response.data); // ✅ Log fetched product

            if (!response.data.seller || !response.data.seller._id) {
                console.warn("⚠️ Warning: Seller ID missing in fetched product:", response.data.name);
            }

            setProduct(response.data);
        } catch (error) {
            console.error("❌ Error fetching product:", error.response?.data || error.message);
        }
    };

    fetchProduct();
}, [id]);



  const handleQuantityChange = (type) => {
    setQuantity((prev) =>
      type === 'increment' ? prev + 1 : Math.max(1, prev - 1)
    );
  };

  const handleAddReview = async () => {
    if (!newReview || rating === 0) {
      alert('Please provide a review and a rating.');
      return;
    }

    const reviewData = {
      user: username || 'Anonymous',
      rating,
      comment: newReview,
    };

    try {
      const response = await axios.post(
        `http://localhost:5000/api/products/${id}/reviews`,
        reviewData
      );
      setReviews([...reviews, response.data.review]); // Update reviews in the UI
      setNewReview('');
      setRating(0);
    } catch (error) {
      console.error('Error adding review:', error);
      alert('Failed to submit review. Please try again.');
    }
  };

  if (!product) {
    return (
      <>
        <Navbar
          username={username}
          isAuthenticated={isAuthenticated}
          handleLogout={handleLogout}
        />
        <div className="container text-center mt-5">
          <h2>Product not found</h2>
        </div>
      </>
    );
  }

  const averageRating = reviews.length
    ? (reviews.reduce((acc, curr) => acc + curr.rating, 0) / reviews.length).toFixed(1)
    : 'No Ratings';

  return (
    <>
      <Navbar
        username={username}
        isAuthenticated={isAuthenticated}
        handleLogout={handleLogout}
        cart={cart} // ✅ use prop instead of localStorage
      />

      <div className="container product-page mt-4">
        <div className="row">
          {/* Left Column: Images */}
          <div className="col-lg-6 col-md-6">
            <img
              src={`http://localhost:5000/${product.images[0]}`}
              alt={product.name}
              className="img-fluid main-product-image"
            />
            <div className="thumbnail-row mt-3">
              {product.images.map((image, idx) => (
                <img
                  key={idx}
                  src={`http://localhost:5000/${image}`}
                  alt={`Thumbnail ${idx}`}
                  className="thumbnail-image"
                />
              ))}
            </div>
          </div>

          {/* Right Column: Details */}
          <div className="col-lg-6 col-md-6">
            <h1 className="product-title">{product.name}</h1>
            <p className="text-muted">
              Store: {product.seller && product.seller.storeName ? product.seller.storeName : 'Unknown Store'}
            </p>

            <div className="ratings mb-3">
              <span className="stars ">⭐⭐⭐⭐⭐</span>
              <span className="ms-2 text-secondary">{averageRating} Ratings</span>
            </div>

            <h2 className="text-danger">Rs. {product.price}</h2>
            <p>{product.description}</p>

            <div className="quantity-control d-flex align-items-center my-3">
              <button
                className="btn btn-secondary"
                onClick={() => handleQuantityChange('decrement')}
              >
                -
              </button>
              <input
                type="number"
                readOnly
                className="form-control text-center mx-2"
                value={quantity}
              />
              <button
                className="btn btn-secondary"
                onClick={() => handleQuantityChange('increment')}
              >
                +
              </button>
            </div>

            <div className="d-flex gap-3">
            <button
  className="btn btn-primary w-50 rounded-pill fw-bold"
  onClick={() => {
    navigate('/checkout', {
      state: {
        directBuy: {
          _id: product._id,
          name: product.name,
          price: product.price,
          quantity,
          image: `http://localhost:5000/${product.images[0].replace(/\\/g, "/")}`,
          seller: {
            _id: product.seller?._id,
            storeName: product.seller?.storeName || "Unknown Store",
          },
          sellerId: product.seller?._id || "UNKNOWN_SELLER",
        },
      },
    });
  }}
>
  Buy Now
</button>


              <button
  className="btn btn-warning w-50 rounded-pill fw-bold"
  onClick={() =>
    handleAddToCart({
      _id: product._id,
      name: product.name,
      price: product.price,
      image: `http://localhost:5000/${product.images[0]}`,
      quantity,
      seller: {
        _id: product.seller?._id,
        storeName: product.seller?.storeName,
      },
      sellerId: product.seller?._id,
    })
  }
>
  Add to Cart
</button>




            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="reviews-section mt-5">
          <h3>Reviews</h3>
          <div className="existing-reviews">
            {reviews.length ? (
              reviews.map((review, idx) => (
                <div key={idx} className="review-item">
                  <p>
                    <strong>{review.user}</strong> -{' '}
                    <span className="text-warning">⭐{review.rating}</span>
                  </p>
                  <p>{review.comment}</p>
                  {review.reply && product.seller && product.seller.storeName && (
                    <p className="reply text-muted">
                      <strong>{product.seller.storeName}:</strong> {review.reply}
                    </p>
                  )}
                </div>
              ))
            ) : (
              <p>No reviews yet. Be the first to review!</p>
            )}
          </div>

          {/* Add a Review */}
          {isAuthenticated && (
            <div className="add-review mt-4">
              <h4>Leave a Review</h4>
              <textarea
                className="form-control mb-2"
                rows="3"
                placeholder="Write your review..."
                value={newReview}
                onChange={(e) => setNewReview(e.target.value)}
              ></textarea>
              <div className="rating-input d-flex align-items-center mb-3">
                <span className="me-2">Your Rating:</span>
                {[1, 2, 3, 4, 5].map((star) => (
                  <span
                    key={star}
                    className={`star ${rating >= star ? 'text-warning' : 'text-muted'}`}
                    style={{ cursor: 'pointer' }}
                    onClick={() => setRating(star)}
                  >
                    ⭐
                  </span>
                ))}
              </div>
              <button className="btn btn-success" onClick={handleAddReview}>
                Submit Review
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ProductPage;