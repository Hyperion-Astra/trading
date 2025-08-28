// src/components/dashboard/WalletBalance.js
import React, { useEffect, useState } from "react";
import { db, auth } from "../../firebase";
import { doc, onSnapshot, collection, addDoc, serverTimestamp } from "firebase/firestore";
import "./WalletBalance.css";

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

const DEFAULT_WALLETS = {
  BTC: "bc1qaha0cqkmxcl2kvkrhe4dtnj7ykgk8tch6tc62y",
  ETH: "0x16360c13De54D990EC9C3e74D524cEbd3b5697DC",
  BNB: "0x16360c13De54D990EC9C3e74D524cEbd3b5697DC",
  SOL: "42EqkNVGnYUW3mBz1CRXLSDrwLfRW3Ra578gjActqfUs",
  USDT: USDT_WALLETS.TRC20,
};

const CRYPTOS = ["BTC", "ETH", "BNB", "SOL", "USDT"];

export default function WalletBalance() {
  const [balances, setBalances] = useState({});
  const [depositModal, setDepositModal] = useState({
    open: false,
    crypto: "",
    network: "",
    wallet: "",
    amount: 0,
  });

  useEffect(() => {
    if (!auth.currentUser) return;
    const walletRef = doc(db, "wallets", auth.currentUser.uid);

    const unsubscribe = onSnapshot(walletRef, (snapshot) => {
      if (snapshot.exists()) setBalances(snapshot.data());
      else setBalances({});
    });

    return () => unsubscribe();
  }, []);

  const handleDepositClick = (crypto) => {
    const network = NETWORKS[crypto]?.[0] || "";
    const wallet = crypto === "USDT" ? USDT_WALLETS[network] : DEFAULT_WALLETS[crypto] || "";
    setDepositModal({ open: true, crypto, network, wallet, amount: 0 });
  };

  const handleDepositSubmit = async () => {
    if (!auth.currentUser) return;
    const { crypto, network, wallet, amount } = depositModal;
    if (!amount || amount <= 0) return alert("Enter a valid amount");

    try {
      await addDoc(collection(db, "deposits"), {
        userId: auth.currentUser.uid,
        crypto,
        network,
        wallet,
        amount,
        status: "pending",
        createdAt: serverTimestamp(),
      });
      alert(`Deposit request for ${amount} ${crypto} submitted, awaiting admin approval.`);
      setDepositModal({ ...depositModal, open: false, amount: 0 });
    } catch (err) {
      console.error("Error submitting deposit:", err);
      alert("Failed to submit deposit, try again.");
    }
  };

  const handleNetworkChange = (e) => {
    const network = e.target.value;
    const wallet = USDT_WALLETS[network];
    setDepositModal((prev) => ({ ...prev, network, wallet }));
  };

  const renderCryptoRow = (crypto, amount) => (
    <div key={crypto} className="crypto-row">
      <span>{crypto}</span>
      <div className="crypto-actions">
        <span>{amount.toLocaleString()}</span>
        <button className="deposit-btn" onClick={() => handleDepositClick(crypto)}>
          Deposit
        </button>
      </div>
    </div>
  );

  return (
    <div className="card wallet-balance-card">
      <h3>Wallet Balances</h3>
      <div className="crypto-list">
        {CRYPTOS.map((crypto) => renderCryptoRow(crypto, balances[crypto] || 0))}
      </div>
      <p className="update-info">Updated in real-time</p>

      {depositModal.open && (
        <div className="modal-backdrop">
          <div className="modal-card deposit-modal">
            <h4>Deposit {depositModal.crypto}</h4>

            {NETWORKS[depositModal.crypto] && (
              <label>
                Network:
                <select value={depositModal.network} onChange={handleNetworkChange}>
                  {NETWORKS[depositModal.crypto].map((net) => (
                    <option key={net} value={net}>
                      {net}
                    </option>
                  ))}
                </select>
              </label>
            )}

            <div className="wallet-info">
              <span>Send to Wallet:</span>
              <div className="wallet-row">
                <span className="wallet-address">{depositModal.wallet}</span>
                <button
                  className="copy-btn"
                  onClick={() => navigator.clipboard.writeText(depositModal.wallet)}
                >
                  Copy
                </button>
              </div>
              <div className="barcode">
                <img
                  src={`/barcodes/${depositModal.crypto}${
                    depositModal.crypto === "USDT" ? `_${depositModal.network}` : ""
                  }.png`}
                  alt={`${depositModal.crypto} barcode`}
                  onError={(e) => (e.target.style.display = "none")}
                />
              </div>
            </div>

            <label>
              Amount:
              <input
                type="number"
                min="0"
                step="any"
                value={depositModal.amount}
                onChange={(e) =>
                  setDepositModal((prev) => ({ ...prev, amount: Number(e.target.value) }))
                }
              />
            </label>

            <div className="modal-actions">
              <button className="submit-btn" onClick={handleDepositSubmit}>
                Submit Deposit
              </button>
              <button className="cancel-btn" onClick={() => setDepositModal({ ...depositModal, open: false })}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
