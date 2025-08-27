// src/components/dashboard/WithdrawForm.js
import React, { useState } from "react";
import { db, auth } from "../../firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";

function WithdrawForm() {
  const [user] = useAuthState(auth);
  const [amount, setAmount] = useState("");
  const [walletAddress, setWalletAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleWithdraw = async (e) => {
    e.preventDefault();
    if (!user) return setMessage("⚠️ You must be logged in.");

    setLoading(true);
    try {
      await addDoc(collection(db, "withdrawals"), {
        userId: user.uid,
        email: user.email,
        amount,
        walletAddress,
        status: "pending",
        createdAt: serverTimestamp(),
      });
      setMessage("Withdrawal request submitted ✅");
      setAmount("");
      setWalletAddress("");
    } catch (err) {
      console.error("Error submitting withdrawal:", err);
      setMessage("Failed to submit request ❌");
    }
    setLoading(false);
  };

  return (
    <div className="card">
      <h3>Withdraw Funds</h3>

      {message && (
        <p className="text-muted" style={{ marginBottom: "10px", textAlign: "center" }}>
          {message}
        </p>
      )}

      <form onSubmit={handleWithdraw}>
        <div className="form-group">
          <label>Amount (USD)</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Enter amount"
            required
          />
        </div>

        <div className="form-group">
          <label>Wallet Address</label>
          <input
            type="text"
            value={walletAddress}
            onChange={(e) => setWalletAddress(e.target.value)}
            placeholder="Enter your wallet address"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="btn btn-success"
          style={{ width: "100%" }}
        >
          {loading ? "Submitting..." : "Request Withdrawal"}
        </button>
      </form>
    </div>
  );
}

export default WithdrawForm;
