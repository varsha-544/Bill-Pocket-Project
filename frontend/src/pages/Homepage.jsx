import { Link, useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import "../CSS/homepage.css";

const GoalPreview = ({ goals }) => (
  <>
    {goals.shortTerm.slice(0, 2).map((goal, index) => (
      <React.Fragment key={`short-${index}`}>
        {goal.date} - {goal.goal} - ₹{goal.cost}<br />
      </React.Fragment>
    ))}
    {goals.longTerm.slice(0, 1).map((goal, index) => (
      <React.Fragment key={`long-${index}`}>
        {goal.date} - {goal.goal} - ₹{goal.cost}<br />
      </React.Fragment>
    ))}
  </>
);

function Homepage() {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pressTimer, setPressTimer] = useState(null);
  const [goals, setGoals] = useState({ shortTerm: [], longTerm: [] });
  const [user, setUser] = useState(null);
  const [statements, setStatements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [goalExpense, setGoalExpense] = useState("--");
  const [expectedExpenditure, setExpectedExpenditure] = useState("--");

  const STORAGE_KEYS = {
    USER: "user",
    GOALS: "goals",
    STATEMENTS: "statements",
    HAS_LOGGED_IN: "hasLoggedIn",  // added key for login tracking
  };

  // Check if user has logged in before from localStorage
  const [hasLoggedInBefore, setHasLoggedInBefore] = useState(
    localStorage.getItem(STORAGE_KEYS.HAS_LOGGED_IN) === "true"
  );

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem(STORAGE_KEYS.USER) || "null");
    const storedGoals = JSON.parse(localStorage.getItem(STORAGE_KEYS.GOALS) || '{"shortTerm":[],"longTerm":[]}');
    const storedStatements = JSON.parse(localStorage.getItem(STORAGE_KEYS.STATEMENTS) || "[]");

    if (userData) {
      setUser(userData);
      // Since user data is present, set hasLoggedIn flag to true
      localStorage.setItem(STORAGE_KEYS.HAS_LOGGED_IN, "true");
      setHasLoggedInBefore(true);
    }
    if (storedGoals) setGoals(storedGoals);
    if (storedStatements) setStatements(storedStatements);

    setLoading(false);
  }, []);

  useEffect(() => {
    if (!user) return;

    localStorage.setItem(STORAGE_KEYS.GOALS, JSON.stringify(goals));
    localStorage.setItem(STORAGE_KEYS.STATEMENTS, JSON.stringify(statements));

    const totalGoalExpense =
      goals.shortTerm.reduce((sum, g) => sum + parseFloat(g.cost || 0), 0) +
      goals.longTerm.reduce((sum, g) => sum + parseFloat(g.cost || 0), 0);

    const totalExpectedExpenditure = statements.reduce((sum, s) => sum + parseFloat(s.cost || 0), 0);

    setGoalExpense(`₹${totalGoalExpense.toFixed(2)}`);
    setExpectedExpenditure(`₹${totalExpectedExpenditure.toFixed(2)}`);
  }, [goals, statements, user]);

  const handlePressStart = () => {
    const timer = setTimeout(() => setIsModalOpen(true), 400);
    setPressTimer(timer);
  };

  const handlePressEnd = () => {
    clearTimeout(pressTimer);
  };

  const handleCloseModal = (e) => {
    if (e.target.className === "modal-overlay") {
      setIsModalOpen(false);
    }
  };

  const trend =
    statements.length >= 2 && parseFloat(statements[0].cost) > parseFloat(statements[1].cost)
      ? "Increasing"
      : "Stable";

  if (loading) return <div>Loading homepage...</div>;

  return (
    <div className="color1">
      <div className={`title fontstyle1 ${isModalOpen ? "blur-background" : ""}`}>
        <h1 className="head1">BILL <br /> POCKET</h1>
        <p>Create your goals.. Track your expense...</p>

        {/* Show login/register buttons only if user NOT logged in */}
        {!user && (
          <div className="auth-buttons">
            <button onClick={() => navigate("/login")}>Login</button>
            <button onClick={() => navigate("/register")}>Register</button>
          </div>
        )}
      </div>

      <div className={`conwrp ${isModalOpen ? "blur-background" : ""}`}>
        {user ? (
          <>
            {/* Bank Details */}
            <div className="bnkdtls">
              <Link to="/page1" className="container1">
                <p className="txt">
                  Name: {user.name}
                  <br />
                  Bank 2 IFSC: {user.ifsc}
                  <br />
                  Bank Balance: ₹{user.balance}/-
                </p>
              </Link>

              <Link to="/page1" className="container1">
                <p className="txt">
                  Available balance: ₹{user.balance}/-
                  <br />
                  Goal Expense: {goalExpense}
                  <br />
                  Expected Expenditure: {expectedExpenditure}
                  <br />
                  {parseFloat(expectedExpenditure.replace("₹", "")) > user.balance && (
                    <span style={{ color: "red", fontWeight: "bold" }}>⚠️ Budget Exceeded!</span>
                  )}
                </p>
              </Link>
            </div>

            {/* Goals */}
            <Link to="/goal" className="container2">
              <h1 className="head2">Goals</h1>
              <p className="txt">
                {goals.shortTerm.length === 0 && goals.longTerm.length === 0 ? (
                  <span className="empty-message">No goals set yet. Click to add your first goal!</span>
                ) : (
                  <>
                    <GoalPreview goals={goals} />
                    <br />
                    <strong>Suggested Monthly Savings:</strong>
                    <br />
                    ₹
                    {Math.ceil(
                      goals.shortTerm.reduce((sum, g) => sum + parseFloat(g.cost || 0), 0) +
                        goals.longTerm.reduce((sum, g) => sum + parseFloat(g.cost || 0), 0)
                    / 12)}
                  </>
                )}
              </p>
            </Link>

            {/* Statements */}
            <Link to="/statement" className="container3">
              <h1 className="head2">Statements</h1>
              <div
                onMouseDown={handlePressStart}
                onMouseUp={handlePressEnd}
                onMouseLeave={handlePressEnd}
              >
                <p className="txt">
                  {statements.length === 0 ? (
                    <span>No statements available.</span>
                  ) : (
                    <>
                      {statements[0].date} - {statements[0].item} - ₹{statements[0].cost}
                      <br />
                      <strong>Spending Trend:</strong> {trend}
                      <br />
                      <strong>Alert:</strong> Nearing your budget limit!
                      <br />
                      <strong>Smart Insight:</strong> Reduce dining expenses this month.
                    </>
                  )}
                </p>
              </div>
            </Link>
          </>
        ) : (
          // Show message only if user is NOT logged in AND never logged in before
          !hasLoggedInBefore && (
            <div className="unauth-message">
              <p>
                Unlock your financial story – <strong>Register Now</strong>
              </p>
            </div>
          )
        )}
      </div>

      {isModalOpen && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-content">
            <h2>Transaction Details</h2>
            <p>
              2025-04-10 – Apple Store – MacBook Pro Purchase – ₹2,49,900
              <br />
              2025-04-05 – Airbnb – Tokyo Booking – ₹1,15,000
              <br />
              2025-03-03 – Delta Airlines – Japan Flight – ₹85,000
              <br />
              2025-03-30 – Credit Card Payment – Chase – ₹3,20,000
              <br />
              2025-03-25 – Coursera – UX Design Course – ₹74,900
              <br />
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default Homepage;
