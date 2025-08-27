// src/components/Modal.js
import React, { useState } from "react";
import "./Modal.css";

export default function Modal({ show, onClose, crypto, onConfirm }) {
  const [usdAmount, setUsdAmount] = useState("");
  const [selectedCrypto, setSelectedCrypto] = useState(
    crypto?.name || "BTC"
  );

  if (!show) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!usdAmount || !selectedCrypto) return;

    onConfirm(Number(usdAmount), selectedCrypto);
    setUsdAmount("");
    setSelectedCrypto("BTC");
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>
          &times;
        </button>

        <h2>Exchange {selectedCrypto}</h2>

        <form onSubmit={handleSubmit}>
          <label>
            Select Crypto:
            <select
              value={selectedCrypto}
              onChange={(e) => setSelectedCrypto(e.target.value)}
            >
              <option value="BTC">Bitcoin (BTC)</option>
              <option value="ETH">Ethereum (ETH)</option>
              <option value="USDT">Tether (USDT)</option>
              <option value="SOL">Solana (SOL)</option>
              <option value="BNB">BNB (BNB)</option>
            </select>
          </label>

          <label>
            USD Amount:
            <input
              type="number"
              value={usdAmount}
              onChange={(e) => setUsdAmount(e.target.value)}
              placeholder="Enter USD amount"
              required
            />
          </label>

          <div className="payment-info">
            <p>
              Send your payment to the wallet address below to complete your
              exchange:
            </p>
            <p className="wallet">1A2b3C4d5E6F7g8H9i0J</p>
          </div>

          <button type="submit" className="confirm-btn">
            Confirm Exchange
          </button>
        </form>
      </div>
    </div>
  );
}
