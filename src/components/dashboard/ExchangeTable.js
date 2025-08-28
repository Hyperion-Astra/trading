// src/components/dashboard/ExchangeTable.js
import React, { useState, useEffect } from "react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db, auth } from "../../firebase";
import "./ExchangeTable.css";

export default function ExchangeTable({ cryptos, balances = {} }) {
  const [fromCrypto, setFromCrypto] = useState(cryptos[0] || null);
  const [toCrypto, setToCrypto] = useState(cryptos[1] || cryptos[0]);
  const [fromAmount, setFromAmount] = useState(1);
  const [toAmount, setToAmount] = useState(0);
  const [error, setError] = useState("");

  // Calculate toAmount and check balance
  useEffect(() => {
    if (!fromCrypto || !toCrypto) return;

    const fromPrice = fromCrypto.symbol === "USDT" ? fromCrypto.price : fromCrypto.price - 15;
    const usdAmount = fromPrice * fromAmount;
    setToAmount(usdAmount / toCrypto.price);

    if (balances[fromCrypto.symbol] < fromAmount) {
      setError(`Insufficient ${fromCrypto.symbol} balance!`);
    } else {
      setError("");
    }
  }, [fromAmount, fromCrypto, toCrypto, balances]);

  const handleCryptoChange = (type, symbol) => {
    const crypto = cryptos.find(c => c.symbol === symbol);
    if (type === "from") setFromCrypto(crypto);
    else setToCrypto(crypto);
  };

  const swapCryptos = () => {
    setFromCrypto(toCrypto);
    setToCrypto(fromCrypto);
    setFromAmount(toAmount);
  };

  const handleConfirm = async (e) => {
    e.preventDefault();
    if (!auth.currentUser) {
      alert("You must be logged in to perform an exchange.");
      return;
    }
    if (error) return;

    try {
      await addDoc(collection(db, "exchanges"), {
        crypto: fromCrypto.name,
        symbol: fromCrypto.symbol,
        amount: (fromCrypto.symbol === "USDT" ? fromCrypto.price : fromCrypto.price - 15) * fromAmount,
        userId: auth.currentUser.uid,
        createdAt: serverTimestamp(),
      });

      alert("Exchange submitted!");
      setFromAmount(1);
    } catch (err) {
      console.error("Error saving exchange:", err);
      alert("Failed to save exchange. Please try again.");
    }
  };

  if (!cryptos || cryptos.length === 0) return <p>Loading cryptos...</p>;

  return (
    <div className="exchange-table-card">
      <h2>Exchange Crypto</h2>

      <form onSubmit={handleConfirm}>
        {/* --- FROM --- */}
        <label>
          From:
          <select value={fromCrypto.symbol} onChange={(e) => handleCryptoChange("from", e.target.value)}>
            {cryptos.map(c => (
              <option key={c.symbol} value={c.symbol}>{c.name} ({c.symbol})</option>
            ))}
          </select>
        </label>
        <input
          type="number"
          value={fromAmount}
          min="1"
          step="any"
          onChange={(e) => setFromAmount(Number(e.target.value))}
        />

        {/* --- SWAP BUTTON --- */}
        <button type="button" className="swap-btn" onClick={swapCryptos} style={{color: "#3b82f6"}}>⇅</button>

        {/* --- TO --- */}
        <label>
          To:
          <select value={toCrypto.symbol} onChange={(e) => handleCryptoChange("to", e.target.value)}>
            {cryptos.map(c => (
              <option key={c.symbol} value={c.symbol}>{c.name} ({c.symbol})</option>
            ))}
          </select>
        </label>
        <input type="number" value={toAmount.toFixed(6)} readOnly />

        {error && <p style={{ color: "red" }}>{error}</p>}

        <button type="submit" className="confirm-btn" disabled={!!error}>Confirm Exchange</button>
      </form>
    </div>
  );
}
