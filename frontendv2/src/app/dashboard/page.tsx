'use client';

import { useWeb3Auth } from '../providers';
import { redirect } from 'next/navigation';
import { useEffect } from 'react';

export default function Dashboard() {
  const { address } = useWeb3Auth();

  useEffect(() => {
    if (!address) {
      redirect('/auth');
    }
  }, [address]);

  if (!address) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen p-8">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      <p>Your wallet address: {address}</p>
      {/* Add your protected content here */}
    </div>
  );
}