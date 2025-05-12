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
  <h2 className="mhead mb-4">Manage Reviews</h2>

  {reviews.length === 0 ? (
    <p>No reviews found.</p>
  ) : (
    <div className="table-responsive">
      <table className="table table-bordered table-hover align-middle text-center">
        <thead className="table-light">
          <tr>
            <th>Sr #</th>
            <th>Picture</th>
            <th>Product Name</th>
            <th>User</th>
            <th>Rating</th>
            <th>Review</th>
            <th>Reply</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {reviews.map((review, index) => (
            <tr key={review._id}>
              <td>{index + 1}</td>
              <td>
                <img
                  src={`http://localhost:5000/${review.productImage}`}
                  alt={review.productName}
                  width="50"
                  className="rounded"
                />
              </td>
              <td>{review.productName}</td>
              <td>{review.user}</td>
              <td>⭐ {review.rating}</td>
              <td>{review.comment}</td>
              <td>
                {review.reply ? (
                  <p className="text-muted mb-0"><strong>{review.reply}</strong></p>
                ) : replyReviewId === review._id ? (
                  <div>
                    <input
                      type="text"
                      className="form-control mb-2"
                      placeholder="Write a reply..."
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                    />
                    <button
                      className="btn btn-primary btn-sm"
                      onClick={() => handleReply(review.productId, review._id)}
                    >
                      <FaReply /> Submit
                    </button>
                  </div>
                ) : (
                  <button
                    className="btn btn-secondary btn-sm"
                    onClick={() => setReplyReviewId(review._id)}
                  >
                    <FaReply /> Reply
                  </button>
                )}
              </td>
              <td>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => handleDelete(review.productId, review._id)}
                >
                  <FaTrash /> Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )}
</div>

  );
};

export default ManageReviews;
