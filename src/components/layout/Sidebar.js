// src/components/layout/Sidebar.js
import React from "react";
import { auth } from "../../firebase";
import { signOut } from "firebase/auth";

function Sidebar({ role, setActivePage }) {
  const handleLogout = () => signOut(auth);

  return (
    // ⬇️ renamed from "sidebar" to "sidebar-panel"
    <aside className="sidebar-panel">
      <div className="sidebar-header">
        <h2>ChangeCog</h2>
      </div>

      <nav className="sidebar-nav">
        <ul>
          <li onClick={() => setActivePage("dashboard")} style={{ cursor: "pointer" }}>
            🏠 Dashboard
          </li>
          <li onClick={() => setActivePage("exchange")} style={{ cursor: "pointer" }}>
            💱 Exchange
          </li>
          <li onClick={() => setActivePage("withdraw")} style={{ cursor: "pointer" }}>
            💸 Withdraw
          </li>
          {role === "admin" && (
            <li onClick={() => setActivePage("admin")} style={{ cursor: "pointer" }}>
              🛠 Admin
            </li>
          )}
        </ul>
      </nav>

      <div className="sidebar-footer">
        <button className="btn btn-danger" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;
