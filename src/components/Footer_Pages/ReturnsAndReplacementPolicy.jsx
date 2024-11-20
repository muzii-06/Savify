// src/components/Footer_Pages/ReturnsAndReplacementPolicy.js

import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './PolicyPage.css';
import savifylogo from './Savify logo.png';
 // Import a shared CSS file for consistent styling if you have one

const ReturnsAndReplacementPolicy = () => {
  return (
    
    <div className=" policy-page">
      <h2 className="text-center ">Returns and Replacement Policy</h2>
      <p>
        At Savify, we want you to be completely satisfied with your purchase. 
        If you're not happy with your product, we offer a simple returns and replacement policy to make it right.
      </p>
      
      <h4>Eligibility for Returns</h4>
      <p>
        To be eligible for a return, please ensure that:
        <ul>
          <li>The item is unused and in the same condition as when you received it.</li>
          <li>The item is in its original packaging.</li>
          <li>You have the receipt or proof of purchase.</li>
        </ul>
      </p>

      <h4>How to Initiate a Return</h4>
      <p>
        To initiate a return, contact our support team at [support email] with your order number and reason for return. 
        We’ll guide you through the steps to return the item. 
      </p>

      <h4>Replacement Policy</h4>
      <p>
        If you receive a defective or incorrect item, we’ll replace it free of charge. 
        Please notify us within 7 days of receiving the product to be eligible for a replacement.
      </p>

      <h4>Refunds</h4>
      <p>
        Once we receive your returned item, we’ll inspect it and notify you of the status. 
        Approved refunds will be processed and applied to your original payment method within 7-10 business days.
      </p>

      <h4>Exceptions</h4>
      <p>
        Please note that certain items are non-returnable and non-refundable, including:
        <ul>
          <li>Perishable goods</li>
          <li>Personal care items</li>
          <li>Gift cards</li>
        </ul>
      </p>

      <h4>Contact Us</h4>
      <p>
        If you have any questions about our returns and replacement policy, feel free to contact us at savify@gmail.com or +92-3160583721.
      </p>
    </div>
    
  );
};

export default ReturnsAndReplacementPolicy;
