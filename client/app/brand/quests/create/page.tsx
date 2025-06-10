"use client"

import type React from "react"

import {useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { toast } from "@/hooks/use-toast"
import { uploadToCloudinary } from "@/utils/uploadToCloudinary";
import { useWeb3 } from "@/contexts/useWeb3"
import CurrencyDisplay from '@/components/CurrencyDisplay';
import {useAlert} from "@/components/custom-popup"
import {useConfirm} from '@/components/custom-confirm'
import { PaymentModal } from "@/components/payment-modal"




let hasConnectedMiniPay = false;

export default function CreateQuestPage() {
const { showAlert, AlertComponent } = useAlert()
const { showConfirm, ConfirmComponent } = useConfirm()

    // 🚀 Auto-connect MiniPay if detected
    useEffect(() => {
      if (typeof window !== "undefined") {
        if (window.ethereum?.isMiniPay && !hasConnectedMiniPay) {
          hasConnectedMiniPay = true;
        }
      }
    }, []);
  
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  // Inside your CreateQuestPage component
const { sendCUSD, checkCUSDBalance, getUserAddress, approveSpending, createQuest, checkTokenBalances } = useWeb3();
const [paymentProcessing, setPaymentProcessing] = useState(false);


  // Form state
  const [title, setTitle] = useState("")
  const [brand, setBrandName] = useState("")
  // const [rewardCriteria, setRewardCriteria] = useState("")
  const [category, setCategory] = useState("Create video")
  // const [description, setDescription] = useState("")
  const [longDescription, setLongDescription] = useState("")
  const [prizePool, setPrizePool] = useState("")
  const [deadline, setDeadline] = useState("")
  const [minFollowers, setMinFollowers] = useState("")
  // const [requirements, setRequirements] = useState("")
  const [imageUrl, setImageUrl] = useState("")
  const [videosToReward, setVideosToReward] = useState("10")
  const[rewardPerVideo, setRewardPerVideo] = useState("")
  const [uploading, setUploading] = useState(false);
  const [showBudgetInput, setShowBudgetInput] = useState(false);
  const [balanceError, setBalanceError] = useState<{ hasError: boolean;message: string; balance: string; required: string;}>({hasError: false, message: "", balance: "", required: ""});

  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [paymentStepComplete, setPaymentStepComplete] = useState(false);
  const [tokenForPayment, setTokenForPayment] = useState("")
const [paymentAddress, setPaymentAddress] = useState<`0x${string}` | null>(null);

  // string; required: string;}>({hasError: false, message: "", balance: "", required: ""});

const handleVideosToRewardChange = (value: string) => {
  setVideosToReward(value);

    // Hide budget if value is empty, zero, or invalid
  if (!value || parseFloat(value) <= 0 || !rewardPerVideo) {
    setShowBudgetInput(false);
    setPrizePool(""); // Clear the prize pool value
    return;
  }
  
  if (value && rewardPerVideo) {
    const budget = parseFloat(value) * parseFloat(rewardPerVideo);
    setPrizePool(budget.toString());
    setShowBudgetInput(true);
  }
};

const handleRewardPerVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const value = e.target.value;
  setRewardPerVideo(value);

    // Hide budget if value is empty, zero, or invalid
  if (!value || parseFloat(value) <= 0 || !videosToReward) {
    setShowBudgetInput(false);
    setPrizePool(""); // Clear the prize pool value
    return;
  }

  if (value && videosToReward) {
    const budget = parseFloat(videosToReward) * parseFloat(value);
    setPrizePool(budget.toString());
    setShowBudgetInput(true);
  }
};

const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
  // setShowPaymentModal(true);

  const file = e.target.files?.[0];
  if (!file) return;

  setUploading(true);
  try {
    const url = await uploadToCloudinary(file);
    setImageUrl(url);
    console.log("Uploaded image URL:", url);
  } catch (err) {
    await showAlert(`Upload failed : ${err}`)
    // console.error("Upload failed", err);
  }
  setUploading(false);
};

