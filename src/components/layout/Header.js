import React from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../../firebase";

function Header({ onMenuClick }) {
  const [user] = useAuthState(auth);

  return (
    <header className="header">
      <div className="header-left">
        <button className="menu-toggle" onClick={onMenuClick}>
          ☰
        </button>
        <h1>Dashboard</h1>
      </div>

      <div className="header-right">
        {user && (
          <div className="user-info">
            <span>{user.email}</span>
            <img
              src={user.photoURL || "https://via.placeholder.com/32"}
              alt="avatar"
              className="avatar"
            />
          </div>
        )}
      </div>
    </header>
  );
}

export default Header;
