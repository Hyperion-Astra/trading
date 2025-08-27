// src/components/Main.js
import React, { useState, useEffect } from "react";
import useScrollAnimation from "../hooks/useScrollAnimation";
import "./Main.css";

export default function Main() {
  const [isOpen, setIsOpen] = useState(false);
  const [heroRef, heroVisible] = useScrollAnimation();

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <div>
      {/* NAVBAR */}
      <nav className="navbar">
        <div className="nav-container">
          <h2 className="logo">ChangeCog</h2>
          <div className={`nav-links ${isOpen ? "open fade-in" : ""}`}>
            <a href="#prices">Prices</a>
            <a href="#contact">Contact</a>
          </div>
          <button className="nav-toggle" onClick={toggleMenu}>
            ☰
          </button>
        </div>
      </nav>

      {/* HERO */}
      <section
        className={`hero ${heroVisible ? "fade-in-up" : ""}`}
        id="home"
        ref={heroRef}
      >
        <div className="hero-content">
          <h1>Experience limitless crypto exchange. <br /> Fast, Secure and Reliable</h1>
          <p>Buy Bitcoin, Ethereum, and USDT at cheaper rates.</p>
          <div className="hero-buttons">
  <button onClick={() => document.getElementById("prices").scrollIntoView({ behavior: "smooth" })} style={{color: "black"}}>
    View Prices
  </button>

  <button onClick={() => document.getElementById("prices").scrollIntoView({ behavior: "smooth" })} style={{color: "black"}}>
    Start Trading
  </button>
</div>

        </div>
      </section>
    </div>
  );
}
