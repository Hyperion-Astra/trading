import React, { useEffect, useState } from "react";
import { db } from "../../firebase";
import { collection, getDocs, updateDoc, doc } from "firebase/firestore";

const ExchangeRequests = () => {
  const [exchanges, setExchanges] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchExchanges = async () => {
    setLoading(true);
    const querySnapshot = await getDocs(collection(db, "exchanges"));
    const data = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    setExchanges(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchExchanges();
  }, []);

  const handleUpdateStatus = async (id, status) => {
    await updateDoc(doc(db, "exchanges", id), { status });
    fetchExchanges(); // refresh after update
  };

  if (loading) return <div>Loading exchange requests...</div>;

  return (
    <div className="card bg-white p-4 rounded-xl shadow-md col-span-full">
      <h3 className="text-lg font-bold mb-2">Exchange Requests</h3>
      {exchanges.length === 0 ? (
        <p>No exchange requests.</p>
      ) : (
        <ul>
          {exchanges.map((ex) => (
            <li
              key={ex.id}
              className="flex justify-between items-center p-2 border-b"
            >
              <div>
                <p>User ID: {ex.userId}</p>
                <p>
                  {ex.crypto} → {ex.fiat}
                </p>
                <p>Amount: ${ex.amount}</p>
              </div>
              <div className="flex gap-2">
                {ex.status === "Pending" && (
                  <>
                    <button
                      className="px-2 py-1 bg-green-200 text-green-800 rounded hover:bg-green-300 transition"
                      onClick={() => handleUpdateStatus(ex.id, "Approved")}
                    >
                      Approve
                    </button>
                    <button
                      className="px-2 py-1 bg-red-200 text-red-800 rounded hover:bg-red-300 transition"
                      onClick={() => handleUpdateStatus(ex.id, "Rejected")}
                    >
                      Reject
                    </button>
                  </>
                )}
                {ex.status !== "Pending" && (
                  <span
                    className={`px-2 py-1 rounded ${
                      ex.status === "Approved"
                        ? "bg-green-200 text-green-800"
                        : "bg-red-200 text-red-800"
                    }`}
                  >
                    {ex.status}
                  </span>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ExchangeRequests;
