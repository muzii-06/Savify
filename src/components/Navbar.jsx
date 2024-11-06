import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FaSearch, FaShoppingCart } from 'react-icons/fa';
import './Navbar.css'; // Custom styles
import savifylogo from './Savify logo.png';


const Navbar = () => {
    return (
        <nav className="navbar navbar-expand-lg navbar-light custom-navbar p-3 flex-column"> {/* Use flex-column to stack items */}
            <div className="container-fluid d-flex justify-content-between align-items-center">
                

                <div className="m-0 p-0 ms-auto navbar-nav d-flex align-items-center justify-content-end fw-bolder">
                    <a className="nav-link" href="/">SELL ON SAVIFY</a>
                    <a className="nav-link" href="/">HELP & SUPPORT</a>
                    <a className="nav-link" href="#" >
                        LOGIN
                    </a>
                    <a className="nav-link" href="/">SIGN UP</a>
                  
                </div>
            </div>

            {/* Search bar on a new line */}
            <div className="container-fluid mt-2"> 
               

           
            <a className="navbar-brand" href="/">
                    <img width={100} height={100} src={savifylogo} alt="Logo" /> {/* Replace with your logo */}
                </a>{/* Add margin-top for spacing */}
                
                <div className="d-flex justify-content-center align-items-center w-100 ">
               
                    <form className="d-flex w-75 justify-content-center align-items-center gap-3"> {/* Adjust width as needed */}
                        <input
                            className="form-control me-2 search-input fw-bold"
                            type="search"
                            placeholder="Search in Savify"
                            aria-label="Search"
                        />
                        <button className="btn btn-outline-secondary" type="submit">
                            <FaSearch />
                        </button>
                        <a className="nav-link cart-icon" href="/">
                        <FaShoppingCart /> {/* Cart Icon */}
                    </a>
                    </form>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
