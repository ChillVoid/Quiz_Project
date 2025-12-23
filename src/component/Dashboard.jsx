import React from 'react';
import { useNavigate } from 'react-router-dom';

export const Dashboard = ({ quizzes, userName, userRole }) => {
  const navigate = useNavigate();

  const handleQuizClick = (quiz) => {
    // 1. Store the selected quiz in sessionStorage so View_Quiz can find it
    sessionStorage.setItem("active_quiz", JSON.stringify(quiz));

    // 2. Decide the mode: Admins preview, Students take the quiz
    const mode = userRole === 'admin' ? 'preview' : 'take';

    // 3. Navigate to the View_Quiz route
    navigate(`/view?mode=${mode}`);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 p-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-indigo-900">
            Welcome, {userName}!
          </h1>
          <p className="text-slate-500 text-sm">Role: {userRole}</p>
        </div>
      </div>

      {/* Quizzes Section */}
      <div>
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
          Available Quizzes
        </h2>
        {quizzes.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-2xl border-2 border-dashed border-slate-200">
            <p className="text-slate-400">No quizzes generated yet.</p>
          </div>
        ) : (
          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {quizzes.map((quiz, index) => (
              <li
                key={index}
                onClick={() => handleQuizClick(quiz)} // CLICK HANDLER
                className="group cursor-pointer bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:border-indigo-300 hover:shadow-xl hover:shadow-indigo-100 transform hover:-translate-y-1 transition-all"
              >
                <div className="flex justify-between items-start mb-4">
                   <h3 className="font-bold text-xl text-slate-800 group-hover:text-indigo-600 transition-colors">
                    {quiz.title}
                  </h3>
                  {/* Visual indicator for Due Date */}
                  {quiz.settings?.dueDate && (
                     <span className="text-[10px] bg-red-50 text-red-600 px-2 py-1 rounded font-bold uppercase">
                        Due: {new Date(quiz.settings.dueDate).toLocaleDateString()}
                     </span>
                  )}
                </div>

                <p className="text-slate-500 text-sm mb-6 line-clamp-2">
                  {quiz.description || "No description provided."}
                </p>

                <div className="flex justify-between items-center text-xs font-semibold">
                  <span className="bg-slate-100 text-slate-600 px-3 py-1 rounded-full">
                    {quiz.pages?.length || 0} Pages
                  </span>
                  <span className="text-indigo-600">
                    {quiz.settings?.timeLimit || "N/A"} Mins →
                  </span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};