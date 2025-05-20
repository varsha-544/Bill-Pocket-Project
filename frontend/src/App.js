import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Homepage from "./pages/Homepage";
import Goal from "./pages/goal";
import Statement from "./pages/statement";
import LeftNav from "./components/LeftNav";
import TopHead from "./components/tophead";
import About from "./pages/about";
import Login from "./components/login";
import Profile from "./pages/profile";
import { FinanceProvider } from "./context/FinanceContext";


function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  return (
    <BrowserRouter>
    <FinanceProvider>
      <div>
      <TopHead />
      <LeftNav />
        <Routes>
          <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn}/>} />
          <Route path="/register" element={<Login setIsLoggedIn={setIsLoggedIn} />} /> 
          <Route path="/" element={<Homepage />} />
          <Route path="/goal" element={<Goal />} />
          <Route path="/statement" element={<Statement/>} />
          <Route path="/about" element={<About />} />
          <Route path="/profile" element={<Profile />} /> 
        </Routes>
      </div>
      </FinanceProvider>
    </BrowserRouter>
  );
}

export default App;
