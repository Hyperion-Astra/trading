import React from "react";
import "./CryptoCard.css";

function CryptoCard({ name, price, discounted, onExchange }) {
  return (
    <div className="crypto-card">
      <h2>{name}</h2>
      {price ? (
        <>
          <p>Market Price: ${price}</p>
          <p className="discount">Your Price: ${discounted}</p>
          <button className="exchange-btn" onClick={onExchange}>
            Exchange Now
          </button>
        </>
      ) : (
        <p>Loading price...</p>
      )}
    </div>
  );
}

export default CryptoCard;
