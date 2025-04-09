'use client';

import { useWeb3Auth } from './../context/web3AuthContext';

export default function Home() {
  const { address, login, logout } = useWeb3Auth();

  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold mb-4">Web3Auth + Next.js</h1>

      {address ? (
        <>
          <p>Connected Address: </p>
          <code className="block  p-2 rounded mb-4">{address}</code>
          <button onClick={logout} className="bg-red-500 text-white px-4 py-2 rounded">Logout</button>
        </>
      ) : (
        <button onClick={login} className="bg-blue-500 text-white px-4 py-2 rounded">Login with Web3Auth</button>
      )}
    </main>
  );
}
