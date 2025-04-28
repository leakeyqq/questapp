// "use client"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import SubmissionForm from "@/components/submission-form"
import { quests } from "@/lib/data"
import type { Quest } from "@/lib/types"
import { notFound, useParams, useRouter  } from "next/navigation"
import { useEffect, useState } from "react"
import { getSingleQuest } from "@/lib/quest";
import LinkifyText from '@/components/LinkifyText';


import { generateMetadata } from "./../[id]/generateMetadata";
export { generateMetadata };


interface PageProps {
  params: { id: string };
}

// interface QuestPageProps {
//   params: {
//     id: string
//   }
// }

export default async function QuestPage({ 
  params 
}: { 
  params: { id: string } 
}) {
  const awaitedParams = await params; // Properly await params first

  const quest = await getSingleQuest(awaitedParams.id);

  if (!quest) notFound();

  // const { id } = useParams() as { id: string } // 👈 Get dynamic route param
  // const [quest, setQuest] = useState<Quest | null>(null)
  // const [loading, setLoading] = useState(true)

  // useEffect(()=>{
  //   const fetchQuest = async () => {
  //     try{
  //       const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/quest/getSingleQuest/${id}`,  {
  //         credentials: "include"
  //       })
  //       if (res.status == 404) throw new Error("Quest not found")
  //       if (res.status != 200) throw new Error("An error occured!")
  
          
  //       const data = await res.json()
  //       setQuest(data.quest)
  //     }catch (error) {
  //       console.error("Error fetching quest:", error)
  //       // router.push("/404") // or use notFound() if in server context
  //     } finally {
  //       setLoading(false)
  //     }

  //   }
  //   fetchQuest()
  // }, [id])

  // const quest = quests.find((q) => q.id === id)
  // if (loading) {
  //   return <div>Loading quest...</div>
  // }
  
  if (!quest) {
    notFound()
  }


  // const percentComplete = Math.min(100, Math.round((quest.submissions / quest.maxParticipants) * 100))

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

  // console.log('on page file, quest is ', quest)

  return (
    <div className="min-h-screen bg-brand-light">
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
                <h2 className="text-xl font-bold mb-4 text-brand-dark">Quest Details</h2>
                {/* <p className="text-gray-700 text-sm md:text-lg">{quest.description}</p> */}
                <p className="text-gray-700 text-sm md:text-lg">
                  <LinkifyText text={quest.description} />
                </p>

                <div className="mt-4">
                  <h2 className="text-xl font-bold mb-4 text-brand-dark">Reward criteria</h2>
                  <p className="text-gray-700 mb-4">{quest.rewardCriteria}</p>
                </div>

                <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-brand-light p-4 rounded-lg text-center">
                    <p className="text-gray-600 text-sm">Prize Pool</p>
                    <p className="text-xl font-bold text-brand-purple">{quest.prizePoolUsd} USD</p>
                  </div>
                  <div className="bg-brand-light p-4 rounded-lg text-center">
                    <p className="text-gray-600 text-sm">Deadline</p>
                    <p className="text-xl font-bold text-brand-dark">{daysLeft} days</p>
                  </div>
                  <div className="bg-brand-light p-4 rounded-lg text-center">
                    <p className="text-gray-600 text-sm">Current participants</p>
                    <p className="text-xl font-bold text-brand-dark">{quest.submissions.length}</p>
                  </div>
                  <div className="bg-brand-light p-4 rounded-lg text-center">
                    <p className="text-gray-600 text-sm">Min follower count</p>
                    <p className="text-xl font-bold text-brand-dark">{quest.minFollowerCount.toLocaleString()}</p>
                  </div>
                </div>
              </TabsContent>

              <TabsContent
                value="submissions"
                className="bg-white rounded-xl p-6 border border-gray-200 mt-2 shadow-md"
              >
                <h2 className="text-xl font-bold mb-4 text-brand-dark">Recent Submissions</h2>
                {/* {quest.recentSubmissions && quest.recentSubmissions.length > 0 ? (
                  <div className="space-y-4">
                    {quest.recentSubmissions.map((submission, index) => (
                      <div key={index} className="flex items-start gap-4 p-4 bg-brand-light rounded-lg">
                        <div className="h-10 w-10 rounded-full bg-brand-purple/20 flex items-center justify-center text-brand-purple">
                          {submission.username.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between">
                            <p className="font-semibold text-brand-dark">{submission.username}</p>
                            <p className="text-gray-500 text-sm">{submission.date}</p>
                          </div>
                          <p className="text-gray-700 mt-1">{submission.comment}</p>
                          <a
                            href={submission.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-2 inline-flex items-center text-brand-purple hover:text-brand-pink text-sm"
                          >
                            View Submission
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
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <p>No submissions yet. Be the first to complete this quest!</p>
                  </div>
                )} */}
              </TabsContent>
            </Tabs>
          </div>

          <div>
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden sticky top-4 shadow-md">
              <div className="p-6">
                <h2 className="text-xl font-bold mb-4 text-brand-dark">Quest Status</h2>

                <div className="space-y-4 mb-6">
                  <div className="bg-brand-light p-4 rounded-lg">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Prize Pool:</span>
                      <span className="text-xl font-bold text-brand-purple">{quest.prizePoolUsd} USD</span>
                    </div>
                    <div className="text-sm text-gray-500 mt-1">Distributed among all selected submissions</div>
                  </div>

                  <div className="bg-brand-light p-4 rounded-lg">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Time Left:</span>
                      <span className="font-bold text-brand-dark">{daysLeft} days</span>
                    </div>
                    <div className="text-sm text-gray-500 mt-1">
                      Deadline: {new Date(quest.endsOn).toLocaleDateString()}
                    </div>
                  </div>
                </div>

                <SubmissionForm questId={quest._id} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
