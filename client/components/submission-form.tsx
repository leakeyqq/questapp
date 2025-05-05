"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/hooks/use-toast"
import { useWeb3 } from "@/contexts/useWeb3"


interface SubmissionFormProps {
  questId: string
}

export default function SubmissionForm({ questId }: SubmissionFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [platform, setPlatform] = useState("")
  const [contentUrl, setContentUrl] = useState("")
  // const [comment, setComment] = useState("")

  const {getUserAddress } = useWeb3();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!platform) {
      alert("You did not select the social media platform where you posted the video!")
      return;
    }

    if (!platform || !contentUrl) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    // Simulate API call
    // await new Promise((resolve) => setTimeout(resolve, 1500))

    // toast({
    //   title: "Submission received!",
    //   description: "Your quest submission is being reviewed.",
    // })

    try{
      const userAddress = await getUserAddress();
      if (!userAddress) {
        alert("Please sign in first! Then we can proceed..😀");
        return;
      }

      const confirmSubmission = confirm('Please be aware that you can only submit once for a single quest. Do you wish to proceed?🙂 ')
      if(!confirmSubmission) return 

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/quest/submitQuest/${questId}`,{
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // send cookies for auth
        body: JSON.stringify({
          platform,
          contentUrl
        }),
      })
  
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error.msg || "Something went wrong");
      }
      alert("Quest was submitted successfully! Best of luck in getting rewarded😎");

      setPlatform("")
      setContentUrl("")
    }catch(e: any){
      alert(e)
    }finally{
      setIsSubmitting(false)
    }

  }

  return (
    <div>
      <h3 className="font-bold mb-4 text-brand-dark">Submit your short video link</h3>
      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          <div>
            <label htmlFor="platform" className="block text-sm text-gray-600 mb-1">
              Platform
            </label>
            <Select value={platform} onValueChange={setPlatform}>
              <SelectTrigger className="bg-white border-gray-300 text-gray-800">
                <SelectValue placeholder="Select platform" />
              </SelectTrigger>
              <SelectContent className="bg-white border-gray-200 text-gray-800">
                <SelectItem value="tiktok">TikTok</SelectItem>
                <SelectItem value="instagram">Instagram</SelectItem>
                <SelectItem value="youtube">YouTube</SelectItem>
                <SelectItem value="twitter">Twitter/X</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label htmlFor="contentUrl" className="block text-sm text-gray-600 mb-1">
              Content URL
            </label>
            <Input
              id="contentUrl"
              placeholder="https://"
              value={contentUrl}
              onChange={(e) => setContentUrl(e.target.value)}
              className="bg-white border-gray-300 text-gray-800" required
            />
          </div>

          {/* <div>
            <label htmlFor="comment" className="block text-sm text-gray-600 mb-1">
              Comment (optional)
            </label>
            <Textarea
              id="comment"
              placeholder="Add any details about your submission..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="bg-white border-gray-300 text-gray-800 resize-none h-20"
            />
          </div> */}

          <Button
            type="submit"
            className="w-full bg-brand-purple hover:bg-brand-purple/90 text-white"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Submitting..." : "Submit Quest"}
          </Button>
        </div>
      </form>

      <div className="mt-4 text-xs text-gray-500 text-center">
        By submitting, you confirm that your content meets all quest requirements and you agree to our Terms of Service.
      </div>
    </div>
  )
}
