'use client'

import Link from "next/link"
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { useAccount } from "wagmi";
import CurrencyDisplay from '@/components/CurrencyDisplay';
import { useWeb3 } from "@/contexts/useWeb3"
import { CopyButton } from "@/components/copyButton"
import { Gift, Trophy, Award } from 'lucide-react';
import { CashOutModal } from "@/components/cash-out-modal"
import SocialPlatformIcon from '@/components/SocialPlatformIcon';

// components/SocialPlatformIcon.tsx
import { FaYoutube, FaTwitter, FaInstagram, FaTiktok, FaTwitch, FaFacebook, FaGlobe } from 'react-icons/fa';

type PlatformIconProps = {
  platform?: string;
  className?: string;
};

// export const SocialPlatformIcon = ({ platform, className }: PlatformIconProps) => {
//   if (!platform) return <FaGlobe className={className} />;
  
//   const platformLower = platform.toLowerCase();
  
//   if (platformLower.includes('youtube')) return <FaYoutube className={className} />;
//   if (platformLower.includes('twitter') || platformLower.includes('x.com')) return <FaTwitter className={className} />;
//   if (platformLower.includes('instagram')) return <FaInstagram className={className} />;
//   if (platformLower.includes('tiktok')) return <FaTiktok className={className} />;
  
//   return <FaGlobe className={className} />;
// };


interface Quest {
  _id: string; // Can be string or ObjectId
  createdByAddress: string;
  brandName: string;
  title: string;
  brandImageUrl: string;
  description: string;
  rewardCriteria: string;
  prizePoolUsd: string;
  minFollowerCount: number;
  visibleOnline: boolean;
  endsOn: Date | string;
  submissions: Array<{
    submittedByAddress?: string;
    socialPlatformName?: string;
    videoLink?: string;
    comments?: string;
    rewarded?: boolean;
    rewardAmountUsd?: string;
    submissionRead?: boolean;
    submittedAtTime?: Date;
    rewardedAtTime?: Date;
  }>;
  createdAt: Date | string;
  updatedAt: Date | string;
  __v: number;
  videosToBeAwarded?: number;
  pricePerVideo?: string | number;
  _submissionRewarded?: boolean;
  _submissionRejected?: boolean;
  _rewardedAmount?: string;
  _platformPosted?: string;
  _videoUrl?: string;
  _submittedOn: Date;
}

