"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/hooks/use-toast"
import { useWeb3 } from "@/contexts/useWeb3"
import { sdk } from '@farcaster/frame-sdk';
import {useAlert} from "@/components/custom-popup"
import {useConfirm} from '@/components/custom-confirm'


interface SubmissionFormProps {
  questId: string
}

export default function SubmissionForm({ questId }: SubmissionFormProps) {
  const { showAlert, AlertComponent } = useAlert()
  const { showConfirm, ConfirmComponent } = useConfirm()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [platform, setPlatform] = useState("")
  const [contentUrl, setContentUrl] = useState("")
  const [isFarcaster, setIsFarcaster] = useState(false)

  useEffect(() => {
  const checkFarcaster = async () => {
    try {
      const farcasterStatus = await sdk.isInMiniApp();
      setIsFarcaster(farcasterStatus);
    } catch (error) {
      console.error("Error checking Farcaster status:", error);
      setIsFarcaster(false);
    }
  };
  
  checkFarcaster();
}, []);

  // const [comment, setComment] = useState("")

  const {getUserAddress } = useWeb3();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!platform) {
      await showAlert("You did not select the social media platform where you posted the video!")
      return;
    }

    if (!contentUrl) {
      await showAlert('Video URL of your post is missing!')
      return
    }

    setIsSubmitting(true)

    try{
      const userAddress = await getUserAddress();
      if (!userAddress) {
        await showAlert("Please sign in first! Then we can proceed..😀");
        return;
      }

      const confirmSubmission = await showConfirm('Please be aware that you can only submit once for a single quest. Do you wish to proceed?🙂 ')
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
        await showAlert(`${data.error.msg || "Something went wrong"}`)
        return
        // throw new Error(data.error.msg || "Something went wrong");
      }
       await showAlert("Quest was submitted successfully! Best of luck in getting rewarded😎");

      setPlatform("")
      setContentUrl("")
    }catch(e: any){
      // alert(e)
       await showAlert(`${e}`);
    }finally{
      setIsSubmitting(false)
    }

  }

  return (
    <div>
      <h3 className="font-bold mb-4 text-brand-dark">Submit your short video link</h3>
      <AlertComponent />
        <ConfirmComponent />
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
                {isFarcaster && <SelectItem value="farcaster">Farcaster</SelectItem>}
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
