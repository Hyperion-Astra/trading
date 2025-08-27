// src/components/dashboard/ExchangeList.js
import React, { useEffect, useState } from "react";
import { db, auth } from "../../firebase";
import { collection, query, where, onSnapshot, orderBy } from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";

function ExchangeList() {
  const [user] = useAuthState(auth);
  const [exchanges, setExchanges] = useState([]);

  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, "exchanges"),
      where("userId", "==", user.uid),
      orderBy("createdAt", "desc")
    );

    const unsub = onSnapshot(q, (snapshot) => {
      setExchanges(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    });

    return () => unsub();
  }, [user]);

  return (
    <div className="bg-white p-4 rounded-lg shadow col-span-1 md:col-span-2 xl:col-span-3">
      <h3 className="text-lg font-semibold mb-4">My Exchange Requests</h3>
      {exchanges.length === 0 ? (
        <p className="text-gray-500 text-center">No exchange requests yet.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-2">Crypto</th>
                <th className="p-2">Amount</th>
                <th className="p-2">Wallet</th>
                <th className="p-2">Status</th>
                <th className="p-2">Date</th>
              </tr>
            </thead>
            <tbody>
              {exchanges.map((ex) => (
                <tr key={ex.id} className="border-b">
                  <td className="p-2">{ex.crypto}</td>
                  <td className="p-2">{ex.amount}</td>
                  <td className="p-2">{ex.walletAddress}</td>
                  <td className="p-2">
                    <span
                      className={`px-2 py-1 rounded text-white ${
                        ex.status === "approved"
                          ? "bg-green-500"
                          : ex.status === "rejected"
                          ? "bg-red-500"
                          : "bg-yellow-500"
                      }`}
                    >
                      {ex.status}
                    </span>
                  </td>
                  <td className="p-2">
                    {ex.createdAt?.toDate
                      ? ex.createdAt.toDate().toLocaleString()
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

export default ExchangeList;
