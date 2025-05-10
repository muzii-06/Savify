import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Navbar from './Navbar';
import axios from 'axios';
import './ProductPage.css';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const ProductPage = ({ products, handleAddToCart, username, isAuthenticated, handleLogout,cart }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState('');
  const [rating, setRating] = useState(0);
  const [showBargainModal, setShowBargainModal] = useState(false);
  const [round, setRound] = useState(1);
  const [userOffer, setUserOffer] = useState('');
  const [aiOffer, setAiOffer] = useState(product?.price || 0);
  const [finalDiscount, setFinalDiscount] = useState(0);
  const [bargainAccepted, setBargainAccepted] = useState(false);
  const [bargainOver, setBargainOver] = useState(false);
  const [bargainRounds, setBargainRounds] = useState(0);
const [maxDiscountPercent, setMaxDiscountPercent] = useState(0);
const [canReview, setCanReview] = useState(false);
const [chatMessages, setChatMessages] = useState([]);
const [isTyping, setIsTyping] = useState(false);
const [predictedDiscount, setPredictedDiscount] = useState(0); // <-- NEW


  

// ✅ Fetch Product Info
useEffect(() => {
  const fetchProduct = async () => {
    if (!id || id.length !== 24) return;

    try {
      const response = await axios.get(`http://localhost:5000/api/products/${id}`);
      setProduct(response.data);
      setReviews(response.data.reviews || []);

      if (response.data.maxDiscountPercent && response.data.bargainRounds) {
        setMaxDiscountPercent(response.data.maxDiscountPercent);
        setBargainRounds(response.data.bargainRounds);
      }
    } catch (error) {
      console.error("❌ Error fetching product:", error.response?.data || error.message);
    }
  };

  fetchProduct();
}, [id]);

// ✅ Check if the user is eligible to review
useEffect(() => {
  const checkEligibility = async () => {
    if (!id || !isAuthenticated) return;
    const buyerId = localStorage.getItem('userId');

    try {
      const response = await axios.get(
        `http://localhost:5000/api/orders/buyer/${buyerId}/can-review/${id}`
      );
      setCanReview(response.data.canReview);
    } catch (error) {
      console.error("❌ Error checking review eligibility:", error);
    }
  };

  checkEligibility();
}, [id, isAuthenticated]);




  const handleQuantityChange = (type) => {
    setQuantity((prev) =>
      type === 'increment' ? prev + 1 : Math.max(1, prev - 1)
    );
  };
  const handleUserOffer = async () => {
    if (!userOffer || isNaN(userOffer)) return alert("Enter a valid number");
  
    try {
      const buyerId = localStorage.getItem("userId");
  
      if (!buyerId || !product?._id) {
        alert("User or product info missing. Please log in again.");
        return;
      }
      
      const response = await axios.post("http://localhost:5000/api/negotiate", {
        userId: buyerId,
        productId: product._id,
        max_discount: maxDiscountPercent,
      });
  
      const discount = response.data.discount;
      const counterOffer =
        product.price -
        (product.price * (discount / bargainRounds) * round) / 100;
  
        if (userOffer >= counterOffer) {
          setAiOffer(userOffer);
          setFinalDiscount(((product.price - userOffer) / product.price * 100).toFixed(2));
          setBargainAccepted(true);
          setBargainOver(true);
        } else {
          // Always respond with the same offer once rounds are exhausted
          if (round < bargainRounds) {
            setAiOffer(counterOffer);
            setRound((prev) => prev + 1);
          } else {
            setAiOffer((prev) => prev); // No change
          }
        
          setChatMessages((prev) => [
            ...prev,
            { sender: 'ai', text: `🤖 My counter offer is Rs. ${counterOffer.toFixed(0)}` },
          ]);
        }
        
    } catch (error) {
      console.error("❌ AI error:", error.response?.data || error.message);
      alert("Something went wrong with the bargain engine.");
    }
  };
  
  const handleAcceptBargain = async () => {
    try {
      const userId = localStorage.getItem("userId");
  
      await axios.post("http://localhost:5000/api/vouchers", {
        userId,
        productId: product._id,
        discountedPrice: aiOffer,
      });
  
      const discountPercent = discount; // use model-predicted full value


      navigate('/checkout', {
        state: {
          directBuy: {
            ...product,
            price: aiOffer,
            originalPrice: product.price, // ✅ required to show strike-through
            quantity,
            voucherApplied: true,
            discountPercent: discountPercent,
            image: `http://localhost:5000/${product.images[0].replace(/\\/g, "/")}`
          },
        },
      });
      
      
      

    } catch (err) {
      toast.error("❌ Failed to save voucher.");
    }
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
  onClick={() => {
    const sellerId = product.seller?._id || product.sellerId || "UNKNOWN_SELLER";
    
    // 🧹 Remove voucher if it exists for this seller
    const cartVouchers = JSON.parse(localStorage.getItem("cartVouchers")) || {};
    if (cartVouchers[sellerId]) {
      delete cartVouchers[sellerId];
      localStorage.setItem("cartVouchers", JSON.stringify(cartVouchers));
      toast.warning("⚠️ Existing voucher removed for this seller due to new product addition.");
    }
  
    handleAddToCart({
      ...product,
      reviews: product.reviews || [],
      quantity,
      image: `http://localhost:5000/${product.images[0]}`,
      seller: {
        _id: sellerId,
        storeName: product.seller?.storeName || "Unknown Store",
      },
      sellerId: sellerId,
      bargainRounds: product.bargainRounds || 1,
      maxDiscountPercent: product.maxDiscountPercent || 10,
      rating: parseFloat(averageRating),  // ✅ use the exact averageRating already displayed
    });
    
  }}
  
  
>
  Add to Cart
</button>
<button
  className="btn btn-dark w-100 rounded-pill fw-bold mt-2"
  onClick={() => {
    if (!bargainRounds || !maxDiscountPercent) {
      alert("❌ This product is not available for bargain.");
      return;
    }
    setShowBargainModal(true);
    setRound(1);
    setUserOffer('');
    setAiOffer(product.price);
    setBargainAccepted(false);
    setBargainOver(false);
    setChatMessages([
      {
        sender: 'ai',
        text: `🛒 The original price is Rs. ${product.price}. Let's start bargaining!`,
      },
    ]);
  }}
>
  Start Bargain
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
          {/* Add a Review */}
{isAuthenticated && canReview && (
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

{isAuthenticated && !canReview && (
  <div className="text-muted mt-3">
    ✅ You can only leave a review once this product is marked <strong>Delivered</strong> in your order.
  </div>
)}

        </div>
      </div>
      {showBargainModal && (
  <div className="modal show fade d-block" tabIndex="-1">
    <div className="modal-dialog modal-dialog-centered">
      <div className="modal-content">
        <div className="modal-header">
        <h5 className="modal-title">Bargain Assistant</h5>

          <button type="button" className="btn-close" onClick={() => setShowBargainModal(false)}></button>
        </div>
        <div className="modal-body">
  <div className="chat-box d-flex flex-column">
    {chatMessages.map((msg, idx) => (
      <div
        key={idx}
        className={`chat-bubble ${msg.sender === 'user' ? 'user-msg' : 'ai-msg'}`}
      >
        {msg.text}
      </div>
    ))}
    {isTyping && <div className="typing-indicator">🤖 Typing...</div>}
  </div>

  {bargainAccepted ? (
    <div className="text-center mt-3">
      <h5>✅ Bargain Accepted!</h5>
      <p>You got a {finalDiscount}% discount!</p>
      <button
        className="btn btn-success"
        onClick={() =>
          navigate('/checkout', {
            state: {
              directBuy: {
                ...product,
                price: aiOffer,
                quantity,
              },
            },
          })
        }
      >
        Proceed to Checkout
      </button>
    </div>
  ) : (
    <div className="d-flex flex-wrap gap-2 mt-3 justify-content-start">
      <input
        type="number"
        className="form-control"
        value={userOffer}
        onChange={(e) => setUserOffer(e.target.value)}
        placeholder="Enter your offer"
        disabled={isTyping}
      />
      <button
        className="btn btn-primary"
        onClick={async () => {
          if (!userOffer || isNaN(userOffer)) return alert("Enter a valid number");
          const offer = Number(userOffer);
          setChatMessages((prev) => [...prev, { sender: 'user', text: `My offer: Rs. ${offer}` }]);
          setUserOffer('');
          setIsTyping(true);

          setTimeout(async () => {
            try {
              const buyerId = localStorage.getItem("userId");
              const response = await axios.post("http://localhost:5000/api/negotiate", {
                userId: buyerId,
                productId: product._id,
                max_discount: maxDiscountPercent,
                account_age_days: 30,
                total_orders: 2,
                product_rating: parseFloat(averageRating) || 4.5,
              });

              const discount = response.data.discount;
              setPredictedDiscount(discount);
              const newOffer =
                product.price - (product.price * discount * round / bargainRounds) / 100;

              setIsTyping(false);

              // If max rounds reached, just reuse last offer
              // const discount = response.data.discount;
              // setPredictedDiscount(discount);
              
              const nextRound = round + 1;
              
              if (nextRound > bargainRounds) {
                const finalOffer = product.price - (product.price * discount / 100);
                setAiOffer(finalOffer);
                setChatMessages((prev) => [
                  ...prev,
                  { sender: 'ai', text: `🤖 My final offer is Rs. ${finalOffer.toFixed(0)}` },
                ]);
              } else {
                const scaledOffer = product.price - (product.price * discount * round / bargainRounds) / 100;
                setAiOffer(scaledOffer);
                setChatMessages((prev) => [
                  ...prev,
                  { sender: 'ai', text: `🤖 My counter offer is Rs. ${scaledOffer.toFixed(0)}` },
                ]);
                setRound(nextRound);
              }
              

            } catch (err) {
              setIsTyping(false);
              setChatMessages((prev) => [
                ...prev,
                { sender: 'ai', text: `❌ Something went wrong with AI engine.` },
              ]);
            }
          }, 1500);
        }}
        disabled={isTyping}
      >
        Send
      </button>
      <button
  className="btn btn-success"
  onClick={() => {
    const discountPercent = ((product.price - aiOffer) / product.price) * 100;
    setFinalDiscount(discountPercent.toFixed(2));
    setBargainAccepted(true);

    navigate('/checkout', {
      state: {
        directBuy: {
          ...product,
          price: aiOffer,
          originalPrice: product.price,
          quantity,
          voucherApplied: true,
          discountPercent: discountPercent.toFixed(2),
          image: `http://localhost:5000/${product.images[0].replace(/\\/g, "/")}`,
        },
      },
    });
  }}
  disabled={isTyping || !aiOffer}
>
  Accept
</button>


<button
  className="btn btn-danger "
  onClick={() => setShowBargainModal(false)}
  disabled={isTyping}
>
  Cancel
</button>

    </div>
  )}
</div>


      </div>
    </div>
  </div>
)}

    </>
  );
};

export default ProductPage;