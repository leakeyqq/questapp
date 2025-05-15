"use client"
import { useEffect, useState } from "react"
import QuestCardV2 from "@/components/quest-card-v2"
import { sdk } from '@farcaster/frame-sdk'// Update the path


export default function ThreeQuests(){
    const [quests, setQuests] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchQuests = async () => {
          try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/quest/get3QuestsOnly`, {
              credentials: "include"
            })
            // const res = await fetch("http://localhost:5000/api/quest/allQuests")
    
            const data = await res.json()
            setQuests(data._3quests)
          } catch (error) {
            console.error("Failed to fetch quests:", error)
          } finally {
            setLoading(false)
          }
        }
    
        fetchQuests()
      }, [])

    useEffect(() => {
      if (quests.length === 0) return; // skip if no quests yet
      const init = async () => {
        try {
          await sdk.actions.ready();
          console.log("SDK ready")
        } catch (err) {
          console.error("Failed to initialize SDK:", err)
        }
      }
      init()
    }, [quests])
      
    
      
      
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