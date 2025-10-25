"use client";

import { useState } from "react";
import {useAlert} from "@/components/custom-popup"
import { useRouter } from "next/navigation";
import { useAccount, useConnect, useDisconnect } from "wagmi";


interface UpvoteButtonProps {
  questId: string;
  submissionId: string;
  hasUpvoted: boolean;
  upvoteCount: number;
}

export default function UpvoteButton({ 
  questId, 
  submissionId, 
  hasUpvoted: initialHasUpvoted, 
  upvoteCount : initialUpvoteCount 
}: UpvoteButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { showAlert, AlertComponent } = useAlert()
const { address, isConnected } = useAccount();
  const router = useRouter(); // Use the hook

    const [hasUpvoted, setHasUpvoted] = useState(initialHasUpvoted);
  const [upvoteCount, setUpvoteCount] = useState(initialUpvoteCount);
  

  

  const handleUpvote = async () => {
    if (isLoading) return;
    
    setIsLoading(true);
    
    try {

     if(!isConnected || !address){
        console.log('You have to login first!')
        await showAlert('Please Login first to upvote!')
     }else {
    // Optimistically update the UI
      const newHasUpvoted = !hasUpvoted;
      const newUpvoteCount = newHasUpvoted ? upvoteCount + 1 : upvoteCount - 1;
      
      setHasUpvoted(newHasUpvoted);
      setUpvoteCount(newUpvoteCount);

     if (hasUpvoted) {
        // Remove upvote
        console.log('command to remove vote')
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/quest/removeVote`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          submissionId,
          questId
        }),
      })

      const data = await res.json()

      if(data.success == false){
                  // Revert optimistic update if API call fails
          setHasUpvoted(initialHasUpvoted);
          setUpvoteCount(initialUpvoteCount);

        await showAlert(`Failed because of:  ${data.message}`)
      }

      } else {
        // Add upvote
        console.log('command to add vote')
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/quest/upvoteSubmission`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          submissionId,
          questId
        }),
      })

      const data = await res.json()

      if(data.success == false){
                  // Revert optimistic update if API call fails
          setHasUpvoted(initialHasUpvoted);
          setUpvoteCount(initialUpvoteCount);

        await showAlert(`Not successful because of:  ${data.message}`)
      }

      }
     }
  
    
    } catch (error) {
      // Revert optimistic update on error
      setHasUpvoted(initialHasUpvoted);
      setUpvoteCount(initialUpvoteCount);
        await showAlert(`Error updating upvote:, ${error}`)
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
    <button 
      onClick={handleUpvote}
      disabled={isLoading}
className={`absolute top-1 right-1 flex items-center gap-0 px-1.5 py-1 border rounded-md transition-all duration-150 hover:shadow-sm ${!isLoading ? 'active:scale-95' : ''} text-xs font-medium ${
  hasUpvoted 
    ? 'bg-pink-100 text-pink-700 border-pink-200 hover:bg-pink-200' 
    : 'bg-white border-gray-300 hover:border-brand-purple hover:text-brand-purple'
} ${isLoading ? 'cursor-not-allowed' : ''}`}
    >
      Upvote
      <svg 
        className="w-4 h-4" 
        fill="none" 
        stroke="currentColor" 
        viewBox="0 0 24 24"
      >
        <path 
          stroke="currentColor"
          strokeWidth="2"
          d="M12 6L6 18H18L12 6Z" 
        />
      </svg>
      <span className="font-semibold text-xs">{upvoteCount}</span>
    </button>
     <AlertComponent/>
    </>

  );
}