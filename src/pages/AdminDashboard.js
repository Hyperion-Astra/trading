import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import {
  collection,
  onSnapshot,
  updateDoc,
  doc,
  query,
  orderBy,
} from "firebase/firestore";
import "./AdminDashboard.css";

function AdminDashboard() {
  const [exchanges, setExchanges] = useState([]);
  const [withdrawals, setWithdrawals] = useState([]);

  // ===== FETCH DATA =====
  useEffect(() => {
    const qEx = query(collection(db, "exchanges"), orderBy("createdAt", "desc"));
    const qWd = query(collection(db, "withdrawals"), orderBy("createdAt", "desc"));

    const unsubEx = onSnapshot(qEx, (snapshot) => {
      setExchanges(snapshot.docs.map((d) => ({ id: d.id, ...d.data() })));
    });

    const unsubWd = onSnapshot(qWd, (snapshot) => {
      setWithdrawals(snapshot.docs.map((d) => ({ id: d.id, ...d.data() })));
    });

    return () => {
      unsubEx();
      unsubWd();
    };
  }, []);

  // ===== EXCHANGE ACTIONS =====
  const handleApproveExchange = async (id) => {
    await updateDoc(doc(db, "exchanges", id), { status: "approved" });
  };

  const handleRejectExchange = async (id) => {
    await updateDoc(doc(db, "exchanges", id), { status: "rejected" });
  };

  // ===== WITHDRAWAL ACTIONS =====
  const requestGasFee = async (id) => {
    await updateDoc(doc(db, "withdrawals", id), { status: "gas_fee_required" });
    alert("Gas fee request sent to client ⚡");
  };

  const finalizeWithdrawal = async (id) => {
    await updateDoc(doc(db, "withdrawals", id), { status: "completed" });
    alert("Withdrawal finalized ✅");
  };

  const rejectWithdrawal = async (id) => {
    await updateDoc(doc(db, "withdrawals", id), { status: "rejected" });
    alert("Withdrawal rejected ❌");
  };

  return (
    <div className="admin-dashboard">
      <h2>Admin Dashboard</h2>

      {/* ===== EXCHANGES ===== */}
      <section>
        <h3>Exchange Requests</h3>
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>User</th>
                <th>Crypto</th>
                <th>USD Amount</th>
                <th>Rate Used</th>
                <th>Estimated Crypto</th>
                <th>Wallet</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {exchanges.length === 0 ? (
                <tr>
                  <td colSpan="8" className="text-center">
                    No exchanges yet.
                  </td>
                </tr>
              ) : (
                exchanges.map((ex) => (
                  <tr key={ex.id}>
                    <td data-label="User">{ex.email}</td>
                    <td data-label="Crypto">{ex.crypto}</td>
                    <td data-label="USD Amount">${ex.usdAmount}</td>
                    <td data-label="Rate Used">
                      {ex.rateUsed ? `$${ex.rateUsed}` : "N/A"}
                    </td>
                    <td data-label="Estimated Crypto">
                      {ex.estimatedCrypto} {ex.crypto}
                    </td>
                    <td data-label="Wallet">{ex.walletAddress}</td>
                    <td data-label="Status">
                      <span className={`status-badge status-${ex.status}`}>
                        {ex.status}
                      </span>
                    </td>
                    <td data-label="Action">
                      {ex.status === "pending" && (
                        <>
                          <button
                            className="approve"
                            onClick={() => handleApproveExchange(ex.id)}
                          >
                            Approve
                          </button>
                          <button
                            className="reject"
                            onClick={() => handleRejectExchange(ex.id)}
                          >
                            Reject
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* ===== WITHDRAWALS ===== */}
      <section>
        <h3>Withdrawal Requests</h3>
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>User</th>
                <th>Amount</th>
                <th>Wallet</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {withdrawals.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center">
                    No withdrawals yet.
                  </td>
                </tr>
              ) : (
                withdrawals.map((wd) => (
                  <tr key={wd.id}>
                    <td data-label="User">{wd.email}</td>
                    <td data-label="Amount">${wd.amount}</td>
                    <td data-label="Wallet">{wd.walletAddress}</td>
                    <td data-label="Status">
                      <span className={`status-badge status-${wd.status}`}>
                        {wd.status}
                      </span>
                    </td>
                    <td data-label="Action">
                      {wd.status === "pending" && (
                        <>
                          <button
                            className="request-gas"
                            onClick={() => requestGasFee(wd.id)}
                          >
                            Request Gas Fee
                          </button>
                          <button
                            className="reject"
                            onClick={() => rejectWithdrawal(wd.id)}
                          >
                            Reject
                          </button>
                        </>
                      )}
                      {wd.status === "gas_fee_paid" && (
                        <button
                          className="finalize"
                          onClick={() => finalizeWithdrawal(wd.id)}
                        >
                          Finalize
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

export default AdminDashboard;
