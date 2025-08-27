import React, { useState, useEffect, useRef } from "react";
import "./Contact.css";

const Contact = () => {
  const sectionRef = useRef(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [status, setStatus] = useState("");
  const [errors, setErrors] = useState({
    name: "",
    email: "",
  });

  // Scroll fade-in effect
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          sectionRef.current.classList.add("visible");
        }
      },
      { threshold: 0.3 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => {
      if (sectionRef.current) observer.unobserve(sectionRef.current);
    };
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Real-time validation
    if (name === "email" && !/\S+@\S+\.\S+/.test(value)) {
      setErrors({ ...errors, email: "Invalid email format" });
    } else {
      setErrors({ ...errors, email: "" });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.message) {
      setStatus("Please fill out all fields.");
      return;
    }

    const formspreeEndpoint = "https://formspree.io/f/mzzeabab"; // Replace with actual Formspree ID

    try {
      const response = await fetch(formspreeEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setStatus("Message sent successfully!");
        setFormData({ name: "", email: "", message: "" });
      } else {
        setStatus("Something went wrong. Please try again.");
      }
    } catch (err) {
      setStatus("Something went wrong. Please try again.");
    }
  };

  return (
    <div id="contact">
    <div className="contact-section" id="contact" ref={sectionRef}>
  <div className="contact-text">
    <h2>Trade Crypto at Exclusive Discounts!</h2>
    <p>
      Bitcoin, Ethereum, or USDT? With Changecog,
      you can buy popular cryptocurrencies 
      Fast & secure – start trading today and enjoy the savings!
    </p>
  </div>

      <form onSubmit={handleSubmit} className="contact-form">
        <div className="input-group">
          <label>Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="input-group">
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          {errors.email && <span className="error">{errors.email}</span>}
        </div>

        <div className="input-group">
          <label>Message</label>
          <textarea
            name="message"
            value={formData.message}
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit" className="tonne">Send Message</button>
        {status && <p className="status-message">{status}</p>}
      </form>
    </div>
    </div>
  );
};

export default Contact;
