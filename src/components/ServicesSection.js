// src/components/Services.js
import React, { useState, useEffect } from "react";
import "./ServicesSection.css";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";
import Modal from "./Modal";

export default function Services() {
  const [crypto, setCrypto] = useState("BTC");
  const [amount, setAmount] = useState("");
  const [result, setResult] = useState(null);
  const [prices, setPrices] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch live prices from CoinGecko
  useEffect(() => {
    const fetchPrices = async () => {
      try {
        const res = await fetch(
          "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,tether,solana,binancecoin&vs_currencies=usd"
        );
        if (!res.ok) throw new Error("Network response was not ok");
        const data = await res.json();

        // Store prices with $15 discount (except USDT)
        const updated = {
          BTC: data.bitcoin.usd - 15,
          ETH: data.ethereum.usd - 15,
          USDT: data.tether.usd, // no discount
          SOL: data.solana.usd - 15,
          BNB: data.binancecoin.usd - 15,
        };

        setPrices(updated);
      } catch (err) {
        console.error("Failed to fetch prices:", err);
        setError("Unable to fetch live prices. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchPrices();
  }, []);

  const handleExchange = (e) => {
    e.preventDefault();
    if (!amount || !prices[crypto]) return;

    const rate = prices[crypto];
    setResult((amount / rate).toFixed(6));
  };

  return (
    <section className="exchange">
      <h2>Exchange Crypto</h2>

      {loading ? (
        <p className="loading">Fetching live prices...</p>
      ) : error ? (
        <p className="error">{error}</p>
      ) : (
        <>
          <form onSubmit={handleExchange}>
            <select value={crypto} onChange={(e) => setCrypto(e.target.value)}>
              <option value="BTC">Bitcoin (BTC)</option>
              <option value="ETH">Ethereum (ETH)</option>
              <option value="USDT">Tether (USDT)</option>
              <option value="SOL">Solana (SOL)</option>
              <option value="BNB">BNB (BNB)</option>
            </select>

            <input
              type="number"
              placeholder="Enter USD amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />

            <button type="submit">Exchange</button>
          </form>

          {result && (
            <p>
              You will receive: <strong>{result} {crypto}</strong>
            </p>
          )}
        </>
      )}
    </section>
  );
}
