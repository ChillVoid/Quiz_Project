import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Dashboard } from './component/Dashboard.jsx';
import { Navbar } from './component/Navbar.jsx';
import { Login } from './component/Login.jsx';
import { Add_Quiz } from './component/Selection/Add_Quiz.jsx';
import { View_Quiz } from './component/Selection/View_Quiz.jsx';
import { USERS } from './assets/quizData.js';
import "./index.css";

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  
  // Create a state for quizzes that loads from LocalStorage
  const [quizzes, setQuizzes] = useState([]);

  // Load quizzes from "database" on startup
  useEffect(() => {
    const savedQuizzes = JSON.parse(localStorage.getItem("global_quizzes") || "[]");
    setQuizzes(savedQuizzes);
  }, []);

  // Function to refresh quiz list (call this after adding a quiz)
  const refreshQuizzes = () => {
    const savedQuizzes = JSON.parse(localStorage.getItem("global_quizzes") || "[]");
    setQuizzes(savedQuizzes);
  };

  const handleLogin = (e) => {
    e.preventDefault();
    const user = USERS.find((u) => u.username === username && u.password === password);
    if (user) {
      setCurrentUser(user);
      setLoginError("");
    } else {
      setLoginError("Invalid username or password");
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setUsername("");
    setPassword("");
  };

  return (
    <Router>
      {!currentUser ? (
        <Login
          username={username}
          password={password}
          setUsername={setUsername}
          setPassword={setPassword}
          loginError={loginError}
          onLogin={handleLogin}
        />
      ) : (
        <>
          <Navbar onLogout={handleLogout} /> 
          <div className="p-8">
            <Routes>
              <Route path="/" element={<Navigate to="/dashboard" />} />
              <Route path="/dashboard" element={
                <Dashboard 
                  quizzes={quizzes} // Pass the real quizzes state
                  userName={currentUser.username} 
                  userRole={currentUser.role} 
                  onLogout={handleLogout} 
                />
              } />
              {/* Pass the refresh function so Add_Quiz can tell App to update */}
              <Route path="/add" element={<Add_Quiz onQuizAdded={refreshQuizzes} />} />
              <Route path="/view" element={<View_Quiz />} />
              <Route path="/update" element={<div>Update Quiz Page</div>} />
              <Route path="/violation" element={<div>Violation Tracking Page</div>} />
            </Routes>
          </div>
        </>
      )}
    </Router>
  );
}

export default App;