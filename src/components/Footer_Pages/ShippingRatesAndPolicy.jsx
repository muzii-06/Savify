import React from 'react';
import './ShippingRatesAndPolicy.css'; // Custom styles for the page
import savifylogo from './Savify logo.png';
const ShippingRatesAndPolicy = () => {
    return (
        
        <div className="back">
            <img className='m-auto d-block' width={'20%'} height={'20%'} src={savifylogo} alt="Logo" />
               

        <div className="shipping-policy-container">
            <h2>Shipping Rates and Policy</h2>
            <p>Welcome to our Shipping Rates and Policy page. Here, you'll find information on our shipping options, costs, and expected delivery times.</p>
            
            <section>
                <h3>Domestic Shipping</h3>
                <p>We offer various shipping options for domestic orders:</p>
                <ul>
                    <li><strong>Standard Shipping</strong>: 3-5 business days - $5.99</li>
                    <li><strong>Express Shipping</strong>: 1-2 business days - $15.99</li>
                    <li><strong>Overnight Shipping</strong>: 1 business day - $29.99</li>
                </ul>
            </section>
            
            <section>
                <h3>International Shipping</h3>
                <p>For international orders, we currently support the following options:</p>
                <ul>
                    <li><strong>Standard International</strong>: 7-14 business days - $25.99</li>
                    <li><strong>Express International</strong>: 3-5 business days - $45.99</li>
                </ul>
            </section>
            
            <section>
                <h3>Additional Information</h3>
                <p>Note that shipping times may vary due to unforeseen delays in customs or external factors. We strive to deliver your orders on time and will keep you updated on any significant delays.</p>
            </section>
        </div>
        </div>

        
    );
};

export default ShippingRatesAndPolicy;
