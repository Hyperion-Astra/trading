import React, { useState, useEffect } from "react";
import "./Main.css";

const Main = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);
  const scrollToSection = (id) => {
    const section = document.getElementById(id);
    if (section) {
      window.scrollTo({
        top: section.offsetTop - 50, // For fixed headers
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="hero-container">
      
      {/* Overlay for the faded effect */}
      <div className="hero-overlay"></div>
      {/* Header */}
      <header className={`header ${isScrolled ? "scrolled" : ""}`}>
      <img 
      src="/geni.png" 
      alt="GeniSwap Logo" 
      className="logo" 
      onClick={() => window.location.reload()} 
      style={{ cursor: "pointer", height: "100px", width: "auto" }} />
        <button className="contact-button" onClick={() => window.open("https://wa.me/2347025724225", "_blank")} style={{ cursor: "pointer" }}>Contact us</button>
      </header>

      <div className="hero-content">
        <h2 className="hero-title">Turn Your Gift Cards into Cash or Crypto – Instantly!</h2>
        <p className="hero-text">
        With just a few clicks, swap your Amazon, Walmart, Google Play or iTunes cards and more for BTC, ETH, 
        USDT, or Naira—securely and at top rates.
        </p>
        <button className="explore-button" onClick={() => scrollToSection("services")} style={{ cursor: "pointer"}}>Start Trading</button>
      </div>
    </div>
  );
};

export default Main;
