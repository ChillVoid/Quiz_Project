import React, { useState, useEffect } from "react";

export const InstructorDashboard = () => {
  const [allResults, setAllResults] = useState([]);
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [filterViolations, setFilterViolations] = useState(false);

  useEffect(() => {
    // Load all quiz results from localStorage
    const results = JSON.parse(localStorage.getItem("all_quiz_results") || "[]");
    setAllResults(results);
  }, []);

  // Get unique quizzes from results
  const getUniqueQuizzes = () => {
    const uniqueQuizzes = [...new Set(allResults.map(r => r.quizId))];
    return uniqueQuizzes.map(id => {
      const result = allResults.find(r => r.quizId === id);
      return {
        id,
        title: result.quizTitle
      };
    });
  };

  const getResultsForQuiz = (quizId) => {
    let filtered = allResults;
    
    if (quizId) {
      filtered = filtered.filter(r => r.quizId === quizId);
    }

    if (filterViolations) {
      filtered = filtered.filter(r => r.violations > 0);
    }

    return filtered;
  };

  const handleReleaseScores = (quizId) => {
    const updatedResults = allResults.map(result => {
      if (result.quizId === quizId) {
        return { ...result, scoreReleased: true };
      }
      return result;
    });

    setAllResults(updatedResults);
    localStorage.setItem("all_quiz_results", JSON.stringify(updatedResults));
    alert(`✓ Scores released for all students on Quiz ID: ${quizId}`);
  };

  const handleHideScores = (quizId) => {
    const updatedResults = allResults.map(result => {
      if (result.quizId === quizId) {
        return { ...result, scoreReleased: false };
      }
      return result;
    });

    setAllResults(updatedResults);
    localStorage.setItem("all_quiz_results", JSON.stringify(updatedResults));
    alert(`✓ Scores hidden for all students on Quiz ID: ${quizId}`);
  };

  const resultsToDisplay = getResultsForQuiz(selectedQuiz);
  const uniqueQuizzes = getUniqueQuizzes();

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-indigo-900 mb-2">Instructor Dashboard</h1>
        <p className="text-gray-600">Manage and release student quiz results</p>
      </div>

      {/* Filters Section */}
      <div className="bg-white p-6 rounded-lg border border-gray-200 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Quiz:</label>
            <select
              value={selectedQuiz || ""}
              onChange={(e) => setSelectedQuiz(e.target.value ? parseInt(e.target.value) : null)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
            >
              <option value="">All Quizzes</option>
              {uniqueQuizzes.map(quiz => (
                <option key={quiz.id} value={quiz.id}>
                  {quiz.title}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-end">
            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={filterViolations}
                onChange={(e) => setFilterViolations(e.target.checked)}
                className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
              />
              <span className="ml-2 text-sm font-medium text-gray-700">Show Only Violations (≥1)</span>
            </label>
          </div>
        </div>
      </div>

      {resultsToDisplay.length === 0 ? (
        <div className="bg-white p-12 rounded-lg text-center border border-gray-200">
          <p className="text-gray-600 text-lg">
            {filterViolations ? "No students with violations found." : "No student results yet."}
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-indigo-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Student Name</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Student ID</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Quiz Title</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">Score</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">Violations</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Submitted At</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">Status</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">Action</th>
                </tr>
              </thead>
              <tbody>
                {resultsToDisplay.map((result, idx) => (
                  <tr key={idx} className="border-b border-gray-200 hover:bg-slate-50">
                    <td className="px-6 py-4 text-sm text-gray-900 font-medium">{result.studentName}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{result.studentId}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{result.quizTitle}</td>
                    <td className="px-6 py-4 text-center">
                      <span className="inline-block bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-sm font-semibold">
                        {result.score}%
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                        result.violations >= 3 
                          ? 'bg-red-100 text-red-700' 
                          : result.violations > 0
                          ? 'bg-yellow-100 text-yellow-700'
                          : 'bg-green-100 text-green-700'
                      }`}>
                        {result.violations}/3
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {new Date(result.submittedAt).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-center">
                      {result.scoreReleased ? (
                        <span className="inline-block bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-semibold">
                          ✓ Released
                        </span>
                      ) : (
                        <span className="inline-block bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-xs font-semibold">
                          ⏳ Hidden
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-center">
                      {result.scoreReleased ? (
                        <button
                          onClick={() => handleHideScores(result.quizId)}
                          className="px-3 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600 transition"
                        >
                          Hide
                        </button>
                      ) : (
                        <button
                          onClick={() => handleReleaseScores(result.quizId)}
                          className="px-3 py-1 bg-green-500 text-white text-sm rounded hover:bg-green-600 transition"
                        >
                          Release
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Summary Stats */}
      {allResults.length > 0 && (
        <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <p className="text-gray-600 text-sm mb-2">Total Submissions</p>
            <p className="text-3xl font-bold text-indigo-600">{allResults.length}</p>
          </div>
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <p className="text-gray-600 text-sm mb-2">Average Score</p>
            <p className="text-3xl font-bold text-indigo-600">
              {Math.round(allResults.reduce((sum, r) => sum + r.score, 0) / allResults.length)}%
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <p className="text-gray-600 text-sm mb-2">Scores Released</p>
            <p className="text-3xl font-bold text-green-600">
              {allResults.filter(r => r.scoreReleased).length}/{allResults.length}
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <p className="text-gray-600 text-sm mb-2">Students with Violations</p>
            <p className="text-3xl font-bold text-red-600">
              {allResults.filter(r => r.violations > 0).length}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};