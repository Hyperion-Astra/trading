// src/pages/Login.js
import React, { useState } from "react";
import { auth, db } from "../firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { useNavigate, Link } from "react-router-dom";
import "./Login.css"; // Import CSS

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // ✅ Check if the email is verified
      if (!user.emailVerified) {
        setError("Please verify your email before logging in. Check your inbox.");
        setLoading(false);
        return;
      }

      // ✅ Fetch role from Firestore
      const userRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(userRef);

      if (docSnap.exists()) {
        const { role } = docSnap.data();
        navigate(role === "admin" ? "/admin-dashboard" : "/dashboard");
      } else {
        setError("No user role found. Please contact support.");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("Invalid email or password.");
    }

    setLoading(false);
  };

  return (
    <div className="login-container">
      <form onSubmit={handleLogin} className="login-form">
        <h2 className="form-title">Login</h2>

        {error && <p className="form-error">{error}</p>}

        <label>Email</label>
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <label>Password</label>
        <input
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button type="submit" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>

        <p className="form-footer">
          Don't have an account? <Link to="/register">Register</Link>
        </p>
        <p>
  Forgot your password? <Link to="/reset-password">Reset it here</Link>
</p>

      </form>
    </div>
  );
}

export default Login;
