// src/components/dashboard/WithdrawList.js
import React, { useEffect, useState } from "react";
import { db, auth } from "../../firebase";
import { collection, query, where, onSnapshot, orderBy } from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";

function WithdrawList() {
  const [user] = useAuthState(auth);
  const [withdrawals, setWithdrawals] = useState([]);

  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, "withdrawals"),
      where("userId", "==", user.uid),
      orderBy("createdAt", "desc")
    );

    const unsub = onSnapshot(q, (snapshot) => {
      setWithdrawals(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    });

    return () => unsub();
  }, [user]);

  return (
    <div className="card" style={{ gridColumn: "1 / -1", padding: "1.5rem" }}>
      <h3 style={{ marginBottom: "1rem" }}>My Withdrawal Requests</h3>

      {withdrawals.length === 0 ? (
        <p className="text-muted" style={{ textAlign: "center" }}>
          No withdrawal requests yet.
        </p>
      ) : (
        <div className="table-container" style={{ overflowX: "auto" }}>
          <table className="table" style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th>Crypto</th>
                <th>Amount (USD)</th>
                <th>Wallet</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {withdrawals.map((wd) => (
                <tr key={wd.id} style={{ textAlign: "center", borderBottom: "1px solid #eee" }}>
                  <td>{wd.crypto || "-"}</td>
                  <td>${wd.amount}</td>
                  <td>{wd.walletAddress}</td>
                  <td>
                    <span
                      className={`status status-${wd.status}`}
                      style={{
                        padding: "0.25rem 0.5rem",
                        borderRadius: "0.25rem",
                        color: "#fff",
                        backgroundColor:
                          wd.status === "pending"
                            ? "#f0ad4e"
                            : wd.status === "completed"
                            ? "#5cb85c"
                            : "#d9534f",
                      }}
                    >
                      {wd.status}
                    </span>
                  </td>
                  <td>
                    {wd.createdAt?.toDate
                      ? wd.createdAt.toDate().toLocaleString()
                      : "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default WithdrawList;
