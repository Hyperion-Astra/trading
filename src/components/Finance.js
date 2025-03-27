import React from "react";
import "./Finance.css";

const Finance = () => {
  const scrollToSection = (id) => {
    const section = document.getElementById(id);
    if (section) {
      window.scrollTo({
        top: section.offsetTop - 50,
        behavior: "smooth",
      });
    }
  };
  return (
    <section className="financial-banner">
      <div className="banner-content">
        <h1 className="banner-heading">Who We Are: Your Trusted Trading Partner</h1>
        <p className="banner-text">
        At GeniSwap , we’re revolutionizing how you unlock value from gift cards and crypto. 
        Our mission is simple: make trading fast, safe, and fair. Whether it’s a $50 iTunes card you 
        don’t need or a crypto stash you want to flip, we’ve got you covered. With cutting-edge security, 
        good market rates, and 24/7 support, we’re here to turn your assets into what you 
        want—effortlessly. Trade with confidence—choose GeniSwap Easy Trade today!</p>
        <button className="banner-button" onClick={() => scrollToSection("services")}>Start Trading</button>
      </div>
    </section>
  );
};

export default Finance;
