import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { quests } from "@/lib/data"
import { notFound } from "next/navigation"

interface SubmissionsPageProps {
  params: {
    id: string
  }
}

export default function SubmissionsPage({ params }: SubmissionsPageProps) {
  const quest = quests.find((q) => q.id === params.id)

  if (!quest) {
    notFound()
  }

  // Mock submissions data
  const pendingSubmissions = [
    {
      id: "sub-1",
      username: "creator1",
      date: "2 days ago",
      comment: "I created this video showcasing your products at the beach. The lighting was perfect!",
      link: "https://example.com/video1",
      platform: "Instagram",
    },
    {
      id: "sub-2",
      username: "fashionista22",
      date: "3 days ago",
      comment: "Here's my submission featuring your collection. I focused on the summer dresses as requested.",
      link: "https://example.com/video2",
      platform: "TikTok",
    },
    {
      id: "sub-3",
      username: "contentcreator",
      date: "4 days ago",
      comment: "I created a beach-themed showcase of your products. My followers loved it!",
      link: "https://example.com/video3",
      platform: "YouTube",
    },
  ]

  const approvedSubmissions = [
    {
      id: "sub-4",
      username: "style_creator",
      date: "1 week ago",
      comment: "Love the new collection, especially the summer dresses!",
      link: "https://example.com/video4",
      platform: "Instagram",
      reward: "15 USDC",
      views: "4.2K",
    },
    {
      id: "sub-5",
      username: "fashion_influencer",
      date: "1 week ago",
      comment: "Here's my take on styling your summer collection for different occasions.",
      link: "https://example.com/video5",
      platform: "TikTok",
      reward: "15 USDC",
      views: "8.7K",
    },
  ]

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
              <Link href={`/brand/quests/${quest.id}/edit`}>Edit Quest</Link>
            </Button>
            <Button asChild className="bg-brand-purple hover:bg-brand-purple/90 text-white">
              <Link href={`/brand/quests/${quest.id}/analytics`}>View Analytics</Link>
            </Button>
          </div>
        </div>

        <Card className="bg-white border-gray-200 shadow-sm mb-8">
          <CardHeader className="pb-2">
            <CardTitle className="text-brand-dark">Quest Overview</CardTitle>
            <CardDescription className="text-gray-600">{quest.description}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-brand-light p-3 rounded-lg text-center">
                <p className="text-gray-600 text-sm">Prize Pool</p>
                <p className="text-xl font-bold text-brand-purple">{quest.prizePool}</p>
              </div>
              <div className="bg-brand-light p-3 rounded-lg text-center">
                <p className="text-gray-600 text-sm">Deadline</p>
                <p className="text-xl font-bold text-brand-dark">{new Date(quest.deadline).toLocaleDateString()}</p>
              </div>
              <div className="bg-brand-light p-3 rounded-lg text-center">
                <p className="text-gray-600 text-sm">Total Submissions</p>
                <p className="text-xl font-bold text-brand-dark">{quest.submissions}</p>
              </div>
              <div className="bg-brand-light p-3 rounded-lg text-center">
                <p className="text-gray-600 text-sm">Pending Review</p>
                <p className="text-xl font-bold text-brand-yellow">{pendingSubmissions.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="pending" className="mb-8">
          <TabsList className="bg-white border border-gray-200">
            <TabsTrigger value="pending">Pending Review ({pendingSubmissions.length})</TabsTrigger>
            <TabsTrigger value="approved">Approved ({approvedSubmissions.length})</TabsTrigger>
            <TabsTrigger value="rejected">Rejected (2)</TabsTrigger>
          </TabsList>

          <TabsContent value="pending" className="mt-4">
            <div className="space-y-4">
              {pendingSubmissions.map((submission) => (
                <div key={submission.id} className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <Badge className="bg-brand-yellow text-brand-dark mb-2">Pending Review</Badge>
                      <h3 className="text-lg font-bold text-brand-dark">{submission.username}</h3>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <span>Submitted {submission.date}</span>
                        <span>•</span>
                        <span>via {submission.platform}</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-brand-light p-3 rounded-lg mb-3">
                    <p className="text-gray-700">{submission.comment}</p>
                    <a
                      href={submission.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-brand-purple hover:text-brand-pink text-sm inline-flex items-center mt-1"
                    >
                      {submission.link}
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
                    <Button variant="outline" size="sm" className="border-red-400 text-red-500 hover:bg-red-50">
                      Reject
                    </Button>
                    <Button size="sm" className="bg-brand-teal hover:bg-brand-teal/90 text-white">
                      Approve & Award
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="approved" className="mt-4">
            <div className="space-y-4">
              {approvedSubmissions.map((submission) => (
                <div key={submission.id} className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <Badge className="bg-brand-teal text-white mb-2">Approved</Badge>
                      <h3 className="text-lg font-bold text-brand-dark">{submission.username}</h3>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <span>Submitted {submission.date}</span>
                        <span>•</span>
                        <span>via {submission.platform}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-brand-purple font-bold">{submission.reward} awarded</div>
                      <div className="text-sm text-gray-600">{submission.views} views</div>
                    </div>
                  </div>

                  <div className="bg-brand-light p-3 rounded-lg mb-3">
                    <p className="text-gray-700">{submission.comment}</p>
                    <a
                      href={submission.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-brand-purple hover:text-brand-pink text-sm inline-flex items-center mt-1"
                    >
                      {submission.link}
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

          <TabsContent value="rejected" className="mt-4">
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
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
