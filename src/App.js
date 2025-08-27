// src/App.js
import React, { useEffect, useState } from "react";
import "./App.css";
import Main from "./components/Main";
import About from "./components/About";
import ServicesSection from "./components/ServicesSection";
import Finance from "./components/Finance";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import Modal from "./components/Modal";
import AOS from "aos";
import "aos/dist/aos.css";
import ResetPassword from "./pages/ResetPassword";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "./firebase";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import AdminDashboard from "./pages/AdminDashboard";
import NotFound from "./pages/NotFound";
import PrivateRoute from "./components/PrivateRoute";
import PublicRoute from "./components/PublicRoute";
import { doc, getDoc } from "firebase/firestore";
import { Toaster } from "react-hot-toast";
import VerifyEmail from "./pages/VerifyEmail";

function App() {
  const [user] = useAuthState(auth);
  const [userRole, setUserRole] = useState(null);
  const [loadingRole, setLoadingRole] = useState(true);

  // Initialize AOS animations
  useEffect(() => {
    AOS.init({ duration: 800, once: true });
  }, []);

  // Fetch user role from Firestore
  useEffect(() => {
    const fetchUserRole = async () => {
      if (user) {
        try {
          const userRef = doc(db, "users", user.uid);
          const docSnap = await getDoc(userRef);
          if (docSnap.exists()) {
            setUserRole(docSnap.data().role || "user");
          } else {
            setUserRole("user"); // default role
          }
        } catch (err) {
          console.error("Error fetching user role:", err);
          setUserRole("user"); // fallback
        }
      } else {
        setUserRole(null);
      }
      setLoadingRole(false);
    };

    fetchUserRole();
  }, [user]);

  if (loadingRole) return <div>Loading...</div>;

  return (
    <>
    <Router>
      <Routes>
        {/* ==== PUBLIC SITE ==== */}
        <Route
          path="/"
          element={
            <>
              <Main />
              <About />
              <ServicesSection />
              <Finance />
              <Contact />
              <Footer />
              <Modal />
            </>
          }
        />

        {/* ==== AUTH ==== */}
        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />
        <Route
          path="/register"
          element={
            <PublicRoute>
              <Register />
            </PublicRoute>
          }
        />
        <Route 
        path="/verify-email" 
        element={
          <PublicRoute>
        <VerifyEmail />
        </PublicRoute>
      } 
      />
      <Route path="/reset-password" element={
        <PublicRoute>
          <ResetPassword />
          </PublicRoute>} />



        {/* ==== DASHBOARD ==== */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute allowedRoles={["user"]} userRole={userRole}>
              <Dashboard />
            </PrivateRoute>
          }
        />

        {/* ==== ADMIN DASHBOARD ==== */}
        <Route
          path="/admin-dashboard"
          element={
            <PrivateRoute allowedRoles={["admin"]} userRole={userRole}>
              <AdminDashboard />
            </PrivateRoute>
          }
        />

        {/* ==== NOT FOUND ==== */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
    <Toaster position="top-right" reverseOrder={false} />
    </>
  );
}

export default App;
