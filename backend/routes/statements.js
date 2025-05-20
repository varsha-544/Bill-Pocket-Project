const express = require("express");
const router = express.Router();
const Statement = require("../models/Statement");
const { authenticateToken } = require("../middleware/authMiddleware");

// ✅ Get all statements for the authenticated user
router.get("/", authenticateToken, async (req, res) => {
    try {
        const statements = await Statement.find({ userId: req.user.id });
        res.json(statements);
    } catch (err) {
        console.error("Error fetching statements:", err.message);
        res.status(500).json({ message: "Server error" });
    }
});

// ✅ Create a new statement
router.post("/", authenticateToken, async (req, res) => {
    console.log("Incoming request body:", req.body);
    console.log("Authenticated User:", req.user);

    const { date, item, cost, note } = req.body;

    if (!req.user || !req.user.id || !date || !item || !cost) {
        return res.status(400).json({ message: "All fields are required!" });
    }

    const newStatement = new Statement({
        userId: req.user.id,
        date,
        item,
        cost,
        note: note || "",
    });

    try {
        const savedStatement = await newStatement.save();
        res.status(201).json(savedStatement);
    } catch (err) {
        console.error("Error saving statement:", err.message);
        res.status(500).json({ message: "Server error. Try again later." });
    }
});

// ✅ Update a statement
router.put("/:id", authenticateToken, async (req, res) => {
    const { date, item, cost } = req.body;

    try {
        const statement = await Statement.findById(req.params.id);

        if (!statement) {
            return res.status(404).json({ message: "Statement not found" });
        }

        if (statement.userId.toString() !== req.user.id) {
            return res.status(403).json({ message: "Unauthorized" });
        }

        statement.date = date || statement.date;
        statement.item = item || statement.item;
        statement.cost = cost || statement.cost;

        const updatedStatement = await statement.save();
        res.json(updatedStatement);
    } catch (err) {
        console.error("Error updating statement:", err.message);
        res.status(400).json({ message: err.message });
    }
});

// ✅ Delete a statement
router.delete("/:id", authenticateToken, async (req, res) => {
    try {
        const statement = await Statement.findById(req.params.id);

        if (!statement) {
            return res.status(404).json({ message: "Statement not found" });
        }

        if (statement.userId.toString() !== req.user.id) {
            return res.status(403).json({ message: "Unauthorized" });
        }

        await statement.deleteOne();
        res.json({ message: "Statement deleted successfully" });
    } catch (err) {
        console.error("Error deleting statement:", err.message);
        res.status(500).json({ message: "Server error" });
    }
});

module.exports = router;
