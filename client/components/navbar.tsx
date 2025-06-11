"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { usePathname } from "next/navigation"
import { useAuth } from "@/contexts/AuthContext"
import { useAccount } from "wagmi"
import ConnectWalletButton from "./test/simple-connect"

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const pathname = usePathname()
  const { user, isAuthenticated, logout } = useAuth()
  const { address } = useAccount()

  const isActive = (path: string) => {
    return pathname === path
  }

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-brand-purple to-brand-pink">
                QuestPanda
              </span>
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-1">

          <Link
              href="/"
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                isActive("/")
                  ? "text-brand-purple bg-brand-light"
                  : "text-gray-700 hover:text-brand-purple hover:bg-brand-light/50"
              }`}
            >
              Home
            </Link>

            <Link
              href="/quests"
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                isActive("/quests")
                  ? "text-brand-purple bg-brand-light"
                  : "text-gray-700 hover:text-brand-purple hover:bg-brand-light/50"
              }`}
            >
              Quests
            </Link>


            
            <Link
              href="/dashboard"
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                isActive("/dashboard")
                  ? "text-brand-purple bg-brand-light"
                  : "text-gray-700 hover:text-brand-purple hover:bg-brand-light/50"
              }`}
            >
              Dashboard
            </Link>
            {/* <Link
              href="/leaderboard"
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                isActive("/leaderboard")
                  ? "text-brand-purple bg-brand-light"
                  : "text-gray-700 hover:text-brand-purple hover:bg-brand-light/50"
              }`}
            >
              Leaderboard
            </Link> */}

            <Link
              href="/brand"
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                isActive("/brand")
                  ? "text-fuchsia-700 bg-brand-light"
                  : "text-fuchsia-700 hover:text-fuchsia-700 hover:bg-brand-light/50"
              }`}
            >
              Am a brand
            </Link>

            {/* <div className="items-center space-x-4">
              <ConnectWalletButton />
           </div> */}

          </div>

          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated && user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-brand-light">
                    <div className="h-8 w-8 bg-brand-purple rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-white">
                        {address?.slice(2, 4).toUpperCase()}
                      </span>
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-medium text-gray-900">
                        {address?.slice(0, 6)}...{address?.slice(-4)}
                      </p>
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 bg-white border-gray-200 text-gray-800">
                  <DropdownMenuLabel>
                    <div>
                      <p className="font-medium">Wallet Connected</p>
                      <p className="text-xs text-gray-500 font-mono">
                        {address?.slice(0, 8)}...{address?.slice(-6)}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-gray-200" />
                  <DropdownMenuItem className="hover:bg-brand-light hover:text-brand-purple">
                    <Link href="/dashboard" className="w-full flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="mr-2"
                      >
                        <rect width="7" height="9" x="3" y="3" rx="1"></rect>
                        <rect width="7" height="5" x="14" y="3" rx="1"></rect>
                        <rect width="7" height="9" x="14" y="12" rx="1"></rect>
                        <rect width="7" height="5" x="3" y="16" rx="1"></rect>
                      </svg>
                      Creator Dashboard
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="hover:bg-brand-light hover:text-brand-purple">
                    <Link href="/brand/dashboard" className="w-full flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="mr-2"
                      >
                        <path d="M12 2v20"></path>
                        <path d="M2 5h20"></path>
                        <path d="M3 3v2"></path>
                        <path d="M21 3v2"></path>
                      </svg>
                      Brand Dashboard
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-gray-200" />
                  <DropdownMenuItem 
                    className="hover:bg-red-50 hover:text-red-600 cursor-pointer"
                    onClick={logout}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="mr-2"
                    >
                      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                      <polyline points="16,17 21,12 16,7"></polyline>
                      <line x1="21" y1="12" x2="9" y2="12"></line>
                    </svg>
                    Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <ConnectWalletButton />
            )}
          </div>

          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-500 hover:text-brand-purple hover:bg-brand-light/50 focus:outline-none"
            >
              <span className="sr-only">Open main menu</span>
              {isMenuOpen ? (
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
                >
                  <path d="M18 6 6 18"></path>
                  <path d="m6 6 12 12"></path>
                </svg>
              ) : (
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
                >
                  <line x1="4" x2="20" y1="12" y2="12"></line>
                  <line x1="4" x2="20" y1="6" y2="6"></line>
                  <line x1="4" x2="20" y1="18" y2="18"></line>
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200">
          <div className="px-2 pt-2 pb-3 space-y-1">
          <Link
              href="/"
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                isActive("/")
                  ? "text-brand-purple bg-brand-light"
                  : "text-gray-700 hover:text-brand-purple hover:bg-brand-light/50"
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>

            <Link
              href="/quests"
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                isActive("/quests")
                  ? "text-brand-purple bg-brand-light"
                  : "text-gray-700 hover:text-brand-purple hover:bg-brand-light/50"
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              Quests
            </Link>
            <Link
              href="/dashboard"
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                isActive("/dashboard")
                  ? "text-brand-purple bg-brand-light"
                  : "text-gray-700 hover:text-brand-purple hover:bg-brand-light/50"
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              Dashboard
            </Link>

            {/* <Link
              href="/leaderboard"
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                isActive("/leaderboard")
                  ? "text-brand-purple bg-brand-light"
                  : "text-gray-700 hover:text-brand-purple hover:bg-brand-light/50"
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              Leaderboard
            </Link> */}

            <Link
              href="/brand"
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                isActive("/brand")
                  ? "text-fuchsia-700 bg-brand-light"
                  : "text-fuchsia-700 hover:text-brand-purple hover:bg-brand-light/50"
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              Am a brand
            </Link>

            {isAuthenticated && user ? (
              <div className="pt-4 pb-3 border-t border-gray-200">
                <div className="flex items-center px-3">
                  <div className="flex-shrink-0">
                    <div className="h-10 w-10 rounded-full bg-brand-purple flex items-center justify-center text-white">
                      <span className="text-sm font-medium">
                        {address?.slice(2, 4).toUpperCase()}
                      </span>
                    </div>
                  </div>
                  <div className="ml-3">
                    <div className="text-base font-medium text-gray-800">Wallet Connected</div>
                    <div className="text-sm font-medium text-gray-500 font-mono">
                      {address?.slice(0, 8)}...{address?.slice(-6)}
                    </div>
                  </div>
                </div>
                <div className="mt-3 px-2 space-y-1">
                  <Link
                    href="/dashboard"
                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-brand-purple hover:bg-brand-light/50"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Creator Dashboard
                  </Link>
                  <Link
                    href="/brand/dashboard"
                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-brand-purple hover:bg-brand-light/50"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Brand Dashboard
                  </Link>
                  <button
                    className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-red-600 hover:text-red-700 hover:bg-red-50"
                    onClick={() => {
                      logout()
                      setIsMenuOpen(false)
                    }}
                  >
                    Sign out
                  </button>
                </div>
              </div>
            ) : (
              <div className="px-3 py-2">
                <ConnectWalletButton />
              </div>
            )}






          </div>
        </div>
      )}
    </nav>
  )
}
