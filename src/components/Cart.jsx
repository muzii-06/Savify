import React from 'react';
import './Cart.css';

function Cart({ cart, setCart }) {
    // Handle increase quantity
    const handleIncrease = (id) => {
        setCart((prevCart) =>
            prevCart.map((item) =>
                item.id === id ? { ...item, quantity: item.quantity + 1 } : item
            )
        );
    };

    // Handle decrease quantity
    const handleDecrease = (id) => {
        setCart((prevCart) =>
            prevCart.map((item) =>
                item.id === id && item.quantity > 1
                    ? { ...item, quantity: item.quantity - 1 }
                    : item
            )
        );
    };

    // Handle remove item from cart
    const handleRemove = (id) => {
        setCart((prevCart) => prevCart.filter((item) => item.id !== id));
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
                        <div key={item.id} className="cart-item">
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
                                        onClick={() => handleIncrease(item.id)}
                                    >
                                        +
                                    </button>
                                    <button
                                        className="cart-btn cart-btn-decrease"
                                        onClick={() => handleDecrease(item.id)}
                                    >
                                        -
                                    </button>
                                    <button
                                        className="cart-btn cart-btn-remove"
                                        onClick={() => handleRemove(item.id)}
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
                    <h4 className="cart-total">Total: Rs {totalPrice}</h4>
                    <button className="btn btn-danger p-2">Proceed to Checkout</button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Cart;
