import React, { useEffect, useState } from "react";
import { db, auth } from "../../firebase";
import { doc, onSnapshot } from "firebase/firestore";

function WalletBalance() {
  const [balance, setBalance] = useState(0);

  useEffect(() => {
    if (!auth.currentUser) return;

    const walletRef = doc(db, "wallets", auth.currentUser.uid);

    // Live update listener
    const unsubscribe = onSnapshot(walletRef, (snapshot) => {
      if (snapshot.exists()) {
        setBalance(snapshot.data().balance);
      } else {
        setBalance(0);
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="card">
      <h3>Wallet Balance</h3>
      <p style={{ fontSize: "22px", fontWeight: "600", color: "#1e293b" }}>
        ${balance.toLocaleString()}
      </p>
      <p style={{ fontSize: "13px", color: "#6b7280" }}>Updated in real-time</p>
    </div>
  );
}

export default WalletBalance;
