'use client'
import Link from "next/link"
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { notFound } from "next/navigation"
import { CopyButton } from "@/components/copyButton"


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

export const SocialPlatformIcon = ({ platform, className }: PlatformIconProps) => {
  if (!platform) return <FaGlobe className={className} />;
  
  const platformLower = platform.toLowerCase();
  
  if (platformLower.includes('youtube')) return <FaYoutube className={className} />;
  if (platformLower.includes('twitter') || platformLower.includes('x.com')) return <FaTwitter className={className} />;
  if (platformLower.includes('instagram')) return <FaInstagram className={className} />;
  if (platformLower.includes('tiktok')) return <FaTiktok className={className} />;
  
  return <FaGlobe className={className} />;
};

export const shortenAddress = (address: string, chars = 4): string => {
  if (!address) return 'Anonymous';
  return `${address.substring(0, chars)}...${address.substring(address.length - chars)}`;
};
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

interface SubmissionsPageProps {
  params: {
    id: string
  }
}

interface Submission {
  _id?: string;
  submittedByAddress: string;
  socialPlatformName?: string;
  videoLink?: string;
  submittedAtTime?: string;
  comments?: string;
  rewarded?: boolean;
  rewardAmountUsd?: String;
  submissionRead?: boolean;
  rewardedAtTime?: Date;
  // Add any other properties that exist in your submission objects
}