export default function DashboardPage() {
    const { address, isConnected } = useAccount();
    const [loading, setLoading] = useState(false);
    const [quests, setQuests] = useState<Quest[]>([]);
    const[totalEarnings, setTotalEarnings] = useState('0')
    const[totalWithdrawn, setTotalWithdrawn] = useState('0')
    const[totalBalance, setTotalBalance ] = useState('0')
    const [walletBalance, setWalletBalance] = useState(0)
    const [showCashOutModal, setShowCashOutModal] = useState(false)
    const {checkCUSDBalance, isWalletReady } = useWeb3();
    

    useEffect(() => {
      if(isConnected && address && isWalletReady){
          setLoading(true);
          try{
            const getCreatorDetails = async() => {
                let fake_amount = '1'
                const balanceCheck = await checkCUSDBalance(fake_amount);
                setWalletBalance(Number(balanceCheck.balance))
             
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/creator`, {
                method: "GET",
                headers: {
                  "Content-Type": "application/json",
                },
                credentials: "include", 
              })

            if (res.ok) {
              const data = await res.json();
              console.log('Creator data:', data);

              setTotalEarnings(data.creator.totalEarnings)
              setTotalWithdrawn(data.creator.totalWithdrawn)
              setTotalBalance(data.creator.earningsBalance)
              setQuests(data.quests)
            } 
             
            }
            getCreatorDetails();
          }catch(e){
            console.error(e)
          }finally{
            setLoading(false);
          }
      }
    }, [isConnected, address, isWalletReady])


  
  return (
    <div>
      {loading ? (
    <div>Loading your dashboard...</div>
      ): (
    <div className="min-h-screen bg-brand-light">
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-brand-dark">Creator Dashboard</h1>
            <p className="text-gray-600">Track your quests and earnings</p>
          </div>
          <div className="flex gap-2">
            <Button asChild className="bg-brand-purple hover:bg-brand-purple/90 text-white">
              <Link href="/quests">Find New Quests</Link>
            </Button>
            <Button
              className="bg-brand-teal hover:bg-brand-teal/90 text-white"
              onClick={() => setShowCashOutModal(true)}
            >
              Cash Out
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card className="bg-white border-gray-200 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-brand-dark">Total Earnings</CardTitle>
              <CardDescription className="text-gray-600">All time</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-brand-teal">{totalEarnings} <CurrencyDisplay/></div>
              <p className="text-gray-600 text-sm mt-1">Wallet balance <span className="font-bold">{walletBalance}<CurrencyDisplay/></span></p>
              
            </CardContent>
          </Card>

          <Card className="bg-white border-gray-200 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-brand-dark">Completed Quests</CardTitle>
              <CardDescription className="text-gray-600">All time</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-brand-dark">{quests.length}</div>
              <p className="text-gray-600 text-sm mt-1"><span className="font-bold">{quests.filter(quest => quest._submissionRewarded).length}</span> rewarded</p>
            </CardContent>
          </Card>

          {/* <Card className="bg-white border-gray-200 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-brand-dark">Creator Level</CardTitle>
              <CardDescription className="text-gray-600">Based on activity</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <div className="text-3xl font-bold text-brand-purple">Silver</div>
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
                  className="text-gray-400"
                >
                  <circle cx="12" cy="8" r="6"></circle>
                  <path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"></path>
                </svg>
              </div>
              <div className="mt-2">
                <div className="flex justify-between text-xs mb-1 text-gray-600">
                  <span>Progress to Gold</span>
                  <span>65%</span>
                </div>
                <Progress value={65} className="h-2 bg-gray-200" indicatorClassName="bg-brand-purple" />
              </div>
            </CardContent>
          </Card> */}
        </div>

        <Tabs defaultValue="completed" className="mb-8">
          <TabsList className="bg-white border border-gray-200">
            <TabsTrigger value="completed">Completed</TabsTrigger>
          </TabsList>

          <TabsContent value="completed" className="mt-4">
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
              <div className="p-4">
                <h2 className="text-xl font-bold mb-4 text-brand-dark">Completed Quests ({quests.length})</h2>



                <div className="space-y-6">
                  {quests && quests.length > 0 ? (
                    quests.map((quest) => (
                      <div key={quest._id} className="bg-brand-light rounded-xl p-5 transition-all hover:shadow-md">
                        <div className="flex flex-col md:flex-row gap-5">
                          {/* Image section with improved styling */}
                          <div className="h-32 md:h-auto md:w-48 rounded-lg overflow-hidden shadow-sm flex-shrink-0">
                            <img
                              src={quest.brandImageUrl || "/default-quest-image.jpg"}
                              alt={`${quest.brandName} thumbnail`}
                              className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                            />
                          </div>

                          <div className="flex-1 flex flex-col justify-between">
                            <div>
                              <div className="flex flex-wrap items-center gap-2 mb-3">
                                {/* Brand name with icon */}
                                <span className="text-sm text-gray-600 flex items-center">
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
                                    className="mr-1"
                                  >
                                    <path d="M20.91 8.84 8.56 2.23a1.93 1.93 0 0 0-1.81 0L3.1 4.13a2.12 2.12 0 0 0-.05 3.69l12.22 6.93a2 2 0 0 0 1.94 0L21 12.51a2.12 2.12 0 0 0-.09-3.67Z"></path>
                                    <path d="m3.09 8.84 12.35-6.61a1.93 1.93 0 0 1 1.81 0l3.65 1.9a2.12 2.12 0 0 1 .1 3.69L8.73 14.75a2 2 0 0 1-1.94 0L3 12.51a2.12 2.12 0 0 1 .09-3.67Z"></path>
                                    <line x1="12" y1="22" x2="12" y2="13"></line>
                                    <path d="M20 13.5v3.37a2.06 2.06 0 0 1-1.11 1.83l-6 3.08a1.93 1.93 0 0 1-1.78 0l-6-3.08A2.06 2.06 0 0 1 4 16.87V13.5"></path>
                                  </svg>
                                  {quest.brandName}
                                </span>

                                {/* Status badge with improved styling */}
                                <Badge
                                  className={
                                    new Date(quest.endsOn) < new Date()
                                      ? "bg-brand-teal text-white"
                                      : "bg-brand-yellow text-brand-dark"
                                  }
                                >
                                  {new Date(quest.endsOn) < new Date() ? "Quest ended" : "Quest in progress"}
                                </Badge>

                                {/* Date badge with cleaner format */}
                                <Badge variant="outline" className="border-gray-300 text-gray-700 bg-white">
                                  {new Date(quest._submittedOn).toLocaleDateString("en-US", {
                                    month: "short",
                                    day: "numeric",
                                    year: "numeric",
                                  })}
                                </Badge>
                              </div>

                              {/* Quest title with larger font */}
                              <h3 className="text-xl font-bold mb-2 text-brand-dark">{quest.title}</h3>

                              {/* Payment amount with icon */}
                              <div className="flex items-center text-brand-purple font-bold mb-3">
                                    <Gift className="w-4 h-4 mr-2" /> {quest.pricePerVideo} <CurrencyDisplay/>
                              </div>
                            </div>

                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mt-2">
                              {/* Video link with platform icon */}
                              <div className="relative inline-flex items-center">
                                <a
                                  href={quest._videoUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center text-brand-purple hover:text-brand-pink transition-colors"
                                >
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="18"
                                    height="18"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="mr-2"
                                  >
                                    <path d="m22 8-6 4 6 4V8Z"></path>
                                    <rect x="2" y="6" width="14" height="12" rx="2" ry="2"></rect>
                                  </svg>
                                  Watch on {quest._platformPosted}
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
                                    className="ml-1"
                                  >
                                    <path d="M7 7h10v10"></path>
                                    <path d="M7 17 17 7"></path>
                                  </svg>
                                </a>

                                 <CopyButton text={quest._videoUrl || ''} />
                              </div>

                              <div className="flex items-center justify-between gap-4">
                                {/* Payment status with appropriate styling */}
                                {quest._submissionRewarded ? (
                                  <div className="text-brand-teal font-bold flex items-center">
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      width="18"
                                      height="18"
                                      viewBox="0 0 24 24"
                                      fill="none"
                                      stroke="currentColor"
                                      strokeWidth="2"
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      className="mr-1"
                                    >
                                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                                      <polyline points="22 4 12 14.01 9 11.01"></polyline>
                                    </svg>
                                    <span>{quest._rewardedAmount} <CurrencyDisplay/> earned</span>
                                  </div>
                                ) : (
                                  <div className="text-dark flex items-center font-medium">
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      width="18"
                                      height="18"
                                      viewBox="0 0 24 24"
                                      fill="none"
                                      stroke="currentColor"
                                      strokeWidth="2"
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      className="mr-1"
                                    >
                                      <circle cx="12" cy="12" r="10"></circle>
                                      <line x1="12" y1="8" x2="12" y2="12"></line>
                                      <line x1="12" y1="16" x2="12.01" y2="16"></line>
                                    </svg>
                                    In review
                                  </div>
                                )}

                                {/* View quest button */}
                                <Link href={`/quests/${quest._id}`} passHref>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="border-brand-purple text-brand-purple hover:bg-brand-purple/10 transition-colors"
                                  >
                                    View Quest
                                  </Button>
                                </Link>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-12 bg-brand-light/50 rounded-xl border border-dashed border-gray-300">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="48"
                        height="48"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="mx-auto text-gray-400 mb-4"
                      >
                        <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
                        <line x1="8" y1="21" x2="16" y2="21"></line>
                        <line x1="12" y1="17" x2="12" y2="21"></line>
                      </svg>
                      <p className="text-gray-500 mb-2">No completed quests yet</p>
                      <p className="text-gray-400 text-sm mb-4">Complete your first quest to see it here</p>
                      <Button asChild size="sm" className="bg-brand-purple hover:bg-brand-purple/90 text-white">
                        <Link href="/quests">Browse Available Quests</Link>
                      </Button>
                    </div>
                  )}
                </div>


              </div>
            </div>
          </TabsContent>
        </Tabs> 
        <CashOutModal
          isOpen={showCashOutModal}
          onClose={() => setShowCashOutModal(false)}
          onCashOutComplete={() => {
            // Refresh creator data after cash out
            setLoading(true);
            const refreshData = async() => {
              try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/creator`, {
                  method: "GET",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  credentials: "include", 
                })

                if (res.ok) {
                  const data = await res.json();
                  setTotalEarnings(data.creator.totalEarnings)
                  setTotalWithdrawn(data.creator.totalWithdrawn)
                  setTotalBalance(data.creator.earningsBalance)
                  setQuests(data.quests)
                } 
              } catch(e) {
                console.error(e)
              } finally {
                setLoading(false);
              }
            }
            refreshData();
          }}
          availableBalance={totalBalance}
          walletAddress={address || ""}
        />
        
        {/* <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="bg-white border-gray-200 shadow-sm">
            <CardHeader>
              <CardTitle className="text-brand-dark">Payout History</CardTitle>
              <CardDescription className="text-gray-600">Recent transactions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { date: "Apr 25, 2023", amount: "$120.00", status: "Completed" },
                  { date: "Apr 12, 2023", amount: "$75.00", status: "Completed" },
                  { date: "Mar 30, 2023", amount: "$200.00", status: "Completed" },
                  { date: "Mar 15, 2023", amount: "$50.00", status: "Completed" },
                ].map((transaction, index) => (
                  <div key={index} className="flex justify-between items-center p-3 bg-brand-light rounded-lg">
                    <div>
                      <p className="font-medium text-brand-dark">{transaction.date}</p>
                      <p className="text-gray-600 text-sm">Quest Reward</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-brand-teal">{transaction.amount}</p>
                      <p className="text-gray-600 text-sm">{transaction.status}</p>
                    </div>
                  </div>
                ))}
              </div>

              <Button
                variant="outline"
                className="w-full mt-4 border-brand-purple text-brand-purple hover:bg-brand-purple/10"
              >
                View All Transactions
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-white border-gray-200 shadow-sm">
            <CardHeader>
              <CardTitle className="text-brand-dark">Recommended Quests</CardTitle>
              <CardDescription className="text-gray-600">Based on your profile</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[1, 2, 3].map((item) => (
                  <div key={item} className="flex gap-3 p-3 bg-brand-light rounded-lg">
                    <div className="h-16 w-16 rounded-lg bg-gray-200 flex items-center justify-center flex-shrink-0">
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
                        className="text-gray-400"
                      >
                        <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
                        <circle cx="9" cy="9" r="2" />
                        <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-brand-dark">Spring Collection Showcase</h4>
                      <p className="text-gray-600 text-sm mb-1">Create a short video featuring our spring collection</p>
                      <div className="flex justify-between items-center">
                        <span className="text-brand-purple font-bold">$100 USDC</span>
                        <Badge variant="outline" className="text-xs border-brand-purple/30 text-brand-dark">
                          5 days left
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <Button asChild className="w-full mt-4 bg-brand-purple hover:bg-brand-purple/90 text-white">
                <Link href="/quests">Browse All Quests</Link>
              </Button>
            </CardContent>
          </Card>
        </div> */}
      </div>
    </div>
      )}
    </div>
  )
}
