import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Cart.css';
import savifylogo from './Savify logo.png';
import { toast } from 'react-toastify';
import axios from "axios";


function Cart({ cart, setCart }) {
    const navigate = useNavigate(); // ✅ Use navigate hook for redirection
    const [showCartBargainModal, setShowCartBargainModal] = useState(false);
    const [cartRound, setCartRound] = useState(1);
    const [userCartOffer, setUserCartOffer] = useState('');
    const [cartAiOffer, setCartAiOffer] = useState(0);
    const [cartAccepted, setCartAccepted] = useState(false);
    const [cartOver, setCartOver] = useState(false);
    const [avgRounds, setAvgRounds] = useState(1);
    const [sellerCartItems, setSellerCartItems] = useState([]);
    const [sellerCartTotal, setSellerCartTotal] = useState(0);
    const [avgDiscountPercent, setAvgDiscountPercent] = useState(10);
    const [selectedSellerId, setSelectedSellerId] = useState("");
    const [voucherTimers, setVoucherTimers] = useState({});
    const [chatMessages, setChatMessages] = useState([]);
    const [isTyping, setIsTyping] = useState(false);


    // Update countdown timers every second
    useEffect(() => {
      const interval = setInterval(() => {
        const vouchers = JSON.parse(localStorage.getItem("cartVouchers") || "{}");
        const now = Date.now();
    
        const updatedTimers = {};
    
        for (const [sellerId, voucher] of Object.entries(vouchers)) {
          const remaining = voucher.expiry - now;
    
          if (remaining > 0) {
            const totalSeconds = Math.floor(remaining / 1000);
            const hours = String(Math.floor(totalSeconds / 3600)).padStart(2, '0');
            const minutes = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, '0');
            const seconds = String(totalSeconds % 60).padStart(2, '0');
            updatedTimers[sellerId] = `${hours}:${minutes}:${seconds}`;
          } else {
            // Voucher expired
            delete vouchers[sellerId];
            localStorage.setItem("cartVouchers", JSON.stringify(vouchers));
            setValidCartVoucher({ ...vouchers });
            toast.warning(`⏰ Voucher expired for seller: ${sellerId}`);
          }
        }
    
        setVoucherTimers(updatedTimers);
      }, 1000);
    
      return () => clearInterval(interval);
    }, []);
    
    // 🟢 Add this block here
    const [validCartVoucher, setValidCartVoucher] = useState(null);
    const validateVoucherOnChange = (updatedCart, sellerIdToCheck) => {
      const cartVouchers = JSON.parse(localStorage.getItem("cartVouchers") || "{}");
    
      if (!cartVouchers[sellerIdToCheck]) return;
    
      const stillValid = updatedCart.some(
        (item) => (item?.seller?._id || item?.sellerId) === sellerIdToCheck
      );
    
      if (!stillValid) return;
    
      delete cartVouchers[sellerIdToCheck];
      localStorage.setItem("cartVouchers", JSON.stringify(cartVouchers));
      setValidCartVoucher(cartVouchers);
      toast.warning("⚠️ Voucher removed due to quantity change.");
    };
    
    
    useEffect(() => {
      const stored = localStorage.getItem("cartVouchers");
      if (stored) {
        const parsed = JSON.parse(stored);
        const now = Date.now();
    
        // Filter out expired or invalid vouchers
        const updated = Object.fromEntries(
          Object.entries(parsed).filter(([sellerId, v]) => {
            const stillExists = cart.some(
              item => (item?.seller?._id || item?.sellerId) === sellerId
            );
            return v.expiry > now && stillExists;
          })
        );
    
        setValidCartVoucher(updated);
        localStorage.setItem("cartVouchers", JSON.stringify(updated)); // Refresh storage
      } else {
        setValidCartVoucher(null);
      }
    }, [cart]);
    
    // 🔁 re-run if cart changes (e.g., new seller added)
    


    
    // Group items by sellerId
const sellerGroups = cart.reduce((acc, item) => {
    const sellerId = item?.seller?._id || item?.sellerId || "UNKNOWN_SELLER";
    if (!acc[sellerId]) acc[sellerId] = [];
    acc[sellerId].push(item);
    return acc;
  }, {});
  
  const sellerIds = Object.keys(sellerGroups);
  const canBargain = selectedSellerId && sellerGroups[selectedSellerId]?.length > 0;
