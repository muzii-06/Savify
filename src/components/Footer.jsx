import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Footer.css';
import { Link } from 'react-router-dom'; // Custom styles (optional)

const Footer = () => {
    return (
        <footer className="footer mt-auto py-4 ">
            <div className="col-lg-10 m-auto ">
                <div className="row">
                    {/* Let Us Help You Section */}
                    <div className="col-md-4">
                        <h5>Let Us Help You</h5>
                        <ul className="list-unstyled">
                            
                            <li><a href="/">Your Account</a></li>
                            <li><a href="/">Your Orders</a></li>
                            <li><Link to="/shipping-rates-policy">Shipping Rates & Policies</Link></li>
                            <li><Link to="/returns-replacement-policy">Returns & Replacements</Link></li>
                            <li><Link to="/help">Help</Link></li>
                        </ul>
                    </div>

                    {/* Additional Columns if needed */}
                    <div className="col-md-4">
                        <h5>Get to Know Us</h5>
                        <ul className="list-unstyled text-white">
                            <li><a href="/">Careers</a></li>
                            <li><a href="/">Blog</a></li>
                            <li><a href="/">About Savify</a></li>
                           
                        </ul>
                    </div>

                    <div className="col-md-4">
                        <h5>Connect with Us</h5>
                        <ul className="list-unstyled">
                            <li><a href="/">Facebook</a></li>
                            <li><a href="/">Twitter</a></li>
                            <li><a href="/">Instagram</a></li>
                        </ul>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
