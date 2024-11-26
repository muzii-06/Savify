import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Navbar from './Navbar';
import axios from 'axios';
import './ProductPage.css';

const ProductPage = ({ products, handleAddToCart, username, isAuthenticated, handleLogout }) => {
  const { id } = useParams();
  const navigate = useNavigate(); // Use navigate instead of Navigate
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState('');
  const [rating, setRating] = useState(0);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/products/${id}`);
        setProduct(response.data);
        setReviews(response.data.reviews || []); // Load existing reviews
      } catch (error) {
        console.error('Error fetching product:', error);
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
      user: username || 'Anonymous', // Use the username passed as a prop
      rating,
      comment: newReview,
    };

    try {
      const response = await axios.post(
        `http://localhost:5000/api/products/${id}/reviews`,
        reviewData
      );
      setReviews([...reviews, response.data.review]); // Update reviews in the UI
      setNewReview(''); // Reset the review input field
      setRating(0); // Reset the rating
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
            <p className="text-muted">Brand: {product.sellerName || 'No Brand'}</p>

            <div className="ratings mb-3">
              <span className="stars">⭐⭐⭐⭐⭐</span>
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
                className="btn btn-primary w-50"
                onClick={() => navigate('/checkout')}
              >
                Buy Now
              </button>
              <button
                className="btn btn-warning w-50"
                onClick={() =>
                  handleAddToCart({
                    _id: product._id,
                    name: product.name,
                    price: product.price,
                    image: `http://localhost:5000/${product.images[0]}`,
                    quantity, // Use the quantity state value
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
