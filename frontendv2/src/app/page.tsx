'use client';

import { useAuth } from "@/context/AuthContext";

export default function Home() {
  const {
    user,
    login,
    logout,
    getUserInfo,
    enableMFA,
    manageMFA,
    authenticateUser,
    addAndSwitchChain,
  } = useAuth();

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold">Web3Auth Demo</h1>

      {!user ? (
        <button onClick={login} className="bg-blue-500 text-white p-2 rounded">
          Login with Web3Auth
        </button>
      ) : (
        <div className="flex flex-col gap-2">
          <p>Welcome, {user.name || user.email}</p>
          <button onClick={logout} className="bg-red-500 text-white p-2 rounded">
            Logout
          </button>
          <button onClick={getUserInfo} className="bg-gray-200 p-2 rounded">
            Get User Info
          </button>
          <button onClick={enableMFA} className="bg-green-500 text-white p-2 rounded">
            Enable MFA
          </button>
          <button onClick={manageMFA} className="bg-yellow-500 text-white p-2 rounded">
            Manage MFA
          </button>
          <button onClick={authenticateUser} className="bg-purple-500 text-white p-2 rounded">
            Get Auth Token
          </button>
          <button onClick={addAndSwitchChain} className="bg-indigo-500 text-white p-2 rounded">
            Switch to Sepolia
          </button>
        </div>
      )}
    </div>
  );
}
