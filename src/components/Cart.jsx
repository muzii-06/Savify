import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Cart.css';
import savifylogo from './Savify logo.png';
import { toast } from 'react-toastify';

function Cart({ cart, setCart }) {
    const navigate = useNavigate(); // ✅ Use navigate hook for redirection

    // Handle increase quantity
    const handleIncrease = (_id) => {
        setCart((prevCart) => {
            const updatedCart = prevCart.map((item) =>
                item._id === _id ? { ...item, quantity: item.quantity + 1 } : item
            );
            localStorage.setItem("cart", JSON.stringify(updatedCart)); // Sync with localStorage
            return updatedCart;
        });
    };

    const handleDecrease = (_id) => {
        setCart((prevCart) => {
            const updatedCart = prevCart.map((item) =>
                item._id === _id && item.quantity > 1
                    ? { ...item, quantity: item.quantity - 1 }
                    : item
            );
            localStorage.setItem("cart", JSON.stringify(updatedCart)); // Sync with localStorage
            return updatedCart;
        });
    };

    

    const handleRemove = (_id) => {
      setCart((prevCart) => {
        const removedItem = prevCart.find((item) => item._id === _id);
    
        if (removedItem) {
          toast.error(`🗑️ ${removedItem.name} removed from cart`);
        }
    
        const updatedCart = prevCart.filter((item) => item._id !== _id);
        localStorage.setItem("cart", JSON.stringify(updatedCart)); // Sync with localStorage
        return updatedCart;
      });
    };
    

    // Calculate total price
    const totalPrice = cart.reduce(
        (total, item) => total + item.price * item.quantity,
        0
    );

    return (
        <div className="cart-page">
            <h2 className="cart-title">Your Cart</h2>
            {cart.length === 0 ? (
                <p className="cart-empty">Your cart is empty!</p>
            ) : (
                <div className="cart-items">
                    {cart.map((item) => (
                        <div key={item._id} className="cart-item">
                            <img
                                src={item.image}
                                alt={item.name}
                                className="cart-item-image"
                            />
                            <div className="cart-item-details">
                                <h5 className="cart-item-title">{item.name}</h5>
                                <p className="cart-item-price">Price: Rs {item.price}</p>
                                <p className="cart-item-quantity">Quantity: {item.quantity}</p>
                                <div className="cart-item-controls">
                                    <button
                                        className="cart-btn cart-btn-increase"
                                        onClick={() => handleIncrease(item._id)}
                                    >
                                        +
                                    </button>
                                    <button
                                        className="cart-btn cart-btn-decrease"
                                        onClick={() => handleDecrease(item._id)}
                                    >
                                        -
                                    </button>
                                    <button
                                        className="cart-btn cart-btn-remove"
                                        onClick={() => handleRemove(item._id)}
                                    >
                                        Remove
                                    </button>
                                </div>
                            </div>
                            <p className="cart-item-subtotal">
                                Subtotal: Rs {item.price * item.quantity}
                            </p>
                        </div>
                    ))}
                    <hr className="cart-divider" />
                    <div className="d-flex align-items-center justify-content-between">
                        <h4 className="cart-total fs-4">Total: Rs {totalPrice}</h4>
                        <img className="m-auto d-block" width="40%" src={savifylogo} alt="Logo" />
                        <button
                            className="btn btn-success p-2 ptco"
                            onClick={() => navigate("/checkout")} // ✅ Redirect to Checkout Page
                        >
                            Proceed to Checkout
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Cart;
