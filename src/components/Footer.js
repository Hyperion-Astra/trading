import React from "react";
import { FaInstagram, FaTiktok, FaSnapchatGhost, FaWhatsapp, FaFacebook, FaLinkedin  } from 'react-icons/fa';
import xLogo from '../assets/x.jpg';  // Adjust the path to where your image is located
import "./Footer.css";  // CSS file for styling

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <p>&copy; 2025 Geniswap. All rights reserved.</p>
        <div className="social-links">
          <a href="https://x.com/geniswap47884" target="_blank" rel="noopener noreferrer" className="social-icon">
            <img src={xLogo} alt="X logo" className="social-logo" />
          </a>
          <a href="https://www.instagram.com/geniswap" target="_blank" rel="noopener noreferrer" className="social-icon">
            <FaInstagram />
          </a>
          <a href="https://www.tiktok.com/@geniswaptrade" target="_blank" rel="noopener noreferrer" className="social-icon">
            <FaTiktok />
          </a>
          <a href="https://www.snapchat.com/add/geniswap" target="_blank" rel="noopener noreferrer" className="social-icon">
            <FaSnapchatGhost />
          </a>
          <a href="https://wa.me/2347025724225" target="_blank" rel="noopener noreferrer" className="social-icon">
            <FaWhatsapp />
          </a>
          <a href="https://www.facebook.com/share/169ez4dx7F/?mibextid=qi2Omg" target="_blank" rel="noopener noreferrer" className="social-icon">
            <FaFacebook />
          </a>
          <a href="https://www.linkedin.com/in/geni-swap-a0660835a/" target="_blank" rel="noopener noreferrer" className="social-icon">
            <FaLinkedin />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
