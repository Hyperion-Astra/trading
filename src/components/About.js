import React from "react";
import "./About.css";
import londonImage from "../assets/gift.jpg";

const About = () => {
  return (
    <section className="about-section">
      <div className="about-content">
        <h2>YOUR TRUSTED PARTNER IN GIFT CARD AND CRYPTO TRADING</h2>
        <p>
        Welcome to GeniSwap Easy Trade, where unused gift cards become your ticket to fast cash or 
        cryptocurrency. With just a few clicks, swap your Amazon, Walmart, Google Play or iTunes cards 
        and more for BTC, ETH, USDT, or Naira securely and at top rates. No complicated steps, no hidden fees, just 
        easy trades, every time. Join thousands of savvy users cashing in on simplest trading platform. 
        Start now, your next payout is minutes away! <br /> <br />
        Whether you are looking to buy or sell, our reliable service caters to both new users and seasoned 
        traders, offering competitive rates and exceptional customer support. Join us as we bridge 
        traditional gifting with the future of finance.
        </p>
      </div>
      <div className="about-image" data-aos="fade-left">
        <img src={londonImage} alt="Gift card" loading="lazy" />
      </div>
    </section>
  );
};

export default About;
