// "use client"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import SubmissionForm from "@/components/submission-form"
import { quests } from "@/lib/data"
import type { Quest } from "@/lib/types"
import { notFound, useParams, useRouter  } from "next/navigation"
// import { useEffect, useState } from "react"
import { getSingleQuest } from "@/lib/quest";
import LinkifyText from '@/components/LinkifyText';
import { CopyButton } from "@/components/copyButton"
import CurrencyDisplay from '@/components/CurrencyDisplay';
import FarcasterSDKInitializer from "@/components/FarcasterSDKInitializer";
import { cookies } from 'next/headers';


import { generateMetadata } from "./../[id]/generateMetadata";
export { generateMetadata };

// components/SocialPlatformIcon.tsx
import { 
  FaYoutube, 
  FaTwitter, 
  FaInstagram, 
  FaTiktok,
  FaTwitch,
  FaFacebook,
  FaGlobe 
} from 'react-icons/fa';

type PlatformIconProps = {
  platform?: string;
  className?: string;
};


type Platform = 'twitter' | 'tiktok' | 'instagram'; // Add other platforms as needed

type SocialPlatformSettings = {
  allowedOnCampaign: boolean;
  minFollowers: number;
};

type SocialPlatformsAllowed = {
  [P in Platform]?: SocialPlatformSettings;
};

export const SocialPlatformIcon = ({ platform, className }: PlatformIconProps) => {
  if (!platform) return <FaGlobe className={className} />;
  
  const platformLower = platform.toLowerCase();
  
  if (platformLower.includes('youtube')) return <FaYoutube className={className} />;
  if (platformLower.includes('twitter') || platformLower.includes('x.com')) return <FaTwitter className={className} />;
  if (platformLower.includes('instagram')) return <FaInstagram className={className} />;
  if (platformLower.includes('tiktok')) return <FaTiktok className={className} />;
  
  return <FaGlobe className={className} />;
};

interface PageProps {
  params: { id: string };
}

// interface QuestPageProps {
//   params: {
//     id: string
//   }
// }
// utils/date.ts
export const formatDateString = (dateString?: string) => {
  if (!dateString) return '';
  try {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  } catch {
    return dateString; // fallback to raw string if parsing fails
  }
};
export const shortenAddress = (address: string, chars = 4): string => {
  if (!address) return 'Anonymous';
  return `${address.substring(0, chars)}...${address.substring(address.length - chars)}`;
};