const handlePaymentAndSubmit  = async (e: React.FormEvent) => {
  e.preventDefault();

  if (!title || !brand || !category || !longDescription || !prizePool || !deadline || !imageUrl || !videosToReward || !rewardPerVideo) {
    
    await showAlert("Something is missing! Please fill out all fields!")
    // toast({
    //   title: "Missing information",
    //   description: "Please fill in all required fields",
    //   variant: "destructive",
    // });
    return;
  }

  const userAddress = await getUserAddress();
  if (!userAddress) {
    await showAlert("Please sign in first!");
    return;
  }
  setPaymentAddress(userAddress)

  // Show confirmation dialog for depositing funds
  const confirmDeposit = await showConfirm(`${prizePool} USD will be transfered from your wallet into the prize pool. Confirm to proceed!`);

  if(!confirmDeposit){
  return
  }
  // Show modal first, then wait for user to complete
        // Check the which asset to deduct from the user. by checking the balance of all their tokens
      const {cUSDBalance, USDTBalance, USDCBalance} = await checkTokenBalances()

      if(Number(cUSDBalance) >= Number(prizePool)){
        setTokenForPayment('cusd')
        await completeQuestCreation()
      }else if(Number(USDTBalance) >= Number(prizePool)){
        setTokenForPayment('usdt')
        await completeQuestCreation()
      }else if(Number(USDCBalance) >= Number(prizePool)){
        setTokenForPayment('usdc')
        await completeQuestCreation()
      }else{
        // If user show them a warning and a deep link to go and deposit funds
        // If user in on a different wallet then pop up the deposit modal
        if (typeof window !== "undefined" && window.ethereum?.isMiniPay) {
            setBalanceError({
              hasError: true,
              message: "Insufficient balance to create this quest",
              balance: '0',
              required: '0',
            });
            setPaymentProcessing(false);
            return;
        }else{
            await showAlert("We have noticed you have insufficient balance. We are going to ask you to top up!");
            setShowPaymentModal(true);
        }

      }
};

