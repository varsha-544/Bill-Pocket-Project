import { createContext, useState, useContext } from "react";

const FinanceContext = createContext();

export const FinanceProvider = ({ children }) => {
  const [goals, setGoals] = useState({
    shortTerm: [],
    longTerm: [],
    shortTermExpense: 0,
    longTermExpense: 0
  });
  
  const [statements, setStatements] = useState([]);
  const [totalExpense, setTotalExpense] = useState(0);

  const updateGoals = (newGoals) => {
    const shortTerm = newGoals.filter(g => g.type === 'short');
    const longTerm = newGoals.filter(g => g.type === 'long');
    
    setGoals({
      shortTerm,
      longTerm,
      shortTermExpense: shortTerm.reduce((sum, g) => sum + Number(g.cost), 0),
      longTermExpense: longTerm.reduce((sum, g) => sum + Number(g.cost), 0)
    });
  };

  const updateStatements = (newStatements) => {
    setStatements(newStatements);
    setTotalExpense(newStatements.reduce((sum, s) => sum + Number(s.cost), 0));
  };

  return (
    <FinanceContext.Provider value={{
      goals,
      statements,
      totalExpense,
      updateGoals,
      updateStatements
    }}>
      {children}
    </FinanceContext.Provider>
  );
};

export const useFinance = () => useContext(FinanceContext);