export default async function QuestPage({ 
  params 
}: { 
  params: { id: string } 
}) {
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
interface Applicant {
  userWalletAddress: string;
  platform?: string;
  approved: boolean;
  rejected: boolean;
  // Add other fields from your schema as needed
}
  // const [allSubmissions, setAllSubmissions] = useState<Submission[]>([])

let allSubmissions: Submission[] = []

  
  const awaitedParams = await params; // Properly await params first

  const quest = await getSingleQuest(awaitedParams.id);

  if (!quest) notFound();
        
  // setAllSubmissions(quest.submissions)
  allSubmissions = quest.submissions

  // console.log('address is ', address)
  const cookieStore = await cookies();
  const userWalletAddress = cookieStore.get('userWalletAddress')?.value; 
  const isUserLoggedIn = Boolean(cookieStore.get('userWalletAddress')?.value);
  // const userApplication = quest.applicants.find((a: Applicant)  => a.userWalletAddress === userWalletAddress);

  const userApplication = quest.applicants?.find((a: Applicant) => a.userWalletAddress === userWalletAddress) || null;

  const applicationStatus = quest.approvalNeeded 
    ? !isUserLoggedIn 
      ? 'notLoggedIn'
      : userApplication?.approved
        ? 'approved'
      : userApplication?.rejected
        ? 'rejected'
      : userApplication
        ? 'pending' // Has application but neither approved nor rejected
        : 'notApplied'
    : 'notApplied';


  const daysLeft = Math.ceil((new Date(quest.endsOn).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))

  // Assign a color based on the quest category
  const getCategoryColor = (category: string) => {
    const colors = {
      "Create video": "bg-brand-purple text-white",
      Photo: "bg-brand-pink text-white",
      Review: "bg-brand-teal text-white",
      Unboxing: "bg-brand-blue text-white",
    }
    return colors[category as keyof typeof colors] || "bg-brand-yellow text-brand-dark"
  }


const getMinFollowersForPlatform = (quest: Quest, platform: string) => {
  const platformKey = platform.toLowerCase();
  
    // Type-safe check with type assertion
    if (isPlatform(platformKey)) {
      return quest.socialPlatformsAllowed?.[platformKey]?.minFollowers || 0;
    }
    
    // Fallback to legacy minFollowerCount
    return quest.minFollowerCount || 0;
  };

  // Helper type guard
  function isPlatform(key: string): key is Platform {
    return ['twitter', 'tiktok', 'instagram'].includes(key);
  }

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

          // Helper function to get creator data
        const getCreatorData = (submission: Submission) => {
          if (submission.twitterData?.author) {
            return {
              name: submission.twitterData.author.name || submission.twitterData.author.userName || "Unknown",
              username: submission.twitterData.author.userName || "",
              profilePic: submission.twitterData.author.profilePicture || "",
              followers: submission.twitterData.author.followers || 0,
              following: submission.twitterData.author.following || 0,
              verified: submission.twitterData.author.isVerified || submission.twitterData.author.isBlueVerified || false,
              platform: "Twitter",
            }
          }

        if (submission.tiktokData?.author) {
          return {
            name: submission.tiktokData.author.nickname || submission.tiktokData.author.uniqueId || "Unknown",
            username: submission.tiktokData.author.uniqueId || "",
            profilePic: submission.tiktokData.author.avatarThumb || "",
            followers: submission.tiktokData.author.followerCount || 0,
            following: submission.tiktokData.author.followingCount || 0,
            verified: submission.tiktokData.author.verified || false,
            platform: "TikTok",
          }
    }

    return null
        }

        // Helper function to get video metrics
      const getVideoMetrics = (submission: Submission) => {
        if (submission.twitterData) {
          return {
            views: submission.twitterData.viewCount || 0,
            likes: submission.twitterData.likeCount || 0,
            comments: submission.twitterData.replyCount || 0,
            platform: "Twitter",
            lastUpdated: submission.twitterData.statsLastUpdated || new Date()
          }
        }

        if (submission.tiktokData) {
          return {
            views: submission.tiktokData.playCount || 0,
            likes: submission.tiktokData.diggCount || 0,
            comments: submission.tiktokData.commentCount || 0,
            platform: "TikTok",
            lastUpdated: submission.tiktokData.statsLastUpdated || new Date()
          }
        }

        return null
      }

    

  return (
    <div className="min-h-screen bg-brand-light">
      <FarcasterSDKInitializer />
      <div className="container mx-auto px-4 py-12">
        <div className="mb-8">
          <Link href="/quests" className="text-brand-purple hover:text-brand-pink flex items-center">
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
              <path d="m15 18-6-6 6-6"></path>
            </svg>
            Back to quests
          </Link>
        </div>


        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">


    <div className="relative h-64 md:h-80 rounded-xl overflow-hidden mb-6 shadow-lg">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${quest.brandImageUrl})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
      
      {/* Approval Needed Badge - Top Right */}
      {quest.approvalNeeded && (
        <div className="absolute top-4 left-4">
          <Badge className="bg-brand-blue text-white">
            Approval Needed
              <span className="flex items-center justify-center w-4 h-4 rounded-full bg-white/20">
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  width="12" 
                  height="12" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
              </span>
          </Badge>
        </div>
      )}
      
      <div className="absolute bottom-4 left-4">
        <Badge className="bg-brand-purple text-white">Create video</Badge>
        <h1 className="text-3xl md:text-4xl font-bold text-white">{quest.title}</h1>
        <p className="text-white/80">by {quest.brandName}</p>
      </div>
    </div>

            <Tabs defaultValue="details" className="mb-8">
              <TabsList className="bg-white border border-gray-200">
                <TabsTrigger value="details">Details</TabsTrigger>
                <TabsTrigger value="submissions">Submissions</TabsTrigger>
              </TabsList>
              <TabsContent value="details" className="bg-white rounded-xl p-6 border border-gray-200 mt-2 shadow-md">
                <h2 className="text-xl font-bold mb-4 text-brand-dark">Quest details</h2>
                {/* <p className="text-gray-700 text-sm md:text-lg">{quest.description}</p> */}
                <p className="text-gray-700 text-sm md:text-lg">
                  <LinkifyText text={quest.description} />
                </p>

              {/* Platform Requirements Section - Flex Wrap */}
              <div className="mt-4">
              <div className="mb-3">
                <h2 className="text-xl font-bold text-brand-dark">Social requirement</h2>
                <p className="text-sm md:text-lg text-gray-700 mt-1">
                  You should meet <span className="font-bold">one</span> of these number of followers to participate.
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                {Object.entries(quest.socialPlatformsAllowed || {}).map(([platform, config]) => {
                  const platformConfig = config as SocialPlatformSettings;
                  const platformKey = platform as Platform;
                  
                  return platformConfig.allowedOnCampaign && (
                    <div 
                      key={platformKey} 
                      className="flex items-center gap-2 p-2 pr-3 rounded-lg bg-brand-light/30 hover:bg-brand-light/40 transition-colors"
                    >
                      <SocialPlatformIcon platform={platformKey} className="w-5 h-5 flex-shrink-0" />
                      <div className="min-w-0">
                        <p className="text-sm md:text-lg font-medium capitalize">{platformKey}</p>
                        <p className="text-[0.80rem] text-gray-500 font-medium">
                          {getMinFollowersForPlatform(quest, platformKey).toLocaleString()}+
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
              </div>

                <div className="mt-4">
                  <h2 className="text-xl font-bold mb-4 text-brand-dark">Reward criteria</h2>
                  {quest.approvalNeeded ? (
                  <p className="text-gray-700 mb-4">All content creators will be rewarded with {quest.pricePerVideo}<CurrencyDisplay/> each.
                   {/* Only  {quest.videosToBeAwarded} slots left now. */}
                   </p>

                  ):(
                  <p className="text-gray-700 mb-4">The best {quest.videosToBeAwarded} videos shall earn {quest.pricePerVideo}<CurrencyDisplay/> each.</p>
                  )}
                </div>


      <div className="mt-6 grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="bg-brand-light p-4 rounded-lg text-center">
                    <p className="text-gray-600 text-sm">Reward</p>
                    <p className="text-xl font-bold text-brand-purple">{quest.pricePerVideo} <CurrencyDisplay/></p>
                  </div>


                  
                  <div className="bg-brand-light p-4 rounded-lg text-center">
                    <p className="text-gray-600 text-sm">Deadline</p>
                    <p className="text-xl font-bold text-brand-dark">
                          {daysLeft >= 0 ? `${daysLeft} days` : "Quest ended"}
                    </p>

                  </div>
                  <div className="bg-brand-light p-4 rounded-lg text-center">
                    <p className="text-gray-600 text-sm">Current participants</p>
                    <p className="text-xl font-bold text-brand-dark">{quest.submissions.length}</p>
                  </div>
                  {/* <div className="bg-brand-light p-4 rounded-lg text-center">
                    <p className="text-gray-600 text-sm">Min follower count</p>
                    <p className="text-xl font-bold text-brand-dark">{quest.minFollowerCount.toLocaleString()}</p>
                  </div> */}
                </div>
              </TabsContent>

            <TabsContent value="submissions" className="bg-white rounded-lg p-4 border border-gray-200 mt-2 shadow-sm">
              <div className="space-y-3">
                {allSubmissions.reverse().map((submission: Submission) => {
                  const creatorData = getCreatorData(submission)
                  const videoMetrics = getVideoMetrics(submission)

                  return (
                    <div key={submission._id} className="bg-white rounded-md p-3 border border-gray-100 shadow-sm">
                        {/* Reward Banner */}
  {submission.rewardAmountUsd && (
    <div className="absolute top-2 right-2 bg-brand-purple text-white text-xs font-semibold px-2 py-1 rounded-full shadow-md">
      Reward: {submission.rewardAmountUsd} USD
    </div>
  )}
                      {/* Header: Profile + Buttons */}
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-start gap-3">
                          {creatorData?.profilePic ? (
                            <img
                              src={creatorData.profilePic || "/placeholder.svg"}
                              alt={creatorData.name}
                              className="w-10 h-10 rounded-full object-cover border"
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-full bg-brand-purple/20 flex items-center justify-center text-brand-purple font-semibold text-sm">
                              {creatorData?.name?.charAt(0) || shortenAddress(submission.submittedByAddress).charAt(0)}
                            </div>
                          )}

                          <div className="text-sm">
                            <div className="flex items-center gap-1 font-semibold text-brand-dark text-base">
                              {creatorData?.name || shortenAddress(submission.submittedByAddress)}
                              {creatorData?.verified && (
                                <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                                  <polyline points="22 4 12 14.01 9 11.01"></polyline>
                                </svg>
                              )}
                            </div>
                            {creatorData?.username && (
                              <p className="text-gray-600 text-xs">@{creatorData.username}</p>
                            )}
                            {creatorData?.followers !== undefined && (
                              <p className="text-xs text-gray-500 mt-1">
                                <span className="font-medium text-brand-purple">{formatNumber(creatorData.followers)}</span>{" "}
                                followers
                              </p>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Platform + Watch + Copy */}
                      <div className="flex flex-wrap items-center gap-2 text-sm text-gray-600 mb-2">
                        <span>{creatorData?.platform}</span>

                        <SocialPlatformIcon platform={submission.socialPlatformName} className="w-4 h-4" />
                        <a
                          href={submission.videoLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-brand-purple hover:text-brand-pink flex items-center text-sm"
                        >
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path d="m22 8-6 4 6 4V8Z" />
                            <rect x="2" y="6" width="14" height="12" rx="2" ry="2" />
                          </svg>
                          Watch
                        </a>
                        <CopyButton text={submission.videoLink || ''} />
                        <span
                          className={`text-white text-xs font-semibold px-2 py-1 rounded-full shadow-md ${
                            submission.rewardAmountUsd == '0' ? 'bg-brand-purple' : 'bg-brand-teal'}`}>
                          + {submission.rewardAmountUsd} USD
                        </span>

                      </div>
  


                      {/* Video Metrics */}
                      {videoMetrics && submission.socialPlatformName?.toLowerCase() === 'twitter' && (
                        <div className="bg-brand-light p-2 rounded-md mb-2">
                          <div className="grid grid-cols-3 gap-2 text-center text-xs">
                            <div>
                              <div className="flex justify-center mb-1 text-brand-purple">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                                  <circle cx="12" cy="12" r="3" />
                                </svg>
                              </div>
                              <p className="font-bold">{formatNumber(videoMetrics.views)}</p>
                              <p className="text-gray-600">Views</p>
                            </div>

                            <div>
                              <div className="flex justify-center mb-1 text-brand-pink">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                                </svg>
                              </div>
                              <p className="font-bold">{formatNumber(videoMetrics.likes)}</p>
                              <p className="text-gray-600">Likes</p>
                            </div>

                            <div>
                              <div className="flex justify-center mb-1 text-brand-teal">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                                </svg>
                              </div>
                              <p className="font-bold">{formatNumber(videoMetrics.comments)}</p>
                              <p className="text-gray-600">Comments</p>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* No Metrics Message */}
                      {!videoMetrics && !creatorData && (
                        <div className="bg-gray-50 p-2 rounded-md text-center text-sm text-gray-600">
                          <svg
                            className="inline w-4 h-4 mr-1 text-gray-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <circle cx="12" cy="12" r="10" />
                            <line x1="12" y1="8" x2="12" y2="12" />
                            <line x1="12" y1="16" x2="12.01" y2="16" />
                          </svg>
                          Social media metrics not available
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </TabsContent>

            </Tabs>
          </div>

          <div>
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden sticky top-4 shadow-md">
              <div className="p-6">
                <h2 className="text-xl font-bold mb-4 text-brand-dark">Quest status</h2>

                <div className="space-y-4 mb-6">
                  {/* <div className="bg-brand-light p-4 rounded-lg">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Prize Pool:</span>
                      <span className="text-xl font-bold text-brand-purple">{quest.prizePoolUsd} <CurrencyDisplay/></span>
                    </div>
                    <div className="text-sm text-gray-500 mt-1">Distributed among all selected submissions</div>
                  </div> */}

                  <div className="bg-brand-light p-4 rounded-lg">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Time Left:</span>
                      {/* <span className="font-bold text-brand-dark">{daysLeft} days</span> */}
                      <span className="font-bold text-brand-dark">
                          {daysLeft >= 0 ? `${daysLeft} days` : "Quest ended"}
                      </span>


                    </div>
                    <div className="text-sm text-gray-500 mt-1">
                      Deadline: {new Date(quest.endsOn).toLocaleDateString()}
                    </div>
                  </div>
                </div>

                {/* <SubmissionForm questId={quest._id} /> */}
                <SubmissionForm 
                  questId={quest._id} 
                  approvalNeeded={quest.approvalNeeded} 
                  minFollowers={quest.minFollowers}  
                  allowedPlatforms={quest.socialPlatformsAllowed}  
                  applicationStatus={applicationStatus}
                  appliedPlatform={applicationStatus === 'approved' ? userApplication?.platform : undefined} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
