import React from 'react';
import './ShippingRatesAndPolicy.css';
import savifylogo from './Savify logo.png';

const ShippingRatesAndPolicy = () => {
    return (
        <div className="back">
            <img className='m-auto d-block' width={'20%'} height={'20%'} src={savifylogo} alt="Logo" />

            <div className="shipping-policy-container">
                <h2>Shipping Policy</h2>
                <p>At Savify, we are committed to delivering your orders efficiently and securely across Pakistan.</p>
                
                <section>
                    <h3>Delivery Timeline</h3>
                    <p>
                        Orders are typically delivered within <strong>4 to 7 working days</strong> from the date of order confirmation.
                        Delivery time may vary based on your location and product availability.
                    </p>
                </section>

                <section>
                    <h3>Shipping Charges</h3>
                    <p><strong>We do not charge any shipping fee</strong> on standard orders. All orders are delivered free of cost to your doorstep.</p>
                </section>

                <section>
                    <h3>Important Notes</h3>
                    <ul>
                        <li>Our delivery partners operate only on working days (Monday to Saturday).</li>
                        <li>In case of delays due to weather, public holidays, or operational issues, you will be notified via email or SMS.</li>
                        <li>Please ensure your contact and address information is accurate to avoid failed deliveries.</li>
                    </ul>
                </section>

                <section>
                    <h3>Need Help?</h3>
                    <p>
                        If you have any questions regarding your shipment, feel free to contact our support team at
                        <strong> support@savify.com</strong> or via WhatsApp.
                    </p>
                </section>
            </div>
        </div>
    );
};

export default ShippingRatesAndPolicy;
