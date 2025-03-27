import React from "react";
import "./Footer.css";

const Footer = () => {
  
  return (
    <div className="container">

        <h1 className="logos" onClick={() => window.location.reload()} style={{ cursor: "pointer" }}>GeniSwap</h1>
        <p className="ton">@ 2025. Made by Hyperion_Astra</p>
      
    </div>
  );
};

export default Footer;
