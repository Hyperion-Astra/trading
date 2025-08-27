import React, { useEffect, useState } from "react";
import { db } from "../../firebase";
import { collection, getDocs, updateDoc, doc } from "firebase/firestore";

const WithdrawRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchRequests = async () => {
    setLoading(true);
    const querySnapshot = await getDocs(collection(db, "withdrawals"));
    const data = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    setRequests(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleUpdateStatus = async (id, status) => {
    await updateDoc(doc(db, "withdrawals", id), { status });
    fetchRequests(); // refresh after update
  };

  if (loading) return <div>Loading withdraw requests...</div>;

  return (
    <div className="card bg-white p-4 rounded-xl shadow-md col-span-full">
      <h3 className="text-lg font-bold mb-2">Withdrawal Requests</h3>
      {requests.length === 0 ? (
        <p>No withdrawal requests.</p>
      ) : (
        <ul>
          {requests.map((req) => (
            <li
              key={req.id}
              className="flex justify-between items-center p-2 border-b"
            >
              <div>
                <p>User ID: {req.userId}</p>
                <p>Amount: ${req.amount}</p>
              </div>
              <div className="flex gap-2">
                {req.status === "Pending" && (
                  <>
                    <button
                      className="px-2 py-1 bg-green-200 text-green-800 rounded hover:bg-green-300 transition"
                      onClick={() => handleUpdateStatus(req.id, "Approved")}
                    >
                      Approve
                    </button>
                    <button
                      className="px-2 py-1 bg-red-200 text-red-800 rounded hover:bg-red-300 transition"
                      onClick={() => handleUpdateStatus(req.id, "Rejected")}
                    >
                      Reject
                    </button>
                  </>
                )}
                {req.status !== "Pending" && (
                  <span
                    className={`px-2 py-1 rounded ${
                      req.status === "Approved"
                        ? "bg-green-200 text-green-800"
                        : "bg-red-200 text-red-800"
                    }`}
                  >
                    {req.status}
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

export default WithdrawRequests;
