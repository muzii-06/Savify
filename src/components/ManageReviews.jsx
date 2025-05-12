import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaReply, FaTrash } from "react-icons/fa";
import '../styling/ManageReviews.css';
const ManageReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [replyText, setReplyText] = useState("");
  const [replyReviewId, setReplyReviewId] = useState(null);
  const sellerId = localStorage.getItem("sellerId"); // Get seller ID from localStorage

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/products/seller/${sellerId}/reviews`);
        setReviews(response.data);
      } catch (error) {
        console.error("Error fetching reviews:", error);
      }
    };
    fetchReviews();
  }, [sellerId]);

  const handleDelete = async (productId, reviewId) => {
    if (!window.confirm("Are you sure you want to delete this review?")) return;

    try {
      await axios.delete(`http://localhost:5000/api/products/${productId}/reviews/${reviewId}`);
      setReviews(reviews.filter((review) => review._id !== reviewId));
      alert("Review deleted successfully.");
    } catch (error) {
      console.error("Error deleting review:", error);
      alert("Failed to delete review.");
    }
  };

  const handleReply = async (productId, reviewId) => {
    if (!replyText.trim()) return alert("Reply cannot be empty!");

    try {
      await axios.put(`http://localhost:5000/api/products/${productId}/reviews/${reviewId}/reply`, {
        reply: replyText,
      });

      setReviews(
        reviews.map((review) =>
          review._id === reviewId ? { ...review, reply: replyText } : review
        )
      );

      setReplyText("");
      setReplyReviewId(null);
      alert("Reply added successfully.");
    } catch (error) {
      console.error("Error adding reply:", error);
      alert("Failed to add reply.");
    }
  };

  return (
    <div className="revcontainer mt-4">
      <h2 className="mhead">Manage Reviews</h2>
      {reviews.length === 0 ? (
        <p>No reviews found.</p>
      ) : (
        <ul className="list-group">
          {reviews.map((review) => (
            <li key={review._id} className="list-group-item">
              {/* ✅ Display Product Name & Image */}
              <div className="d-flex align-items-center mb-2">
                <img
                  src={`http://localhost:5000/${review.productImage}`}
                  alt={review.productName}
                  width="50"
                  className="me-2 rounded"
                />
                <strong>{review.productName}</strong>
              </div>

              <strong>{review.user}</strong> (⭐{review.rating})
              <p>{review.comment}</p>

              {review.reply && <p className="text-muted"><strong>Reply:</strong> {review.reply}</p>}

              <button className="btn btn-danger me-2" onClick={() => handleDelete(review.productId, review._id)}>
                <FaTrash /> Delete
              </button>

              {replyReviewId === review._id ? (
                <>
                  <input
                    type="text"
                    className="form-control mt-2"
                    placeholder="Write a reply..."
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                  />
                  <button className="btn btn-primary mt-2" onClick={() => handleReply(review.productId, review._id)}>
                    <FaReply /> Submit Reply
                  </button>
                </>
              ) : (
                <button className="btn btn-secondary" onClick={() => setReplyReviewId(review._id)}>
                  <FaReply /> Reply
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ManageReviews;
