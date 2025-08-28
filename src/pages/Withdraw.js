// src/pages/Withdraw.js
import React, { useState, useEffect } from "react";
import { db, auth } from "../firebase";
import {
  collection,
  addDoc,
  query,
  where,
  onSnapshot,
  doc,
  updateDoc,
} from "firebase/firestore";

function Withdraw() {
  const [amount, setAmount] = useState("");
  const [walletAddress, setWalletAddress] = useState("");
  const [withdrawals, setWithdrawals] = useState([]);
  const [loading, setLoading] = useState(false);

  const user = auth.currentUser;

  // ✅ Submit withdrawal request
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!amount || !walletAddress) {
      alert("Please fill in all fields");
      return;
    }
    setLoading(true);

    try {
      await addDoc(collection(db, "withdrawals"), {
        userId: user.uid,
        amount,
        walletAddress,
        status: "pending",
        createdAt: new Date(),
      });

      setAmount("");
      setWalletAddress("");
      alert("Withdrawal request submitted ✅");
    } catch (err) {
      console.error("Error submitting withdrawal:", err);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Confirm Gas Fee Paid
  const handleGasFeePaid = async (id) => {
    try {
      await updateDoc(doc(db, "withdrawals", id), {
        status: "gas_fee_paid",
      });
      alert("You have confirmed gas fee payment ✅");
    } catch (err) {
      console.error("Error confirming gas fee:", err);
    }
  };

  // ✅ Fetch withdrawals for this user in real-time
  useEffect(() => {
    if (!user) return;

    const q = query(collection(db, "withdrawals"), where("userId", "==", user.uid));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const list = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setWithdrawals(list);
    });

    return () => unsubscribe();
  }, [user]);

  return (
    <div className="withdraw-wrapper">
      <div className="withdraw-page">
      <h2>Withdraw Funds</h2>

      {/* === Withdrawal Form === */}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Amount</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
          />
        </div>

        <div>
          <label>Wallet Address</label>
          <input
            type="text"
            value={walletAddress}
            onChange={(e) => setWalletAddress(e.target.value)}
            required
          />
        </div>

        <button type="submit" disabled={loading}>
          {loading ? "Submitting..." : "Request Withdrawal"}
        </button>
      </form>

      {/* === Withdrawal History === */}
      <h3>Your Withdrawals</h3>
      <table>
        <thead>
          <tr>
            <th>Amount</th>
            <th>Wallet</th>
            <th>Status</th>
            <th>Action / Note</th>
          </tr>
        </thead>
        <tbody>
          {withdrawals.length === 0 ? (
            <tr>
              <td colSpan="4">No withdrawals yet.</td>
            </tr>
          ) : (
            withdrawals.map((wd) => (
              <tr key={wd.id}>
                <td>{wd.amount}</td>
                <td>{wd.walletAddress}</td>
                <td>{wd.status}</td>
                <td>
                  {wd.status === "gas_fee_required" && (
                    <button onClick={() => handleGasFeePaid(wd.id)}>
                      ✅ I Have Paid Gas Fee
                    </button>
                  )}
                  {wd.status === "completed" && (
                    <span style={{ color: "green" }}>✅ Completed</span>
                  )}
                  {wd.status === "rejected" && (
                    <span style={{ color: "red" }}>❌ Rejected</span>
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
    </div>
  );
}

export default Withdraw;
