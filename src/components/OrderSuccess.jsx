import React from "react";
import { Link } from "react-router-dom";

const OrderSuccess = () => {
  return (
    <div className="container text-center mt-5">
      <h2 className="text-success">🎉 Order Placed Successfully!</h2>
      <p>Thank you for shopping with us. Your order will be processed soon.</p>
      <Link to="/home" className="btn btn-primary">
        Continue Shopping
      </Link>
    </div>
  );
};

export default OrderSuccess;
