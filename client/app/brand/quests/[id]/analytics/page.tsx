'use client'
import Link from "next/link"
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { notFound } from "next/navigation"
import CurrencyDisplay from '@/components/CurrencyDisplay';
import { PlatformDistributionChart } from "@/components/charts/platform-distribution-chart"
import { PlatformEngagementChart } from "@/components/charts/platform-engagement-chart"

interface Submission {
  _id?: string
  submittedByAddress: string
  socialPlatformName?: string
  videoLink?: string
  submittedAtTime?: string
  comments?: string
  rewarded?: boolean
  rewardAmountUsd?: string
  submissionRead?: boolean
  rewardedAtTime?: Date,
  twitterData?: {
    id?: string
    text?: string
    retweetCount?: number
    replyCount?: number
    likeCount?: number
    quoteCount?: number
    viewCount?: number
    createdAt?: Date
    lang?: string
    bookmarkCount?: number
    statsLastUpdated?: Date,
    author?: {
      userName?: string
      id?: string
      name?: string
      isVerified?: boolean
      isBlueVerified?: boolean
      profilePicture?: string
      location?: string
      followers?: number
      following?: number
    }
  }
  tiktokData?: {
    id?: string
    createTime?: Date
    author?: {
      id?: string
      uniqueId?: string
      nickname?: string
      avatarThumb?: string
      createTime?: Date
      verified?: boolean
      followerCount?: number
      followingCount?: number
      heartCount?: number
      videoCount?: number
      diggCount?: number
      friendCount?: number
    }
    diggCount?: number
    shareCount?: number
    commentCount?: number
    playCount?: number
    collectCount?: number
    repostCount?: number
    locationCreated?: string
    statsLastUpdated?: Date
  }
}

export default function AnalyticsPage({ 
  params 
}: { 
  params: { id: string } 
}) {
  const [submissions, setSubmissions] = useState<Submission[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchAllSubmissions = async () => {
    setLoading(true)
    const awaitedParams = await params; // Properly await params first

      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/brand/mySingleCreatedQuest/${awaitedParams.id}`, {
          credentials: "include",
        });

        const data = await res.json();

        const fetchedQuest = data.quest;

        if (!fetchedQuest) {
            notFound()
        }

        setSubmissions(fetchedQuest.submissions)

      } catch (error) {
        console.error("Error fetching submissions:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchAllSubmissions()
  }, [])

  // Aggregation logic
  const totals = {
    twitter: {
      views: 0,
      likes: 0,
      comments: 0,
      shares: 0,
      submissions: 0,
    },
    tiktok: {
      views: 0,
      likes: 0,
      comments: 0,
      shares: 0,
      submissions: 0,
    },
  }

  submissions.forEach((s) => {
    if (s.twitterData) {
      totals.twitter.views += s.twitterData.viewCount || 0
      totals.twitter.likes += s.twitterData.likeCount || 0
      totals.twitter.comments += s.twitterData.replyCount || 0
      totals.twitter.shares += s.twitterData.retweetCount || 0
      totals.twitter.submissions += 1
    }

    if (s.tiktokData) {
      totals.tiktok.views += s.tiktokData.playCount || 0
      totals.tiktok.likes += s.tiktokData.diggCount || 0
      totals.tiktok.comments += s.tiktokData.commentCount || 0
      totals.tiktok.shares += s.tiktokData.shareCount || 0
      totals.tiktok.submissions += 1
    }
  })

  const overallTotals = {
    views: totals.twitter.views + totals.tiktok.views,
    likes: totals.twitter.likes + totals.tiktok.likes,
    comments: totals.twitter.comments + totals.tiktok.comments,
    shares: totals.twitter.shares + totals.tiktok.shares,
  }

    // Prepare data for charts
  const platformData = [
    {
      name: "Twitter",
      views: totals.twitter.views,
      likes: totals.twitter.likes,
      comments: totals.twitter.comments,
      shares: totals.twitter.shares,
      submissions: totals.twitter.submissions,
      color: "bg-brand-blue",
    },
    {
      name: "TikTok",
      views: totals.tiktok.views,
      likes: totals.tiktok.likes,
      comments: totals.tiktok.comments,
      shares: totals.tiktok.shares,
      submissions: totals.tiktok.submissions,
      color: "bg-brand-purple",
    },
  ].filter((platform) => platform.submissions > 0)

      // Helper function to format numbers
  const formatNumber = (num?: number): string => {
    if (!num) return "0"
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + "M"
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + "K"
    }
    return num.toString()
  }


  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Campaign Analytics</h1>

      {loading ? (
        <p>Loading analytics...</p>
      ) : (
        <>
        
        
        <Tabs defaultValue="platforms" className="mb-8">
          <TabsList className="bg-white border border-gray-200">
            <TabsTrigger value="platforms">Platforms</TabsTrigger>

          </TabsList>

            <TabsContent value="platforms" className="mt-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              <PlatformDistributionChart
                data={platformData}
                title="Platform View Distribution"
                subtitle="Percentage of views per platform"
              />

              <PlatformEngagementChart
                data={platformData}
                title="Platform Engagement"
                subtitle="Views and likes comparison"
              />
            </div>

            {/* Platform Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {platformData.map((platform, index) => (
                <Card key={index} className="bg-white border-gray-200 shadow-sm">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-brand-dark flex items-center justify-between">
                      {platform.name}
                      <Badge className={`${platform.color} text-white`}>{platform.submissions} submissions</Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Views:</span>
                        <span className="font-bold text-brand-purple">{formatNumber(platform.views)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Likes:</span>
                        <span className="font-bold text-brand-pink">{formatNumber(platform.likes)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Comments:</span>
                        <span className="font-bold text-brand-teal">{formatNumber(platform.comments)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Shares:</span>
                        <span className="font-bold text-brand-yellow">{formatNumber(platform.shares)}</span>
                      </div>
                    </div>
                    <div className="mt-4">
                      <div className="text-sm text-gray-600 mb-1">Platform Share</div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>

          <section className="mb-6">
            <h2 className="text-xl font-semibold">📊 Overall Totals</h2>
            <ul className="list-disc ml-6 mt-2">
              <li>Views: {overallTotals.views.toLocaleString()}</li>
              <li>Likes: {overallTotals.likes.toLocaleString()}</li>
              <li>Comments: {overallTotals.comments.toLocaleString()}</li>
              <li>Shares: {overallTotals.shares.toLocaleString()}</li>
            </ul>
          </section>

          <section className="mb-6">
            <h2 className="text-xl font-semibold">🐦 Twitter Stats</h2>
            <ul className="list-disc ml-6 mt-2">
              <li>Views: {totals.twitter.views.toLocaleString()}</li>
              <li>Likes: {totals.twitter.likes.toLocaleString()}</li>
              <li>Comments: {totals.twitter.comments.toLocaleString()}</li>
              <li>Shares (Retweets): {totals.twitter.shares.toLocaleString()}</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold">🎵 TikTok Stats</h2>
            <ul className="list-disc ml-6 mt-2">
              <li>Views: {totals.tiktok.views.toLocaleString()}</li>
              <li>Likes (Hearts): {totals.tiktok.likes.toLocaleString()}</li>
              <li>Comments: {totals.tiktok.comments.toLocaleString()}</li>
              <li>Shares: {totals.tiktok.shares.toLocaleString()}</li>
            </ul>
          </section>
        </>
      )}
    </div>
  )
}