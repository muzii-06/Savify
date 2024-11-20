import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Footer.css';
import { Link } from 'react-router-dom'; // Custom styles (optional)
import { FaInstagram } from "react-icons/fa6";
import { FaFacebookF } from "react-icons/fa";
import { CiTwitter } from "react-icons/ci";
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
                        <ul className="list-unstyled d-flex align-items-center  gap-4 mt-3  ">
                            <li ><a href="https://www.instagram.com/"><FaInstagram size={30} /></a>  </li>
                            <li><a href="https://www.facebook.com/"><FaFacebookF size={30} /> </a></li>
                            <li><a href="https://twitter.com/login"><CiTwitter  size={30} /></a></li>
                        </ul>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
