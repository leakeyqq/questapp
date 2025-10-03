  "use client"

  import { Card, CardContent, CardHeader } from "@/components/ui/card"
  import { Trophy, Zap, Target, Medal, Crown, TrendingUp } from "lucide-react"
  import {useEffect, useState} from "react"

  interface LeaderboardCreator {
  _id: string
  creatorAddress: string
  questsDoneCount?: number
  points: {
    pointsEarned: number
    pointsRedeemed: number
  }
  twitterData?: {
    name: string
    followers: number
    cloudinary_profilePicture: string
  }
  tiktokData?: {
    name: string
    followers: number
    cloudinary_profilePicture: string
  }
  instagramData?: {
    name: string
    followers: number
    cloudinary_profilePicture: string

  }
}

interface LeaderboardItem {
  id: string
  rank: number
  name: string
  avatar: string
  points: number
  questsCompleted: number
}


  // Simple leaderboard data
  // const leaderboardData = [
  //   {
  //     id: 1,
  //     rank: 1,
  //     name: "Sarah Johnson",
  //     avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
  //     points: 15420,
  //     questsCompleted: 47,
  //   },
  //   {
  //     id: 2,
  //     rank: 2,
  //     name: "Mike Chen",
  //     avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
  //     points: 14890,
  //     questsCompleted: 43,
  //   },
  //   {
  //     id: 3,
  //     rank: 3,
  //     name: "Emma Rodriguez",
  //     avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
  //     points: 13750,
  //     questsCompleted: 39,
  //   },
  //   {
  //     id: 4,
  //     rank: 4,
  //     name: "Alex Thompson",
  //     avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
  //     points: 12980,
  //     questsCompleted: 36,
  //   },
  //   {
  //     id: 5,
  //     rank: 5,
  //     name: "Jessica Park",
  //     avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face",
  //     points: 11650,
  //     questsCompleted: 32,
  //   },
  //   {
  //     id: 6,
  //     rank: 6,
  //     name: "David Kim",
  //     avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
  //     points: 10890,
  //     questsCompleted: 29,
  //   },
  //   {
  //     id: 7,
  //     rank: 7,
  //     name: "Lisa Wang",
  //     avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face",
  //     points: 9750,
  //     questsCompleted: 26,
  //   },
  //   {
  //     id: 8,
  //     rank: 8,
  //     name: "Ryan Martinez",
  //     avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop&crop=face",
  //     points: 8920,
  //     questsCompleted: 24,
  //   },
  //   {
  //     id: 9,
  //     rank: 9,
  //     name: "Sophia Lee",
  //     avatar: "https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=150&h=150&fit=crop&crop=face",
  //     points: 8150,
  //     questsCompleted: 22,
  //   },
  //   {
  //     id: 10,
  //     rank: 10,
  //     name: "James Wilson",
  //     avatar: "https://images.unsplash.com/photo-1507591064344-4c6ce005b128?w=150&h=150&fit=crop&crop=face",
  //     points: 7680,
  //     questsCompleted: 20,
  //   },
  // ]

  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + "M"
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + "K"
    }
    return num.toString()
  }

  export default function LeaderboardPage() {

  const [leaderboardData, setLeaderboardData] = useState<LeaderboardItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchLeaderboardData = async () => {
      try {
        setLoading(true)
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/creator/creatorsBoard`)
        if (!response.ok) {
          throw new Error(`Failed to fetch leaderboard data: ${response.status}`)
        }
        
        const unprocessedData = await response.json()

        const data: LeaderboardCreator[] = await unprocessedData.creators

        // Transform the API data into the format needed for the component
        const transformedData: LeaderboardItem[] = data
          .filter(creator => creator.points?.pointsEarned > 0) // Only include creators with points
          .sort((a, b) => (b.points?.pointsEarned || 0) - (a.points?.pointsEarned || 0)) // Sort by points descending
          // .slice(0, 20) // Take top 10
          .map((creator, index) => {
            // Get a fallback avatar based on index
            // const avatarIndex = index % fallbackAvatars.length
            // const fallbackAvatar = fallbackAvatars[avatarIndex]
            
            
            // Determine display name (prefer Twitter, then TikTok, then Instagram, then address)
            let userAvatar = "icon.png"
            let displayName = "Panda creator"
            if (creator.twitterData?.name) {
              displayName = `${creator.twitterData.name}`
              userAvatar = `${creator.twitterData.cloudinary_profilePicture}`
            } else if (creator.tiktokData?.name) {
              displayName = `${creator.tiktokData.name}`
              userAvatar = `${creator.tiktokData.cloudinary_profilePicture}`
            } else if (creator.instagramData?.name) {
              displayName = `${creator.instagramData.name}`
              userAvatar = `${creator.instagramData.cloudinary_profilePicture}`
            }
            
            // Calculate total quests completed
            const questsCompleted = (creator.questsDoneCount || 0)
            
            return {
              id: creator._id || creator.creatorAddress,
              rank: index + 1,
              name: displayName,
              avatar: userAvatar,
              points: creator.points?.pointsEarned || 0,
              questsCompleted: questsCompleted
            }
          })
        
        setLeaderboardData(transformedData)
      } catch (err) {
        console.error('Error fetching leaderboard data:', err)
        setError(err instanceof Error ? err.message : 'An unknown error occurred')
      } finally {
        setLoading(false)
      }
    }

    fetchLeaderboardData()
  }, [])

  const getRankIcon = (rank: number) => {
  // if (rank === 1) return <Crown className="w-5 h-5 md:w-6 md:h-6 text-yellow-500" />
  if (rank === 1) return "🥇"

  if (rank === 2) return "🥈"
  // if (rank === 3) return <Trophy className="w-5 h-5 md:w-6 md:h-6 text-orange-500" />
  if (rank === 3) return "🥉"

  return <span className="text-lg md:text-xl font-bold text-brand-purple">#{rank}</span>
}

const getRankBg = (rank: number) => {
  if (rank === 1) return "bg-gradient-to-r from-gray-50 to-yellow-100 border-gray-200"
  if (rank === 2) return "bg-gradient-to-r from-gray-50 to-gray-100 border-gray-200"
  if (rank === 3) return "bg-gradient-to-r from-gray-50 to-gray-100 border-orange-200"
  return "bg-white border-gray-100"
}

    if (loading) {
    return (
      <div className="min-h-screen bg-brand-light flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-purple mx-auto mb-4"></div>
          <p className="text-gray-600">Loading leaderboard...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-brand-light flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Trophy className="w-6 h-6 text-red-500" />
          </div>
          <h2 className="text-lg font-semibold text-red-600 mb-2">Error Loading Leaderboard</h2>
          <p className="text-gray-600">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-brand-purple text-white rounded-md hover:bg-brand-purple/90"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Modern Header */}
      <div className="bg-gradient-to-r from-pink-500 to-purple-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-32 translate-x-32"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-24 -translate-x-24"></div>

        <div className="container mx-auto px-4 py-8 md:py-12 relative z-10">
          <div className="text-center text-white">
            <div className="flex justify-center mb-4">
              <div className="w-14 h-14 md:w-16 md:h-16 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                <Trophy className="w-7 h-7 md:w-8 md:h-8 text-white" />
              </div>
            </div>
            <h1 className="text-2xl md:text-4xl font-bold mb-2">Creator Leaderboard</h1>
            <p className="text-white/90 text-sm md:text-base max-w-2xl mx-auto">
              Celebrating our top-performing creators and their achievements
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 md:py-8 -mt-6 relative z-10 mb-8">
        {/* Top 3 Podium Cards */}
<div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
  {leaderboardData.slice(0, 3).map((creator, index) => (
    <Card
      key={creator.id}
      className={`shadow-lg hover:shadow-xl transition-all duration-300
        ${index === 0 ? "md:col-span-1 md:order-2 md:scale-110 bg-yellow-50" : ""}
        ${index === 1 ? "md:order-1 bg-gray-100" : ""}
        ${index === 2 ? "md:order-3 bg-orange-50" : ""}
      `}
    >
      <CardContent className="p-6 text-center">
        <div className="mb-4">{getRankIcon(creator.rank)}</div>
        <img
          src={creator.avatar || "/placeholder.svg"}
          alt={creator.name}
          className="w-14 h-14 rounded-full mx-auto border-2 shadow-md"
        />
        <h3 className="font-semibold mt-3">{creator.name}</h3>
        <p className="text-sm text-gray-600">
          {/* {formatNumber(creator.points)} points • {creator.questsCompleted} Quests */}
          {creator.points} points • {creator.questsCompleted} Quests

        </p>
      </CardContent>
    </Card>
  ))}
</div>


        {/* Full Leaderboard */}
        <Card className="bg-white shadow-lg border-0 rounded-xl overflow-hidden">
          <CardHeader className="pb-4 bg-gradient-to-r from-purple-50 to-pink-50 border-b">
            <div className="flex items-center justify-center">
              {/* <TrendingUp className="w-5 h-5 text-purple-600 mr-2" /> */}
              <h2 className="text-lg md:text-xl font-bold text-gray-800 text-center">Complete rankings</h2>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {leaderboardData.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                <Trophy className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>No leaderboard data available yet.</p>
                <p className="text-sm">Be the first to complete quests and earn points!</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {leaderboardData.map((creator, index) => (
                  <div
                    key={creator.id}
                    className={`p-4 md:p-5 hover:bg-gray-50 transition-all duration-200 ${index < 3 ? "bg-gradient-to-r from-purple-50/30 to-transparent" : ""}`}
                  >
                    {/* Mobile Layout */}
                    <div className="md:hidden">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="flex-shrink-0 w-8 flex justify-center">
                          {creator.rank <= 3 ? (
                            getRankIcon(creator.rank)
                          ) : (
                            <span className="text-base font-bold text-purple-600">#{creator.rank}</span>
                          )}
                        </div>

                        <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-white shadow-sm">
                          <img
                            src={creator.avatar || "/placeholder.svg?height=40&width=40"}
                            alt={creator.name}
                            className="w-full h-full object-cover"
                          />
                        </div>

                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-gray-800 text-sm truncate">{creator.name}</h3>
                          
                          {/* Points and quests under the name on mobile */}
                          <div className="flex items-center gap-3 mt-1">
                            <div className="flex items-center gap-1 text-purple-600 font-medium text-xs">
                              {/* <Zap className="w-3 h-3" /> */}
                              {/* {formatNumber(creator.points)} points */}

                              {creator.points} points
                            </div>
                            <div className="flex items-center gap-1 text-pink-600 font-medium text-xs">
                              {/* <Target className="w-3 h-3" /> */}
                              {creator.questsCompleted} quests
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Desktop Layout */}
                    <div className="hidden md:flex items-center justify-between">
                      <div className="flex items-center gap-5">
                        <div className="flex-shrink-0 w-10 flex justify-center">
                          {creator.rank <= 3 ? (
                            getRankIcon(creator.rank)
                          ) : (
                            <span className="text-xl font-bold text-purple-600">#{creator.rank}</span>
                          )}
                        </div>

                        <div className="w-12 h-12 rounded-full overflow-hidden border-3 border-white shadow-md">
                          <img
                            src={creator.avatar || "/placeholder.svg?height=48&width=48"}
                            alt={creator.name}
                            className="w-full h-full object-cover"
                          />
                        </div>

                        <div>
                          <h3 className="font-semibold text-lg text-gray-800">{creator.name}</h3>
                        </div>
                      </div>

                      <div className="flex items-center gap-8">
                        <div className="text-center bg-purple-50 rounded-lg px-4 py-2">
                          <div className="flex items-center gap-2 text-purple-600 font-bold">
                            <Zap className="w-4 h-4" />
                            {creator.points}
                          </div>
                          <p className="text-gray-600 text-xs">Points</p>
                        </div>

                        <div className="text-center bg-pink-50 rounded-lg px-4 py-2">
                          <div className="flex items-center gap-2 text-pink-600 font-bold">
                            <Target className="w-4 h-4" />
                            {creator.questsCompleted}
                          </div>
                          <p className="text-gray-600 text-xs">Quests</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
  }
