import React from "react";

export const Login =({
  username,
  password,
  setUsername,
  setPassword,
  loginError,
  onLogin
}) =>{
  return (
    <div className="min-h-screen bg-indigo-300 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg border border-gray-200 p-8 w-full max-w-md shadow-lg">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Quiz App</h1>
          <p className="text-gray-600">Login</p>
        </div>

        <form onSubmit={onLogin} className="space-y-4">
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username"
            className="w-full px-4 py-2 border rounded-lg"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="w-full px-4 py-2 border rounded-lg"
          />

          {loginError && (
            <div className="bg-red-50 text-red-700 p-3 rounded-lg text-sm">
              {loginError}
            </div>
          )}

          <button className="w-full bg-blue-600 text-white py-2 rounded-lg">
            Login
          </button>
        </form>
      </div>
    </div>
  );
}
