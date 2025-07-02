import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; 

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import "../CSS/statement.css";
import {
  getStatements,
  createStatement,
  updateStatement,
  deleteStatement,
} from "../api/statementAPI";

function Statement() {
  const navigate = useNavigate(); // ✅ Initialize navigation
  const [statements, setStatements] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newStatement, setNewStatement] = useState({
    date: "",
    item: "",
    cost: "",
    note: "",
  });
  const [editIndex, setEditIndex] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortKey, setSortKey] = useState("date");
  const [monthlyIncome, setMonthlyIncome] = useState(localStorage.getItem("monthlyIncome") || "");
  const [confirmedIncome, setConfirmedIncome] = useState(null); // ✅ Track confirmed income

  const handleIncomeChange = (e) => {
    setMonthlyIncome(e.target.value);
    localStorage.setItem("monthlyIncome", e.target.value); // ✅ Save income for persistence
};
 
  useEffect(() => {
  const fetchStatementsData = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please login to access statements.");
      navigate("/login");
      return;
    }

    try {
      const response = await getStatements();
      console.log("🚀 API Response:", response);
      if (response && response.length > 0) {
        setStatements(response);
        localStorage.setItem("statements", JSON.stringify(response)); // ✅ localStorage sync
      } else {
        const saved = JSON.parse(localStorage.getItem("statements") || "[]"); // ✅ fallback
        setStatements(saved);
      }
    } catch (error) {
      console.error("Error fetching statements:", error);
      const saved = JSON.parse(localStorage.getItem("statements") || "[]"); // ✅ fallback
      setStatements(saved);
    }
  };

  fetchStatementsData();
}, [navigate]);
useEffect(() => {
  localStorage.setItem("statements", JSON.stringify(statements)); // ✅ update storage on change
}, [statements]);

  const totalExpense = statements.reduce((total, s) => total + parseFloat(s.cost || 0), 0);
  const remainingBalance = monthlyIncome ? monthlyIncome - totalExpense : 0; // ✅ Adjust dynamically
  const suggestedSavings = monthlyIncome ? (monthlyIncome * 0.2).toFixed(2) : 0; // ✅ Suggest saving 20%
 
const handleConfirmIncome = () => {
   const incomeValue= parseFloat(monthlyIncome); 
    if (isNaN(incomeValue) || incomeValue <= 0) {
        alert("⚠️ Please enter a valid monthly income!");
        return;
    }
    setConfirmedIncome(incomeValue); // ✅ Save confirmed income
    alert(`✅ Monthly Income set to ₹${incomeValue}`); 
};

  useEffect(() => {
     if (confirmedIncome === null || confirmedIncome <= 0) return;
 // ✅ Prevent alerts until income is confirmed

    if (totalExpense > confirmedIncome) {
        alert("⚠️ You’ve exceeded your monthly income!");
    } else if (totalExpense > confirmedIncome * 0.9) {
        alert("🔔 You’re close to spending all of your monthly income.");
    }
}, [totalExpense, confirmedIncome]); // ✅ Only check confirmed income

  const lineChartData = [...(statements || [])]
    .map((s) => ({
      date: s.date,
      cost: parseFloat(s.cost),
    }))
    .sort((a, b) => new Date(a.date) - new Date(b.date));

   const handleSubmitStatement = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("⚠️ Authentication error! Please log in again.");
        navigate("/login");
        return;
      }
         const statementToSend = { ...newStatement };
           // ✅ Prevent empty fields
         if (!statementToSend.date || !statementToSend.item || !statementToSend.cost) {
            alert("⚠️ All fields are required!");
            return;
        }

        let response;
        if (editIndex !== null) {
         const statementId = statements[editIndex]?._id || statements[editIndex]?.id;
           if (!statementId) {
                alert("⚠️ Error: Statement ID not found!");
                return;
            }
            response = await updateStatement(statementId, statementToSend, {
                headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" }
            });
            // ✅ Properly update the edited statement in the state
            setStatements(statements.map((s, i) => (i === editIndex ? response : s)));
            
        } else {
            response = await createStatement(statementToSend, {
                headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" }
            });

            setStatements([...statements, response]);
        }

        setNewStatement({ date: "", item: "", cost: "", note: "" });
        setEditIndex(null);
        setIsModalOpen(false);
  }  catch (err) {
       console.error("Error submitting statement:", err.response?.data || err.message);
        alert("Failed to submit statement. Please try again.");
  }
};

 const handleEditStatement = (index) => {
    if (index < 0 || index >= statements.length) {
        alert("⚠️ Error: Invalid statement index!");
        return;
    }

    const statementToEdit = statements[index];  // ✅ Correctly retrieve statement
    if (!statementToEdit) {
        alert("⚠️ Error: Statement not found!");
        return;
    }

    setNewStatement({ ...statementToEdit }); // ✅ Fill the form with statement data
    setEditIndex(index); // ✅ Set the index for editing
    setIsModalOpen(true); // ✅ Open the modal when button is clicked
};

