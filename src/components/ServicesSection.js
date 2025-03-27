import React, { useState } from "react";
import "./ServicesSection.css";

const services = [
  {
    "title": "Gift Card Trading Platform",
    "description": "Easily trade your gift cards for cash or cryptocurrency with our seamless and user-friendly platform. We support a wide range of popular gift cards with instant transactions and secure processing.",
    "moreInfo": "Our platform offers a fast and secure way to trade gift cards with real-time price evaluations. Benefit from competitive rates, instant payouts, and a hassle-free trading experience."
  },
  {
    "title": "Gift Card-to-Crypto  Exchange",
    "description": "Convert your gift cards from top brands into cryptocurrency effortlessly. Enjoy a secure and instant exchange process with minimal transaction fees.",
    "moreInfo": "We support a variety of gift cards and offer a broad selection of cryptocurrency, making it easy to convert your digital assets into everyday spending power. Transactions are encrypted and processed instantly."
  },
  {
    "title": "Secure Crypto Transactions",
    "description": "Our platform ensures the highest level of security for all crypto transactions, utilizing blockchain technology and advanced encryption.",
    "moreInfo": "With multi-layer security, two-factor authentication, and cold storage solutions, we prioritize the safety of your funds. Trade with confidence, knowing your assets are protected at all times."
  },
  {
    "title": "Comprehensive Market Insights",
    "description": "Stay ahead of the market with real-time data, price tracking, and in-depth analysis on crypto and gift card trading trends.",
    "moreInfo": "Access detailed reports, historical data, and AI-driven predictions to make informed trading decisions. Our insights empower you to maximize profits and minimize risks."
  },
  {
    "title": "24/7 Customer Support",
    "description": "Get assistance anytime with our dedicated customer support team, available 24/7 to resolve your issues quickly and efficiently.",
    "moreInfo": "Our multilingual support team is always ready to assist you with any inquiries, from technical troubleshooting to transaction clarifications. We prioritize fast response times and customer satisfaction."
  },
  {
    "title": "Competitive Pricing Strategies",
    "description": "Benefit from the best exchange rates and low fees, ensuring you get the most value for your transactions.",
    "moreInfo": "We continuously analyze market trends to offer fair and competitive pricing. Our platform minimizes hidden fees and maximizes your earnings with transparent and dynamic pricing models."
  },
];

const ServicesSection = () => {
  const [expanded, setExpanded] = useState(Array(services.length).fill(false));

  const toggleExpand = (index) => {
    const newExpanded = [...expanded];
    newExpanded[index] = !newExpanded[index];
    setExpanded(newExpanded);
  };

  return (
    <section className="services-section" id="services"> 
      <h2 className="section-title">Trade Securely</h2>
      <div className="services-grid">
        {services.map((service, index) => (
          <div key={index} className="service-card">
            <h3>{service.title}</h3>
            <p>{service.description}</p>
            {expanded[index] && <p className="more-info-text">{service.moreInfo}</p>}
            <button className="more-info-btn" onClick={() => toggleExpand(index)}>
              {expanded[index] ? "Read Less" : "Read More"}
            </button>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ServicesSection;