// Auto-select seller if only one exists
useEffect(() => {
  if (sellerIds.length === 1) {
    setSelectedSellerId(sellerIds[0]);
  }
}, [cart]);

  
    // Handle increase quantity
    const handleIncrease = (_id) => {
      setCart((prevCart) => {
        const updatedCart = prevCart.map((item) =>
          item._id === _id ? { ...item, quantity: item.quantity + 1 } : item
        );
        localStorage.setItem("cart", JSON.stringify(updatedCart));
        
        const changedItem = prevCart.find(item => item._id === _id);
        const sellerId = changedItem?.seller?._id || changedItem?.sellerId;
        validateVoucherOnChange(updatedCart, sellerId);
    
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
        localStorage.setItem("cart", JSON.stringify(updatedCart));
    
        const changedItem = prevCart.find(item => item._id === _id);
        const sellerId = changedItem?.seller?._id || changedItem?.sellerId;
        validateVoucherOnChange(updatedCart, sellerId);
    
        return updatedCart;
      });
    };
    

    

    const handleRemove = (_id) => {
      setCart((prevCart) => {
        const removedItem = prevCart.find((item) => item._id === _id);
        if (!removedItem) return prevCart;
    
        const updatedCart = prevCart.filter((item) => item._id !== _id);
        localStorage.setItem("cart", JSON.stringify(updatedCart));
    
        const removedSellerId = (removedItem?.seller?._id || removedItem?.sellerId || "").toString().trim();
    
        // 🔥 Remove the seller's voucher immediately (even if other items still exist)
        const vouchers = JSON.parse(localStorage.getItem("cartVouchers") || "{}");
    
        if (vouchers[removedSellerId]) {
          delete vouchers[removedSellerId];
          localStorage.setItem("cartVouchers", JSON.stringify(vouchers));
          setValidCartVoucher({ ...vouchers }); // ✅ force state refresh
          toast.warning("⚠️ Voucher removed due to product removal from that seller.");
        }
    
        toast.error(`🗑️ ${removedItem.name} removed from cart`);
        return updatedCart;
      });
    };
    
    
    
    
    

    // Calculate total price
    const totalPrice = cart.reduce(
        (total, item) => total + item.price * item.quantity,
        0
    );
    const handleBargainOnCart = () => {
        if (!selectedSellerId || !sellerGroups[selectedSellerId]) {
          toast.error("Please select a seller to bargain.");
          return;
        }
      
        const items = sellerGroups[selectedSellerId];
        const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
      
        const rounds = items.map(item => item.bargainRounds || 1);
        const avg = Math.round(rounds.reduce((a, b) => a + b, 0) / rounds.length);
        setAvgRounds(avg);
      
        const discounts = items.map(item => item.maxDiscountPercent || 10);
        const avgDiscount = Math.round(discounts.reduce((a, b) => a + b, 0) / discounts.length);
        setAvgDiscountPercent(avgDiscount);
      
        setSellerCartItems(items);
        setSellerCartTotal(total);
        setCartAiOffer(total);
        setCartRound(1);
        setUserCartOffer('');
        setCartAccepted(false);
        setCartOver(false);
        setChatMessages([
          {
            sender: 'ai',
            text: `🛒 Total price of seller's items is Rs. ${total}. Let's begin bargaining!`,
          },
        ]);
        setShowCartBargainModal(true);
      };
      

      const handleSendOffer = async () => {
        if (!userCartOffer || isNaN(userCartOffer)) return alert("Enter a valid number");
      
        const offer = Number(userCartOffer);
        setChatMessages((prev) => [...prev, { sender: 'user', text: `My offer: Rs. ${offer}` }]);
        setUserCartOffer('');
        setIsTyping(true);
      
        setTimeout(async () => {
          const userId = localStorage.getItem("userId");
          const avgRating = sellerCartItems.reduce((sum, item) => sum + (parseFloat(item.rating) || 4.5), 0) / sellerCartItems.length;
          const totalOrders = parseInt(localStorage.getItem("totalOrders") || "1");
          const accountAgeDays = 30;
          const maxDiscount = avgDiscountPercent;
      
          try {
            const response = await axios.post("http://localhost:5000/api/negotiate", {
              userId,
              productId: sellerCartItems[0]._id,
              max_discount: maxDiscount,
              account_age_days: accountAgeDays,
              total_orders: totalOrders,
              product_rating: avgRating.toFixed(2),
            });
      
            const discount = response.data.discount;
            const predictedFinalOffer = sellerCartTotal - (sellerCartTotal * discount / 100);
            const nextRound = cartRound + 1;
      
            setIsTyping(false);
      
            if (cartRound >= avgRounds) {
              // Keep responding with same final offer
              setCartAiOffer(predictedFinalOffer);
              setChatMessages((prev) => [
                ...prev,
                { sender: 'ai', text: `🤖 My final offer remains Rs. ${predictedFinalOffer.toFixed(0)}` },
              ]);
              setCartOver(false); // Prevent bargain failed message
            } else {
              // Play next round with scaled offer
              const scaledOffer = sellerCartTotal - (sellerCartTotal * discount * cartRound / avgRounds) / 100;
              setCartAiOffer(scaledOffer);
              setChatMessages((prev) => [
                ...prev,
                { sender: 'ai', text: `🤖 My counter offer is Rs. ${scaledOffer.toFixed(0)}` },
              ]);
              setCartRound(nextRound);
            }
          } catch (err) {
            setIsTyping(false);
            setChatMessages((prev) => [
              ...prev,
              { sender: 'ai', text: `❌ Error: Failed to get AI response.` },
            ]);
          }
        }, 1500);
      };
      
      
    return (
        <div className="cart-page">
            <h2 className="cart-title">Your Cart</h2>
            {cart.length === 0 ? (
                <p className="cart-empty">Your cart is empty!</p>
            ) : (
                <div className="cart-items">
            {Object.entries(sellerGroups).map(([sellerId, items]) => (
  <div key={sellerId} className="seller-section border p-3 mb-4 rounded">
    <h5 className="mb-3">Store: {items[0]?.seller?.storeName || "Unknown Store"}</h5>

    {items.map((item) => (
      <div key={item._id} className="cart-item">
        <img src={item.image} alt={item.name} className="cart-item-image" />
        <div className="cart-item-details">
          <h6 className="cart-item-title">Name: {item.name}</h6>
          <p className="cart-item-price">Price: Rs {item.price}</p>
          <p className="cart-item-quantity">Quantity: {item.quantity}</p>
          <div className="cart-item-controls">
            <button className="cart-btn cart-btn-increase" onClick={() => handleIncrease(item._id)}>+</button>
            <button className="cart-btn cart-btn-decrease" onClick={() => handleDecrease(item._id)}>-</button>
            <button className="cart-btn cart-btn-remove" onClick={() => handleRemove(item._id)}>Remove</button>
          </div>
        </div>
        <p className="cart-item-subtotal">Subtotal: Rs {item.price * item.quantity}</p>
      </div>
    ))}

    {/* 💰 Show Totals + Bargain Button */}
    <div className="mt-3">
    {validCartVoucher?.[sellerId] ? (
  <div className="text-success mb-2">
    <strong>🎉 Bargain Accepted:</strong><br />
    Discount: {validCartVoucher[sellerId].discountPercent}%<br />
    Discounted Total: Rs {Number(validCartVoucher[sellerId].discountedTotal).toFixed(0)}<br />
    ⏳ <strong>Time Left:</strong> {voucherTimers[sellerId] || "00:00:00"}
  </div>

) : (
  <div className="mb-2">
    <strong>Total:</strong> Rs {items.reduce((sum, item) => sum + item.price * item.quantity, 0)}
  </div>
)}


      {/* 🎯 Bargain Button (only if voucher not applied) */}
      {!(validCartVoucher && validCartVoucher[sellerId]) && (

        <div className="d-flex align-items-center mb-3 gap-2">
          <input
            className="form-check-input"
            type="radio"
            name="selectedSeller"
            value={sellerId}
            onChange={() => setSelectedSellerId(sellerId)}
            checked={selectedSellerId === sellerId}
          />
          <label className="form-check-label me-3">Select for Bargaining</label>
          {selectedSellerId === sellerId && (
            <button className="btn btn-dark btn-sm" onClick={handleBargainOnCart}>
              Start Bargain
            </button>
          )}
        </div>
      )}

      {/* ✅ Proceed to Checkout always available */}
      <button
  className="btn btn-success mt-2"
  onClick={() => {
    const cartVouchers = JSON.parse(localStorage.getItem("cartVouchers")) || {};
    const sellerItems = sellerGroups[sellerId]; // Only that seller's products

    const checkoutItems = sellerItems.map(item => ({
      ...item,
      image: item.image,
      seller: item.seller,
      sellerId: item?.seller?._id || item?.sellerId || "UNKNOWN_SELLER",
    }));

    const sellerVoucher = cartVouchers[sellerId] || null;

    navigate('/checkout', {
      state: {
        items: checkoutItems,
        voucher: sellerVoucher,
      },
    });
  }}
>
  Proceed to Checkout
</button>



    </div>
  </div>
))}


                    <hr className="cart-divider" />
                    <img className="m-auto d-block" width="40%" src={savifylogo} alt="Logo" />
                </div>
            )}
            {showCartBargainModal && (
  <div className="modal show fade d-block" tabIndex="-1">
    <div className="modal-dialog modal-dialog-centered">
      <div className="modal-content">
        <div className="modal-header">
          <h5 className="modal-title">Bargain Round {cartRound} of {avgRounds}</h5>
          <button type="button" className="btn-close" onClick={() => setShowCartBargainModal(false)}></button>
        </div>
        <div className="modal-body">
        {true ? (

    <>
      <div className="chat-box d-flex flex-column">
        {chatMessages.map((msg, idx) => (
          <div
            key={idx}
            className={`chat-bubble ${msg.sender === 'user' ? 'user-msg' : 'ai-msg'}`}
          >
            {msg.text}
          </div>
        ))}
        {isTyping && <div className="typing-indicator">🤖 Typing...</div>}
      </div>

      <div className="d-flex gap-2 mt-2">
        <input
          type="number"
          className="form-control"
          value={userCartOffer}
          onChange={(e) => setUserCartOffer(e.target.value)}
          placeholder="Enter your offer"
          disabled={isTyping}
        />
        <button
          className="btn btn-primary"
          onClick={handleSendOffer}
          disabled={isTyping}
        >
          Send
        </button>
        <button
  className="btn btn-success"
  onClick={() => {
    const finalDiscount = ((sellerCartTotal - cartAiOffer) / sellerCartTotal) * 100;
    const expiryTime = Date.now() + 24 * 60 * 60 * 1000;

    const discountedTotal = Number(cartAiOffer);
    const discountPercent = finalDiscount.toFixed(2);

    const existingVouchers = JSON.parse(localStorage.getItem("cartVouchers")) || {};
    const updatedVouchers = {
      ...existingVouchers,
      [selectedSellerId]: {
        discountedTotal,
        discountPercent,
        expiry: expiryTime,
        sellerId: selectedSellerId,
      },
    };

    localStorage.setItem("cartVouchers", JSON.stringify(updatedVouchers));
    setValidCartVoucher(updatedVouchers);

    toast.success(`🎉 Offer Accepted! Final price: Rs. ${discountedTotal.toFixed(0)}`);
    setCartAccepted(true);
    setCartOver(true);
    setShowCartBargainModal(false);
  }}
  disabled={isTyping || !cartAiOffer}
>
  Accept
</button>

      </div>
    </>
  ) : (
    <div className="text-center">
      {cartAccepted ? (
        <>
          <h5>✅ Bargain Accepted!</h5>
          <p>You got a discount. Final Price: Rs. {cartAiOffer}</p>
          <p className="text-muted">You can now proceed to checkout from the cart.</p>
        </>
      ) : (
        <>
          <h5>❌ Bargain Failed</h5>
          <p>No agreement reached.</p>
        </>
      )}
    </div>
  )}
</div>


      </div>
    </div>
  </div>
)}

        </div>
    );
}

export default Cart;
