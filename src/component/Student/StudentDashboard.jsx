import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const StudentDashboard = ({ quizzes, studentName, studentId }) => {
  const navigate = useNavigate();
  const [availableQuizzes, setAvailableQuizzes] = useState([]);
  const [studentAttempts, setStudentAttempts] = useState({});
  const [filterTab, setFilterTab] = useState("total"); // NEW: Filter state

  useEffect(() => {
    // Load student quiz attempts
    const attempts = JSON.parse(localStorage.getItem(`student_attempts_${studentId}`) || "{}");
    setStudentAttempts(attempts);
    setAvailableQuizzes(quizzes);
  }, [quizzes, studentId]);

  const hasAttempted = (quizId) => {
    return studentAttempts[quizId]?.submitted || false;
  };

  const handleStartQuiz = (quiz) => {
    if (hasAttempted(quiz.id)) {
      alert("You have already taken this quiz. Please wait for the instructor to release your score.");
      return;
    }
    navigate(`/student-quiz/${quiz.id}`);
  };

  // NEW: Filter quizzes based on status
  const getFilteredQuizzes = () => {
    switch (filterTab) {
      case "completed":
        return availableQuizzes.filter(q => hasAttempted(q.id));
      case "missing":
        return availableQuizzes.filter(q => !hasAttempted(q.id));
      case "total":
      default:
        return availableQuizzes;
    }
  };

  const filteredQuizzes = getFilteredQuizzes();
  const completedCount = availableQuizzes.filter(q => hasAttempted(q.id)).length;
  const missingCount = availableQuizzes.filter(q => !hasAttempted(q.id)).length;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 p-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-indigo-900 mb-2">
          Welcome, {studentName}!
        </h1>
        <p className="text-slate-600">Student ID: {studentId}</p>
      </div>

      {/* NEW: Filter Tabs */}
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

      <div>
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
              return (
                <div
                  key={quiz.id}
                  className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-lg transition-all"
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

                  {quiz.dueDate && (
                    <p className="text-xs text-gray-500 mb-4">
                      Due: {new Date(quiz.dueDate).toLocaleDateString()}
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