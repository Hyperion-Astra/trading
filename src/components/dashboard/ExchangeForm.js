// src/components/dashboard/ExchangeForm.js
import React, { useState, useEffect } from "react";
import { db, auth } from "../../firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";

function ExchangeForm() {
  const [user] = useAuthState(auth);
  const [crypto, setCrypto] = useState("BTC");
  const [amountUSD, setAmountUSD] = useState("");
  const [prices, setPrices] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);
  const [walletAddress, setWalletAddress] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  // ✅ Fetch live prices from CoinGecko
  useEffect(() => {
    const fetchPrices = async () => {
      try {
        const res = await fetch(
          "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,tether,solana,binancecoin&vs_currencies=usd"
        );
        if (!res.ok) throw new Error("Network response was not ok");
        const data = await res.json();

        // Apply $15 discount (except USDT)
        const updated = {
          BTC: data.bitcoin.usd - 15,
          ETH: data.ethereum.usd - 15,
          USDT: data.tether.usd,
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

  // ✅ Calculate estimated crypto
  const handleCalculate = (e) => {
    e.preventDefault();
    if (!amountUSD || !prices[crypto]) return;
    const rate = prices[crypto];
    setResult((amountUSD / rate).toFixed(6));
  };

  // ✅ Submit exchange request to Firestore
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return setMessage("⚠️ You must be logged in.");
    if (!walletAddress) return setMessage("Please provide a wallet address.");
    if (!amountUSD || !prices[crypto]) return setMessage("Enter a valid amount.");

    setSubmitting(true);
    try {
      await addDoc(collection(db, "exchanges"), {
        userId: user.uid,
        email: user.email,
        crypto,
        usdAmount: amountUSD,
        walletAddress,
        estimatedCrypto: result,
        rateUsed: prices[crypto], // ✅ store the live rate at submission
        status: "pending",
        createdAt: serverTimestamp(),
      });

      setMessage("Exchange request submitted ✅");
      setAmountUSD("");
      setWalletAddress("");
      setResult(null);
    } catch (err) {
      console.error("Error submitting exchange:", err);
      setMessage("Failed to submit request ❌");
    }
    setSubmitting(false);
  };

  return (
    <div className="card">
      <h3>Exchange Crypto</h3>

      {loading ? (
        <p className="text-muted">Fetching live prices...</p>
      ) : error ? (
        <p className="text-error">{error}</p>
      ) : (
        <>
          {message && (
            <p className="text-muted" style={{ textAlign: "center" }}>
              {message}
            </p>
          )}

          {/* Step 1: Calculator */}
          <form onSubmit={handleCalculate}>
            <div className="form-group">
              <label>Select Cryptocurrency</label>
              <select value={crypto} onChange={(e) => setCrypto(e.target.value)}>
                <option value="BTC">Bitcoin (BTC)</option>
                <option value="ETH">Ethereum (ETH)</option>
                <option value="USDT">Tether (USDT)</option>
                <option value="SOL">Solana (SOL)</option>
                <option value="BNB">BNB (BNB)</option>
              </select>
            </div>

            <div className="form-group">
              <label>Amount in USD</label>
              <input
                type="number"
                placeholder="Enter USD amount"
                value={amountUSD}
                onChange={(e) => setAmountUSD(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: "100%" }}>
              Calculate
            </button>
          </form>

          {/* Step 2: Show estimate + wallet + submit */}
          {result && (
            <form onSubmit={handleSubmit} style={{ marginTop: "15px" }}>
              <p className="text-center">
                You will receive:{" "}
                <strong>
                  {result} {crypto}
                </strong>
              </p>

              <div className="form-group">
                <label>Wallet Address</label>
                <input
                  type="text"
                  placeholder={`Enter your ${crypto} wallet address`}
                  value={walletAddress}
                  onChange={(e) => setWalletAddress(e.target.value)}
                  required
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="btn btn-success"
                style={{ width: "100%" }}
              >
                {submitting ? "Submitting..." : "Submit Exchange"}
              </button>
            </form>
          )}
        </>
      )}
    </div>
  );
}

export default ExchangeForm;
