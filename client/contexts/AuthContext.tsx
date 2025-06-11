"use client"

import { createContext, useContext, useEffect, useState, ReactNode, useRef } from 'react'
import { useAccount, useDisconnect } from 'wagmi'
import Cookies from 'js-cookie'

interface User {
  walletAddress: string
  _id: string
  createdAt: string
  updatedAt: string
  __v: number
}

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (address: string) => Promise<boolean>
  logout: () => void
  checkAuthStatus: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const { address, isConnected } = useAccount()
  const { disconnect } = useDisconnect()
  
  // Track login attempts to prevent infinite loops
  const loginAttempts = useRef<Map<string, { count: number; lastAttempt: number }>>(new Map())
  const maxLoginAttempts = 3
  const loginCooldown = 60000 // 1 minute

  const isAuthenticated = !!user && (!!Cookies.get('token') || !!Cookies.get('auth_token'))

  // Helper function to check if we should attempt login
  const shouldAttemptLogin = (walletAddress: string): boolean => {
    const attempts = loginAttempts.current.get(walletAddress)
    if (!attempts) return true
    
    const now = Date.now()
    const timeSinceLastAttempt = now - attempts.lastAttempt
    
    // Reset attempts if cooldown period has passed
    if (timeSinceLastAttempt > loginCooldown) {
      loginAttempts.current.delete(walletAddress)
      return true
    }
    
    // Don't attempt if we've exceeded max attempts and are still in cooldown
    return attempts.count < maxLoginAttempts
  }

  // Helper function to record login attempt
  const recordLoginAttempt = (walletAddress: string, success: boolean) => {
    if (success) {
      // Clear attempts on successful login
      loginAttempts.current.delete(walletAddress)
      return
    }
    
    const attempts = loginAttempts.current.get(walletAddress) || { count: 0, lastAttempt: 0 }
    attempts.count += 1
    attempts.lastAttempt = Date.now()
    loginAttempts.current.set(walletAddress, attempts)
  }

  // Login function
  const login = async (walletAddress: string): Promise<boolean> => {
    try {
      // console.log('🔐 AuthContext: Starting login for:', walletAddress)
      
      // Check if we should attempt login
      if (!shouldAttemptLogin(walletAddress)) {
        const attempts = loginAttempts.current.get(walletAddress)
        const remainingCooldown = Math.ceil((loginCooldown - (Date.now() - attempts!.lastAttempt)) / 1000)
        // console.log(`⏳ AuthContext: Too many failed attempts. Please wait ${remainingCooldown} seconds before trying again.`)
        return false
      }
      
      setIsLoading(true)
      
      // Check if API base URL is configured
      const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000'
      // console.log('🌐 AuthContext: Using API base URL:', apiBaseUrl)
      
      const loginUrl = `${apiBaseUrl}/api/auth/login`
      // console.log('🔗 AuthContext: Attempting login to:', loginUrl)
      
      const response = await fetch(loginUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ address: walletAddress }),
      })

      // console.log('📡 AuthContext: Response status:', response.status)
      // console.log('📡 AuthContext: Response headers:', Object.fromEntries(response.headers.entries()))

      if (!response.ok) {
        // console.log('❌ AuthContext: Login request failed:', response.status, response.statusText)
        const errorText = await response.text()
        // console.log('❌ AuthContext: Error response body:', errorText)
        recordLoginAttempt(walletAddress, false)
        throw new Error(`Login failed: ${response.status} ${response.statusText}`)
      }

      const data = await response.json()
      // console.log('🔐 AuthContext: Full login response:', data)
      // console.log('🔐 AuthContext: Login response received:', data.responseData?.success ? 'SUCCESS' : 'FAILED')
      
      if (data.responseData?.success && data.userFromDB) {
        // Store token in cookie that middleware can read
        if (data.tokenGenerated) {
          // console.log('🍪 Setting auth token in cookie')
          
          // Set cookie using document.cookie (more reliable for middleware)
          const expires = new Date()
          expires.setDate(expires.getDate() + 7) // 7 days
          
          // Set both cookie names to ensure compatibility
          document.cookie = `token=${data.tokenGenerated}; expires=${expires.toUTCString()}; path=/; SameSite=Lax`
          document.cookie = `auth_token=${data.tokenGenerated}; expires=${expires.toUTCString()}; path=/; SameSite=Lax`
          
          // Also set via js-cookie for easier access
          Cookies.set('token', data.tokenGenerated, {
            expires: 7,
            path: '/',
            sameSite: 'lax'
          })
          Cookies.set('auth_token', data.tokenGenerated, {
            expires: 7,
            path: '/',
            sameSite: 'lax'
          })
          
          // console.log('✅ Cookie set successfully')
        }

        // Store user data
        setUser(data.userFromDB)
        
        // Store auth state for cross-tab sync
        localStorage.setItem('auth_user', JSON.stringify(data.userFromDB))
        localStorage.setItem('auth_timestamp', Date.now().toString())
        
        // console.log('✅ Authentication successful:', data.userFromDB.walletAddress)
        
        // Record successful login
        recordLoginAttempt(walletAddress, true)
        
        // Check if there's a redirect path and navigate there
        const redirectPath = sessionStorage.getItem('redirect_after_login')
        if (redirectPath && typeof window !== 'undefined') {
          sessionStorage.removeItem('redirect_after_login')
          window.location.href = redirectPath
        }
        
        return true
      }

      // console.log('❌ AuthContext: Login failed - invalid response structure or missing data')
      // Record failed login attempt
      recordLoginAttempt(walletAddress, false)
      return false
    } catch (error) {
      console.error('❌ AuthContext: Login error:', error)
      if (error instanceof TypeError && error.message.includes('fetch')) {
        console.error('❌ AuthContext: Network error - backend server may not be running')
        console.error('❌ AuthContext: Attempted URL:', `${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000'}/api/auth/login`)
      }
      recordLoginAttempt(walletAddress, false)
      return false
    } finally {
      setIsLoading(false)
    }
  }

  // Logout function
  const logout = () => {
    // Clear cookies both ways
    document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'
    document.cookie = 'auth_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'
    Cookies.remove('token', { path: '/' })
    Cookies.remove('auth_token', { path: '/' })
    
    // Clear local storage
    localStorage.removeItem('auth_user')
    localStorage.removeItem('auth_timestamp')
    
    // Clear state
    setUser(null)
    
    // Disconnect wallet
    disconnect()
    
    // console.log('🚪 User logged out')
    
    // Notify other tabs
    localStorage.setItem('auth_logout', Date.now().toString())
  }

  // Check authentication status
  const checkAuthStatus = async () => {
    try {
      // console.log('🔍 AuthContext: Checking auth status...')
      const token = Cookies.get('token') || Cookies.get('auth_token')
      
      if (!token) {
        // console.log('🔍 AuthContext: No token found')
        setUser(null)
        setIsLoading(false)
        return
      }

      // console.log('🔍 AuthContext: Token found, checking localStorage for cached user...')
      
      // First check if we have cached user data
      const cachedUser = localStorage.getItem('auth_user')
      if (cachedUser) {
        try {
          const userData = JSON.parse(cachedUser)
          // console.log('✅ AuthContext: Using cached user data:', userData.walletAddress)
          setUser(userData)
          setIsLoading(false)
          return
        } catch (e) {
          // console.log('⚠️ AuthContext: Invalid cached user data, will verify with backend')
        }
      }

      // console.log('🔍 AuthContext: Verifying token with backend...')
      
      // Verify token with backend - try both verify endpoints
      let response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/auth/verify`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      })

      // If verify endpoint doesn't exist, try getting user info directly
      if (!response.ok && response.status === 404) {
        // console.log('🔍 AuthContext: /verify endpoint not found, trying alternative...')
        response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/auth/me`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        })
      }

      if (response.ok) {
        const userData = await response.json()
        const user = userData.user || userData.userFromDB || userData
        // console.log('✅ AuthContext: Token verified, user:', user.walletAddress)
        setUser(user)
        localStorage.setItem('auth_user', JSON.stringify(user))
      } else {
        // console.log('❌ AuthContext: Token verification failed:', response.status)
        // Token invalid, clear auth
        logout()
      }
    } catch (error) {
      console.error('❌ AuthContext: Auth check failed:', error)
      // Don't logout on network errors, just use cached data if available
      const cachedUser = localStorage.getItem('auth_user')
      if (cachedUser) {
        try {
          const userData = JSON.parse(cachedUser)
          // console.log('⚠️ AuthContext: Using cached user due to network error:', userData.walletAddress)
          setUser(userData)
        } catch (e) {
          logout()
        }
      } else {
        logout()
      }
    } finally {
      setIsLoading(false)
    }
  }

  // Auto-login when wallet connects
  useEffect(() => {
    if (isConnected && address && !isAuthenticated && !isLoading) {
      // Check if we should attempt auto-login
      if (shouldAttemptLogin(address)) {
        // console.log('🔗 Wallet connected, attempting auto-login...')
        login(address)
      } else {
        const attempts = loginAttempts.current.get(address)
        if (attempts) {
          const remainingCooldown = Math.ceil((loginCooldown - (Date.now() - attempts.lastAttempt)) / 1000)
          // console.log(`⏳ Auto-login skipped due to previous failed attempts. ${remainingCooldown}s remaining.`)
        }
      }
    }
  }, [isConnected, address, isAuthenticated, isLoading])

  // Check auth status on mount
  useEffect(() => {
    checkAuthStatus()
  }, [])

  // Cross-tab synchronization
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'auth_logout') {
        // Another tab logged out
        setUser(null)
        Cookies.remove('token', { path: '/' })
        Cookies.remove('auth_token', { path: '/' })
      } else if (e.key === 'auth_user' && e.newValue) {
        // Another tab logged in
        const userData = JSON.parse(e.newValue)
        setUser(userData)
      }
    }

    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [])

  // Handle wallet disconnection - but don't logout immediately as Web3Auth might be reconnecting
  useEffect(() => {
    if (!isConnected && isAuthenticated && !isLoading) {
      const timer = setTimeout(() => {
        // Only logout if still disconnected after a delay (to handle Web3Auth reconnection)
        if (!isConnected && isAuthenticated) {
          // console.log('🔌 Wallet disconnected permanently, logging out...')
          logout()
        }
      }, 2000) // 2 second delay
      
      return () => clearTimeout(timer)
    }
  }, [isConnected, isAuthenticated, isLoading])

  const value: AuthContextType = {
    user,
    isAuthenticated,
    isLoading,
    login,
    logout,
    checkAuthStatus,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
} 