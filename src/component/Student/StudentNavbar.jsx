import { useNavigate } from "react-router-dom";

export const StudentNavbar = ({ onLogout, userName }) => {
  const navigate = useNavigate();

  const navItems = [
    { path: "/student-dashboard", label: "Manage Quizzes" },
    { path: "/student-results", label: "My Results" },
  ];

  const handleLogoutClick = () => {
    onLogout();
    navigate("/");
  };

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
          {navItems.map((item) => (
            <li key={item.path}>
              <button
                onClick={() => navigate(item.path)}
                className="px-4 py-2 rounded-lg transition hover:bg-blue-300 text-gray-600 hover:text-black"
              >
                {item.label}
              </button>
            </li>
          ))}
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