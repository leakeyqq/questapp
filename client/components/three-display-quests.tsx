"use client"
import { useEffect, useState } from "react"
import QuestCardV2 from "@/components/quest-card-v2"

export default function ThreeQuests(){
    const [quests, setQuests] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchQuests = async () => {
          try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/quest/allQuests/`, {
              credentials: "include"
            })
            // const res = await fetch("http://localhost:5000/api/quest/allQuests")
    
            const data = await res.json()
            setQuests(data.allQuests)
          } catch (error) {
            console.error("Failed to fetch quests:", error)
          } finally {
            setLoading(false)
          }
        }
    
        fetchQuests()
      }, [])
      
      return (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {loading ? (
                    <p>Loading quests...</p>
                  ) : quests.length > 0 ? (
                    quests.slice(0, 3).map((quest: any) => <QuestCardV2 key={quest._id} quest={quest} />)
                  ) : (
                    <p>No quests found.</p>
                  )}
                </div>
      )

}