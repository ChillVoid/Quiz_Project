import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Dashboard } from './component/Dashboard.jsx';
import { InstructorDashboard } from './component/InstructorDashboard.jsx';
import { InstructorNavbar } from './component/InstructorNavbar.jsx';
import { StudentDashboard } from './component/Student/StudentDashboard.jsx';
import { StudentNavbar } from './component/Student/StudentNavbar.jsx';
import { StudentQuizView } from './component/Student/StudentQuizView.jsx';
import { StudentResults } from './component/Student/StudentResults.jsx';
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
  const [quizzes, setQuizzes] = useState([]);

  useEffect(() => {
    const savedQuizzes = JSON.parse(localStorage.getItem("global_quizzes") || "[]");
    setQuizzes(savedQuizzes);
  }, []);

  // Function to refresh quiz list
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
      ) : currentUser.role === 'admin' ? (
        // ========== INSTRUCTOR/ADMIN ROUTES ==========
        <>
          <InstructorNavbar onLogout={handleLogout} />
          <div className="p-8">
            <Routes>
              <Route path="/" element={<Navigate to="/instructor-dashboard" />} />
              
              {/* Instructor Dashboard - View Student Results & Release Scores */}
              <Route path="/instructor-dashboard" element={<InstructorDashboard />} />
              
              {/* Manage Quizzes */}
              <Route path="/dashboard" element={
                <Dashboard 
                  quizzes={quizzes}
                  userName={currentUser.username}
                  userRole={currentUser.role}
                />
              } />
              
              {/* Add Quiz */}
              <Route path="/add" element={<Add_Quiz onQuizAdded={refreshQuizzes} />} />
              
              {/* View Quiz */}
              <Route path="/view" element={<View_Quiz />} />
              
              {/* Update Quiz */}
              <Route path="/update" element={<div className="text-center p-8">Update Quiz Page</div>} />
              
              {/* Violation Tracking */}
              <Route path="/violation" element={<div className="text-center p-8">Violation Tracking Page</div>} />
            </Routes>
          </div>
        </>
      ) : (
        // ========== STUDENT ROUTES ==========
        <>
          <StudentNavbar onLogout={handleLogout} userName={currentUser.name} />
          <div className="p-8">
            <Routes>
              <Route path="/" element={<Navigate to="/student-dashboard" />} />
              
              {/* Student Dashboard - List of Quizzes to Take */}
              <Route path="/student-dashboard" element={
                <StudentDashboard 
                  quizzes={quizzes}
                  studentName={currentUser.name}
                  studentId={currentUser.username}
                />
              } />
              
              {/* Take Quiz */}
              <Route path="/student-quiz/:quizId" element={
                <StudentQuizView 
                  quizzes={quizzes}
                  studentName={currentUser.name}
                  studentId={currentUser.username}
                />
              } />
              
              {/* View Results */}
              <Route path="/student-results" element={
                <StudentResults 
                  studentId={currentUser.username}
                  studentName={currentUser.name}
                />
              } />
            </Routes>
          </div>
        </>
      )}
    </Router>
  );
}

export default App;