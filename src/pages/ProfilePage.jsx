import React from "react";
import { useAuth } from "../context/AuthContext.jsx";

const ProfilePage = () => {
  const { user } = useAuth();

  if (!user) return <p className="state-message">Loading user profile...</p>;

  return (
    <div className="profile-card">
      <h2>User Profile</h2>
      <div className="profile-details">
        <p>
          <strong>Name:</strong> {user.name}
        </p>
        <p>
          <strong>Email:</strong> {user.email}
        </p>
        <p>
          <strong>User ID:</strong> {user.id || user._id}
        </p>
      </div>
    </div>
  );
};

export default ProfilePage;
