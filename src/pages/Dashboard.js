import React, { useState, useEffect } from "react";
import Header from "../components/layout/Header";
import Sidebar from "../components/layout/Sidebar";
import WalletBalance from "../components/dashboard/WalletBalance";
import ProfileCard from "../components/dashboard/ProfileCard";
import WithdrawForm from "../components/dashboard/WithdrawForm";
import WithdrawList from "../components/dashboard/WithdrawList";
import ExchangeTable from "../components/dashboard/ExchangeTable";
import DepositPage from "./DepositPage"; // ⬅️ NEW IMPORT

import { db, auth } from "../firebase";
import { collection, getDocs, query, orderBy, where } from "firebase/firestore";

const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activePage, setActivePage] = useState("dashboard");
  const [cryptos, setCryptos] = useState([]);
  const [exchanges, setExchanges] = useState([]);
  const [balances, setBalances] = useState({}); // Added to store user balances

  // Fetch crypto prices
  useEffect(() => {
    const fetchPrices = async () => {
      try {
        const res = await fetch(
          "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,binancecoin,solana,tether&vs_currencies=usd"
        );
        const data = await res.json();

        const cryptoData = [
          { id: "btc", name: "Bitcoin", price: data.bitcoin.usd - 15, symbol: "BTC", wallet: "bc1qaha0cqkmxcl2kvkrhe4dtnj7ykgk8tch6tc62y" },
          { id: "eth", name: "Ethereum", price: data.ethereum.usd - 15, symbol: "ETH", wallet: "0x16360c13De54D990EC9C3e74D524cEbd3b5697DC" },
          { id: "bnb", name: "BNB", price: data.binancecoin.usd - 15, symbol: "BNB", wallet: "0x16360c13De54D990EC9C3e74D524cEbd3b5697DC" },
          { id: "sol", name: "Solana", price: data.solana.usd - 15, symbol: "SOL", wallet: "42EqkNVGnYUW3mBz1CRXLSDrwLfRW3Ra578gjActqfUs" },
          { id: "usdt", name: "USDT", price: data.tether.usd, symbol: "USDT", wallet: "TQYPwybdLCkrtgWhUXGxUd6sxXvUdjHS1E" },
        ];

        setCryptos(cryptoData);

        // Initialize balances to 0 for each crypto if not already set
        const initialBalances = {};
        cryptoData.forEach(c => initialBalances[c.symbol] = 0);
        setBalances(initialBalances);

      } catch (error) {
        console.error("Error fetching crypto prices:", error);
      }
    };
    fetchPrices();
  }, []);

  // Fetch exchanges for logged-in user
  useEffect(() => {
    const fetchExchanges = async () => {
      if (!auth.currentUser) return;
      try {
        const q = query(
          collection(db, "exchanges"),
          where("userId", "==", auth.currentUser.uid),
          orderBy("createdAt", "desc")
        );
        const snapshot = await getDocs(q);
        const fetchedExchanges = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setExchanges(fetchedExchanges);

        // Update balances based on past exchanges
        const updatedBalances = { ...balances };
        fetchedExchanges.forEach(ex => {
          updatedBalances[ex.symbol] = (updatedBalances[ex.symbol] || 0) - ex.amount;
        });
        setBalances(updatedBalances);

      } catch (err) {
        console.error("Error fetching exchanges:", err);
      }
    };
    fetchExchanges();
  }, [cryptos]);

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert("Copied to clipboard!");
  };

  return (
    <div className="dashboard-layout" style={{ display: "flex" }}>
      <div className={sidebarOpen ? "sidebar open" : "sidebar"}>
        <Sidebar role="client" setActivePage={setActivePage} />
      </div>

      <div className="dashboard-main" style={{ flex: 1 }}>
        <Header onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
        {sidebarOpen && <div className="sidebar-backdrop" onClick={() => setSidebarOpen(false)} />}

        <main className="dashboard-content" style={{ padding: "2rem" }}>
          {activePage === "dashboard" && (
            <>
              <ProfileCard />
              <WalletBalance balances={balances} />
              <WithdrawForm />
              <WithdrawList />

              {exchanges.length > 0 && (
                <div className="exchanges-card">
                  <h2>My Exchanges</h2>
                  <table className="exchanges-table">
                    <thead>
                      <tr>
                        <th>Date</th>
                        <th>Crypto</th>
                        <th>Amount</th>
                        <th>Wallet</th>
                        <th>Contract</th>
                        <th>Network</th>
                      </tr>
                    </thead>
                    <tbody>
                      {exchanges.map((ex) => (
                        <tr key={ex.id}>
                          <td>{ex.createdAt?.toDate ? ex.createdAt.toDate().toLocaleString() : ""}</td>
                          <td>{ex.crypto}</td>
                          <td>{ex.amount}</td>
                          <td>
                            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                              <span style={{ fontFamily: "monospace" }}>{ex.wallet}</span>
                              <button
                                onClick={() => copyToClipboard(ex.wallet)}
                                style={{ padding: "0.2rem 0.5rem", fontSize: "0.8rem", cursor: "pointer", borderRadius: "6px", border: "none", background: "#1e293b", color: "#fff" }}
                              >
                                Copy
                              </button>
                            </div>
                          </td>
                          <td>
                            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                              <span style={{ fontFamily: "monospace" }}>{ex.contract || "-"}</span>
                              {ex.contract && (
                                <button
                                  onClick={() => copyToClipboard(ex.contract)}
                                  style={{ padding: "0.2rem 0.5rem", fontSize: "0.8rem", cursor: "pointer", borderRadius: "6px", border: "none", background: "#1e293b", color: "#fff" }}
                                >
                                  Copy
                                </button>
                              )}
                            </div>
                          </td>
                          <td>{ex.network}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </>
          )}

          {activePage === "exchange" && (
            <>
              {cryptos.length > 0 ? (
                <ExchangeTable cryptos={cryptos} balances={balances} />
              ) : (
                <p>Loading cryptos...</p>
              )}
            </>
          )}

          {activePage === "withdraw" && (
            <>
              <WithdrawForm />
              <WithdrawList />
            </>
          )}

          {/* ⬇️ NEW DEPOSIT PAGE */}
          {activePage === "deposit" && (
            <DepositPage balances={balances} cryptos={cryptos} />
          )}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
