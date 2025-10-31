"use client"

import { useEffect, useState } from "react"
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
import ConnectWalletButton from "./test/simple-connect"
import { Zap, Info, Star } from "lucide-react"
import { AirdropInfoModal } from "@/components/airdrop-info-modal"
import { useAccount } from "wagmi";
import { useWeb3 } from "@/contexts/useWeb3"
import { getWeb3AuthInstance } from "../lib/web3AuthConnector"



export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const pathname = usePathname()
  const { address, isConnected } = useAccount();

    const [isAirdropModalOpen, setIsAirdropModalOpen] = useState(false)
    const [userPoints, setUserPoints] = useState(0)
    const [imgError, setImgError] = useState(false)
    const { isWalletReady } = useWeb3();
    

      const [userInfo, setUserInfo] = useState({
      name: "Me",
      profilePhoto: "/human-avatar.jpg", // You can add a default avatar image
      email: ""
    });
    
    

      // Mock user points - in real app, this would come from your data source
  // const userPoints = 500
  // Fetch user points
useEffect(() => {
    if(isConnected && address){
      const fetchPoints = async () => {
        try {
           const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/creator/getPoints`,
            {
              method: "GET",
              headers: { "Content-Type": "application/json" },
              credentials: "include",
            }
          );
          const data = await res.json();
          if (data.success) {
            setUserPoints(data.points)
          } else {
            console.log("Fetching points failed:", data.error);
          }
        } catch (error) {
            console.log("Fetching points failed:", error);
          
        }
      }

      fetchPoints()
    }
  
}, [isConnected])

  useEffect(() => {

    const fetchUserInfo = async () => {
      try {
        const web3auth = getWeb3AuthInstance();

        // After successful login
        if(web3auth.connected){
          const userInfo = await web3auth.getUserInfo();
          setUserInfo({
            name: userInfo.name || "Creator",
            profilePhoto: userInfo.profileImage || "/human-avatar.jpg",
            email: ""

          });
        }
      } catch (error) {
        throw error
      }

    }
    fetchUserInfo()

  }, [isConnected, address, isWalletReady])


  const isActive = (path: string) => {
    return pathname === path
  }

  return (
    <>
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <img src="/panda-logo.png" alt="Logo" className="w-10 mr-3"/>
              <span className="text-xl md:text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-brand-purple to-brand-pink">
                Questpanda
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
              Creator
            </Link>
            <Link
              href="/leaderboard"
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                isActive("/leaderboard")
                  ? "text-brand-purple bg-brand-light"
                  : "text-gray-700 hover:text-brand-purple hover:bg-brand-light/50"
              }`}
            >
              Leaderboard
            </Link>

            <Link
              href="/brand"
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                isActive("/brand")
                  ? "text-brand-purple bg-brand-light"
                  : "text-gray-700 hover:text-brand-purple hover:bg-brand-light/50"
              }`}
            >
              Brand
            </Link>

          </div>

            <div className="hidden md:flex items-center space-x-4 hidden">
              {/* Points Display with Info Icon */}
              <button
                onClick={() => setIsAirdropModalOpen(true)}
                className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-full hover:shadow-md hover:scale-105 transition-all group"
              >
            {imgError ? (
            <span className="text-2xl">🐼</span>
          ) : (
            <img 
              src="/smallpanda.png"
              alt="Icon"
              className="w-5 h-5 object-cover"
              onError={() => setImgError(true)}
            />
          )}
                <span className="font-semibold text-gray-700">{userPoints.toLocaleString()}</span>
              </button>
            </div>

            
            <div className="md:hidden flex items-center gap-2">
              {/* Mobile Points Display */}

<button
  onClick={() => setIsAirdropModalOpen(true)}
  className="flex items-center gap-1 px-2 py-0.5 bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-full hover:shadow-md transition-all"
>


              {imgError ? (
            <span className="text-2xl">🐼</span>
          ) : (
            <img 
              src="/smallpanda.png"
              alt="Icon"
              className="w-4 h-4 object-cover"
              onError={() => setImgError(true)}
            />
          )}
  <span className="font-semibold text-gray-700 text-xs">{userPoints.toLocaleString()}</span>
</button>

            </div>
            


          <div className="hidden md:flex items-center space-x-4">

            
<div className="hidden md:flex items-center space-x-4">
  <div className="items-center space-x-4">
    {/* Show user profile and name when logged in */}
    {isConnected && userInfo ? (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <div className="flex items-center space-x-2 rounded-full pl-2 pr-4 py-1 border hover:bg-gray-50 cursor-pointer transition-colors">
            <div className="w-8 h-8 bg-brand-purple/10 rounded-full flex items-center justify-center">
              <img 
                src={userInfo.profilePhoto} 
                alt={userInfo.name} 
                className="w-full h-full object-cover rounded-[50%]" 
                onError={(e) => {
                  e.currentTarget.src = "/human-avatar.jpg"
                }}
              />
            </div>
            <span className="text-sm font-medium text-gray-700">
              {userInfo.name.split(' ')[0]}
            </span>
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="p-0">
            <div className="w-full">
              <ConnectWalletButton />
            </div>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ) : (
      <ConnectWalletButton />
    )}
  </div>
</div>

          {/* <div className="items-center space-x-4">
              <ConnectWalletButton />
           </div> */}
           
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

                  {/* Show user info in mobile menu */}
      {isConnected && userInfo && (
        <div className="flex items-center space-x-3 px-3 py-4 border-b border-gray-100 mb-2 bg-gray-50 rounded-lg mx-2">
          <div className="w-10 h-10 bg-brand-purple/10 rounded-full flex items-center justify-center">
            <img 
              src={userInfo.profilePhoto} 
              alt={userInfo.name}
              className="w-full h-full object-cover rounded-[50%]"
              onError={(e) => {
                e.currentTarget.src = "/human-avatar.jpg"
              }}
            />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-700">{userInfo.name}</p>
            <p className="text-xs text-gray-500">Online</p>
          </div>
        </div>
      )}


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
              Creator
            </Link>


            <Link
              href="/brand"
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                isActive("/brand")
                  ? "text-brand-purple bg-brand-light"
                  : "text-gray-700 hover:text-brand-purple hover:bg-brand-light/50"
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              Brand
            </Link>

                        <Link
              href="/leaderboard"
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                isActive("/leaderboard")
                  ? "text-brand-purple bg-brand-light"
                  : "text-gray-700 hover:text-brand-purple hover:bg-brand-light/50"
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              Leaderboard
            </Link>

            <div className="items-center space-x-4">
            {/* User Dropdown or Auth Button */}
              <ConnectWalletButton />
           </div>

          </div>
        </div>
      )}
    </nav>
          {/* Airdrop Info Modal */}
      <AirdropInfoModal
        isOpen={isAirdropModalOpen}
        onClose={() => setIsAirdropModalOpen(false)}
        userPoints={userPoints}
      />
    </>
    
  )
}
