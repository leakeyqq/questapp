"use client"
import { X, Zap, Gift, TrendingUp } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

interface AirdropInfoModalProps {
  isOpen: boolean
  onClose: () => void
  userPoints: number
}

export function AirdropInfoModal({ isOpen, onClose, userPoints }: AirdropInfoModalProps) {
  const [imgError, setImgError] = useState(false)

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-sm w-full">
        {/* Header */}
        <div className="bg-gradient-to-r from-brand-purple to-brand-pink p-4 relative">
          <button
            onClick={onClose}
            className="absolute top-3 right-3 text-white hover:bg-white/20 rounded-full p-1 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-2">
            <div className="bg-white/20 p-2 rounded-full">
              <Gift className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Rewards  program🎁</h2>
              <p className="text-white/90 text-xs">Earn extra points → Get free cash</p>
            </div>
          </div>
        </div>

        {/* Content - Compact */}
        <div className="p-4 space-y-4">
          {/* Current Points */}
          <div className="bg-gradient-to-br from-brand-purple/10 to-brand-pink/10 p-4 rounded-lg border border-brand-purple/20">
            <div className="flex items-center justify-between mb-1">
              <span className="text-gray-600 text-sm font-medium">Extra points earned</span>
{imgError ? (
  <span className="text-2xl">🐼</span>
) : (
  <img 
    src="/smallpanda.png"
    alt="Icon"
    className="w-8 h-8 object-cover"
    onError={() => setImgError(true)}
  />
)}
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-brand-purple">{userPoints.toLocaleString()}</span>
              {/* <span className="text-gray-600 text-sm">= {userPoints.toLocaleString()} free coins on launch</span> */}
            </div>
          </div>

          {/* How It Works - Compact */}
          <div>
            <h3 className="text-sm font-bold text-gray-900 mb-2 flex items-center gap-1">
              {/* <TrendingUp className="w-4 h-4 text-brand-purple" /> */}
              How it works
            </h3>
            <div className="space-y-2 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 bg-brand-purple text-white rounded-full flex items-center justify-center font-bold text-xs">
                  1
                </div>
                <span className="text-gray-600">Complete quests</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 bg-brand-pink text-white rounded-full flex items-center justify-center font-bold text-xs">
                  2
                </div>
                <span className="text-gray-600">Earn 100 extra points for each quest done</span>
              </div>
                            <div className="flex items-center gap-2">
                <div className="w-5 h-5 bg-brand-teal text-white rounded-full flex items-center justify-center font-bold text-xs">
                  3
                </div>
                <span className="text-gray-600">Wait for launch day and receive an airdrop</span>
              </div>
            </div>
          </div>

          
                    {/* What You'll Get - Clear explanation */}
                    <div className="bg-blue-50 border-2 border-blue-400 rounded-xl p-4">
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 bg-blue-400 rounded-full p-2">
                          <Gift className="w-5 h-5 text-blue-900" />
                        </div>
                        <div>
                          {/* <p className="font-bold text-blue-900 mb-1">After launch 🎁</p> */}
                          {/* <p className="font-bold text-blue-900 mb-1">After launch 🎁</p> */}
                          <p className="font-bold text-blue-900 mb-1">Airdrop coming...🎁</p>


                          <p className="text-sm text-blue-800">
                            Your points will convert to <strong>coins</strong> with real value. You can redeem for cash
                          </p>
                        </div>
                      </div>
                    </div>


          {/* Action Buttons - Compact */}
          <div className="space-y-2">
            <Link
              href="/leaderboard"
              onClick={onClose}
              className="block w-full bg-gradient-to-r from-brand-purple to-brand-pink text-white text-center py-2 px-4 rounded-lg font-semibold text-sm hover:shadow-md transition-all"
            >
              View Leaderboard ›
            </Link>
            
            {/* <Link
              href="/leaderboard"
              onClick={onClose}
              className="block w-full bg-white border border-gray-300 text-gray-700 text-center py-2 px-4 rounded-lg font-medium text-sm hover:bg-gray-50 transition-colors"
            >
              View Leaderboard
            </Link> */}
          </div>
        </div>
      </div>
    </div>
  )
}