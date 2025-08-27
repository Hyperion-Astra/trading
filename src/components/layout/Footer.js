// src/components/layout/Footer.js
import React from "react";
import { FaXTwitter, FaInstagram, FaTiktok, FaSnapchatGhost, FaWhatsapp, FaFacebookF, FaLinkedinIn } from "react-icons/fa6";

function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-8 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 text-center md:text-left">
        
        {/* Branding */}
        <div>
          <h2 className="text-2xl font-bold text-blue-400">Changecog</h2>
          <p className="text-gray-400 mt-2">
            Secure and fast crypto & gift card trading platform.
          </p>
        </div>

        {/* Contact Info */}
        <div>
          <h3 className="text-lg font-semibold mb-2">Contact Us</h3>
          <p className="text-gray-400">Tel: 209-827-2194</p>
          <p className="text-gray-400">
            Email:{" "}
            <a
              href="mailto:enquiries@ugwumbacdiala.com"
              className="text-blue-400 hover:underline"
            >
              enquiries@ugwumbacdiala.com
            </a>
          </p>
        </div>

        {/* Social Links */}
        <div>
          <h3 className="text-lg font-semibold mb-2">Follow Us</h3>
          <div className="flex justify-center md:justify-start space-x-4 text-xl">
            <a href="#" aria-label="X / Twitter" className="hover:text-blue-400">
              <FaXTwitter />
            </a>
            <a href="#" aria-label="Instagram" className="hover:text-pink-400">
              <FaInstagram />
            </a>
            <a href="#" aria-label="TikTok" className="hover:text-white">
              <FaTiktok />
            </a>
            <a href="#" aria-label="Snapchat" className="hover:text-yellow-400">
              <FaSnapchatGhost />
            </a>
            <a href="#" aria-label="WhatsApp" className="hover:text-green-400">
              <FaWhatsapp />
            </a>
            <a href="#" aria-label="Facebook" className="hover:text-blue-600">
              <FaFacebookF />
            </a>
            <a href="#" aria-label="LinkedIn" className="hover:text-blue-500">
              <FaLinkedinIn />
            </a>
          </div>
        </div>
      </div>

      {/* Bottom note */}
      <div className="mt-6 text-center text-gray-500 text-sm">
        © {new Date().getFullYear()} ChangeCog. All rights reserved.
      </div>
    </footer>
  );
}

export default Footer;
