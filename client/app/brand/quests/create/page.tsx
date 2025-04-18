"use client"

import type React from "react"

import { useState } from "react"
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

export default function CreateQuestPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Form state
  const [title, setTitle] = useState("")
  const [brand, setBrandName] = useState("")
  const [rewardCriteria, setRewardCriteria] = useState("")
  const [category, setCategory] = useState("Create video")
  // const [description, setDescription] = useState("")
  const [longDescription, setLongDescription] = useState("")
  const [prizePool, setPrizePool] = useState("")
  const [deadline, setDeadline] = useState("")
  const [minFollowers, setMinFollowers] = useState("")
  // const [requirements, setRequirements] = useState("")
  const [imageUrl, setImageUrl] = useState("")
  const [uploading, setUploading] = useState(false);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const url = await uploadToCloudinary(file);
      setImageUrl(url);
      console.log("Uploaded image URL:", url);
    } catch (err) {
      console.error("Upload failed", err);
    }
    setUploading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    if (!title || !brand || !rewardCriteria || !category || !longDescription || !prizePool || !deadline || !imageUrl) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }
  
    setIsSubmitting(true);
  
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/quest/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // send cookies for auth
        body: JSON.stringify({
          title,
          brand,
          rewardCriteria,
          category,
          longDescription,
          prizePool,
          deadline,
          minFollowers,
          imageUrl,
        }),
      });
  
      const data = await res.json();
  
      if (!res.ok) {
        throw new Error(data.error || "Something went wrong");
      }
  
      toast({
        title: "Quest created!",
        description: "Your quest has been created successfully.",
      });
  
      router.push("/brand/dashboard");
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message || "Failed to create quest.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  

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

        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-8 text-brand-dark">Create New Quest</h1>

          <form onSubmit={handleSubmit}>
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
                      <Label htmlFor="prizePool" className="text-brand-dark">
                        Prize Pool (USD)  - To be shared among the selected<span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="prizePool"
                        placeholder="e.g., 100 USD"
                        value={prizePool}
                        onChange={(e) => setPrizePool(e.target.value)}
                        className="bg-white border-gray-300 text-gray-800"
                        type="number"
                        min="1"
                        required
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
                        max={new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]} // ✅ 7 days from today
                        required
                      />
                    </div>
                  </div>

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


                  <div className="space-y-2">
                    <Label htmlFor="rewardriteria" className="text-brand-dark">
                      Reward criteria - How the winners will be picked
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
                  </div>

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
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Creating..." : "Create Quest"}
                </Button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
