// src/components/dashboard/ProfileCard.js
import React, { useEffect, useState } from "react";
import { auth, db } from "../../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { doc, getDoc, updateDoc } from "firebase/firestore";

function ProfileCard() {
  const [user] = useAuthState(auth);
  const [profile, setProfile] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [displayName, setDisplayName] = useState("");
  const [walletAddress, setWalletAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;
      try {
        const userRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(userRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setProfile(data);
          setDisplayName(data.displayName || "");
          setWalletAddress(data.walletAddress || "");
        }
      } catch (err) {
        console.error("Error fetching profile:", err);
      }
    };

    fetchProfile();
  }, [user]);

  const handleSave = async () => {
    if (!user) return;
    setLoading(true);
    setMessage("");

    try {
      const userRef = doc(db, "users", user.uid);
      await updateDoc(userRef, {
        displayName,
        walletAddress,
      });
      setProfile((prev) => ({
        ...prev,
        displayName,
        walletAddress,
      }));
      setMessage("Profile updated ✅");
      setEditMode(false);
    } catch (err) {
      console.error("Error updating profile:", err);
      setMessage("Failed to update profile ❌");
    }
    setLoading(false);
  };

  if (!user) return null;

  return (
    <div className="card">
      <h3>My Profile</h3>

      {!profile ? (
        <p className="text-muted">Loading profile...</p>
      ) : (
        <>
          {editMode ? (
            <div>
              <div className="form-group">
                <label>Display Name</label>
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="Enter your name"
                />
              </div>

              <div className="form-group">
                <label>Wallet Address</label>
                <input
                  type="text"
                  value={walletAddress}
                  onChange={(e) => setWalletAddress(e.target.value)}
                  placeholder="Enter wallet address"
                />
              </div>

              <div style={{ display: "flex", gap: "10px" }}>
                <button
                  onClick={handleSave}
                  disabled={loading}
                  className="btn btn-success"
                  style={{ flex: 1 }}
                >
                  {loading ? "Saving..." : "Save"}
                </button>
                <button
                  onClick={() => setEditMode(false)}
                  className="btn btn-danger"
                  style={{ flex: 1 }}
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div>
              <p><strong>Email:</strong> {profile.email}</p>
              <p>
                <strong>Role:</strong>{" "}
                <span className={`status status-${profile.role}`}>
                  {profile.role}
                </span>
              </p>
              <p>
                <strong>Joined:</strong>{" "}
                {profile.createdAt?.toDate
                  ? profile.createdAt.toDate().toLocaleDateString()
                  : "-"}
              </p>
              {profile.displayName && (
                <p><strong>Name:</strong> {profile.displayName}</p>
              )}
              {profile.walletAddress && (
                <p><strong>Wallet:</strong> {profile.walletAddress}</p>
              )}

              <button
                onClick={() => setEditMode(true)}
                className="btn btn-primary"
                style={{ marginTop: "10px", width: "100%" }}
              >
                Edit Profile
              </button>
            </div>
          )}

          {message && (
            <p className="text-muted" style={{ marginTop: "10px", textAlign: "center" }}>
              {message}
            </p>
          )}
        </>
      )}
    </div>
  );
}

export default ProfileCard;
