// "use client"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import SubmissionForm from "@/components/submission-form"
import { quests } from "@/lib/data"
import type { Quest } from "@/lib/types"
import { notFound  } from "next/navigation"
// import { useEffect, useState } from "react"
import { getSingleQuest } from "@/lib/quest";
import LinkifyText from '@/components/LinkifyText';
import { CopyButton } from "@/components/copyButton"
import CurrencyDisplay from '@/components/CurrencyDisplay';
import FarcasterSDKInitializer from "@/components/FarcasterSDKInitializer";
import { cookies } from 'next/headers';
import ShareButton from "@/components/ShareButton"
import UpvoteButton from '@/components/UpvoteButton';
import QuestQRCode from '@/components/QuestQRCode';

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
import { Video } from "lucide-react"

type PlatformIconProps = {
  platform?: string;
  className?: string;
};


type Platform = 'twitter' | 'tiktok' | 'instagram' | 'farcaster'; // Add other platforms as needed

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
  if (platformLower.includes('twitter') || platformLower.includes('x.com')) return <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 93 92" fill="none">
              <rect x="0.138672" width="91.5618" height="91.5618" rx="15" fill="black"/>
              <path d="M50.7568 42.1716L69.3704 21H64.9596L48.7974 39.383L35.8887 21H21L40.5205 48.7983L21 71H25.4111L42.4788 51.5869L56.1113 71H71L50.7557 42.1716H50.7568ZM44.7152 49.0433L42.7374 46.2752L27.0005 24.2492H33.7756L46.4755 42.0249L48.4533 44.7929L64.9617 67.8986H58.1865L44.7152 49.0443V49.0433Z" fill="white"/>
              </svg>;
  if (platformLower.includes('instagram')) return <img 
          src="/insta-adobe2.png" 
          alt="Instagram" 
          className="object-contain h-7 w-7"
        />;
  if (platformLower.includes('tiktok')) return <svg width="20" height="20" viewBox="0 0 92 92" fill="none" xmlns="http://www.w3.org/2000/svg">
