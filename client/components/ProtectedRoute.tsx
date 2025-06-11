"use client"

import { useEffect, ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { useAccount } from 'wagmi'

interface ProtectedRouteProps {
  children: ReactNode
  fallback?: ReactNode
  redirectTo?: string
}

export function ProtectedRoute({ 
  children, 
  fallback = <LoadingAuth />, 
  redirectTo = '/' 
}: ProtectedRouteProps) {
  const { isAuthenticated, isLoading, user } = useAuth()
  const { isConnected } = useAccount()
  const router = useRouter()

  useEffect(() => {
    // If not loading and not authenticated, redirect
    if (!isLoading && !isAuthenticated) {
      // console.log('🚫 Access denied - redirecting to:', redirectTo)
      // Store current path for redirect after login
      sessionStorage.setItem('redirect_after_login', window.location.pathname)
      router.push(redirectTo)
    }
  }, [isLoading, isAuthenticated, router, redirectTo])

  // Show loading while checking auth
  if (isLoading) {
    return fallback
  }

  // Show loading if wallet not connected
  if (!isConnected) {
    return <ConnectWalletPrompt />
  }

  // Show loading if no user data yet
  if (!user) {
    return fallback
  }

  // Render protected content
  if (isAuthenticated) {
    return <>{children}</>
  }

  // Default fallback
  return fallback
}

function LoadingAuth() {
  return (
    <div className="min-h-screen bg-brand-light flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-purple mx-auto mb-4"></div>
        <h2 className="text-xl font-semibold text-brand-dark mb-2">Authenticating...</h2>
        <p className="text-gray-600">Verifying your wallet connection</p>
      </div>
    </div>
  )
}

function ConnectWalletPrompt() {
  return (
    <div className="min-h-screen bg-brand-light flex items-center justify-center">
      <div className="max-w-md mx-auto text-center p-8 bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="w-16 h-16 bg-brand-purple rounded-full flex items-center justify-center mx-auto mb-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-white"
          >
            <rect width="18" height="11" x="3" y="11" rx="2" ry="2"></rect>
            <circle cx="12" cy="5" r="2"></circle>
            <path d="M12 7v4"></path>
          </svg>
        </div>
        <h2 className="text-xl font-bold text-brand-dark mb-2">Wallet Required</h2>
        <p className="text-gray-600 mb-6">
          Please connect your wallet to access this page. Your wallet serves as your identity and authentication.
        </p>
        <button 
          onClick={() => window.location.reload()}
          className="bg-brand-purple hover:bg-brand-purple/90 text-white px-6 py-2 rounded-lg font-medium transition-colors"
        >
          Connect Wallet
        </button>
      </div>
    </div>
  )
} 