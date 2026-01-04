import React, { useState, useEffect } from "react";

export const StudentResults = ({ studentId, studentName }) => {
  const [results, setResults] = useState([]);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    const loadResults = () => {
      const allResults = JSON.parse(localStorage.getItem("all_quiz_results") || "[]");
      const studentResults = allResults.filter(r => r.studentId === studentId);
      setResults(studentResults);
    };

    loadResults();

    const pollInterval = setInterval(() => {
      loadResults();
    }, 3000);

    const handleStorageChange = () => {
      loadResults();
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      clearInterval(pollInterval);
      window.removeEventListener("storage", handleStorageChange);
    };
  }, [studentId, refreshKey]);

  const completedQuizzes = results.filter(r => r.submitted);
  const releasedScores = completedQuizzes.filter(r => r.scoreReleased);
  const pendingScores = completedQuizzes.filter(r => !r.scoreReleased);

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
  };

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="mb-8 flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-indigo-900">My Quiz Results</h1>
          <p className="text-gray-600">Student: {studentName}</p>
        </div>
        <button
          onClick={handleRefresh}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition text-sm font-medium"
        >
          🔄 Refresh
        </button>
      </div>

      {completedQuizzes.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
            <p className="text-gray-600 text-sm mb-2">Total Quizzes Completed</p>
            <p className="text-3xl font-bold text-indigo-600">{completedQuizzes.length}</p>
          </div>
          <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
            <p className="text-gray-600 text-sm mb-2">Scores Released</p>
            <p className="text-3xl font-bold text-green-600">{releasedScores.length}</p>
          </div>
          <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
            <p className="text-gray-600 text-sm mb-2">Pending Results</p>
            <p className="text-3xl font-bold text-yellow-600">{pendingScores.length}</p>
          </div>
        </div>
      )}

      {completedQuizzes.length === 0 ? (
        <div className="bg-white p-12 rounded-lg text-center border border-gray-200">
          <p className="text-gray-600 text-lg">No quiz results yet. Complete a quiz to see your results here.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {releasedScores.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">✓ Released Scores</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {releasedScores.map((result, idx) => (
                  <div key={idx} className="bg-green-50 rounded-lg border border-green-200 p-6 shadow-sm hover:shadow-md transition-shadow">
                    <h3 className="font-bold text-lg mb-2 text-indigo-900">{result.quizTitle}</h3>
                    <p className="text-sm text-gray-600 mb-4">
                      Submitted: {new Date(result.submittedAt).toLocaleDateString()}
                    </p>
                    
                    <div className="text-center bg-white p-6 rounded mb-4 border border-green-200">
                      <p className="text-6xl font-bold text-green-600">{result.score}%</p>
                      <p className="text-sm text-green-700 mt-2">Score Released ✓</p>
                    </div>
                    
                    <div className="text-xs text-gray-600 bg-gray-50 p-3 rounded space-y-1">
                      <p><strong>Violations:</strong> {result.violations}/3</p>
                      <p><strong>Questions Answered:</strong> {Object.keys(result.answers).length}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {pendingScores.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">⏳ Pending Results</h2>
              <p className="text-sm text-gray-600 mb-4">Scores will appear here automatically once released by your instructor.</p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {pendingScores.map((result, idx) => (
                  <div key={idx} className="bg-yellow-50 rounded-lg border border-yellow-200 p-6 shadow-sm hover:shadow-md transition-shadow">
                    <h3 className="font-bold text-lg mb-2 text-indigo-900">{result.quizTitle}</h3>
                    <p className="text-sm text-gray-600 mb-4">
                      Submitted: {new Date(result.submittedAt).toLocaleDateString()}
                    </p>
                    
                    <div className="text-center bg-white p-6 rounded mb-4 border border-yellow-200">
                      <p className="text-lg text-gray-700 font-semibold">⏳ Pending</p>
                      <p className="text-sm text-gray-600 mt-2">Waiting for instructor to release score</p>
                    </div>
                    
                    <div className="text-xs text-gray-600 bg-gray-50 p-3 rounded space-y-1">
                      <p><strong>Violations:</strong> {result.violations}/3</p>
                      <p><strong>Questions Answered:</strong> {Object.keys(result.answers).length}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};