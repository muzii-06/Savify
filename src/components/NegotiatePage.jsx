import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';

const NegotiatePage = () => {
  const location = useLocation();
  const { product } = location.state;

  const [offer, setOffer] = useState(product.price);
  const [round, setRound] = useState(1);
  const [response, setResponse] = useState(null);

  const handleOfferChange = (e) => setOffer(Number(e.target.value));

  const handleNegotiation = () => {
    // Basic negotiation logic (you can replace with your AI model)
    if (round <= product.bargainRounds) {
      const discount = (product.maxDiscountPercent / product.bargainRounds) * round;
      const newPrice = product.price - (product.price * (discount / 100));
      setResponse(`Seller's counter offer: Rs. ${newPrice.toFixed(2)} (Round ${round})`);
      setRound(round + 1); // Increment round
    } else {
      setResponse('Negotiation closed. Deal accepted!');
    }
  };

  return (
    <div className="container">
      <h2>Start Bargain for {product.name}</h2>
      <p>Price: Rs. {product.price}</p>
      <p>Maximum Discount: {product.maxDiscountPercent}%</p>
      <p>Negotiation Rounds: {product.bargainRounds}</p>

      <div>
        <h4>Offer: Rs. {offer}</h4>
        <input
          type="number"
          value={offer}
          onChange={handleOfferChange}
          min={product.price * 0.1}
        />
        <button onClick={handleNegotiation}>Submit Offer (Round {round})</button>
      </div>

      {response && <p>{response}</p>}
    </div>
  );
};

export default NegotiatePage;
