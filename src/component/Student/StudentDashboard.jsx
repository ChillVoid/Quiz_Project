import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

export const StudentDashboard = ({ quizzes, studentName, studentId }) => {
  const navigate = useNavigate();
  const [availableQuizzes, setAvailableQuizzes] = useState([]);
  const [studentAttempts, setStudentAttempts] = useState({});
  const [filterTab, setFilterTab] = useState("total");
  const quizzesRef = useRef(null);

  useEffect(() => {
    // Load student quiz attempts
    const attempts = JSON.parse(localStorage.getItem(`student_attempts_${studentId}`) || "{}");
    setStudentAttempts(attempts);
    setAvailableQuizzes(quizzes);
  }, [quizzes, studentId]);

  const hasAttempted = (quizId) => {
    const quizIdStr = String(quizId);
    return studentAttempts[quizIdStr]?.submitted || false;
  };

  const handleStartQuiz = (quiz) => {
    if (hasAttempted(quiz.id)) {
      alert("You have already taken this quiz. Please wait for the instructor to release your score.");
      return;
    }
    navigate(`/student-quiz/${quiz.id}`);
  };

  const getFilteredQuizzes = () => {
    switch (filterTab) {
      case "completed":
        return availableQuizzes.filter(q => hasAttempted(q.id));
      case "missing":
        const now = new Date();
        return availableQuizzes.filter(q => {
          const attempted = hasAttempted(q.id);
          const dueDate = q.dueDate || q.settings?.dueDate;
          const isDueDatePassed = dueDate && now > new Date(dueDate);
          return !attempted && isDueDatePassed;
        });
      case "total":
      default:
        return availableQuizzes;
    }
  };

  const handleManageQuizzesClick = () => {
    setFilterTab("total");
    setTimeout(() => {
      if (quizzesRef.current) {
        quizzesRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 0);
  };

  // Expose the function globally so StudentNavbar can call it
  useEffect(() => {
    window.handleManageQuizzesScroll = handleManageQuizzesClick;
  }, []);

  const filteredQuizzes = getFilteredQuizzes();
  const completedCount = availableQuizzes.filter(q => hasAttempted(q.id)).length;
  const missingCount = availableQuizzes.filter(q => {
    const attempted = hasAttempted(q.id);
    const dueDate = q.dueDate || q.settings?.dueDate;
    const isDueDatePassed = dueDate && new Date() > new Date(dueDate);
    return !attempted && isDueDatePassed;
  }).length;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 p-8">
      {/* Welcome Section */}
      <div className="mb-8 bg-gradient-to-r from-gray-100 to-gray-200 rounded-lg p-8 text-gray-900 shadow-lg border border-gray-300">
        <h1 className="text-4xl font-bold mb-3">Welcome to the Quiz Application!</h1>
        <p className="text-gray-600 text-lg mb-6">
          Hello <span className="font-semibold">{studentName}</span>, you're ready to test your knowledge. Good luck!
        </p>
        
        {/* Rules Section */}
        <div className="bg-white/80 backdrop-blur-sm rounded-lg p-6 border border-gray-300">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            ⚠️ Important Rules & Guidelines
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="bg-gray-50 rounded p-4 border-l-4 border-yellow-400">
              <h3 className="font-semibold mb-2 text-gray-900">❌ Prohibited Actions:</h3>
              <ul className="space-y-2 text-gray-700">
                <li>🚫 <span className="font-medium">Alt-Tab or Switch Tabs</span> - Switching away from the quiz will count as a violation</li>
                <li>🚫 <span className="font-medium">Window Minimization</span> - Minimizing the quiz window is tracked</li>
                <li>🚫 <span className="font-medium">Browser Focus Loss</span> - Clicking outside the quiz window will trigger a violation</li>
              </ul>
            </div>
            
            <div className="bg-gray-50 rounded p-4 border-l-4 border-red-400">
              <h3 className="font-semibold mb-2 text-gray-900">⚡ Violation System:</h3>
              <ul className="space-y-2 text-gray-700">
                <li>⚠️ <span className="font-medium">3 Violations = Auto Submit</span> - After 3 violations, your quiz will be automatically submitted and your score will automatically be zero</li>
                <li>📊 <span className="font-medium">Violation Tracking</span> - All violations are recorded and reported to instructors</li>
                <li>📝 <span className="font-medium">Score Impact</span> - Instructors may deduct points based on violations.</li>
              </ul>
            </div>

            <div className="bg-gray-50 rounded p-4 border-l-4 border-green-400">
              <h3 className="font-semibold mb-2 text-gray-900">✅ Best Practices:</h3>
              <ul className="space-y-2 text-gray-700">
                <li>✓ Keep the quiz window in focus at all times</li>
                <li>✓ Close unnecessary applications before starting</li>
                <li>✓ Ensure a stable internet connection</li>
                <li>✓ Read questions carefully before answering</li>
              </ul>
            </div>

            <div className="bg-gray-50 rounded p-4 border-l-4 border-blue-400">
              <h3 className="font-semibold mb-2 text-gray-900">⏱️ Time Management:</h3>
              <ul className="space-y-2 text-gray-700">
                <li>⏳ Watch the timer - it counts down during your quiz</li>
                <li>⏸️ You cannot pause the quiz once started</li>
                <li>🔔 When time expires, your quiz auto-submits</li>
                <li>📌 Submit manually before time runs out</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="mb-8 flex gap-4 flex-wrap">
        <button
          onClick={() => setFilterTab("total")}
          className={`px-6 py-3 rounded-lg font-medium transition ${
            filterTab === "total"
              ? "bg-indigo-600 text-white shadow-md"
              : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50"
          }`}
        >
          Total Quizzes
          <span className="ml-2 font-bold">({availableQuizzes.length})</span>
        </button>
        <button
          onClick={() => setFilterTab("completed")}
          className={`px-6 py-3 rounded-lg font-medium transition ${
            filterTab === "completed"
              ? "bg-green-600 text-white shadow-md"
              : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50"
          }`}
        >
          Completed
          <span className="ml-2 font-bold">({completedCount})</span>
        </button>
        <button
          onClick={() => setFilterTab("missing")}
          className={`px-6 py-3 rounded-lg font-medium transition ${
            filterTab === "missing"
              ? "bg-red-600 text-white shadow-md"
              : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50"
          }`}
        >
          Missing
          <span className="ml-2 font-bold">({missingCount})</span>
        </button>
      </div>

      {/* Quizzes Section - with ref */}
      <div ref={quizzesRef}>
        <h2 className="text-2xl font-bold mb-6">
          {filterTab === "total" && "All Quizzes"}
          {filterTab === "completed" && "Completed Quizzes"}
          {filterTab === "missing" && "Missing Quizzes"}
        </h2>
        {filteredQuizzes.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-2xl border-2 border-dashed border-slate-200">
            <p className="text-slate-400">
              {filterTab === "total" && "No quizzes available yet."}
              {filterTab === "completed" && "You haven't completed any quizzes yet."}
              {filterTab === "missing" && "You've completed all available quizzes!"}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredQuizzes.map((quiz) => {
              const attempted = hasAttempted(quiz.id);
              const dueDate = quiz.dueDate || quiz.settings?.dueDate;
              const isDueDatePassed = dueDate && new Date() > new Date(dueDate);
              
              return (
                <div
                  key={quiz.id}
                  className={`bg-white p-6 rounded-2xl shadow-sm border transition-all ${
                    isDueDatePassed && !attempted 
                      ? "border-red-300 hover:shadow-lg" 
                      : "border-slate-100 hover:shadow-lg"
                  }`}
                >
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="font-bold text-xl text-slate-800">
                      {quiz.title}
                    </h3>
                    {attempted && (
                      <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold">
                        ✓ Completed
                      </span>
                    )}
                    {isDueDatePassed && !attempted && (
                      <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-bold">
                        ⚠ Overdue
                      </span>
                    )}
                  </div>

                  <p className="text-slate-500 text-sm mb-4">
                    {quiz.description}
                  </p>

                  <div className="flex justify-between text-xs font-semibold mb-4">
                    <span className="bg-slate-100 text-slate-600 px-3 py-1 rounded-full">
                      {quiz.totalQuestions || quiz.questions?.length || 0} Questions
                    </span>
                    <span className="text-indigo-600">
                      {quiz.duration || quiz.settings?.timeLimit || "N/A"} Mins
                    </span>
                  </div>

                  {dueDate && (
                    <p className={`text-xs mb-4 ${isDueDatePassed && !attempted ? "text-red-600 font-bold" : "text-gray-500"}`}>
                      Due: {new Date(dueDate).toLocaleDateString()}
                    </p>
                  )}

                  <button
                    onClick={() => handleStartQuiz(quiz)}
                    disabled={attempted}
                    className={`w-full py-2 rounded-lg font-medium transition ${
                      attempted
                        ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                        : "bg-indigo-600 text-white hover:bg-indigo-700"
                    }`}
                  >
                    {attempted ? "Already Taken" : "Start Quiz"}
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};