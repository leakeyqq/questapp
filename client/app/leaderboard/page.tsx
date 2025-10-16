  "use client"

  import { Card, CardContent, CardHeader } from "@/components/ui/card"
  import { Trophy, Zap, Target, Medal, Crown, TrendingUp, ArrowRight, Link } from "lucide-react"
  import {useEffect, useState} from "react"
  import { useAccount } from "wagmi";
  

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
  const { address, isConnected } = useAccount();
  const [userPoints, setUserPoints] = useState(0)
  const [imgError, setImgError] = useState(false)

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
            <h1 className="text-2xl md:text-4xl font-bold mb-2">Creator leaderboard</h1>
            <p className="text-white/90 text-sm md:text-base max-w-2xl mx-auto">
              Celebrating our top-performing creators and their achievements
            </p>


                  {/* Fancy Discover Creators Text */}
      <div className="mt-2">

        {/* Compact Leaderboard Component */}
        <div className="mt-12 mb-12">
          <div className="relative max-w-xl mx-auto">
            {/* Background glow effect */}
            <div className="absolute -inset-1 bg-gradient-to-r from-brand-purple via-brand-pink to-brand-teal rounded-xl blur opacity-25"></div>

            {/* Main content */}
            <div className="relative bg-white rounded-xl p-6 border border-gray-200/50 shadow-lg">
              {/* Points Display */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10  rounded-lg flex items-center justify-center">
  {imgError ? (
  <span className="text-2xl">🐼</span>
) : (
  <img 
    src="/smallpanda.png"
    alt="Icon"
    className="w-10 h-10 object-cover"
    onError={() => setImgError(true)}
  />
)}
                    {/* <Zap className="w-5 h-5 text-white" /> */}
                  </div>
                  <div className="text-left">
                    <p className="text-sm text-gray-500">Your Points</p>
                    <p className="text-2xl font-bold text-gray-900">{userPoints.toLocaleString()}</p>
                  </div>
                </div>
              </div>

              {/* Airdrop Allocation */}
              <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg p-4 border border-yellow-200/50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-xl">🎁</span>
                  </div>
                  <div className="text-left flex-1">
                    <p className="text-sm font-semibold text-gray-900">Your Airdrop allocation</p>
                    <p className="text-xs text-gray-600">
                      You'll receive{" "}
                      <span className="font-bold text-brand-purple">
                        {(userPoints).toLocaleString()} coins
                      </span>{" "}
                      when we launch!
                    </p>
                  </div>
                </div>
              </div>

          {/* <p className="text-xs text-gray-500 mt-3 font-medium">Do quests, earn points & rank higher</p> */}
              


            </div>
          </div>
        </div>

        <Link href="/leaderboard" className="group inline-block hidden">
          <div className="relative">
            {/* Background glow effect */}
            <div className="absolute -inset-1 bg-gradient-to-r from-brand-purple via-brand-pink to-brand-teal rounded-lg blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>

            {/* Main content */}
            <div className="relative bg-white rounded-lg p-4 sm:p-6 border border-gray-200/50 shadow-lg group-hover:shadow-xl transition-all duration-300">
              <div className="flex items-center justify-center space-x-3">
                {/* Animated icon */}
                <div className="relative">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-brand-purple to-brand-pink rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
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
                      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                      <circle cx="9" cy="7" r="4"></circle>
                      <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
                      <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                    </svg>
                  </div>
                  {/* Pulse animation */}
                  <div className="absolute inset-0 w-12 h-12 bg-gradient-to-br from-brand-purple to-brand-pink rounded-full animate-ping opacity-20"></div>
                </div>



                {/* Text content */}
                <div className="text-left">
                  <div className="text-md sm:text-2xl font-bold bg-gradient-to-r from-brand-purple via-brand-pink to-brand-teal bg-clip-text text-transparent group-hover:from-brand-teal group-hover:via-brand-purple group-hover:to-brand-pink transition-all duration-500">
                    {/* Discover 3,000+ Creators */}
                    Leaderboard
                  </div>
                  <div className="text-sm text-gray-500 mt-1 group-hover:text-gray-600 transition-colors">
                    {/* Find the perfect creator for your brand */}
                    Top creators in our community
                  </div>

                  {/* Call to Action */}
                  {/* <div className="mt-6 p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl border border-yellow-200/50">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center flex-shrink-0">
                            <span className="text-lg">🎁</span>
                          </div>
                          <div className="text-left flex-1">
                            <p className="text-sm font-semibold text-gray-900">
                              Collect points for our upcoming token airdrop!
                            </p>
                            <p className="text-xs text-gray-600">1 point = 1 token when we launch</p>
                          </div>
                        </div>
                      </div> */}

                </div>


                {/* Arrow icon */}
                <div className="ml-4 group-hover:translate-x-1 transition-transform duration-300">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-brand-purple"
                  >
                    <path d="M7 7h10v10"></path>
                    <path d="M7 17 17 7"></path>
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </Link>
      </div>

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