export default function SubmissionsPage({ 
  params 
}: { 
  params: { id: string } 
}){
  const [loading, setLoading] = useState(false)
  const [quest, setQuest] = useState<any>(null)
  const [pendingSubmissions, setPendingSubmissions] = useState<Submission[]>([])
  const [approvedSubmissions, setApprovedSubmissions] = useState<Submission[]>([])


  // const quest = quests.find((q) => q.id === params.id)

  useEffect(() => {
    const fetchSubmissions = async ()=>{
      try{
        setLoading(true)
        const awaitedParams = await params; // Properly await params first

        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/brand/mySingleCreatedQuest/${awaitedParams.id}`, {
          credentials: "include",
        });
        
        const data = await res.json();

        const fetchedQuest = data.quest;

        if (!fetchedQuest) {
          notFound()
        }
        setQuest(fetchedQuest)
        setPendingSubmissions(fetchedQuest.submissions.filter((s: Submission) => !s.rewarded))
        setApprovedSubmissions(fetchedQuest.submissions.filter((s: Submission) => s.rewarded))      
      }catch(e){
        console.log(e)
      }finally{
        setLoading(false)
      }
    }
    fetchSubmissions()
  }, [params])
  


  if (loading) {
    return <div>Fetching quest submissions...</div>
  }

  if (!quest) {
    return <div>Quest not found</div>
  }

  return (
    <div className="min-h-screen bg-brand-light">
      <div className="container mx-auto px-4 py-12">
        <div className="mb-8">
          <Link href="/brand/dashboard" className="text-brand-purple hover:text-brand-pink flex items-center">
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
            Back to Dashboard
          </Link>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-brand-dark">Submissions for {quest.title}</h1>
            <p className="text-gray-600">Review and manage creator submissions</p>
          </div>
          <div className="flex gap-2">
            <Button
              asChild
              variant="outline"
              className="border-brand-purple text-brand-purple hover:bg-brand-purple/10"
            >
              <Link href={`/brand/quests/${quest._id}/edit`}>Edit Quest</Link>
            </Button>
            <Button asChild className="bg-brand-purple hover:bg-brand-purple/90 text-white">
              <Link href={`/brand/quests/${quest._id}/analytics`}>View Analytics</Link>
            </Button>
          </div>
        </div>

        <Card className="bg-white border-gray-200 shadow-sm mb-8">
          <CardHeader className="pb-2">
            <CardTitle className="text-brand-dark">Quest Overview</CardTitle>
            <CardDescription className="text-gray-600">{quest.description}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              <div className="bg-brand-light p-3 rounded-lg text-center">
                <p className="text-gray-600 text-sm">Prize Pool</p>
                <p className="text-xl font-bold text-brand-purple">{quest.prizePoolUsd}</p>
              </div>
              <div className="bg-brand-light p-3 rounded-lg text-center">
                <p className="text-gray-600 text-sm">Deadline</p>
                <p className="text-xl font-bold text-brand-dark">{new Date(quest.endsOn).toLocaleDateString()}</p>
              </div>
              <div className="bg-brand-light p-3 rounded-lg text-center">
                <p className="text-gray-600 text-sm">Total Submissions</p>
                <p className="text-xl font-bold text-brand-dark">{quest.submissions.length}</p>
              </div>
              {/* <div className="bg-brand-light p-3 rounded-lg text-center">
                <p className="text-gray-600 text-sm">Not rewarded</p>
                <p className="text-xl font-bold text-brand-yellow">{pendingSubmissions.length}</p>
              </div> */}
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="pending" className="mb-8">
          <TabsList className="bg-white border border-gray-200">
            <TabsTrigger value="pending">Not rewarded ({pendingSubmissions.length})</TabsTrigger>
            <TabsTrigger value="approved">Rewarded ({approvedSubmissions.length})</TabsTrigger>
            {/* <TabsTrigger value="rejected">Rejected (2)</TabsTrigger> */}
          </TabsList>

          <TabsContent value="pending" className="mt-4">
            <div className="space-y-4">
              {pendingSubmissions.map((submission: Submission) => (
                <div key={submission._id} className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <Badge className="bg-brand-yellow text-brand-dark mb-2">Not rewarded</Badge>
                      <h3 className="text-lg font-bold text-brand-dark">{shortenAddress(submission.submittedByAddress)}</h3>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <span>Submitted {formatDateString(submission.submittedAtTime)}</span>
                        <span>•</span>
                        <span>via {submission.socialPlatformName} </span>
                        <SocialPlatformIcon platform={submission.socialPlatformName} className="w-4 h-4"/>
                        <span className="">
                        <CopyButton text={submission.videoLink || ''} />
                      </span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-brand-light p-3 rounded-lg mb-3">
                    {/* <p className="text-gray-700">{submission.comment}</p> */}
                    <a
                      href={submission.videoLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-brand-purple hover:text-brand-pink text-sm inline-flex items-center mt-1"
                    >
                      Watch video
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

                  </div>

                  <div className="flex gap-2 justify-end">
                    {/* <Button variant="outline" size="sm" className="border-red-400 text-red-500 hover:bg-red-50">
                      Reject
                    </Button> */}
                    <Button size="sm" className="bg-brand-teal hover:bg-brand-teal/90 text-white">
                      Reward
                    </Button>

 
                  
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="approved" className="mt-4">
            <div className="space-y-4">
              {approvedSubmissions.map((submission: Submission) => (
                <div key={submission._id} className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <Badge className="bg-brand-teal text-white mb-2">Approved</Badge>
                      <h3 className="text-lg font-bold text-brand-dark">{submission.submittedByAddress}</h3>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <span>Submitted {submission.submittedAtTime}</span>
                        <span>•</span>
                        <span>via {submission.socialPlatformName}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-brand-purple font-bold">{submission.rewardAmountUsd} USD awarded</div>
                      {/* <div className="text-sm text-gray-600">{submission.views} views</div> */}
                    </div>
                  </div>

                  <div className="bg-brand-light p-3 rounded-lg mb-3">
                    {/* <p className="text-gray-700">{submission.comment}</p> */}
                    <a
                      href={submission.videoLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-brand-purple hover:text-brand-pink text-sm inline-flex items-center mt-1"
                    >
                      {submission.videoLink}
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
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          {/* <TabsContent value="rejected" className="mt-4">
            <div className="space-y-4">
              {[1, 2].map((item) => (
                <div key={item} className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <Badge className="bg-red-500 text-white mb-2">Rejected</Badge>
                      <h3 className="text-lg font-bold text-brand-dark">rejected_user{item}</h3>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <span>Submitted 1 week ago</span>
                        <span>•</span>
                        <span>via Instagram</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-brand-light p-3 rounded-lg mb-3">
                    <p className="text-gray-700">This is my submission for your quest. Hope you like it!</p>
                    <a
                      href="#"
                      className="text-brand-purple hover:text-brand-pink text-sm inline-flex items-center mt-1"
                    >
                      https://example.com/rejected{item}
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
                  </div>

                  <div className="bg-red-50 p-3 rounded-lg border border-red-100">
                    <p className="text-sm font-medium text-red-600 mb-1">Rejection Reason:</p>
                    <p className="text-gray-700 text-sm">
                      {item === 1
                        ? "Content doesn't meet our brand guidelines. Please ensure you're following the quest requirements."
                        : "The submission doesn't feature our products as required in the quest description."}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent> */}
        </Tabs>
      </div>
    </div>
  )
}
