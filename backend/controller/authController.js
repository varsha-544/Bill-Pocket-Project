const User = require('../models/user');
const jwt = require("jsonwebtoken");


// Register a new user
exports.register = async (req, res) => {
    try {
        const { username, name, email, mobile, ifsc, balance, password, confirmPassword } = req.body;

        // Simple validation
        if (password !== confirmPassword) {
            return res.status(400).json({ success: false, message: "Passwords don't match" });
        }

        // Check if user exists
        const existingUser = await User.findOne({ $or: [{ username }, { email }] });
        if (existingUser) {
            return res.status(400).json({ success: false, message: "User already exists" });
        }

        
        // Create new user (without hashing for simplicity)
        const user = new User({
            username,
            name,
            email,
            mobile,
            ifsc,
            balance,
            password
        });

        await user.save();

        res.status(201).json({ 
            success: true, 
            message: "Registration successful",
            user: {
                id: user._id,
                username: user.username,
                name: user.name,
                email: user.email,
                mobile: user.mobile,
                ifsc: user.ifsc,
                balance: user.balance
            }
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

// Login user
exports.login = async (req, res) => {
    try {
        const { username, password } = req.body;

        // Find user by username
        const user = await User.findOne({ username });
        // Check password (without hashing)
        if (!user || user.password !== password) {
            return res.status(400).json({ success: false, message: "Invalid credentials" });
        }
        // ✅ Generate JWT Token
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { 
            expiresIn: "1h",
         });

        console.log("✅ Token generated successfully:", token); // Debugging

        // Return user data (without password)
        res.json({
            success: true,
            token,
            user: {
                id: user._id,
                username: user.username,
                name: user.name,
                email: user.email,
                mobile: user.mobile,
                ifsc: user.ifsc,
                balance: user.balance
            }
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Server error" });
    }
};