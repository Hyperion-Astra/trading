import React, { useState } from 'react';
import './PricingCalculator.css'; // Add the CSS file for styling

const PricingCalculator = () => {
  const [amount, setAmount] = useState(0);
  const [price, setPrice] = useState(0);

  const calculatePrice = (amount) => {
    const rate = 0.5; // Example rate for converting gift card amount to crypto/cash
    setPrice(amount * rate);
  };

  return (
    <div className="pricing-calculator">
      <h2>Gift Card to Crypto Calculator</h2>
      <label htmlFor="amount">Enter Gift Card Amount ($):</label>
      <input
        type="number"
        id="amount"
        value={amount}
        onChange={(e) => {
          setAmount(e.target.value);
          calculatePrice(e.target.value);
        }}
      />
      <div className="result">
        <h3>Estimated Price</h3>
        <p>${price.toFixed(2)}</p>
      </div>
    </div>
  );
};

export default PricingCalculator;
