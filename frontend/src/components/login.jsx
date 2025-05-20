import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../CSS/login.css";

function Login({ setIsLoggedIn }) {
    const location = useLocation();
    const navigate = useNavigate();

    // Show Register if path is "/register", else Login
    const [isFlipped, setIsFlipped] = useState(location.pathname === "/register");

    useEffect(() => {
        setIsFlipped(location.pathname === "/register");
    }, [location.pathname]);

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleFlip = () => {
        setIsFlipped(!isFlipped);
        // Change URL according to the shown form
        if (isFlipped) {
            navigate("/login");
        } else {
            navigate("/register");
        }
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData.entries());

        if (data.password !== data["confirm-password"]) {
            setError("Passwords don't match");
            return;
        }

        try {
            const response = await fetch("http://localhost:5000/api/auth/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    username: data.username,
                    name: data.name,
                    email: data.email,
                    mobile: data.mobile,
                    ifsc: data.ifsc,
                    balance: parseFloat(data.balance),
                    password: data.password,
                    confirmPassword: data["confirm-password"],
                }),
            });

            const result = await response.json();
            console.log("Login response result:", result);

            if (!response.ok) {
                throw new Error(result.message || "Registration failed");
            }

            if (result.success) {
                alert("Registration successful!");
                localStorage.setItem("user", JSON.stringify(result.user)); // Store user after registration
                localStorage.setItem("hasLoggedIn", "true");    
                setIsFlipped(false); // Flip to login page
                setError("");
                navigate("/login"); // Update URL to login
            } else {
                setError(result.message || "Registration failed");
            }
        } catch (err) {
            console.error("Registration error:", err);
            setError(err.message || "Registration failed. Please try again.");
        }
    };

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch("http://localhost:5000/api/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ username: username, password: password }),
            });

            const result = await response.json();
            console.log("Login API response:", result);

            if (result.success && result.user) {
                // ✅ Store the token from the parsed result
            if (result.token) {
            localStorage.setItem("token", result.token);
            } else {
               console.warn("No token received from backend.");
            }
                localStorage.setItem("user", JSON.stringify(result.user));
                localStorage.setItem("hasLoggedIn", "true");   
                
                setIsLoggedIn(true);
                console.log("User logged in, redirecting...");
                navigate("/");
            } else {
                setError(result.message || "Invalid username or password");
            }
        } catch (err) {
            console.error("Login error:", err);
            setError("Login failed. Please try again.");
        }
    };

    return (
        <div className={`content ${isFlipped ? "flipped-background" : ""}`}>
            <div className={`login-container ${isFlipped ? "flipped" : ""}`}>
                {/* Registration Form */}
                {isFlipped && (
                    <div className="registration-form-container">
                        <h2 className="login-heading">Register</h2>
                        {error && <p className="error">{error}</p>}
                        <form className="registration-form" onSubmit={handleRegister}>
                            {/* Left Column */}
                            <div className="registration-column">
                                <div className="form-group">
                                    <label htmlFor="username">Username</label>
                                    <input
                                        type="text"
                                        id="username"
                                        name="username"
                                        placeholder="Enter your username"
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="email">Email</label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        placeholder="Enter your email"
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="balance">Bank Balance</label>
                                    <input
                                        type="number"
                                        id="balance"
                                        name="balance"
                                        placeholder="Enter your bank balance"
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="password">Password</label>
                                    <input
                                        type="password"
                                        id="password"
                                        name="password"
                                        placeholder="Enter your password"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Right Column */}
                            <div className="registration-column">
                                <div className="form-group">
                                    <label htmlFor="name">Name</label>
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        placeholder="Enter your name"
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="mobile">Mobile Number</label>
                                    <input
                                        type="text"
                                        id="mobile"
                                        name="mobile"
                                        placeholder="Enter your mobile number"
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="ifsc">IFSC</label>
                                    <input
                                        type="text"
                                        id="ifsc"
                                        name="ifsc"
                                        placeholder="Enter your bank IFSC code"
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="confirm-password">Confirm Password</label>
                                    <input
                                        type="password"
                                        id="confirm-password"
                                        name="confirm-password"
                                        placeholder="Confirm your password"
                                        required
                                    />
                                </div>
                            </div>
                            <div className="form-actions">
                                <button type="submit" className="login-button">
                                    Register
                                </button>
                                <p className="toggle-text" onClick={handleFlip}>
                                    Already have an account? Login here
                                </p>
                            </div>
                        </form>
                    </div>
                )}

                {/* Login Form */}
                {!isFlipped && (
                    <div className="login-form-container">
                        <h2 className="login-heading">Login</h2>
                        {error && <p className="error">{error}</p>}
                        <form className="login-form" onSubmit={handleLogin}>
                            <div className="form-group">
                                <label htmlFor="username">Username</label>
                                <input
                                    type="text"
                                    id="username"
                                    name="username"
                                    placeholder="Enter your username"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="password">Password</label>
                                <input
                                    type="password"
                                    id="password"
                                    name="password"
                                    placeholder="Enter your password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>
                            <button type="submit" className="login-button">
                                Login
                            </button>
                            <p className="toggle-text" onClick={handleFlip}>
                                Don't have an account? Register here
                            </p>
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Login;
