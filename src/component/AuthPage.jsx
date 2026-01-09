import React, { useState } from "react";

export const AuthPage = ({ onLogin }) => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [loginUsername, setLoginUsername] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  const [regUsername, setRegUsername] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regConfirmPassword, setRegConfirmPassword] = useState("");
  const [regName, setRegName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regErrors, setRegErrors] = useState({});
  const [regSuccess, setRegSuccess] = useState("");

  const getRegisteredUsers = () => {
    const users = JSON.parse(localStorage.getItem("registered_users") || "[]");
    return users;
  };

  const getHardcodedUsers = () => {
    return [
      { username: 'admin', password: 'admin12345', role: 'admin', name: 'Administrator' },
      { username: '202311221', password: '123456789', role: 'student', name: 'Kurt Eris Navarette' },
      { username: '202311211', password: '123456456', role: 'student', name: 'Angelo Luigi G. Matavia' },
      { username: '202311235', password: '123456123', role: 'student', name: 'John Dave M. Pelone' },
      { username: '202311225', password: '123456321', role: 'student', name: 'Paul Emmanuel D. Olivo' },
    ];
  };

  const handleLogin = (e) => {
    e.preventDefault();
    setLoginError("");

    const registeredUsers = getRegisteredUsers();
    const registeredUser = registeredUsers.find(
      (u) => u.username === loginUsername && u.password === loginPassword
    );

    if (registeredUser) {
      const userData = {
        username: registeredUser.username,
        name: registeredUser.name,
        role: 'student',
      };
      onLogin(userData);
      return;
    }

    const hardcodedUsers = getHardcodedUsers();
    const hardcodedUser = hardcodedUsers.find(
      (u) => u.username === loginUsername && u.password === loginPassword
    );

    if (hardcodedUser) {
      const userData = {
        username: hardcodedUser.username,
        name: hardcodedUser.name,
        role: hardcodedUser.role,
      };
      onLogin(userData);
      return;
    }

    setLoginError("Invalid username or password");
  };

  const validateRegistration = () => {
    let errors = {};

    if (!regName.trim()) errors.name = "Full name is required";
    if (!regUsername.trim()) errors.username = "Username is required";
    if (regUsername.length < 4) errors.username = "Username must be at least 4 characters";
    if (!regEmail.trim()) errors.email = "Email is required";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(regEmail)) errors.email = "Please enter a valid email";
    if (!regPassword) errors.password = "Password is required";
    if (regPassword.length < 6) errors.password = "Password must be at least 6 characters";
    if (regPassword !== regConfirmPassword) errors.confirmPassword = "Passwords do not match";

    const registeredUsers = getRegisteredUsers();
    if (registeredUsers.some(u => u.username === regUsername)) {
      errors.username = "Username already taken";
    }

    setRegErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleRegister = (e) => {
    e.preventDefault();
    setRegSuccess("");

    if (!validateRegistration()) return;

    const newUser = {
      username: regUsername,
      password: regPassword,
      name: regName,
      email: regEmail,
      role: 'student',
      createdAt: new Date().toISOString(),
    };

    const registeredUsers = getRegisteredUsers();
    registeredUsers.push(newUser);
    localStorage.setItem("registered_users", JSON.stringify(registeredUsers));

    setRegSuccess("✅ Registration successful! You can now login.");

    setRegUsername("");
    setRegPassword("");
    setRegConfirmPassword("");
    setRegName("");
    setRegEmail("");
    setRegErrors({});

    setTimeout(() => {
      setIsRegistering(false);
      setRegSuccess("");
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-yellow-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg border border-gray-200 p-8 w-full max-w-md shadow-lg">
        {!isRegistering ? (
          <div className="text-center space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Quiz App</h1>
              <p className="text-gray-600">Login to your account</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <input
                type="text"
                value={loginUsername}
                onChange={(e) => setLoginUsername(e.target.value)}
                placeholder="Username"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
              />
              <input
                type="password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                placeholder="Password"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
              />

              {loginError && (
                <div className="bg-red-50 text-red-700 p-3 rounded-lg text-sm">
                  {loginError}
                </div>
              )}

              <button
                type="submit"
                className="w-full bg-amber-400 text-white py-2 rounded-lg hover:bg-amber-500 transition font-medium"
              >
                Login
              </button>
            </form>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Or</span>
              </div>
            </div>

            <button
              onClick={() => setIsRegistering(true)}
              className="w-full bg-orange-400 text-white py-2 rounded-lg hover:bg-orange-500 transition font-medium"
            >
              Create New Account
            </button>

          </div>
        ) : (
          <div className="space-y-6">
            <div className="text-center">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Create Account</h1>
              <p className="text-gray-600 text-sm">Join Quiz App</p>
            </div>

            <form onSubmit={handleRegister} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input
                  type="text"
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                  placeholder="Enter your full name"
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                    regErrors.name ? "border-red-500 focus:ring-red-600" : "focus:ring-indigo-600"
                  }`}
                />
                {regErrors.name && <p className="text-red-500 text-xs mt-1">{regErrors.name}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  placeholder="Enter your email"
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                    regErrors.email ? "border-red-500 focus:ring-red-600" : "focus:ring-indigo-600"
                  }`}
                />
                {regErrors.email && <p className="text-red-500 text-xs mt-1">{regErrors.email}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Student Number</label>
                <input
                  type="text"
                  value={regUsername}
                  onChange={(e) => setRegUsername(e.target.value)}
                  placeholder="Input Student Number for Username"
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                    regErrors.username ? "border-red-500 focus:ring-red-600" : "focus:ring-indigo-600"
                  }`}
                />
                {regErrors.username && <p className="text-red-500 text-xs mt-1">{regErrors.username}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <input
                  type="password"
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  placeholder="Enter password (min 6 chars)"
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                    regErrors.password ? "border-red-500 focus:ring-red-600" : "focus:ring-indigo-600"
                  }`}
                />
                {regErrors.password && <p className="text-red-500 text-xs mt-1">{regErrors.password}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
                <input
                  type="password"
                  value={regConfirmPassword}
                  onChange={(e) => setRegConfirmPassword(e.target.value)}
                  placeholder="Confirm your password"
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                    regErrors.confirmPassword ? "border-red-500 focus:ring-red-600" : "focus:ring-indigo-600"
                  }`}
                />
                {regErrors.confirmPassword && (
                  <p className="text-red-500 text-xs mt-1">{regErrors.confirmPassword}</p>
                )}
              </div>

              {regSuccess && (
                <div className="bg-green-50 text-green-700 p-3 rounded-lg text-sm">
                  {regSuccess}
                </div>
              )}

              <button
                type="submit"
                className="w-full bg-amber-400 text-white py-2 rounded-lg hover:bg-amber-500 transition font-medium"
              >
                Register
              </button>
            </form>

            <button
              onClick={() => {
                setIsRegistering(false);
                setRegErrors({});
                setRegSuccess("");
              }}
              className="w-full text-gray-600 py-2 rounded-lg hover:bg-gray-100 transition font-medium"
            >
              Back to Login
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthPage;