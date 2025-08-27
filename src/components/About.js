import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // <-- import this
import "./About.css";

export default function About() {
  const navigate = useNavigate(); // <-- create navigate instance
  const [prices, setPrices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPrices = async () => {
      try {
        const res = await fetch(
          "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,tether,solana,binancecoin&vs_currencies=usd"
        );
        if (!res.ok) throw new Error("Network response was not ok");
        const data = await res.json();

        const updated = [
          { id: "bitcoin", name: "Bitcoin (BTC)", price: data.bitcoin.usd - 15 },
          { id: "ethereum", name: "Ethereum (ETH)", price: data.ethereum.usd - 15 },
          { id: "tether", name: "Tether (USDT)", price: data.tether.usd },
          { id: "solana", name: "Solana (SOL)", price: data.solana.usd - 15 },
          { id: "binancecoin", name: "BNB (Binance Coin)", price: data.binancecoin.usd - 15 },
        ];

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

  return (
    <section className="market">
      <div id="prices">
        <h2>Market Prices </h2>

        {loading ? (
          <p className="loading">Fetching live prices...</p>
        ) : error ? (
          <p className="error">{error}</p>
        ) : (
          <table className="market-table">
            <thead>
              <tr>
                <th>Crypto</th>
                <th>Price (USD)</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {prices.map((p, i) => (
                <tr
                  key={i}
                  className="fade-in"
                  style={{ animationDelay: `${i * 0.2}s` }}
                >
                  <td className="crypto-name">{p.name}</td>
                  <td>${p.price.toLocaleString()}</td>
                  <td>
                    <button
                      className="exchange-btn"
                      onClick={() => navigate("/register")} // <-- navigate here
                    >
                      Exchange
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </section>
  );
}
