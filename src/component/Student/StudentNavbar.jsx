import { useNavigate, useLocation } from "react-router-dom";

export const StudentNavbar = ({ onLogout, userName }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const isQuizPage = location.pathname.startsWith("/student-quiz/");

  const handleManageQuizzesClick = () => {
    // If on My Results page, navigate to student dashboard first
    if (location.pathname === "/student-results") {
      navigate("/student-dashboard");
      setTimeout(() => {
        if (window.handleManageQuizzesScroll) {
          window.handleManageQuizzesScroll();
        }
      }, 100);
    } else {
      // Already on dashboard, just scroll to quizzes
      if (window.handleManageQuizzesScroll) {
        window.handleManageQuizzesScroll();
      }
    }
  };

  const handleLogoutClick = () => {
    onLogout();
    navigate("/");
  };

  if (isQuizPage) {
    return null;
  }

  return (
    <nav className="bg-white text-black p-4 shadow-md flex flex-col md:flex-row items-center justify-between">
      <div 
        className="text-2xl font-bold mb-2 md:mb-0 cursor-pointer" 
        onClick={() => navigate("/student-dashboard")}
      >
        Quiz Dashboard
      </div>
      
      <div className="flex flex-col md:flex-row items-center gap-6 flex-1 justify-center">
        <p className="text-sm text-gray-600">Welcome, {userName}</p>
        <ul className="flex flex-col md:flex-row gap-4">
          <li>
            <button
              onClick={handleManageQuizzesClick}
              className="px-4 py-2 rounded-lg transition hover:bg-blue-300 text-gray-600 hover:text-black"
            >
              Manage Quizzes
            </button>
          </li>
          <li>
            <button
              onClick={() => navigate("/student-results")}
              className="px-4 py-2 rounded-lg transition hover:bg-blue-300 text-gray-600 hover:text-black"
            >
              My Results
            </button>
          </li>
        </ul>
      </div>

      <button
        onClick={handleLogoutClick}
        className="mt-2 md:mt-0 bg-blue-400 text-black px-4 py-2 rounded-lg hover:bg-blue-300 transition"
      >
        Logout
      </button>
    </nav>
  );
};