<rect x="0.138672" width="91.5618" height="91.5618" rx="15" fill="black"/>
<path fill-rule="evenodd" clip-rule="evenodd" d="M55.6721 39.4285C58.7387 41.6085 62.4112 42.7733 66.1737 42.7592V35.3024C65.434 35.3045 64.6963 35.2253 63.9739 35.0663V41.0068C60.203 41.0135 56.5252 39.8354 53.4599 37.6389V52.9749C53.4507 55.4914 52.7606 57.9585 51.4628 60.1146C50.165 62.2706 48.3079 64.0353 46.0885 65.2215C43.8691 66.4076 41.37 66.9711 38.8563 66.852C36.3426 66.733 33.9079 65.9359 31.8105 64.5453C33.7506 66.5082 36.2295 67.8513 38.9333 68.4044C41.6372 68.9576 44.4444 68.6959 46.9994 67.6526C49.5545 66.6093 51.7425 64.8312 53.2864 62.5436C54.8302 60.256 55.6605 57.5616 55.6721 54.8018V39.4285ZM58.3938 31.8226C56.8343 30.1323 55.8775 27.9739 55.6721 25.6832V24.7139H53.5842C53.8423 26.1699 54.4039 27.5553 55.2326 28.78C56.0612 30.0048 57.1383 31.0414 58.3938 31.8226ZM36.645 58.642C35.9213 57.6957 35.4779 56.5653 35.365 55.3793C35.2522 54.1934 35.4746 52.9996 36.0068 51.9338C36.5391 50.8681 37.3598 49.9731 38.3757 49.3508C39.3915 48.7285 40.5616 48.4039 41.7529 48.4139C42.4106 48.4137 43.0644 48.5143 43.6916 48.7121V41.0068C42.9584 40.9097 42.2189 40.8682 41.4794 40.8826V46.8728C39.9522 46.39 38.2992 46.4998 36.8492 47.1803C35.3992 47.8608 34.2585 49.0621 33.6539 50.5454C33.0494 52.0286 33.0252 53.6851 33.5864 55.1853C34.1475 56.6855 35.2527 57.9196 36.6823 58.642H36.645Z" fill="#EE1D52"/>
<path fill-rule="evenodd" clip-rule="evenodd" d="M53.4589 37.5892C56.5241 39.7857 60.2019 40.9638 63.9729 40.9571V35.0166C61.8243 34.5623 59.8726 33.4452 58.3927 31.8226C57.1372 31.0414 56.0601 30.0048 55.2315 28.78C54.4029 27.5553 53.8412 26.1699 53.5831 24.7139H48.09V54.8018C48.0849 56.1336 47.6629 57.4304 46.8831 58.51C46.1034 59.5897 45.0051 60.3981 43.7425 60.8217C42.4798 61.2453 41.1162 61.2629 39.8431 60.872C38.57 60.4811 37.4512 59.7012 36.6439 58.642C35.3645 57.9965 34.3399 56.9387 33.7354 55.6394C33.1309 54.3401 32.9818 52.875 33.3121 51.4805C33.6424 50.0861 34.4329 48.8435 35.556 47.9535C36.6791 47.0634 38.0693 46.5776 39.5023 46.5745C40.1599 46.5766 40.8134 46.6772 41.4411 46.8728V40.8826C38.7288 40.9477 36.0946 41.8033 33.8617 43.3444C31.6289 44.8855 29.8946 47.0451 28.8717 49.5579C27.8489 52.0708 27.5821 54.8276 28.1039 57.49C28.6258 60.1524 29.9137 62.6045 31.8095 64.5453C33.9073 65.9459 36.3458 66.7512 38.8651 66.8755C41.3845 66.9997 43.8904 66.4383 46.1158 65.2509C48.3413 64.0636 50.2031 62.2948 51.5027 60.133C52.8024 57.9712 53.4913 55.4973 53.4962 52.9749L53.4589 37.5892Z" fill="white"/>
<path fill-rule="evenodd" clip-rule="evenodd" d="M63.9736 35.0161V33.4129C62.0005 33.4213 60.0655 32.8696 58.3934 31.8221C59.8695 33.4493 61.8229 34.5674 63.9736 35.0161ZM53.5838 24.7134C53.5838 24.4275 53.4968 24.1292 53.4596 23.8434V22.874H45.8785V52.9744C45.872 54.6598 45.197 56.2738 44.0017 57.4621C42.8064 58.6504 41.1885 59.3159 39.503 59.3126C38.5106 59.3176 37.5311 59.0876 36.6446 58.6415C37.4519 59.7007 38.5707 60.4805 39.8438 60.8715C41.1169 61.2624 42.4805 61.2448 43.7432 60.8212C45.0058 60.3976 46.1041 59.5892 46.8838 58.5095C47.6636 57.4298 48.0856 56.1331 48.0907 54.8013V24.7134H53.5838ZM41.4418 40.8696V39.167C38.3222 38.7432 35.1511 39.3885 32.4453 40.9977C29.7394 42.6069 27.6584 45.0851 26.5413 48.0284C25.4242 50.9718 25.337 54.2067 26.2938 57.206C27.2506 60.2053 29.195 62.792 31.8102 64.5448C29.9287 62.5995 28.6545 60.1484 28.1433 57.4908C27.6321 54.8333 27.906 52.0844 28.9315 49.5799C29.957 47.0755 31.6897 44.924 33.918 43.3882C36.1463 41.8524 38.7736 40.9988 41.4791 40.9318L41.4418 40.8696Z" fill="#69C9D0"/>
</svg>;
  if (platformLower.includes('farcaster')) return <img src="/farcaster.webp" alt="Farcaster"  className={className} />;

  
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
  rewardedAtTime?: Date
  socialStatsLastUpdated?: Date
  twitterData?: {
    replyCount?: number
    likeCount?: number
    viewCount?: number
    createdAt?: Date
    statsLastUpdated?: Date
    author?: {
      userName?: string
      name?: string
      cloudinary_profilePicture?: string
      followers?: number
    }
  }
  tiktokData?: {
    replyCount?: number
    likeCount?: number
    viewCount?: number
    createdAt?: Date
    statsLastUpdated?: Date
    author?: {
      userName?: string
      name?: string
      cloudinary_profilePicture?: string
      followers?: number
    }
  }
  instagramData?: {
    replyCount?: number
    likeCount?: number
    viewCount?: number
    createdAt?: Date
    statsLastUpdated?: Date
    author?: {
      userName?: string
      name?: string
      cloudinary_profilePicture?: string
      followers?: number
    }
  }
  upvoters?: string[] 
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
              profilePic: submission.twitterData.author.cloudinary_profilePicture || "",
              followers: submission.twitterData.author.followers || 0,
              platform: "Twitter",
            }
          }

        if (submission.tiktokData?.author) {
          return {
            name: submission.tiktokData.author.name || "Unknown",
            username: submission.tiktokData.author.userName || "",
            profilePic: submission.tiktokData.author.cloudinary_profilePicture || "",
            followers: submission.tiktokData.author.followers || 0,
            platform: "TikTok",
          }
    }

        if (submission.instagramData?.author) {
          return {
            name: submission.instagramData.author.name || "Unknown",
            username: submission.instagramData.author.userName || "",
            profilePic: submission.instagramData.author.cloudinary_profilePicture || "",
            followers: submission.instagramData.author.followers || 0,
            platform: "Instagram",
          }
    }
    

    return null
        }

        // Helper function to get video metrics
      const getVideoMetrics = (submission: Submission) => {
        // console.log('Full submission object:', JSON.stringify(submission, null, 2));
        if (submission.twitterData) {
          return {
            views: submission.twitterData.viewCount || 0,
            likes: submission.twitterData.likeCount || 0,
            comments: submission.twitterData.replyCount || 0,
            platform: "Twitter",
            lastUpdated: submission.socialStatsLastUpdated || submission.twitterData.statsLastUpdated || new Date()
          }
        }else if (submission.tiktokData) {
          return {
            views: submission.tiktokData.viewCount || 0,
            likes: submission.tiktokData.likeCount || 0,
            comments: submission.tiktokData.replyCount || 0,
            platform: "TikTok",
            lastUpdated: submission.socialStatsLastUpdated || submission.tiktokData.statsLastUpdated || new Date()
          }
        }else if (submission.instagramData) {
          return {
            views: submission.instagramData.viewCount || 0,
            likes: submission.instagramData.likeCount || 0,
            comments: submission.instagramData.replyCount || 0,
            platform: "Instagram",
            lastUpdated: submission.socialStatsLastUpdated || submission.instagramData.statsLastUpdated || new Date()
          }
        }else{
          return null
        }
      }

    
      const hasUserUpvoted = (submission: Submission): boolean => {
        if (!userWalletAddress || !submission.upvoters) return false;
        return submission.upvoters.includes(userWalletAddress);
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
        {/* <Badge className="bg-brand-purple text-white">{quest.questType}</Badge> */}
                      {/* <Badge className="text-xs bg-brand-purple text-white hover:text-brand-purple flex items-center gap-1"> */}
                      <Badge className="bg-brand-purple text-white gap-1">

                        {quest.questType === "createThread" ? (
                          <>
                            <FaTwitter className="h-3 w-3" />
                            Create X(Twitter) thread
                          </>
                        ) : (
                          <>
                            <Video className="h-3 w-3" />
                            Create video
                          </>
                        )}
                      </Badge>
        <h1 className="text-3xl md:text-4xl font-bold text-white">{quest.title}</h1>
        <p className="text-white/80">by {quest.brandName}</p>
             <ShareButton />
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
                <p className="text-gray-700 text-sm md:text-lg whitespace-pre-wrap break-words">
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
                      <SocialPlatformIcon platform={platformKey} className="flex-shrink-0" />
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
                  <h2 className="text-xl font-bold mb-4 text-brand-dark">Rewards</h2>
                  {quest.approvalNeeded ? (
                  <p className="text-gray-700 mb-4">All participating content creators will be rewarded with {quest.pricePerVideo}<CurrencyDisplay/> each.
                   {/* Only  {quest.videosToBeAwarded} slots left now. */}
                   </p>

                  ):(
                  <div>
                      {/* <p className="text-gray-700 mb-4">The best {quest.videosToBeAwarded} content creators shall earn {quest.pricePerVideo}<CurrencyDisplay/> each.</p> */}




                  {/* Additional Prize */}
                  <div className="bg-gradient-to-r from-brand-pink/10 to-brand-purple/10 p-4 rounded-lg border mb-4 border-brand-pink/20">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-8 h-8 bg-brand-pink rounded-full flex items-center justify-center">
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                          />
                        </svg>
                      </div>
                      <div>
                        <h3 className="font-bold text-brand-dark text-sm sm:text-lg">For top {quest.videosToBeAwarded} creators</h3>
                      </div>
                    </div>
                      <p className="text-gray-700 text-sm sm:text-lg">
                        💰 <span className="font-bold">{quest.pricePerVideo}<CurrencyDisplay/> </span> each after the brand does their selection
                      </p>
                  </div>


        
                  <div className="bg-gradient-to-r from-brand-purple/10 to-brand-pink/10 p-4 rounded-lg border border-brand-purple/20">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-8 h-8 bg-brand-purple rounded-full flex items-center justify-center">
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M13 10V3L4 14h7v7l9-11h-7z"
                          />
                        </svg>
                      </div>
                      <div>
                        <h3 className="font-bold text-sm sm:text-lg text-brand-dark">For all participants</h3>
                        {/* <p className="text-sm text-gray-600">For all participants</p> */}
                      </div>
                    </div>
                    <p className="text-gray-700 font-medium text-sm sm:text-lg">
                      🎉 <span className="text-brand-purple font-bold">100 points</span> automatically earned upon submitting
                      quest!
                    </p>
                  </div>


</div>






                      
                  )}
                </div>


      <div className="mt-6 grid grid-cols-2 md:grid-cols-3 gap-4">
                  {/* <div className="bg-brand-light p-4 rounded-lg text-center">
                    <p className="text-gray-600 text-sm">Reward</p>
                    <p className="text-xl font-bold text-brand-purple">{quest.pricePerVideo} <CurrencyDisplay/></p>
                  </div> */}


                  
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
              {allSubmissions && allSubmissions.length > 0 ? (
                allSubmissions.reverse().map((submission: Submission, index: number) => {
                  const creatorData = getCreatorData(submission)
                  const videoMetrics = getVideoMetrics(submission)
                  const submissionNumber = allSubmissions.length - index;
                  const hasUpvoted = hasUserUpvoted(submission);
                  const upvoteCount = submission.upvoters?.length || 0;


                  return (
                    <div key={submission._id} className="relative  bg-white rounded-md p-3 border border-gray-100 shadow-sm">

            <div className="absolute top-0 left-0 w-6 h-6 bg-gray-500 text-white rounded-full flex items-center justify-center text-xs font-bold">
              {submissionNumber}
            </div>

                    
                      {quest._id.toString() == 'false' && (

                        <UpvoteButton
                          questId={quest._id}
                          submissionId={submission._id || ''}
                          hasUpvoted={hasUpvoted}
                          upvoteCount={upvoteCount}
                        />

                      )}
       


                        {/* Reward Banner */}
                      {submission.rewardAmountUsd && (
                        <div
                          className={`absolute bottom-2 right-2 text-white text-xs font-semibold px-2 py-1 rounded-full shadow-md ${submission.rewarded ? 'bg-pink-500' : 'bg-brand-purple'
                            }`}
                        >
    
                          {submission.rewardAmountUsd} USD

                        </div>
                      )}
                      {/* Header: Profile + Buttons */}
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-start gap-3">
                          {creatorData?.profilePic ? (
                            <img
                              src={creatorData.profilePic || "/human-avatar.jpg"}
                              // src={"/human-avatar.jpg"}
                              alt={creatorData.name}
                              referrerPolicy="no-referrer"
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
                            </div>
                            {creatorData?.username && (
                              <p className="text-gray-600 text-xs">@{creatorData.username}</p>
                            )}
                            {creatorData?.followers !== undefined && (
                              
                              <p className="text-xs text-gray-500 mt-1">
                      <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500 mb-2">
                                                                               {/* <span>{creatorData?.platform}</span> */}

                      {/* <SocialPlatformIcon platform={submission.socialPlatformName} className="w-4 h-4" /> */}
                      <span className="font-medium text-brand-purple">{formatNumber(creatorData.followers)}</span>{" "}followers
                      </div>
                              </p>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Platform + Watch + Copy */}
                      <div className="flex flex-wrap items-center gap-2 text-sm text-gray-600 mb-2">    
                        <a
                          href={submission.videoLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-brand-purple hover:text-brand-pink gap-2 flex items-center text-sm"
                        >
                                                    
                        View post
                      <SocialPlatformIcon platform={submission.socialPlatformName} className="ms-2 w-4 h-4" />

                        </a>
                        <CopyButton text={submission.videoLink || ''} />



                      </div>
  


                      {/* Video Metrics */}
                      {/* {videoMetrics && (
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
                      )} */}

                      {/* {!videoMetrics && !creatorData && (
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
                      )} */}
                    </div>
                  )
                })
              ): (
                                  <div className="text-center py-8 text-gray-500">
                    <p>No submissions yet. Be the first to complete this quest!</p>
                  </div>
              )}

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
      
      <QuestQRCode questId={awaitedParams.id} className="mt-12 mb-4" />
      
      </div>
    </div>
  )
}
