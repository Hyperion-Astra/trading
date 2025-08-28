import React, { useState, useEffect } from "react";
import { db, auth } from "../../firebase";
import { collection, addDoc, doc, getDoc, serverTimestamp } from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";

function WithdrawForm() {
  const [user] = useAuthState(auth);
  const [crypto, setCrypto] = useState("");
  const [network, setNetwork] = useState("");
  const [amount, setAmount] = useState("");
  const [walletAddress, setWalletAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [balance, setBalance] = useState(null);

  // ⬇️ Load balance when user logs in
  useEffect(() => {
    const fetchBalance = async () => {
      if (!user) return;
      try {
        const userRef = doc(db, "users", user.uid); // adjust if you store balances differently
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          setBalance(userSnap.data().balance || 0);
        } else {
          setBalance(0);
        }
      } catch (err) {
        console.error("Error fetching balance:", err);
        setBalance(0);
      }
    };
    fetchBalance();
  }, [user]);

  const handleWithdraw = async (e) => {
    e.preventDefault();
    if (!user) return setMessage("⚠️ You must be logged in.");
    if (crypto === "USDT" && !network) {
      return setMessage("⚠️ Please select a network for USDT.");
    }
    if (parseFloat(amount) <= 0) {
      return setMessage("⚠️ Amount must be greater than 0.");
    }
    if (balance !== null && parseFloat(amount) > balance) {
      return setMessage("⚠️ Insufficient balance for this withdrawal.");
    }

    setLoading(true);
    try {
      await addDoc(collection(db, "withdrawals"), {
        userId: user.uid,
        email: user.email,
        crypto,
        network: crypto === "USDT" ? network : null,
        amount: parseFloat(amount),
        walletAddress,
        status: "pending", // ⬅️ stays pending until admin approves
        createdAt: serverTimestamp(),
      });
      setMessage("Withdrawal request submitted ✅ Waiting for admin approval.");
      setCrypto("");
      setNetwork("");
      setAmount("");
      setWalletAddress("");
    } catch (err) {
      console.error("Error submitting withdrawal:", err);
      setMessage("Failed to submit request ❌");
    }
    setLoading(false);
  };

  return (
    <div>
      <div className="card">
      <h3>Withdraw Funds</h3>

      {balance !== null && (
        <p className="text-info" style={{ textAlign: "center" }}>
          Available Balance: ${balance}
        </p>
      )}

      {message && (
        <p className="text-muted" style={{ marginBottom: "10px", textAlign: "center" }}>
          {message}
        </p>
      )}

      <form onSubmit={handleWithdraw}>
        <div className="form-group">
          <label>Select Crypto</label>
          <select
            value={crypto}
            onChange={(e) => setCrypto(e.target.value)}
            required
          >
            <option value="">-- Select Crypto --</option>
            <option value="BTC">BTC</option>
            <option value="ETH">ETH</option>
            <option value="SOL">SOL</option>
            <option value="BNB">BNB</option>
            <option value="USDT">USDT</option>
          </select>
        </div>

        {crypto === "USDT" && (
          <div className="form-group">
            <label>Select Network</label>
            <select
              value={network}
              onChange={(e) => setNetwork(e.target.value)}
              required
            >
              <option value="">-- Select Network --</option>
              <option value="ERC20">ERC20</option>
              <option value="TRC20">TRC20</option>
              <option value="BEP20">BEP20</option>
            </select>
          </div>
        )}

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
    </div>
  );
}

export default WithdrawForm;
