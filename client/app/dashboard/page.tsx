import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import CurrencyDisplay from '@/components/CurrencyDisplay';


export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-brand-light">
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-brand-dark">Creator Dashboard</h1>
            <p className="text-gray-600">Track your quests and earnings</p>
          </div>
          <Button asChild className="bg-brand-purple hover:bg-brand-purple/90 text-white">
            <Link href="/quests">Find New Quests</Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card className="bg-white border-gray-200 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-brand-dark">Total Earnings</CardTitle>
              <CardDescription className="text-gray-600">All time</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-brand-teal">0 <CurrencyDisplay/></div>
              <p className="text-gray-600 text-sm mt-1">0 <CurrencyDisplay/> this month</p>
            </CardContent>
          </Card>

          <Card className="bg-white border-gray-200 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-brand-dark">Completed Quests</CardTitle>
              <CardDescription className="text-gray-600">All time</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-brand-dark">3</div>
              <p className="text-gray-600 text-sm mt-1">3 pending review</p>
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

        <Tabs defaultValue="active" className="mb-8">
          <TabsList className="bg-white border border-gray-200">
            <TabsTrigger value="active">Active Quests</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
            <TabsTrigger value="pending">Pending Review</TabsTrigger>
          </TabsList>

          {/* <TabsContent value="active" className="mt-4">
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
              <div className="p-4">
                <h2 className="text-xl font-bold mb-4 text-brand-dark">Active Quests (3)</h2>

                <div className="space-y-4">
                  {[1, 2, 3].map((item) => (
                    <div key={item} className="bg-brand-light rounded-lg p-4 flex flex-col md:flex-row gap-4">
                      <div className="h-24 md:w-40 rounded-lg bg-gray-200 flex items-center justify-center">
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
                          className="text-gray-400"
                        >
                          <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
                          <circle cx="9" cy="9" r="2" />
                          <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
                        </svg>
                      </div>

                      <div className="flex-1">
                        <div className="flex flex-wrap gap-2 mb-2">
                          <Badge className="bg-brand-purple text-white">Video</Badge>
                          <Badge variant="outline" className="border-brand-purple/30 text-brand-dark">
                            3 days left
                          </Badge>
                        </div>

                        <h3 className="text-lg font-bold mb-1 text-brand-dark">Summer Product Showcase</h3>
                        <p className="text-gray-600 text-sm mb-2">
                          Create a 60-second video showcasing our new summer collection
                        </p>

                        <div className="flex items-center justify-between">
                          <div className="text-brand-purple font-bold">$150 USDC</div>
                          <Button asChild size="sm" className="bg-brand-purple hover:bg-brand-purple/90 text-white">
                            <Link href={`/quests/quest-${item}`}>Continue</Link>
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="completed" className="mt-4">
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
              <div className="p-4">
                <h2 className="text-xl font-bold mb-4 text-brand-dark">Completed Quests (24)</h2>

                <div className="space-y-4">
                  {[1, 2, 3].map((item) => (
                    <div key={item} className="bg-brand-light rounded-lg p-4 flex flex-col md:flex-row gap-4">
                      <div className="h-24 md:w-40 rounded-lg bg-gray-200 flex items-center justify-center">
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
                          className="text-gray-400"
                        >
                          <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
                          <circle cx="9" cy="9" r="2" />
                          <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
                        </svg>
                      </div>

                      <div className="flex-1">
                        <div className="flex flex-wrap gap-2 mb-2">
                          <Badge className="bg-brand-teal text-white">Completed</Badge>
                          <Badge variant="outline" className="border-gray-300 text-gray-700">
                            Apr 12, 2023
                          </Badge>
                        </div>

                        <h3 className="text-lg font-bold mb-1 text-brand-dark">Product Review Challenge</h3>
                        <p className="text-gray-600 text-sm mb-2">Created an honest review of our flagship product</p>

                        <div className="flex items-center justify-between">
                          <div className="text-brand-teal font-bold">$75 USDC earned</div>
                          <Button
                            variant="outline"
                            size="sm"
                            className="border-brand-purple text-brand-purple hover:bg-brand-purple/10"
                          >
                            View Details
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="pending" className="mt-4">
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
              <div className="p-4">
                <h2 className="text-xl font-bold mb-4 text-brand-dark">Pending Review (5)</h2>

                <div className="space-y-4">
                  {[1, 2, 3].map((item) => (
                    <div key={item} className="bg-brand-light rounded-lg p-4 flex flex-col md:flex-row gap-4">
                      <div className="h-24 md:w-40 rounded-lg bg-gray-200 flex items-center justify-center">
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
                          className="text-gray-400"
                        >
                          <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
                          <circle cx="9" cy="9" r="2" />
                          <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
                        </svg>
                      </div>

                      <div className="flex-1">
                        <div className="flex flex-wrap gap-2 mb-2">
                          <Badge className="bg-brand-yellow text-brand-dark">Pending</Badge>
                          <Badge variant="outline" className="border-gray-300 text-gray-700">
                            Submitted Apr 28, 2023
                          </Badge>
                        </div>

                        <h3 className="text-lg font-bold mb-1 text-brand-dark">Tech Unboxing Experience</h3>
                        <p className="text-gray-600 text-sm mb-2">
                          Created an unboxing video of the latest tech gadget
                        </p>

                        <div className="flex items-center justify-between">
                          <div className="text-gray-600">Review in progress...</div>
                          <Button
                            variant="outline"
                            size="sm"
                            className="border-brand-purple text-brand-purple hover:bg-brand-purple/10"
                          >
                            View Submission
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent> */}
        </Tabs> 

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
  )
}
