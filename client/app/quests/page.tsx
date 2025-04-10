import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import QuestCard from "@/components/quest-card"
import { quests } from "@/lib/data"

export default function QuestsPage() {
  return (
    <div className="min-h-screen bg-brand-light">
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold mb-8 text-brand-dark">Discover quests</h1>

        <div className="bg-white rounded-xl p-6 mb-8 shadow-md border border-gray-100">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Input placeholder="Search quests..." className="bg-white border-gray-300 text-gray-800" />
            </div>
            <div>
              <Select>
                <SelectTrigger className="bg-white border-gray-300 text-gray-800">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent className="bg-white border-gray-200 text-gray-800">
                  <SelectItem value="newest">Newest</SelectItem>
                  <SelectItem value="prize">Highest reward</SelectItem>
                  <SelectItem value="deadline">Ending soon</SelectItem>
                  <SelectItem value="popular">Trending</SelectItem>
                  <SelectItem value="noncompetitive">Low competition</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/*<div className="flex flex-wrap gap-2 mt-4">
            <Button
              variant="outline"
              size="sm"
              className="border-brand-purple text-brand-purple hover:bg-brand-purple/10 hover:text-brand-purple"
            >
              Trending
            </Button>
            <Button variant="outline" size="sm" className="border-brand-pink text-brand-pink hover:bg-brand-pink/10 hover:text-brand-pink">
              Ending Soon
            </Button>
            <Button variant="outline" size="sm" className="border-brand-teal text-brand-teal hover:bg-brand-teal/10 hover:text-brand-teal">
              High Reward
            </Button>
            <Button variant="outline" size="sm" className="border-brand-blue text-brand-blue hover:bg-brand-blue/10 hover:text-brand-blue">
              Low Competition
            </Button>
          </div> */}

        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {quests.map((quest) => (
            <QuestCard key={quest.id} quest={quest} />
          ))}
        </div>
      </div>
    </div>
  )
}