const handleDeleteStatement = async (index) => {
    try {
        const token = localStorage.getItem("token");
        if (!token) {
            alert("⚠️ Authentication error! Please log in again.");
            navigate("/login");
            return;
        }

        const statementId = statements[index]?._id || statements[index]?.id;
        if (!statementId) {
            alert("⚠️ Error: Statement ID not found!");
            return;
        }

        await deleteStatement(statementId, {
            headers: { Authorization: `Bearer ${token}` }
        });

        setStatements(statements.filter((_, i) => i !== index)); // ✅ Update UI after deletion
    } catch (err) {
        console.error("❌ Error deleting statement:", err.response?.data || err.message);
        alert("Failed to delete statement. Please try again.");
    }
};

  const handleCloseModal = () => {
    setNewStatement({ date: "", item: "", cost: "", note: "" });
    setIsModalOpen(false);
    setEditIndex(null);
  };

  const filteredStatements = [...statements]
    .filter((s) => (s.item || "").toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => {
      if (sortKey === "cost") return parseFloat(b.cost) - parseFloat(a.cost);
      if (sortKey === "date") return new Date(b.date) - new Date(a.date);
      return 0;
    });

  return (
    <div className="statement-page">
      <div className="column">
        <div className="column-header">
          <h2>Statements</h2>
          <button onClick={() => setIsModalOpen(true)}>Add</button>
        </div>

        <div className="controls">
          <input
            type="text"
            placeholder="Search by item..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <select value={sortKey} onChange={(e) => setSortKey(e.target.value)}>
            <option value="date">Sort by Date</option>
            <option value="cost">Sort by Cost</option>
          </select>
        </div>
          <div className="income-input">
          <label>Monthly Income: ₹</label>
         <input 
             type="number" 
            value={monthlyIncome} 
            onChange={(e) => setMonthlyIncome(e.target.value)} 
            placeholder="Enter your monthly income" 
           />
        <button onClick={handleConfirmIncome}>OK</button>   
      </div>

        <ul>
          {statements && statements.length > 0 ? (
            statements.map((statement, index) => (          
            <li key={statement._id || statement.id || index}>
              <span><strong>Date:</strong> {statement.date}</span>
              <span><strong>Goal:</strong> {statement.item}</span>
              <span><strong>Cost:</strong> ₹{statement.cost}</span>
              {statement.note && <span><strong>Note:</strong> {statement.note}</span>}
              <div className="statement1-actions">
                <button onClick={() => handleEditStatement(index)}>Edit</button>
                <button onClick={() => handleDeleteStatement(index)}>Delete</button>
              </div>
            </li>
          ))
        ) : (
            <p>No statements available. Try adding one!</p> // ✅ Prevent blank page
          )}
        </ul>
        <div className="expensse-slot">
           <span><strong>Monthly Income:</strong> ₹{monthlyIncome || "Not Set"}</span>
           <span><strong>Total Expense:</strong> ₹{totalExpense}</span>
           <span><strong>Remaining Balance:</strong> ₹{remainingBalance}</span>
           <span><strong>Suggested Savings (20%):</strong> ₹{suggestedSavings}</span>
       </div>

        <div className="chart-container">
          <h3>Expense Trend</h3>
          {lineChartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={lineChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="cost" stroke="#82ca9d" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <p>No data to display</p>
          )}
        </div>
      </div>

      {isModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <h3>{editIndex !== null ? "Edit Statement" : "Add Statement"}</h3>
            <input
              type="date"
              value={newStatement.date}
              onChange={(e) => setNewStatement({ ...newStatement, date: e.target.value })}
              placeholder="Date"
            />
            <input
              type="text"
              value={newStatement.item}
              onChange={(e) => setNewStatement({ ...newStatement, item: e.target.value })}
              placeholder="Item"
            />
            <input
              type="number"
              value={newStatement.cost}
              onChange={(e) => setNewStatement({ ...newStatement, cost: e.target.value })}
              placeholder="Cost"
            />
            <textarea
              value={newStatement.note}
              onChange={(e) => setNewStatement({ ...newStatement, note: e.target.value })}
              placeholder="Optional Note"
            />
            <div className="modal-buttons">
              <button onClick={handleSubmitStatement}>Submit</button>
              <button onClick={handleCloseModal}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Statement;
