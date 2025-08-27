import React, { useState, useEffect } from "react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db, auth } from "../../firebase";
import "./ExchangeTable.css";

// Define networks and USDT wallets
const NETWORKS = {
  SOL: ["SOL COIN"],
  SOLANA: ["SOL COIN"],
  USDT: ["TRC20", "BEP20", "ERC20"],
};

const USDT_WALLETS = {
  TRC20: "TQYPwybdLCkrtgWhUXGxUd6sxXvUdjHS1E",
  BEP20: "0x16360c13De54D990EC9C3e74D524cEbd3b5697DC",
  ERC20: "0x16360c13De54D990EC9C3e74D524cEbd3b5697DC",
};

export default function ExchangeTable({ cryptos }) {
  // From/To state
  const [fromCrypto, setFromCrypto] = useState(cryptos[0] || null);
  const [toCrypto, setToCrypto] = useState(cryptos[1] || cryptos[0]);
  const [fromAmount, setFromAmount] = useState(1);
  const [toAmount, setToAmount] = useState(0);

  const [network, setNetwork] = useState(
    fromCrypto ? (NETWORKS[fromCrypto.symbol?.toUpperCase()] || [])[0] : ""
  );
  const [walletAddress, setWalletAddress] = useState(fromCrypto?.wallet || "");

  // Update wallet & network when fromCrypto changes
  useEffect(() => {
    if (!fromCrypto) return;

    const availableNetworks = NETWORKS[fromCrypto.symbol?.toUpperCase()] || [];
    setNetwork(prev => availableNetworks.includes(prev) ? prev : availableNetworks[0] || "");

    if (fromCrypto.symbol === "USDT") {
      setWalletAddress(USDT_WALLETS[network] || "");
    } else {
      setWalletAddress(fromCrypto.wallet || "");
    }

    setFromAmount(1);
  }, [fromCrypto, network]);

  // Calculate toAmount whenever fromAmount or crypto changes
  useEffect(() => {
    if (!fromCrypto || !toCrypto) return;

    // Apply $15 discount to fromCrypto if not USDT
    const fromPrice = fromCrypto.symbol === "USDT" ? fromCrypto.price : fromCrypto.price - 15;
    const usdAmount = fromPrice * fromAmount;
    setToAmount(usdAmount / toCrypto.price);
  }, [fromAmount, fromCrypto, toCrypto]);

  const handleCryptoChange = (type, symbol) => {
    const crypto = cryptos.find(c => c.symbol === symbol);
    if (type === "from") setFromCrypto(crypto);
    else setToCrypto(crypto);
  };

  const handleNetworkChange = (e) => setNetwork(e.target.value);

  const swapCryptos = () => {
    setFromCrypto(toCrypto);
    setToCrypto(fromCrypto);
    setFromAmount(toAmount);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert("Copied to clipboard!");
  };

  const handleConfirm = async (e) => {
    e.preventDefault();
    if (!auth.currentUser) {
      alert("You must be logged in to perform an exchange.");
      return;
    }

    try {
      await addDoc(collection(db, "exchanges"), {
        crypto: fromCrypto.name,
        symbol: fromCrypto.symbol,
        amount: (fromCrypto.symbol === "USDT" ? fromCrypto.price : fromCrypto.price - 15) * fromAmount,
        wallet: walletAddress,
        network,
        userId: auth.currentUser.uid,
        createdAt: serverTimestamp(),
      });

      alert("Exchange submitted!");
    } catch (err) {
      console.error("Error saving exchange:", err);
      alert("Failed to save exchange. Please try again.");
    }
  };

  if (!cryptos || cryptos.length === 0) return <p>Loading cryptos...</p>;

  const availableNetworks = NETWORKS[fromCrypto.symbol?.toUpperCase()] || [];
  const showNetworkDropdown = availableNetworks.length > 1;

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

        {showNetworkDropdown && (
          <label>
            Network:
            <select value={network} onChange={handleNetworkChange}>
              {availableNetworks.map(net => (
                <option key={net} value={net}>{net}</option>
              ))}
            </select>
          </label>
        )}

        <div className="payment-info">
          <div className="address-row">
            <span className="wallet">{walletAddress}</span>
            <button type="button" className="copy-btn" onClick={() => copyToClipboard(walletAddress)}>Copy</button>
          </div>

          <div className="barcode-container">
            <img
              src={`/barcodes/${fromCrypto.symbol.toUpperCase()}${fromCrypto.symbol === "USDT" ? `_${network}` : ""}.png`}
              alt={`${fromCrypto.name} barcode`}
              onError={(e) => { e.target.style.display = 'none'; }}
            />
          </div>
        </div>

        <button type="submit" className="confirm-btn">Confirm Exchange</button>
      </form>
    </div>
  );
}
