import React from 'react';
import './Help.css'; // Custom styles for the page
import savifylogo from './Savify logo.png'; // Logo image
import { Link } from 'react-router-dom';
const Help = () => {
    return (
        <div className="help-container">
            <img className='m-auto d-block' width={'20%'} height={'20%'} src={savifylogo} alt="Logo" />

            <div className="help-content">
                <h2>How Can We Help You?</h2>
                <p>Welcome to our Help Center. Here you will find helpful information to assist you with using our website and services.</p>

                <section className="help-section">
                    <h3>Frequently Asked Questions (FAQs)</h3>
                    <ul>
                        <li>
                            <strong>How do I track my order?</strong>
                            <p>You can track your order by logging into your account and visiting the "Order History" section. You will find a tracking number for your order.</p>
                        </li>
                        <li>
                            <strong>Can I change my shipping address after placing an order?</strong>
                            <p>If your order has not been shipped yet, we may be able to update the shipping address. Please contact our customer support as soon as possible.</p>
                        </li>
                        <li>
                            <strong>How can I contact customer support?</strong>
                            <p>You can reach our customer support team via the "Contact Us" page or by emailing support@savify.com. Our team is available 24/7.</p>
                        </li>
                    </ul>
                </section>

                <section className="help-section">
                    <h3>Order and Payment Issues</h3>
                    <p>If you have trouble with your payment or have an issue with your order, please check the following:</p>
                    <ul>
                        <li>Ensure that your billing information is up-to-date.</li>
                        <li>Check if your payment method has sufficient funds.</li>
                        <li>Contact your bank to ensure that there are no payment restrictions.</li>
                    </ul>
                </section>

                <section className="help-section">
                    <h3>Return & Refund Policy</h3>
                    <p>If you are not satisfied with your purchase, we offer returns and refunds. Please visit our <Link to="/returns-replacement-policy">Returns & Refunds Policy</Link> page for more details.</p>
                </section>

                <section className="help-section">
                    <h3>Contact Us</h3>
                    <p>If you need further assistance, don’t hesitate to get in touch with our support team.</p>
                    <p>Email: support@savify.com</p>
                    <p>Phone: +92-3160583721</p>
                </section>
            </div>
        </div>
    );
};

export default Help;
