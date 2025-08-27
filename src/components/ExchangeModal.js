import React, { useState, useEffect } from "react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db, auth } from "../../firebase";
import { useNavigate } from "react-router-dom";
import "./ExchangeModal.css";

// Network mapping
const NETWORKS = {
  SOL: ["SOL COIN"],
  SOLANA: ["SOL COIN"],
  USDT: ["TRC20", "BEP20", "ERC20"],
};

export default function ExchangeModal({ show, onClose, crypto }) {
  const navigate = useNavigate();
  const [walletAddress, setWalletAddress] = useState("");
  const [contractAddress, setContractAddress] = useState("");
  const [network, setNetwork] = useState("");

  // Initialize fields safely
  useEffect(() => {
    if (!crypto) return;

    setWalletAddress(crypto.wallet || "1A2b3C4d5E6F7g8H9i0J");
    setContractAddress(crypto.contract || "0x1234567890abcdef");

    const symbolKey = crypto.symbol?.toUpperCase();
    const availableNetworks = NETWORKS[symbolKey] || [];
    setNetwork(availableNetworks[0] || "");
  }, [crypto]);

  if (!show || !crypto) return null; // Only render if modal should show and crypto exists

  const symbolKey = crypto.symbol?.toUpperCase() || "";
  const availableNetworks = NETWORKS[symbolKey] || [];

  const copyToClipboard = (text) => {
    if (!text) return;
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
        crypto: crypto.name || "",
        symbol: crypto.symbol || "",
        amount: crypto.amount || 0,
        wallet: walletAddress,
        network,
        userId: auth.currentUser.uid,
        createdAt: serverTimestamp(),
      });

      alert("Exchange submitted!");
      onClose();
      navigate("/dashboard");
    } catch (err) {
      console.error("Error saving exchange:", err);
      alert("Failed to save exchange. Please try again.");
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>&times;</button>
        <h2>Exchange {crypto.name || ""}</h2>

        <form onSubmit={handleConfirm}>
          <label>
            USD Amount:
            <input type="number" value={crypto.amount || 0} readOnly />
          </label>

          {availableNetworks.length > 0 && (
            <label>
              Network:
              <select value={network} onChange={(e) => setNetwork(e.target.value)}>
                {availableNetworks.map((net) => (
                  <option key={net} value={net}>{net}</option>
                ))}
              </select>
            </label>
          )}

          <div className="payment-info">
            <div className="address-row">
              <span className="wallet">{walletAddress}</span>
              <button type="button" onClick={() => copyToClipboard(walletAddress)}>Copy</button>
            </div>

            <div className="address-row">
              <span className="contract">{contractAddress}</span>
              <button type="button" onClick={() => copyToClipboard(contractAddress)}>Copy</button>
            </div>

            <div className="barcode-container">
              {symbolKey && (
                <img
                  src={`/barcodes/${symbolKey}.png`}
                  alt={`${crypto.name} barcode`}
                  style={{
                    width: "100%",
                    maxWidth: "300px",
                    marginTop: "10px",
                    border: "2px solid #1e293b",
                    borderRadius: "6px",
                    background: "#f0f8ff",
                    padding: "8px"
                  }}
                />
              )}
            </div>
          </div>

          <button type="submit" className="confirm-btn">Confirm Exchange</button>
        </form>
      </div>
    </div>
  );
}
