import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Dashboard } from './component/Dashboard.jsx';
import { InstructorDashboard } from './component/InstructorDashboard.jsx';
import { InstructorNavbar } from './component/InstructorNavbar.jsx';
import { StudentDashboard } from './component/Student/StudentDashboard.jsx';
import { StudentNavbar } from './component/Student/StudentNavbar.jsx';
import { StudentQuizView } from './component/Student/StudentQuizView.jsx';
import { StudentResults } from './component/Student/StudentResults.jsx';
import { AuthPage } from './component/AuthPage.jsx';
import { Add_Quiz } from './component/Selection/Add_Quiz.jsx';
import { View_Quiz } from './component/Selection/View_Quiz.jsx';
import "./index.css";

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [quizzes, setQuizzes] = useState([]);

  useEffect(() => {
    const savedQuizzes = JSON.parse(localStorage.getItem("global_quizzes") || "[]");
    setQuizzes(savedQuizzes);
  }, []);

  const refreshQuizzes = () => {
    const savedQuizzes = JSON.parse(localStorage.getItem("global_quizzes") || "[]");
    setQuizzes(savedQuizzes);
  };

  const handleLogin = (userData) => {
    setCurrentUser(userData);
  };

  const handleLogout = () => {
    setCurrentUser(null);
  };

  return (
    <Router>
      {!currentUser ? (
        <AuthPage onLogin={handleLogin} />
      ) : currentUser.role === 'admin' ? (
        <>
          <InstructorNavbar onLogout={handleLogout} />
          <div className="p-8">
            <Routes>
              <Route path="/" element={<Navigate to="/instructor-dashboard" />} />
              
              <Route path="/instructor-dashboard" element={<InstructorDashboard />} />
              
              <Route path="/dashboard" element={
                <Dashboard 
                  quizzes={quizzes}
                  userName={currentUser.username}
                  userRole={currentUser.role}
                />
              } />
              
              <Route path="/add" element={<Add_Quiz onQuizAdded={refreshQuizzes} />} />
              
              <Route path="/view" element={<View_Quiz />} />
              
              <Route path="/update" element={<div className="text-center p-8">Update Quiz Page</div>} />
              
              <Route path="/violation" element={<div className="text-center p-8">Violation Tracking Page</div>} />
            </Routes>
          </div>
        </>
      ) : (
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