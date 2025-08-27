// src/pages/VerifyEmail.js
import React, { useState } from "react";
import { auth } from "../firebase";
import { sendEmailVerification } from "firebase/auth";
import { Link } from "react-router-dom";
import "./VerifyEmail.css"; // optional styling

export default function VerifyEmail() {
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleResend = async () => {
    setMessage("");
    setError("");
    if (auth.currentUser && !auth.currentUser.emailVerified) {
      try {
        await sendEmailVerification(auth.currentUser);
        setMessage("Verification email resent. Please check your inbox.");
      } catch (err) {
        setError("Failed to resend verification email. Try again later.");
      }
    } else {
      setError("You are either not logged in or already verified.");
    }
  };

  return (
    <div className="verify-email-container">
      <h2>Verify Your Email</h2>
      <p>
        We’ve sent you a verification link. Please check your inbox and click
        the link to verify your email before logging in.
      </p>
      <p>
        Didn’t get the email?{" "}
        <button onClick={handleResend} className="resend-btn">
          Resend Verification
        </button>
      </p>
      {message && <p className="success">{message}</p>}
      {error && <p className="error">{error}</p>}
      <p>
        Once verified, you can <Link to="/login">log in here</Link>.
      </p>
    </div>
  );
}
