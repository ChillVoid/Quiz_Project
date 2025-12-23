import { useNavigate, NavLink } from "react-router-dom"; // Import routing tools

export const Navbar = ({ onLogout }) => {
  const navigate = useNavigate();

  const navItems = [
    { path: "/dashboard", label: "Dashboard" }, // Added dashboard to nav
    { path: "/add", label: "Add Quiz" },
    { path: "/view", label: "View Quiz" },
    { path: "/violation", label: "Violation Tracking" },
    { path: "/update", label: "Update Quiz" },
  ];

  const handleLogoutClick = () => {
    onLogout(); // Call the logout logic
    navigate("/"); // Send user back to login page
  };

  return (
    <nav className="bg-white text-black p-4 shadow-md flex flex-col md:flex-row items-center justify-between">
      {/* Clicking the logo takes you to dashboard */}
      <div 
        className="text-2xl font-bold mb-2 md:mb-0 cursor-pointer" 
        onClick={() => navigate("/dashboard")}
      >
        Quiz Dashboard
      </div>
      
      <ul className="flex flex-col md:flex-row gap-4">
        {navItems.map((item) => (
          <li key={item.path}>
            <NavLink
              to={item.path}
              className={({ isActive }) =>
                `px-4 py-2 rounded-lg transition hover:bg-blue-300 block ${
                  isActive ? "bg-blue-400 text-black font-semibold" : "text-gray-600"
                }`
              }
            >
              {item.label}
            </NavLink>
          </li>
        ))}
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