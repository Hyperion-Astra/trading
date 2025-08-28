import React, { useState, useEffect } from "react";
import { db, auth } from "../firebase";
import {
  collection,
  addDoc,
  serverTimestamp,
  query,
  where,
  orderBy,
  onSnapshot,
} from "firebase/firestore";
import "./DepositPage.css";

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

export default function DepositPage() {
  const [deposit, setDeposit] = useState({
    crypto: "BTC",
    network: "",
    wallet: DEFAULT_WALLETS.BTC,
    amount: 0,
  });
  const [showModal, setShowModal] = useState(false);
  const [deposits, setDeposits] = useState([]);

  // Fetch user's deposits
  useEffect(() => {
    if (!auth.currentUser) return;

    const q = query(
      collection(db, "deposits"),
      where("userId", "==", auth.currentUser.uid),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetched = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setDeposits(fetched);
    });

    return () => unsubscribe();
  }, [auth.currentUser]);

  const handleCryptoChange = (e) => {
    const crypto = e.target.value;
    const network = NETWORKS[crypto]?.[0] || "";
    const wallet =
      crypto === "USDT" ? USDT_WALLETS[network] : DEFAULT_WALLETS[crypto] || "";
    setDeposit({ crypto, network, wallet, amount: 0 });
  };

  const handleNetworkChange = (e) => {
    const network = e.target.value;
    const wallet = USDT_WALLETS[network];
    setDeposit((prev) => ({ ...prev, network, wallet }));
  };

  const handleSubmit = async () => {
    if (!auth.currentUser) return;
    const { crypto, network, wallet, amount } = deposit;
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

      setShowModal(true);
      setDeposit({
        crypto: "BTC",
        network: "",
        wallet: DEFAULT_WALLETS.BTC,
        amount: 0,
      });
    } catch (err) {
      console.error("Error submitting deposit:", err);
      alert("Failed to submit deposit, try again.");
    }
  };

  return (
    <div className="deposit-page">
      <h2>Deposit Funds</h2>

      {/* Deposit Form */}
      <div className="deposit-form">
        <label>
          Select Crypto:
          <select value={deposit.crypto} onChange={handleCryptoChange}>
            {CRYPTOS.map((crypto) => (
              <option key={crypto} value={crypto}>
                {crypto}
              </option>
            ))}
          </select>
        </label>

        {NETWORKS[deposit.crypto] && (
          <label>
            Network:
            <select value={deposit.network} onChange={handleNetworkChange}>
              {NETWORKS[deposit.crypto].map((net) => (
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
            <span className="wallet-address">{deposit.wallet}</span>
            <button
              className="copy-btn"
              onClick={() => navigator.clipboard.writeText(deposit.wallet)}
            >
              Copy
            </button>
          </div>
          <div className="barcode">
            <img
              src={`/barcodes/${deposit.crypto}${
                deposit.crypto === "USDT" ? `_${deposit.network}` : ""
              }.png`}
              alt={`${deposit.crypto} barcode`}
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
            value={deposit.amount}
            onChange={(e) =>
              setDeposit((prev) => ({
                ...prev,
                amount: Number(e.target.value),
              }))
            }
          />
        </label>

        <button className="submit-btn" onClick={handleSubmit}>
          Submit Deposit
        </button>
      </div>

      {/* Deposit History */}
      <div className="deposit-history">
        <h3>Your Deposits</h3>
        {deposits.length === 0 ? (
          <p>No deposits yet.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Crypto</th>
                <th>Network</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {deposits.map((d) => (
                <tr key={d.id}>
                  <td>{d.crypto}</td>
                  <td>{d.network || "-"}</td>
                  <td>{d.amount}</td>
                  <td className={`status ${d.status}`}>{d.status}</td>
                  <td>
                    {d.createdAt?.toDate
                      ? d.createdAt.toDate().toLocaleString()
                      : "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Deposit Submitted ✅</h3>
            <p>Your deposit request is pending approval by an admin.</p>
            <button className="close-btn" onClick={() => setShowModal(false)}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
