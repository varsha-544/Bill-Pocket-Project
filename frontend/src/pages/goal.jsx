import { useState, useEffect } from "react";
import axios from "axios";
import "../CSS/goal.css";

function Goal() {
    const [isShortTermModalOpen, setIsShortTermModalOpen] = useState(false);
    const [isLongTermModalOpen, setIsLongTermModalOpen] = useState(false);
    const [shortTermGoals, setShortTermGoals] = useState([]);
    const [longTermGoals, setLongTermGoals] = useState([]);
    const [newGoal, setNewGoal] = useState({ date: "", goal: "", cost: "" });
    const [editIndex, setEditIndex] = useState(null);
    const [isEditingShortTerm, setIsEditingShortTerm] = useState(false);
    const [shortTermExpense, setShortTermExpense] = useState(0);
    const [longTermExpense, setLongTermExpense] = useState(0);
    const [shortTermMonthlySaving, setShortTermMonthlySaving] = useState(0);
    const [longTermMonthlySaving, setLongTermMonthlySaving] = useState(0);

    const baseURL = "http://localhost:5000/api";

    useEffect(() => {
        const getGoals = async () => {
            try {
                const storedUser = JSON.parse(localStorage.getItem("user"));
                console.log("Stored User:", storedUser);

                const currentUserId = storedUser?.id;

                if (!currentUserId) {
                    console.log("User ID missing in localStorage:", storedUser);
                    return;
                }

                const res = await axios.get(`${baseURL}/goals?userId=${currentUserId}`);
                const goals = res.data;

                const shortGoals = goals.filter(goal => goal.type === "short");
                const longGoals = goals.filter(goal => goal.type === "long");

                setShortTermGoals(shortGoals);
                setLongTermGoals(longGoals);

                // ✅ Save to localStorage for homepage preview
                localStorage.setItem("goals", JSON.stringify({ shortTerm: shortGoals, longTerm: longGoals }));
            } catch (err) {
                console.error("Failed to fetch goals:", err);
            }
        };

        getGoals();
    }, []);

    useEffect(() => {
        calculateShortTermExpense();
        calculateLongTermExpense();
        calculateMonthlySavings();
    }, [shortTermGoals, longTermGoals]);

    const calculateShortTermExpense = () => {
        const total = shortTermGoals.reduce((sum, goal) => sum + parseFloat(goal.cost || 0), 0);
        setShortTermExpense(total);
    };

    const calculateLongTermExpense = () => {
        const total = longTermGoals.reduce((sum, goal) => sum + parseFloat(goal.cost || 0), 0);
        setLongTermExpense(total);
    };

    const calculateMonthlySavings = () => {
        const currentDate = new Date();

        const calculateForGoals = (goals) => {
            let totalSaving = 0;
            goals.forEach(goal => {
                const goalDate = new Date(goal.date);
                const diffMonths = Math.max(
                    (goalDate.getFullYear() - currentDate.getFullYear()) * 12 +
                    (goalDate.getMonth() - currentDate.getMonth()),
                    1
                );
                const cost = parseFloat(goal.cost || 0);
                totalSaving += cost / diffMonths;
            });
            return totalSaving;
        };

        setShortTermMonthlySaving(calculateForGoals(shortTermGoals));
        setLongTermMonthlySaving(calculateForGoals(longTermGoals));
    };

    const handleAddShortTermGoal = async () => {
        console.log("Short Term Submit clicked");
        try {
            if (!newGoal.goal || !newGoal.cost || !newGoal.date) {
                alert("Please fill in all fields.");
                return;
            }

            const storedUser = JSON.parse(localStorage.getItem("user"));
            const currentUserId = storedUser?.id;

            if (!currentUserId) {
                alert("User not logged in");
                return;
            }

            const payload = {
                userId: currentUserId,
                goal: newGoal.goal.trim(),
                cost: parseFloat(newGoal.cost),
                date: newGoal.date,
                type: "short"
            };

            if (isEditingShortTerm) {
                const res = await axios.put(`${baseURL}/goals/${shortTermGoals[editIndex]._id}`, payload);
                const updatedGoals = [...shortTermGoals];
                updatedGoals[editIndex] = res.data;
                setShortTermGoals(updatedGoals);
                setIsEditingShortTerm(false);
            } else {
                const res = await axios.post(`${baseURL}/goals`, payload);
                setShortTermGoals([...shortTermGoals, res.data]);
            }
            resetModal();
        } catch (err) {
            console.error(err);
        }
    };

    const handleAddLongTermGoal = async () => {
        try {
            if (!newGoal.goal || !newGoal.cost || !newGoal.date) {
                alert("Please fill in all fields.");
                return;
            }

            const storedUser = JSON.parse(localStorage.getItem("user"));
            const currentUserId = storedUser?.id;

            if (!currentUserId) {
                alert("User not logged in");
                return;
            }

            const payload = {
                userId: currentUserId,
                goal: newGoal.goal.trim(),
                cost: parseFloat(newGoal.cost),
                date: newGoal.date,
                type: "long"
            };

            if (editIndex !== null) {
                const res = await axios.put(`${baseURL}/goals/${longTermGoals[editIndex]._id}`, payload);
                const updatedGoals = [...longTermGoals];
                updatedGoals[editIndex] = res.data;
                setLongTermGoals(updatedGoals);
            } else {
                const res = await axios.post(`${baseURL}/goals`, payload);
                setLongTermGoals([...longTermGoals, res.data]);
            }
            resetModal();
        } catch (err) {
            console.error(err);
        }
    };

    const handleDeleteShortTermGoal = async (index) => {
        try {
            await axios.delete(`${baseURL}/goals/${shortTermGoals[index]._id}`);
            const updatedGoals = shortTermGoals.filter((_, i) => i !== index);
            setShortTermGoals(updatedGoals);
            localStorage.setItem("goals", JSON.stringify({ shortTerm: updatedGoals, longTerm: longTermGoals }));
        } catch (err) {
            console.error(err);
        }
    };

    const handleDeleteLongTermGoal = async (index) => {
        try {
            await axios.delete(`${baseURL}/goals/${longTermGoals[index]._id}`);
            const updatedGoals = longTermGoals.filter((_, i) => i !== index);
            setLongTermGoals(updatedGoals);
            localStorage.setItem("goals", JSON.stringify({ shortTerm: shortTermGoals, longTerm: updatedGoals }));
        } catch (err) {
            console.error(err);
        }
    };

    const handleEditShortTermGoal = (index) => {
        setNewGoal(shortTermGoals[index]);
        setEditIndex(index);
        setIsEditingShortTerm(true);
        setIsShortTermModalOpen(true);
    };

    const handleEditLongTermGoal = (index) => {
        setNewGoal(longTermGoals[index]);
        setEditIndex(index);
        setIsLongTermModalOpen(true);
    };

    const resetModal = () => {
        setNewGoal({ date: "", goal: "", cost: "" });
        setIsShortTermModalOpen(false);
        setIsLongTermModalOpen(false);
        setEditIndex(null);
        setIsEditingShortTerm(false);

        // 🔄 Sync latest goal data to localStorage
        localStorage.setItem("goals", JSON.stringify({ shortTerm: shortTermGoals, longTerm: longTermGoals }));
    };

    return (
        <div className="goal-page">
            <div className="split">
                <div className="columns">
                    <div className="column">
                        <div className="column-header">
                            <h2>Short Term Goals</h2>
                            <button onClick={() => setIsShortTermModalOpen(true)}>Add</button>
                        </div>
                        <ul>
                            {shortTermGoals.map((goal, index) => (
                                <li key={goal._id}>
                                    <strong>Date:</strong> {goal.date} <br />
                                    <strong>Goal:</strong> {goal.goal} <br />
                                    <strong>Estimated Cost:</strong> ₹{goal.cost}
                                    <div className="goal-actions">
                                        <button onClick={() => handleEditShortTermGoal(index)}>Edit</button>
                                        <button onClick={() => handleDeleteShortTermGoal(index)}>Delete</button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="column">
                        <div className="column-header">
                            <h2>Long Term Goals</h2>
                            <button onClick={() => setIsLongTermModalOpen(true)}>Add</button>
                        </div>
                        <ul>
                            {longTermGoals.map((goal, index) => (
                                <li key={goal._id}>
                                    <strong>Date:</strong> {goal.date} <br />
                                    <strong>Goal:</strong> {goal.goal} <br />
                                    <strong>Estimated Cost:</strong> ₹{goal.cost}
                                    <div className="goal-actions">
                                        <button onClick={() => handleEditLongTermGoal(index)}>Edit</button>
                                        <button onClick={() => handleDeleteLongTermGoal(index)}>Delete</button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
                <div className="expense-slots">
                    <div className="expense-slot">
                        <p><strong>Short Term Estimated Expense:</strong><br />₹{shortTermExpense.toFixed(2)}</p>
                        <p>Save approx: <strong>₹{shortTermMonthlySaving.toFixed(2)}</strong> per month</p>
                    </div>
                    <div className="expense-slot">
                        <p><strong>Long Term Estimated Expense:</strong><br />₹{longTermExpense.toFixed(2)}</p>
                        <p>Save approx: <strong>₹{longTermMonthlySaving.toFixed(2)}</strong> per month</p>
                    </div>
                </div>
            </div>

            {/* Modals */}
            {isShortTermModalOpen && (
                <div className="modal">
                    <div className="modal-content">
                        <h3>{isEditingShortTerm ? "Edit Short Term Goal" : "Add Short Term Goal"}</h3>
                        <input type="date" value={newGoal.date} onChange={(e) => setNewGoal({ ...newGoal, date: e.target.value })} />
                        <input type="text" value={newGoal.goal} onChange={(e) => setNewGoal({ ...newGoal, goal: e.target.value })} placeholder="Enter your goal" />
                        <input type="text" value={newGoal.cost} onChange={(e) => setNewGoal({ ...newGoal, cost: e.target.value })} placeholder="Estimated Cost" />
                        <div className="modal-buttons">
                            <button onClick={handleAddShortTermGoal}>Submit</button>
                            <button onClick={resetModal}>Cancel</button>
                        </div>
                    </div>
                </div>
            )}

            {isLongTermModalOpen && (
                <div className="modal">
                    <div className="modal-content">
                        <h3>{editIndex !== null ? "Edit Long Term Goal" : "Add Long Term Goal"}</h3>
                        <input type="date" value={newGoal.date} onChange={(e) => setNewGoal({ ...newGoal, date: e.target.value })} />
                        <input type="text" value={newGoal.goal} onChange={(e) => setNewGoal({ ...newGoal, goal: e.target.value })} placeholder="Enter your goal" />
                        <input type="text" value={newGoal.cost} onChange={(e) => setNewGoal({ ...newGoal, cost: e.target.value })} placeholder="Estimated Cost" />
                        <div className="modal-buttons">
                            <button onClick={handleAddLongTermGoal}>Submit</button>
                            <button onClick={resetModal}>Cancel</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Goal;
