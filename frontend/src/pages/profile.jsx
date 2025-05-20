import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../CSS/profile.css";


function Profile() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const userData = JSON.parse(localStorage.getItem('user'));
        if (userData) {
            setUser(userData);
            setIsLoggedIn(true);
        }
    }, []);

    const handleLogin = () => {
        navigate("/login");
    };

    const handleLogout = () => {
        localStorage.removeItem('user');
        localStorage.clear();
        setIsLoggedIn(false);
        setUser(null);
        navigate("/");
    };

    return (
        <div className="coloru">
            <div className="profile-container">
                <h2 className="profile-container h2">Profile</h2>
                {user ? (
                    <div className="profile-section">
                        <div className="profile-row">
                            <label className="profile-label">Name:</label>
                            <span className="profile-value">{user.name}</span>
                        </div>
                        <div className="profile-row">
                            <label className="profile-label">Email:</label>
                            <span className="profile-value">{user.email}</span>
                        </div>
                        <div className="profile-row">
                            <label className="profile-label">IFSC:</label>
                            <span className="profile-value">{user.ifsc}</span>
                        </div>
                        <div className="profile-row">
                            <label className="profile-label">Mobile Number:</label>
                            <span className="profile-value">{user.mobile}</span>
                        </div>
                        <div className="profile-row">
                            <label className="profile-label">Bank Balance:</label>
                            <span className="profile-value">{user.balance}/-</span>
                        </div>
                    </div>
                ) : (
                    <p>No user data available. Please log in.</p>
                )}
                <div className="profile-actions">
                    <button
                        className="profile-button"
                        onClick={handleLogin}
                        disabled={isLoggedIn}
                    >
                        Login
                    </button>
                    <button
                        className="profile-button"
                        onClick={handleLogout}
                        disabled={!isLoggedIn}
                    >
                        Logout
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Profile;