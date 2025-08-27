// src/components/Footer.js
import React from "react";
import "./Footer.css";

export default function Footer() {
  return (
    <footer className="footer">
      <p>© {new Date().getFullYear()} Changecog Exchange. All rights reserved.</p>
      <div className="socials">
        <a href="#">Twitter</a>
        <a href="#">Telegram</a>
        <a href="#">Discord</a>
      </div>
    </footer>
  );
}
