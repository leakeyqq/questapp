"use client"

import { useEffect, ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { useAccount, useConnect } from 'wagmi'

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
    // If not loading and not authenticated, redirect after a delay
    if (!isLoading && !isAuthenticated) {
      console.log('🚫 Access denied - preparing to redirect to:', redirectTo)
      // Store current path for redirect after login
      sessionStorage.setItem('redirect_after_login', window.location.pathname)
      // Delay redirect to give user time to see and click Sign In
      const timer = setTimeout(() => {
        router.push(redirectTo)
      }, 60000) // 60 seconds delay

      return () => clearTimeout(timer) // Cleanup timer on unmount
    }
  }, [isLoading, isAuthenticated, router, redirectTo])

  // Show loading while checking auth
  if (isLoading) {
    return fallback
  }

  // Show prompt if not signed in
  if (!isConnected) {
    return <SignInPrompt />
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
        <h2 className="text-xl font-semibold text-brand-dark mb-2">Checking your account...</h2>
        <p className="text-gray-600">Please wait a moment while we verify your sign-in.</p>
      </div>
    </div>
  )
}

function SignInPrompt() {
  const { connectors, connect } = useConnect()
  const web3authConnector = connectors.find((c) => c.id === "web3auth")

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
            <path d="M15 3h4a2 2 0 1 1 0 4v14a2 2 0 0 1-2 2h-4"></path>
            <polyline points="10 17 15 12 10 7"></polyline>
            <line x1="15" y1="12" x2="3" y2="12"></line>
          </svg>
        </div>
        <h2 className="text-xl font-bold text-brand-dark mb-2">Sign-In Required</h2>
        <p className="text-gray-500 mb-6">
          Please sign in to your account to access this page. Signing in helps us confirm it's really you.
        </p>
        <button 
          onClick={() => web3authConnector && connect({ connector: web3authConnector })}
          className="bg-brand-purple hover:bg-brand-purple/90 text-white px-6 py-2 rounded-lg font-medium transition-colors"
          disabled={!web3authConnector}
        >
          Sign In
        </button>
      </div>
    </div>
  )
}