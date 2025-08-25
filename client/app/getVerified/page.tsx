"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { countries, getUniversalLink } from "@selfxyz/core";
import { SelfQRcodeWrapper, SelfAppBuilder, type SelfApp} from "@selfxyz/qrcode";
import { ethers } from "ethers";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CheckCircle, Shield, Star, Users, TrendingUp, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useAccount } from "wagmi";
import { useWeb3 } from "@/contexts/useWeb3"


export default function Home() {
  const router = useRouter();
  const [selfApp, setSelfApp] = useState<SelfApp | null>(null);
  const [universalLink, setUniversalLink] = useState("");
  const { address } = useAccount();
  const { address: web3Address } = useWeb3();
  const [userId, setUserId] = useState(ethers.ZeroAddress);
  const excludedCountries = useMemo(() => [countries.NORTH_KOREA], []);
  const [isVerified, setIsVerified] = useState(false)


  // Function to check verification status from API
  const checkVerificationStatus = async (walletAddress: string) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/verification/verificationStatus?address=${walletAddress}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        const verified = data.user?.selfProtocol?.verified || false;
        setIsVerified(verified);
        
        if (verified && typeof window !== 'undefined') {
          sessionStorage.setItem('isVerified', 'true');
          sessionStorage.setItem('verifiedAddress', walletAddress);
        }
      }
    } catch (error) {
      console.error("Error checking verification status:", error);
    }
  };

  // Check if user is already verified from sessionStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedVerification = sessionStorage.getItem('isVerified');
      if (savedVerification === 'true') {
        setIsVerified(true);
      } else if (address) {
        // Check API for verification if not in sessionStorage
        checkVerificationStatus(address);
      }
    }
  }, [address]);

  // Set userId from connected wallet address
  useEffect(() => {
    const walletAddress = address || web3Address;
    if (walletAddress) {
      setUserId(walletAddress);
    }
  }, [address, web3Address]);

  useEffect(() => {
    if (!userId || userId === ethers.ZeroAddress) return;
    
    try {
      const app = new SelfAppBuilder({
        version: 2,
        appName: process.env.NEXT_PUBLIC_SELF_APP_NAME || "Questpanda",
        scope: process.env.NEXT_PUBLIC_SELF_SCOPE || "questapp-by-leakey",
        // endpoint: `${process.env.NEXT_PUBLIC_URL}/api/verify`,
        endpoint: process.env.NEXT_PUBLIC_SELF_ENDPOINT || "",
        logoBase64: "https://i.postimg.cc/mrmVf9hm/self.png",
        userId: userId,
        endpointType: "staging_celo",
        userIdType: "hex",
        userDefinedData: "lets get verified Panda🐼",
        disclosures: {
          minimumAge: 18,
          nationality: true,
          // gender: true,
        },
        devMode: true
      }).build();

      setSelfApp(app);
      setUniversalLink(getUniversalLink(app));
    } catch (error) {
      console.error("Failed to initialize Self app:", error);
    }
  }, [userId]);

  const handleSuccessfulVerification = () => {
    setIsVerified(true)
    // Store verification status in sessionStorage
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('isVerified', 'true');
      sessionStorage.setItem('verifiedAddress', userId);
    }
    setTimeout(() => {
      router.push("/dashboard")
    }, 3000)
  };

    const benefits = [
    {
      icon: <Star className="h-5 w-5" />,
      title: "Local campaigns access",
      description: "Get exclusive access to brand campaigns in your region - many companies prefer working with local creators.",
    },
    // {
    //   icon: <TrendingUp className="h-5 w-5" />,
    //   title: "Higher Earnings",
    //   description: "Verified creators earn up to 30% more on average",
    // },
    {
      icon: <Users className="h-5 w-5" />,
      title: "Build trust",
      description: "Some brands prefer working with verified creators",
    },
    // {
    //   icon: <Shield className="h-5 w-5" />,
    //   title: "Account Security",
    //   description: "Enhanced security and protection for your account",
    // },
  ]


    if (isVerified) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md mx-auto text-center">
          <CardContent className="pt-6">
            <div className="mb-6">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-10 w-10 text-green-600" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Verification Successful!</h1>
              <p className="text-gray-600">
                Your account has been verified. You'll be redirected to your dashboard shortly.
              </p>
            </div>
            <Badge variant="secondary" className="bg-green-100 text-green-800">
              <CheckCircle className="h-4 w-4 mr-1" />
              Verified Creator
            </Badge>
          </CardContent>
        </Card>
      </div>
    )
  }



  // return (
  //   <div className="min-h-screen w-full bg-gray-50 flex flex-col items-center justify-center p-4">
  //     <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md mx-auto">
  //       <div className="flex justify-center mb-6">
  //         {selfApp ? (
  //           <SelfQRcodeWrapper
  //             selfApp={selfApp}
  //             onSuccess={handleSuccessfulVerification}
  //             onError={(error) => {
  //               const errorCode = error.error_code || 'Unknown';
  //               const reason = error.reason || 'Unknown error';
  //               console.error(`Error ${errorCode}: ${reason}`);
  //               console.error("Error: Failed to verify identity");
  //             }}
  //           />
  //         ) : (
  //           <div className="w-[256px] h-[256px] bg-gray-200 animate-pulse flex items-center justify-center">
  //             <p className="text-gray-500 text-sm">Loading QR Code...</p>
  //           </div>
  //         )}
  //       </div>
  //     </div>
  //   </div>
  // );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/dashboard">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
            {/* <Badge variant="secondary" className="bg-brand-purple/10 text-brand-purple">
              Optional verification
            </Badge> */}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-white rounded-full shadow-lg flex items-center justify-center border">
              <svg
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-brand-purple"
              >
                <rect x="2" y="6" width="20" height="12" rx="2" />
                <circle cx="8" cy="12" r="2" />
                <path d="m14 10 2 2-2 2" />
              </svg>
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Get verified as a creator</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Unlock exclusive opportunities by verifying your identity. It's quick, secure,
            and completely optional.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Left Column - Benefits */}
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Why get verified?</h2>
              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <div
                    key={index}
                    className="flex items-start space-x-4 p-4 bg-white rounded-lg border shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div className="w-10 h-10 bg-brand-purple/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <div className="text-brand-purple">{benefit.icon}</div>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">{benefit.title}</h3>
                      <p className="text-gray-600 text-sm">{benefit.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* What We Verify */}
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Shield className="h-5 w-5 mr-2 text-brand-purple" />
                  What we verify
                </CardTitle>
                <CardDescription>We use secure blockchain technology to verify your identity</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {/* <div className="flex items-center space-x-3">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm text-gray-700">Age verification (18+)</span>
                  </div> */}
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm text-gray-700">Identity verification</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm text-gray-700">Nationality confirmation</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Privacy Notice */}
            {/* <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <Shield className="h-5 w-5 text-blue-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-blue-900 mb-1">Your Privacy is Protected</h4>
                  <p className="text-sm text-blue-700">
                    We use zero-knowledge proofs to verify your identity without storing your personal data. Your
                    information remains private and secure.
                  </p>
                </div>
              </div>
            </div> */}
          </div>

          {/* Right Column - QR Code */}
          <div className="lg:sticky lg:top-8">
            <Card className="shadow-sm">
              <CardHeader className="text-center">
                <CardTitle>Scan to verify</CardTitle>
                <CardDescription>Use the Self app to scan this QR code and complete your verification</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-center mb-6">
                  {selfApp ? (
                    <SelfQRcodeWrapper
                      selfApp={selfApp}
                      type="deeplink"
                      onSuccess={handleSuccessfulVerification}

                      onError={(error) => {
                        const errorCode = error.error_code || "Unknown"
                        const reason = error.reason || "Unknown error"
                        console.error(`Error ${errorCode}: ${reason}`)
                        console.error("Error: Failed to verify identity")
                      }}
                    />
                  ) : (
                    <div className="w-[256px] h-[256px] bg-gray-100 animate-pulse flex items-center justify-center rounded-lg border">
                      <p className="text-gray-500 text-sm">Loading QR Code...</p>
                    </div>
                  )}
                </div>

                <div className="text-center space-y-4">
                  <div className="text-sm text-gray-600">
                    <p className="mb-2">Don't have the Self app?</p>
                    <div className="flex justify-center space-x-4">
                      {/* <Button variant="outline" size="sm" asChild>
                        <a href="https://apps.apple.com/app/self-app" target="_blank" rel="noopener noreferrer">
                          Download for iOS
                        </a>
                      </Button> */}
                      <Button variant="outline" size="sm" asChild>
                        <a
                          href="https://play.google.com/store/apps/details?id=com.proofofpassportapp"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Download for Android
                        </a>
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Steps */}
            <Card className="mt-6 shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg">How it Works</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-brand-purple text-white rounded-full flex items-center justify-center text-xs font-bold">
                      1
                    </div>
                    <div>
                      <p className="text-sm font-medium">Download the Self app</p>
                      <p className="text-xs text-gray-600">Available on Android</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-brand-purple text-white rounded-full flex items-center justify-center text-xs font-bold">
                      2
                    </div>
                    <div>
                      <p className="text-sm font-medium">Scan the QR code</p>
                      <p className="text-xs text-gray-600">Use your phone camera or the Self app</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-brand-purple text-white rounded-full flex items-center justify-center text-xs font-bold">
                      3
                    </div>
                    <div>
                      <p className="text-sm font-medium">Complete verification</p>
                      <p className="text-xs text-gray-600">Follow the prompts in the app</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )

}