const completeQuestCreation = async ()=>{
  try{
    // First handle payment
    setPaymentProcessing(true);

    // Determine recipient address (this should be your platform's escrow address)
    const platformEscrowAddress = process.env.NEXT_PUBLIC_PLATFORM_ESCROW_ADDRESS;
    if (!platformEscrowAddress) {
      throw new Error("Platform escrow address not configured");
    }

    
  try {

      // Test approval
      // let _tokenName = 'cUSD'
      await approveSpending(prizePool, tokenForPayment)
      let onchainQuestId = await createQuest(prizePool, tokenForPayment)

        setIsSubmitting(true);


        setIsSubmitting(true);

          const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/quest/create`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include", // send cookies for auth
            body: JSON.stringify({
              title,
              brand,
              category,
              longDescription,
              prizePool,
              deadline,
              minFollowers,
              imageUrl,
              videosToReward,
              rewardPerVideo,
              onchainQuestId,
              rewardToken: tokenForPayment
            }),
          });
      
          const data = await res.json();
      
          if (!res.ok) {
            throw new Error(data.error || "Something went wrong");
          }
  
      // toast({
      //   title: "Quest created!",
      //   description: "Your quest has been created successfully.",
      // });
  
      router.push("/brand/dashboard");
    } catch (paymentError: any) {
      // Specific handling for insufficient funds
      if (paymentError.message.includes("insufficient funds") ){
        toast({
          title: "Insufficient Funds",
          description: "You don't have enough cUSD for this transaction",
          variant: "destructive",
        });
      } else {
        throw paymentError; // Re-throw other errors
      }
    }
} catch (err: any) {
    toast({
      title: "Error",
      description: err.message || "Failed to create quest.",
      variant: "destructive",
    });
  } finally {
    setPaymentProcessing(false);
    setIsSubmitting(false);
  }
}

  
  return (
    // <div className="min-h-screen bg-brand-light">
    <div className="min-h-screen bg-brand-light overflow-x-hidden"> 

      <AlertComponent />
      <ConfirmComponent />
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

        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-8 text-brand-dark">Create New Quest</h1>

          <form onSubmit={handlePaymentAndSubmit }>
            <div className="space-y-6">
              <Card className="bg-white border-gray-200 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-brand-dark">Basic Information</CardTitle>
                  <CardDescription className="text-gray-600">
                    Provide the essential details about your quest
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-4">

                <div className="space-y-2">
                      <Label htmlFor="brand" className="text-brand-dark">
                        Brand name <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="brand"
                        placeholder="e.g.,Name of your brand/product"
                        value={brand}
                        onChange={(e) => setBrandName(e.target.value)}
                        className="bg-white border-gray-300 text-gray-800"
                        required
                      />
                    </div>


                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                    <div className="space-y-2">
                      <Label htmlFor="title" className="text-brand-dark">
                        Quest Title <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="title"
                        placeholder="e.g., Summer Collection Showcase"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="bg-white border-gray-300 text-gray-800"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="category" className="text-brand-dark">
                        Quest category <span className="text-red-500">*</span>
                      </Label>
                      <Select value={category} onValueChange={setCategory} required>
                        <SelectTrigger className="bg-white border-gray-300 text-gray-800">
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent className="bg-white border-gray-200 text-gray-800">
                          <SelectItem value="Create video">Video Creation</SelectItem>
                          {/* <SelectItem value="Photo">Photo</SelectItem>
                          <SelectItem value="Review">Review</SelectItem>
                          <SelectItem value="Unboxing">Unboxing</SelectItem> */}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* <div className="space-y-2">
                    <Label htmlFor="description" className="text-brand-dark">
                      Short Description <span className="text-red-500">*</span>
                    </Label>
                    <Textarea
                      id="description"
                      placeholder="Brief description of your quest (max 150 characters)"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="bg-white border-gray-300 text-gray-800 resize-none h-20"
                      maxLength={150}
                      required
                    />
                  </div> */}

                  <div className="space-y-2">
                    <Label htmlFor="longDescription" className="text-brand-dark">
                      Detailed Description - What you want the content creators to do.
                    </Label>
                    <Textarea
                      id="longDescription"
                      placeholder="Create a video showing your followers...."
                      value={longDescription}

                      onChange={(e) => setLongDescription(e.target.value)}
                      className="bg-white border-gray-300 text-gray-800 resize-none h-32"
                      required
                    />
                  </div>

                </CardContent>
              </Card>

              <Card className="bg-white border-gray-200 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-brand-dark">Reward & Requirements</CardTitle>
                  <CardDescription className="text-gray-600">
                    Set the prize pool and participation requirements
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                  <div className="space-y-2">
                    <Label htmlFor="minFollowers" className="text-brand-dark">
                      Minimum Followers - Eligibility criteria for content creators
                    </Label>
                    <Input
                      id="minFollowers"
                      placeholder="Optional"
                      value={minFollowers}
                      onChange={(e) => setMinFollowers(e.target.value)}
                      className="bg-white border-gray-300 text-gray-800"
                      type="number"
                      min="0"
                    />
                  </div>

                  <div className="space-y-2">
                      <Label htmlFor="deadline" className="text-brand-dark">
                        Deadline - Quest ends on.<span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="deadline"
                        type="date"
                        value={deadline}
                        onChange={(e) => setDeadline(e.target.value)}
                        className="bg-white border-gray-300 text-gray-800"
                        min={new Date().toISOString().split("T")[0]}
                        max={new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]} // ✅ 7 days from today
                        
                      />
                    </div>

                    </div>
        

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="videosToReward" className="text-brand-dark">
                        How many videos will you reward? <span className="text-red-500">*</span>
                      </Label>
                      <Select value={videosToReward} onValueChange={handleVideosToRewardChange} required>
                        <SelectTrigger className="bg-white border-gray-300 text-gray-800">
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent className="bg-white border-gray-200 text-gray-800">
                          <SelectItem value="10">The best 10 videos</SelectItem>
                          <SelectItem value="20">The best 20 videos</SelectItem>
                          <SelectItem value="30">The best 30 videos</SelectItem>
                          <SelectItem value="50">The best 50 videos</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>


                    <div className="space-y-2">
                      <Label htmlFor="rewardPerVideo" className="text-brand-dark">
                        How much reward per video? <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="rewardPerVideo"
                        placeholder="e.g., 5 USD"
                        value={rewardPerVideo}
                        // onChange={(e) => setRewardPerVideo(e.target.value)}
                        onChange={handleRewardPerVideoChange}
                        className="bg-white border-gray-300 text-gray-800"
                        type="text"
                        // min="1"
                        required
                      />
                    </div>
              </div>



                 {/* {showBudgetInput && (

                    <div className="space-y-2">
                      <Label htmlFor="prizePool" className="text-brand-dark">
                        Budget  - Amount of funds you need to create this quest<span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="prizePool"
                        placeholder="e.g., 100 USD"
                        value={prizePool}
                        onChange={(e) => setPrizePool(e.target.value)}
                        className="bg-white border-gray-300 text-gray-800"
                        type="number"
                        // min="1"
                        required
                        readOnly
                      />
                    </div>
                )}  */}


{showBudgetInput && (
  <div className="bg-pink-50 border-l-4 border-pink-400 p-4 rounded">
    <div className="flex items-start">
      <div className="flex-shrink-0">
        <svg 
          className="h-5 w-5 text-pink-400" 
          xmlns="http://www.w3.org/2000/svg" 
          viewBox="0 0 20 20" 
          fill="currentColor"
        >
          <path 
            fillRule="evenodd" 
            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9z" 
            clipRule="evenodd" 
          />
        </svg>
      </div>
      <div className="ml-3">
        <h3 className="text-sm font-medium text-pink-800">
          Budget
        </h3>
        <div className="mt-2 text-sm text-pink-700">
          <p>
            You'll need <span className="font-bold">{prizePool}<CurrencyDisplay/></span> to reward {videosToReward} videos at {rewardPerVideo}<CurrencyDisplay/> each
          </p>
        </div>
      </div>
    </div>
    {/* Hidden input for form submission */}
    <input 
      type="hidden" 
      name="prizePool" 
      value={prizePool} 
      required 
    />
  </div>
)}
                

{/* 
                  <div className="space-y-2">
                    <Label htmlFor="rewardriteria" className="text-brand-dark">
                      Reward criteria - How the winners will be picked
                    </Label>
                    <Input
                      id="rewardCriteria"
                      placeholder="e.g., The best 10 videos"
                      value={rewardCriteria}
                      onChange={(e) => setRewardCriteria(e.target.value)}
                      className="bg-white border-gray-300 text-gray-800"
                      min="0"
                    />
                  </div> */}


                  {/* <div className="space-y-2">
                    <Label htmlFor="rewardriteria" className="text-brand-dark">
                      Reward criteria - How the winners will be picked and rewarded
                    </Label>
                    <Textarea
                      id="rewardriteria"
                      placeholder="e.g., The best 10 videos"
                      // value={longDescription}
                      value={rewardCriteria}
                      required
                      onChange={(e) => setRewardCriteria(e.target.value)}
                      className="bg-white border-gray-300 text-gray-800 resize-none h-30"
                    />
                  </div> */}

                  {/* <div className="space-y-2">
                    <Label htmlFor="requirements" className="text-brand-dark">
                      Requirements
                    </Label>
                    <Textarea
                      id="requirements"
                      placeholder="List specific requirements, one per line"
                      value={requirements}
                      onChange={(e) => setRequirements(e.target.value)}
                      className="bg-white border-gray-300 text-gray-800 resize-none h-32"
                    />
                    <p className="text-xs text-gray-500">Enter each requirement on a new line</p>
                  </div> */}
                </CardContent>
              </Card>

              <Card className="bg-white border-gray-200 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-brand-dark">Media</CardTitle>
                  <CardDescription className="text-gray-600">Add visual elements to your quest</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="imageUrl" className="text-brand-dark">
                      Cover Image
                    </Label>
                    <Input
                      id="imageUrl"
                      placeholder="https://example.com/image.jpg"
                      value={imageUrl}
                      onChange={(e) => setImageUrl(e.target.value)}
                      className="bg-white border-gray-300 text-gray-800 hidden"
                      
                    />
                  </div>

                  {/* {imageUrl && (
                    <div className="mt-2">
                      <p className="text-sm text-gray-600 mb-2">Preview:</p>
                      <div
                        className="h-40 w-full rounded-lg bg-cover bg-center border border-gray-300"
                        style={{ backgroundImage: `url(${imageUrl})` }}
                      ></div>
                    </div>
                  )} */}

                  <div className="bg-brand-light p-4 rounded-lg border border-dashed border-gray-300 text-center">
                    {/* <p className="text-gray-600 mb-2">Upload image</p> */}
                     {/* <Button
                      type="button"
                      variant="outline"
                      className="border-brand-purple text-brand-purple hover:bg-brand-purple/10"
                    >
                      Upload Image
                    </Button>  */}
        <input type="file" required accept="image/*" onChange={handleImageUpload} />
        {uploading && <p className="text-lg text-gray-500">Uploading...wait patiently!</p>}

        {imageUrl && (
        <div className="mt-2 space-y-2">
            <img src={imageUrl} alt="Preview" className="w-40 rounded shadow" />
            {/* <p className="text-sm text-gray-600 break-all">
            <strong>Image URL:</strong>{" "}
            <a
                href={imageUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline"
            >
                {imageUrl}
            </a>
            </p> */}
        </div>
        )}


                    <p className="text-xs text-gray-500 mt-2">Recommended size: 1200 x 800px, Max 5MB</p>
                  </div>


                </CardContent>
              </Card>

              {balanceError.hasError && (
                <div className="w-full bg-red-50 border-l-4 border-red-500 p-4 mb-4">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <svg
                        className="h-5 w-5 text-red-500"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-red-700">
                        {/* {balanceError.message} You have {balanceError.balance} cUSD but need {balanceError.required} cUSD. */}
                        Insufficient funds.
                        {hasConnectedMiniPay && (
                          <Link 
                          href="https://minipay.opera.com/add_cash" 
                          className="ml-2 font-medium text-red-700 underline hover:text-red-600"
                        >
                          Click here to top up
                        </Link>
                      )}
                        
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex justify-end gap-4">
                <Button
                  type="button"
                  variant="outline"
                  className="border-gray-300 text-gray-700 hover:bg-gray-100"
                  onClick={() => router.push("/brand/dashboard")}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-brand-purple hover:bg-brand-purple/90 text-white"
                  disabled={isSubmitting || paymentProcessing}
                >
                      {paymentProcessing ? "Processing payment..." : 
                       isSubmitting ? "Creating..." : "Create Quest"}
                </Button>

                <PaymentModal isOpen={showPaymentModal} onClose={() => setShowPaymentModal(false)} onPaymentComplete={completeQuestCreation} prizePool={prizePool} paymentAddress={paymentAddress}/>

                  {/* // Add this loading state component */}
                {/* {paymentProcessing && (
                  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg max-w-md text-center">
                      <p className="text-lg font-medium mb-4">Processing payment...</p>
                      <p className="text-sm text-gray-600">
                        Please confirm the transaction in your wallet
                      </p>
                    </div>
                  </div>
                )} */}
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
