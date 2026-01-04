import { useNavigate } from "react-router-dom";

export const InstructorNavbar = ({ onLogout }) => {
  const navigate = useNavigate();

  const handleLogoutClick = () => {
    onLogout();
    navigate("/");
  };

  return (
    <nav className="bg-white text-black p-4 shadow-md flex flex-col md:flex-row items-center justify-between">
      <div 
        className="text-2xl font-bold mb-2 md:mb-0 cursor-pointer" 
        onClick={() => navigate("/instructor-dashboard")}
      >
        Quiz Dashboard (Instructor)
      </div>
      
      <ul className="flex flex-col md:flex-row gap-4">
        <li>
          <button
            onClick={() => navigate("/instructor-dashboard")}
            className="px-4 py-2 rounded-lg transition hover:bg-blue-300 text-gray-600 hover:text-black"
          >
            Student Results
          </button>
        </li>
        <li>
          <button
            onClick={() => navigate("/add")}
            className="px-4 py-2 rounded-lg transition hover:bg-blue-300 text-gray-600 hover:text-black"
          >
            Add Quiz
          </button>
        </li>
        <li>
          <button
            onClick={() => navigate("/dashboard")}
            className="px-4 py-2 rounded-lg transition hover:bg-blue-300 text-gray-600 hover:text-black"
          >
            Manage Quizzes
          </button>
        </li>
      </ul>

      <button
        onClick={handleLogoutClick}
        className="mt-2 md:mt-0 bg-blue-400 text-black px-4 py-2 rounded-lg hover:bg-blue-300 transition"
      >
        Logout
      </button>
    </nav>
  );
};