import React, { useState, useEffect } from 'react';
import './CryptoPrices.css'; // Add the CSS file for styling

const CryptoPrices = () => {
  const [prices, setPrices] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum&vs_currencies=usd')
      .then((response) => response.json())
      .then((data) => {
        setPrices(data);
        setLoading(false);
      })
      .catch((error) => console.error('Error fetching data:', error));
  }, []);

  return (
    <div className="crypto-prices">
      <h2>Current Crypto Prices</h2>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="crypto-prices-list">
          <div className="crypto-card">
            <h3>Bitcoin</h3>
            <p>${prices.bitcoin?.usd}</p>
          </div>
          <div className="crypto-card">
            <h3>Ethereum</h3>
            <p>${prices.ethereum?.usd}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default CryptoPrices;
