"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function BrandLandingPage() {
  const [scrollY, setScrollY] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-b from-brand-light to-white overflow-hidden">


      
      {/* Decorative elements */}
      <div className="fixed inset-0 pointer-events-none z-0 opacity-30">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-brand-purple/10 blur-3xl"></div>
        <div className="absolute top-1/3 right-1/4 w-96 h-96 rounded-full bg-brand-pink/10 blur-3xl"></div>
        <div className="absolute bottom-1/4 left-1/3 w-80 h-80 rounded-full bg-brand-teal/10 blur-3xl"></div>
        <div className="absolute -bottom-20 right-1/4 w-72 h-72 rounded-full bg-brand-yellow/10 blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 py-4 relative z-10">
        <div
          className="opacity-0 scale-95 animate-fade-in text-center"
          style={{ animationDelay: "0.3s", animationFillMode: "forwards" }}
        >
          <div className="p-8 rounded-2xl border border-gray-100 mb-8">
          {/* <div className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-xl border border-gray-100 mb-8"> */}

            {/* <p className="text-lg text-gray-700 mb-8 max-w-2xl mx-auto">
              <span className="font-semibold text-brand-purple">Questpanda</span> helps brands like yours create
              viral marketing campaigns.
            </p> */}

            <div className="flex flex-wrap justify-center gap-4">
              <Button
                asChild
                size="lg"
                className="bg-gradient-to-r from-brand-purple to-brand-pink hover:opacity-90 text-white shadow-md transition-all duration-300 hover:shadow-lg"
              >
                <Link href="/brand/dashboard">Go to Dashboard</Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-brand-purple hover:text-brand-purple/95  bg-dark text-brand-purple bg-brand-purple/10 shadow-md transition-all duration-300 hover:shadow-lg"
              >
                <Link href="/brand/quests/create">Create first Quest</Link>
              </Button>
            </div>
          </div>
        </div> 


        <header className="mb-24">
          <div
            className="max-w-4xl mx-auto opacity-0 translate-y-4 animate-fade-in"
            style={{ animationDelay: "0.1s", animationFillMode: "forwards" }}
          >
            <div className="text-center mb-12">
              <div className="inline-block mb-6 relative">
                <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-brand-purple via-brand-pink to-brand-teal">
                  Amplify your brand
                </h1>
                <div className="absolute -top-6 -right-6 md:-top-8 md:-right-8 w-12 h-12 md:w-16 md:h-16 bg-brand-teal rounded-full opacity-70 blur-sm animate-pulse"></div>
                <div
                  className="absolute -bottom-4 -left-4 md:-bottom-6 md:-left-6 w-10 h-10 md:w-12 md:h-12 bg-brand-yellow rounded-full opacity-70 blur-sm animate-pulse"
                  style={{ animationDelay: "1s" }}
                ></div>
              </div>
              <p className="text-xl md:text-2xl text-gray-700 mb-8 font-light">
                Questpanda connects your brand with thousands of authentic content creators
              </p>
            </div>

            {/* <div className="grid md:grid-cols-3 gap-4 mb-12">*/}
            <div className="grid md:grid-cols-2 gap-4 mb-12">
              {/* User-Generated Content Box */}
              <div
                className="opacity-0 translate-y-4 animate-fade-in bg-gradient-to-br from-white to-brand-purple/5 p-4 rounded-lg shadow-sm border border-gray-300 text-center group hover:-translate-y-1 transition-all duration-300"
                style={{ animationDelay: "0.2s", animationFillMode: "forwards" }}
              >
                <div className="flex justify-center mb-3">
                  <div className="relative h-20 w-20">
                    <svg viewBox="0 0 100 100" className="h-full w-full text-brand-purple">
                      <rect
                        x="20"
                        y="30"
                        width="60"
                        height="40"
                        rx="5"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="5"
                      />
                      <circle cx="65" cy="40" r="8" fill="none" stroke="currentColor" strokeWidth="3" />
                      <path d="M30 35 L45 20 L55 20 L70 35" fill="none" stroke="currentColor" strokeWidth="3" />
                      <circle cx="50" cy="50" r="12" fill="none" stroke="currentColor" strokeWidth="3" />
                      <circle cx="50" cy="50" r="4" fill="currentColor" />
                    </svg>
                    <div className="absolute inset-0 rounded-full bg-gradient-to-br from-brand-purple/10 to-transparent opacity-70 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                </div>
                <h3 className="text-lg font-bold text-brand-dark mb-1 group-hover:text-brand-purple transition-colors duration-300">
                  User-Generated Content
                </h3>
                <p className="text-gray-600 text-sm">
                  Real people create and share videos about your product on social media
                </p>
              </div>

              {/* Engaged Audiences Box */}
              <div
                className="opacity-0 translate-y-4 animate-fade-in bg-gradient-to-br from-white to-brand-pink/5 p-4 rounded-lg shadow-sm border border-gray-300 text-center group hover:-translate-y-1 transition-all duration-300"
                style={{ animationDelay: "0.4s", animationFillMode: "forwards" }}
              >
                <div className="flex justify-center mb-3">
                  <div className="relative h-20 w-20">
                    <svg viewBox="0 0 100 100" className="h-full w-full text-brand-pink">
                      <circle cx="30" cy="40" r="10" fill="none" stroke="currentColor" strokeWidth="4" />
                      <circle cx="70" cy="40" r="10" fill="none" stroke="currentColor" strokeWidth="4" />
                      <path d="M30 50 Q50 65 70 50" fill="none" stroke="currentColor" strokeWidth="4" />
                      <path
                        d="M20 75 Q30 60 40 63 Q50 65 60 63 Q70 60 80 75"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                    </svg>
                    <div className="absolute inset-0 rounded-full bg-gradient-to-br from-brand-pink/10 to-transparent opacity-70 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                </div>
                <h3 className="text-lg font-bold text-brand-dark mb-1 group-hover:text-brand-pink transition-colors duration-300">
                  Engaged Audiences
                </h3>
                <p className="text-gray-600 text-sm">Reach new customers through creators with loyal followings</p>
              </div>
            </div>

            {/* <div
              className="opacity-0 scale-95 animate-fade-in text-center"
              style={{ animationDelay: "0.8s", animationFillMode: "forwards" }}
            >
              <div className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-xl border border-gray-100 mb-8">
                <p className="text-lg text-gray-700 mb-8 max-w-2xl mx-auto">
                  <span className="font-semibold text-brand-purple">Questpanda</span> helps brands like yours create
                  viral marketing campaigns.
                </p>

                <div className="flex flex-wrap justify-center gap-4">
                  <Button
                    asChild
                    size="lg"
                    className="bg-gradient-to-r from-brand-purple to-brand-pink hover:opacity-90 text-white shadow-md transition-all duration-300 hover:shadow-lg"
                  >
                    <Link href="/brand/dashboard">Go to dashboard</Link>
                  </Button>
                  <Button
                    asChild
                    size="lg"
                    variant="outline"
                    className="border-brand-purple hover:text-brand-purple/95  bg-dark text-brand-purple bg-brand-purple/10 shadow-md transition-all duration-300 hover:shadow-lg"
                  >
                    <Link href="/brand/quests/create">Create first quest</Link>
                  </Button>
                </div>
              </div>
            </div> */}
          </div>
        </header>

          {/* Ways to Use QuestPanda Section */}
        <section className="mb-24">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-brand-dark">
              Three powerful ways to use{" "}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-brand-purple to-brand-pink">
                Questpanda
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Choose the perfect strategy for your brand goals and watch your engagement soar
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Online Contests */}
            <div className="bg-gradient-to-br from-white to-brand-purple/5 rounded-2xl p-8 shadow-xl border border-gray-100 group hover:-translate-y-2 transition-all duration-300 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-radial from-brand-purple/20 to-transparent"></div>
              <div className="relative z-10">
                <div className="flex justify-center mb-6">
                  <div className="h-20 w-20 rounded-full bg-gradient-to-r from-brand-purple to-brand-pink flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <svg className="h-10 w-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                      ></path>
                    </svg>
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-brand-dark mb-4 text-center group-hover:text-brand-purple transition-colors duration-300">
                  Online Contests
                </h3>
                <p className="text-gray-600 text-center mb-6">
                  Let your fans compete for prizes while creating authentic content about your brand
                </p>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="h-6 w-6 rounded-full bg-brand-purple/10 flex items-center justify-center flex-shrink-0">
                      <span className="text-brand-purple text-sm">✓</span>
                    </div>
                    <span className="text-gray-700">Engage existing customers</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="h-6 w-6 rounded-full bg-brand-purple/10 flex items-center justify-center flex-shrink-0">
                      <span className="text-brand-purple text-sm">✓</span>
                    </div>
                    <span className="text-gray-700">Build brand loyalty</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="h-6 w-6 rounded-full bg-brand-purple/10 flex items-center justify-center flex-shrink-0">
                      <span className="text-brand-purple text-sm">✓</span>
                    </div>
                    <span className="text-gray-700">Generate user testimonials</span>
                  </div>
                </div>
                <div className="mt-6 p-4 bg-brand-purple/5 rounded-lg border border-brand-purple/20">
                  <p className="text-sm text-brand-purple font-semibold">
                    💡 Perfect for product launches & seasonal campaigns
                  </p>
                </div>
              </div>
            </div>

            {/* Marketing Campaigns */}
            <div className="bg-gradient-to-br from-white to-brand-pink/5 rounded-2xl p-8 shadow-xl border border-gray-100 group hover:-translate-y-2 transition-all duration-300 relative overflow-hidden transform scale-105 border-brand-pink">
              {/* <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-brand-pink to-brand-purple text-white px-4 py-1 rounded-full text-sm font-bold">
                MOST POPULAR
              </div> */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-radial from-brand-pink/20 to-transparent"></div>
              <div className="relative z-10 pt-4">
                <div className="flex justify-center mb-6">
                  <div className="h-20 w-20 rounded-full bg-gradient-to-r from-brand-pink to-brand-purple flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <svg className="h-10 w-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z"
                      ></path>
                    </svg>
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-brand-dark mb-4 text-center group-hover:text-brand-pink transition-colors duration-300">
                  Marketing Campaigns
                </h3>
                <p className="text-gray-600 text-center mb-6">
                  We connect you with authentic content creators who deliver quality content
                </p>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="h-6 w-6 rounded-full bg-brand-pink/10 flex items-center justify-center flex-shrink-0">
                      <span className="text-brand-pink text-sm">✓</span>
                    </div>
                    <span className="text-gray-700">Awesome content creation</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="h-6 w-6 rounded-full bg-brand-pink/10 flex items-center justify-center flex-shrink-0">
                      <span className="text-brand-pink text-sm">✓</span>
                    </div>
                    <span className="text-gray-700">Targeted audience reach</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="h-6 w-6 rounded-full bg-brand-pink/10 flex items-center justify-center flex-shrink-0">
                      <span className="text-brand-pink text-sm">✓</span>
                    </div>
                    <span className="text-gray-700">Pay after content delivery</span>
                  </div>
                </div>
                <div className="mt-6 p-4 bg-brand-pink/5 rounded-lg border border-brand-pink/20">
                  <p className="text-sm text-brand-pink font-semibold">
                    🎯 Ideal for brand awareness & lead generation
                  </p>
                </div>
              </div>
            </div>

            {/* Viral Campaigns */}
            <div className="bg-gradient-to-br from-white to-brand-teal/5 rounded-2xl p-8 shadow-xl border border-gray-100 group hover:-translate-y-2 transition-all duration-300 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-radial from-brand-teal/20 to-transparent"></div>
              <div className="relative z-10">
                <div className="flex justify-center mb-6">
                  <div className="h-20 w-20 rounded-full bg-gradient-to-r from-brand-teal to-brand-blue flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <svg className="h-10 w-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M13 10V3L4 14h7v7l9-11h-7z"
                      ></path>
                    </svg>
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-brand-dark mb-4 text-center group-hover:text-brand-teal transition-colors duration-300">
                  Make product go viral
                </h3>
                <p className="text-gray-600 text-center mb-6">
                  Work with many content creators at once in a single quest across TikTok, X, and Instagram
                </p>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="h-6 w-6 rounded-full bg-brand-teal/10 flex items-center justify-center flex-shrink-0">
                      <span className="text-brand-teal text-sm">✓</span>
                    </div>
                    <span className="text-gray-700">Multi-platform reach</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="h-6 w-6 rounded-full bg-brand-teal/10 flex items-center justify-center flex-shrink-0">
                      <span className="text-brand-teal text-sm">✓</span>
                    </div>
                    <span className="text-gray-700">Massive creator network</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="h-6 w-6 rounded-full bg-brand-teal/10 flex items-center justify-center flex-shrink-0">
                      <span className="text-brand-teal text-sm">✓</span>
                    </div>
                    <span className="text-gray-700">Coordinated viral push</span>
                  </div>
                </div>
                <div className="mt-6 p-4 bg-brand-teal/5 rounded-lg border border-brand-teal/20">
                  <p className="text-sm text-brand-teal font-semibold">
                    🚀 Best for maximum exposure & viral potential
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Platform Coverage */}
          {/* <div className="mt-16 text-center">
            <h3 className="text-2xl font-bold text-brand-dark mb-6">Available across all social media platforms</h3>
            <div className="flex justify-center items-center gap-8 flex-wrap">
              <div className="flex items-center gap-3 rounded-lg p-4 border border-gray-100">
                <div className="h-10 w-10 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-sm">
                      <svg className="transition-all duration-300 group-hover:scale-110" width="28" height="28" viewBox="0 0 72 72" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path fill-rule="evenodd" clip-rule="evenodd" d="M45.6721 29.4285C48.7387 31.6085 52.4112 32.7733 56.1737 32.7592V25.3024C55.434 25.3045 54.6963 25.2253 53.9739 25.0663V31.0068C50.203 31.0135 46.5252 29.8354 43.4599 27.6389V42.9749C43.4507 45.4914 42.7606 47.9585 41.4628 50.1146C40.165 52.2706 38.3079 54.0353 36.0885 55.2215C33.8691 56.4076 31.37 56.9711 28.8563 56.852C26.3426 56.733 23.9079 55.9359 21.8105 54.5453C23.7506 56.5082 26.2295 57.8513 28.9333 58.4044C31.6372 58.9576 34.4444 58.6959 36.9994 57.6526C39.5545 56.6093 41.7425 54.8312 43.2864 52.5436C44.8302 50.256 45.6605 47.5616 45.6721 44.8018V29.4285ZM48.3938 21.8226C46.8343 20.1323 45.8775 17.9739 45.6721 15.6832V14.7139H43.5842C43.8423 16.1699 44.4039 17.5553 45.2326 18.78C46.0612 20.0048 47.1383 21.0414 48.3938 21.8226ZM26.645 48.642C25.9213 47.6957 25.4779 46.5653 25.365 45.3793C25.2522 44.1934 25.4746 42.9996 26.0068 41.9338C26.5391 40.8681 27.3598 39.9731 28.3757 39.3508C29.3915 38.7285 30.5616 38.4039 31.7529 38.4139C32.4106 38.4137 33.0644 38.5143 33.6916 38.7121V31.0068C32.9584 30.9097 32.2189 30.8682 31.4794 30.8826V36.8728C29.9522 36.39 28.2992 36.4998 26.8492 37.1803C25.3992 37.8608 24.2585 39.0621 23.6539 40.5454C23.0494 42.0286 23.0252 43.6851 23.5864 45.1853C24.1475 46.6855 25.2527 47.9196 26.6823 48.642H26.645Z" fill="#EE1D52"/>
                      <path fill-rule="evenodd" clip-rule="evenodd" d="M43.4589 27.5892C46.5241 29.7857 50.2019 30.9638 53.9729 30.9571V25.0166C51.8243 24.5623 49.8726 23.4452 48.3927 21.8226C47.1372 21.0414 46.0601 20.0048 45.2315 18.78C44.4029 17.5553 43.8412 16.1699 43.5831 14.7139H38.09V44.8018C38.0849 46.1336 37.6629 47.4304 36.8831 48.51C36.1034 49.5897 35.0051 50.3981 33.7425 50.8217C32.4798 51.2453 31.1162 51.2629 29.8431 50.872C28.57 50.4811 27.4512 49.7012 26.6439 48.642C25.3645 47.9965 24.3399 46.9387 23.7354 45.6394C23.1309 44.3401 22.9818 42.875 23.3121 41.4805C23.6424 40.0861 24.4329 38.8435 25.556 37.9535C26.6791 37.0634 28.0693 36.5776 29.5023 36.5745C30.1599 36.5766 30.8134 36.6772 31.4411 36.8728V30.8826C28.7288 30.9477 26.0946 31.8033 23.8617 33.3444C21.6289 34.8855 19.8946 37.0451 18.8717 39.5579C17.8489 42.0708 17.5821 44.8276 18.1039 47.49C18.6258 50.1524 19.9137 52.6045 21.8095 54.5453C23.9073 55.9459 26.3458 56.7512 28.8651 56.8755C31.3845 56.9997 33.8904 56.4383 36.1158 55.2509C38.3413 54.0636 40.2031 52.2948 41.5027 50.133C42.8024 47.9712 43.4913 45.4973 43.4962 42.9749L43.4589 27.5892Z" fill="black"/>
                      <path fill-rule="evenodd" clip-rule="evenodd" d="M53.9736 25.0161V23.4129C52.0005 23.4213 50.0655 22.8696 48.3934 21.8221C49.8695 23.4493 51.8229 24.5674 53.9736 25.0161ZM43.5838 14.7134C43.5838 14.4275 43.4968 14.1292 43.4596 13.8434V12.874H35.8785V42.9744C35.872 44.6598 35.197 46.2738 34.0017 47.4621C32.8064 48.6504 31.1885 49.3159 29.503 49.3126C28.5106 49.3176 27.5311 49.0876 26.6446 48.6415C27.4519 49.7007 28.5707 50.4805 29.8438 50.8715C31.1169 51.2624 32.4805 51.2448 33.7432 50.8212C35.0058 50.3976 36.1041 49.5892 36.8838 48.5095C37.6636 47.4298 38.0856 46.1331 38.0907 44.8013V14.7134H43.5838ZM31.4418 30.8696V29.167C28.3222 28.7432 25.1511 29.3885 22.4453 30.9977C19.7394 32.6069 17.6584 35.0851 16.5413 38.0284C15.4242 40.9718 15.337 44.2067 16.2938 47.206C17.2506 50.2053 19.195 52.792 21.8102 54.5448C19.9287 52.5995 18.6545 50.1484 18.1433 47.4908C17.6321 44.8333 17.906 42.0844 18.9315 39.5799C19.957 37.0755 21.6897 34.924 23.918 33.3882C26.1463 31.8524 28.7736 30.9988 31.4791 30.9318L31.4418 30.8696Z" fill="#69C9D0"/>
                      </svg>
                  </span>
                </div>
                <span className="font-semibold text-gray-700">TikTok</span>
              </div>
              <div className="flex items-center gap-3 rounded-lg p-4 border border-gray-100">
                <div className="h-10 w-10 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-sm">
                    <svg className="transition-all duration-300 group-hover:scale-110" xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 72 72" fill="none">
                      <path d="M40.7568 32.1716L59.3704 11H54.9596L38.7974 29.383L25.8887 11H11L30.5205 38.7983L11 61H15.4111L32.4788 41.5869L46.1113 61H61L40.7557 32.1716H40.7568ZM34.7152 39.0433L32.7374 36.2752L17.0005 14.2492H23.7756L36.4755 32.0249L38.4533 34.7929L54.9617 57.8986H48.1865L34.7152 39.0443V39.0433Z" fill="black"/>
                    </svg>
                  </span>
                </div>
                <span className="font-semibold text-gray-700">X (Twitter)</span>
              </div>
              <div className="flex items-center gap-3  rounded-lg p-4  border border-gray-100">
                <div className="h-10 w-10 rounded-full  flex items-center justify-center">
                  <span className="text-white font-bold text-sm">
                    <svg className="transition-all duration-300 group-hover:scale-110" width="28" height="28" viewBox="0 0 72 72" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M27.4456 35.7808C27.4456 31.1786 31.1776 27.4468 35.7826 27.4468C40.3875 27.4468 44.1216 31.1786 44.1216 35.7808C44.1216 40.383 40.3875 44.1148 35.7826 44.1148C31.1776 44.1148 27.4456 40.383 27.4456 35.7808ZM22.9377 35.7808C22.9377 42.8708 28.6883 48.618 35.7826 48.618C42.8768 48.618 48.6275 42.8708 48.6275 35.7808C48.6275 28.6908 42.8768 22.9436 35.7826 22.9436C28.6883 22.9436 22.9377 28.6908 22.9377 35.7808ZM46.1342 22.4346C46.1339 23.0279 46.3098 23.608 46.6394 24.1015C46.9691 24.595 47.4377 24.9797 47.9861 25.2069C48.5346 25.4342 49.1381 25.4939 49.7204 25.3784C50.3028 25.2628 50.8378 24.9773 51.2577 24.5579C51.6777 24.1385 51.9638 23.6041 52.0799 23.0222C52.1959 22.4403 52.1367 21.8371 51.9097 21.2888C51.6828 20.7406 51.2982 20.2719 50.8047 19.942C50.3112 19.6122 49.7309 19.436 49.1372 19.4358H49.136C48.3402 19.4361 47.5771 19.7522 47.0142 20.3144C46.4514 20.8767 46.1349 21.6392 46.1342 22.4346ZM25.6765 56.1302C23.2377 56.0192 21.9121 55.6132 21.0311 55.2702C19.8632 54.8158 19.0299 54.2746 18.1538 53.4002C17.2777 52.5258 16.7354 51.6938 16.2827 50.5266C15.9393 49.6466 15.533 48.3214 15.4222 45.884C15.3009 43.2488 15.2767 42.4572 15.2767 35.781C15.2767 29.1048 15.3029 28.3154 15.4222 25.678C15.5332 23.2406 15.9425 21.918 16.2827 21.0354C16.7374 19.8682 17.2789 19.0354 18.1538 18.1598C19.0287 17.2842 19.8612 16.7422 21.0311 16.2898C21.9117 15.9466 23.2377 15.5406 25.6765 15.4298C28.3133 15.3086 29.1054 15.2844 35.7826 15.2844C42.4598 15.2844 43.2527 15.3106 45.8916 15.4298C48.3305 15.5408 49.6539 15.9498 50.537 16.2898C51.7049 16.7422 52.5382 17.2854 53.4144 18.1598C54.2905 19.0342 54.8308 19.8682 55.2855 21.0354C55.6289 21.9154 56.0351 23.2406 56.146 25.678C56.2673 28.3154 56.2915 29.1048 56.2915 35.781C56.2915 42.4572 56.2673 43.2466 56.146 45.884C56.0349 48.3214 55.6267 49.6462 55.2855 50.5266C54.8308 51.6938 54.2893 52.5266 53.4144 53.4002C52.5394 54.2738 51.7049 54.8158 50.537 55.2702C49.6565 55.6134 48.3305 56.0194 45.8916 56.1302C43.2549 56.2514 42.4628 56.2756 35.7826 56.2756C29.1024 56.2756 28.3125 56.2514 25.6765 56.1302ZM25.4694 10.9322C22.8064 11.0534 20.9867 11.4754 19.3976 12.0934C17.7518 12.7316 16.3585 13.5878 14.9663 14.977C13.5741 16.3662 12.7195 17.7608 12.081 19.4056C11.4626 20.9948 11.0403 22.8124 10.9191 25.4738C10.7958 28.1394 10.7676 28.9916 10.7676 35.7808C10.7676 42.57 10.7958 43.4222 10.9191 46.0878C11.0403 48.7494 11.4626 50.5668 12.081 52.156C12.7195 53.7998 13.5743 55.196 14.9663 56.5846C16.3583 57.9732 17.7518 58.8282 19.3976 59.4682C20.9897 60.0862 22.8064 60.5082 25.4694 60.6294C28.138 60.7506 28.9893 60.7808 35.7826 60.7808C42.5759 60.7808 43.4286 60.7526 46.0958 60.6294C48.759 60.5082 50.5774 60.0862 52.1676 59.4682C53.8124 58.8282 55.2066 57.9738 56.5989 56.5846C57.9911 55.1954 58.8438 53.7998 59.4842 52.156C60.1026 50.5668 60.5268 48.7492 60.6461 46.0878C60.7674 43.4202 60.7956 42.57 60.7956 35.7808C60.7956 28.9916 60.7674 28.1394 60.6461 25.4738C60.5248 22.8122 60.1026 20.9938 59.4842 19.4056C58.8438 17.7618 57.9889 16.3684 56.5989 14.977C55.2088 13.5856 53.8124 12.7316 52.1696 12.0934C50.5775 11.4754 48.7588 11.0514 46.0978 10.9322C43.4306 10.811 42.5779 10.7808 35.7846 10.7808C28.9913 10.7808 28.138 10.809 25.4694 10.9322Z" fill="url(#paint0_radial_7092_54471)"/>
                      <path d="M27.4456 35.7808C27.4456 31.1786 31.1776 27.4468 35.7826 27.4468C40.3875 27.4468 44.1216 31.1786 44.1216 35.7808C44.1216 40.383 40.3875 44.1148 35.7826 44.1148C31.1776 44.1148 27.4456 40.383 27.4456 35.7808ZM22.9377 35.7808C22.9377 42.8708 28.6883 48.618 35.7826 48.618C42.8768 48.618 48.6275 42.8708 48.6275 35.7808C48.6275 28.6908 42.8768 22.9436 35.7826 22.9436C28.6883 22.9436 22.9377 28.6908 22.9377 35.7808ZM46.1342 22.4346C46.1339 23.0279 46.3098 23.608 46.6394 24.1015C46.9691 24.595 47.4377 24.9797 47.9861 25.2069C48.5346 25.4342 49.1381 25.4939 49.7204 25.3784C50.3028 25.2628 50.8378 24.9773 51.2577 24.5579C51.6777 24.1385 51.9638 23.6041 52.0799 23.0222C52.1959 22.4403 52.1367 21.8371 51.9097 21.2888C51.6828 20.7406 51.2982 20.2719 50.8047 19.942C50.3112 19.6122 49.7309 19.436 49.1372 19.4358H49.136C48.3402 19.4361 47.5771 19.7522 47.0142 20.3144C46.4514 20.8767 46.1349 21.6392 46.1342 22.4346ZM25.6765 56.1302C23.2377 56.0192 21.9121 55.6132 21.0311 55.2702C19.8632 54.8158 19.0299 54.2746 18.1538 53.4002C17.2777 52.5258 16.7354 51.6938 16.2827 50.5266C15.9393 49.6466 15.533 48.3214 15.4222 45.884C15.3009 43.2488 15.2767 42.4572 15.2767 35.781C15.2767 29.1048 15.3029 28.3154 15.4222 25.678C15.5332 23.2406 15.9425 21.918 16.2827 21.0354C16.7374 19.8682 17.2789 19.0354 18.1538 18.1598C19.0287 17.2842 19.8612 16.7422 21.0311 16.2898C21.9117 15.9466 23.2377 15.5406 25.6765 15.4298C28.3133 15.3086 29.1054 15.2844 35.7826 15.2844C42.4598 15.2844 43.2527 15.3106 45.8916 15.4298C48.3305 15.5408 49.6539 15.9498 50.537 16.2898C51.7049 16.7422 52.5382 17.2854 53.4144 18.1598C54.2905 19.0342 54.8308 19.8682 55.2855 21.0354C55.6289 21.9154 56.0351 23.2406 56.146 25.678C56.2673 28.3154 56.2915 29.1048 56.2915 35.781C56.2915 42.4572 56.2673 43.2466 56.146 45.884C56.0349 48.3214 55.6267 49.6462 55.2855 50.5266C54.8308 51.6938 54.2893 52.5266 53.4144 53.4002C52.5394 54.2738 51.7049 54.8158 50.537 55.2702C49.6565 55.6134 48.3305 56.0194 45.8916 56.1302C43.2549 56.2514 42.4628 56.2756 35.7826 56.2756C29.1024 56.2756 28.3125 56.2514 25.6765 56.1302ZM25.4694 10.9322C22.8064 11.0534 20.9867 11.4754 19.3976 12.0934C17.7518 12.7316 16.3585 13.5878 14.9663 14.977C13.5741 16.3662 12.7195 17.7608 12.081 19.4056C11.4626 20.9948 11.0403 22.8124 10.9191 25.4738C10.7958 28.1394 10.7676 28.9916 10.7676 35.7808C10.7676 42.57 10.7958 43.4222 10.9191 46.0878C11.0403 48.7494 11.4626 50.5668 12.081 52.156C12.7195 53.7998 13.5743 55.196 14.9663 56.5846C16.3583 57.9732 17.7518 58.8282 19.3976 59.4682C20.9897 60.0862 22.8064 60.5082 25.4694 60.6294C28.138 60.7506 28.9893 60.7808 35.7826 60.7808C42.5759 60.7808 43.4286 60.7526 46.0958 60.6294C48.759 60.5082 50.5774 60.0862 52.1676 59.4682C53.8124 58.8282 55.2066 57.9738 56.5989 56.5846C57.9911 55.1954 58.8438 53.7998 59.4842 52.156C60.1026 50.5668 60.5268 48.7492 60.6461 46.0878C60.7674 43.4202 60.7956 42.57 60.7956 35.7808C60.7956 28.9916 60.7674 28.1394 60.6461 25.4738C60.5248 22.8122 60.1026 20.9938 59.4842 19.4056C58.8438 17.7618 57.9889 16.3684 56.5989 14.977C55.2088 13.5856 53.8124 12.7316 52.1696 12.0934C50.5775 11.4754 48.7588 11.0514 46.0978 10.9322C43.4306 10.811 42.5779 10.7808 35.7846 10.7808C28.9913 10.7808 28.138 10.809 25.4694 10.9322Z" fill="url(#paint1_radial_7092_54471)"/>
                      <defs>
                      <radialGradient id="paint0_radial_7092_54471" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(17.4144 61.017) scale(65.31 65.2708)">
                      <stop offset="0.09" stop-color="#FA8F21"/>
                      <stop offset="0.78" stop-color="#D82D7E"/>
                      </radialGradient>
                      <radialGradient id="paint1_radial_7092_54471" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(41.1086 63.257) scale(51.4733 51.4424)">
                      <stop offset="0.64" stop-color="#8C3AAA" stop-opacity="0"/>
                      <stop offset="1" stop-color="#8C3AAA"/>
                      </radialGradient>
                      </defs>
                      </svg>
                  </span>
                </div>
                <span className="font-semibold text-gray-700">Instagram</span>
              </div>
            </div>
          </div> */}
        </section>

                {/* Social Media Dominance Section */}
        <section className="mb-24">
          <div className="bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 rounded-3xl p-12 shadow-2xl text-white relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-pink-600/20 opacity-50"></div>
            <div className="absolute top-10 right-10 w-32 h-32 bg-white/10 rounded-full blur-2xl animate-pulse"></div>
            <div
              className="absolute bottom-10 left-10 w-40 h-40 bg-white/5 rounded-full blur-3xl animate-pulse"
              style={{ animationDelay: "1s" }}
            ></div>

            <div className="relative z-10">
              <div className="text-center mb-16">
                <div className="inline-block mb-6">
                  <h2 className="text-4xl md:text-6xl font-bold mb-4">
                    Social media is the{" "}
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 via-pink-400 to-cyan-400">
                      new marketplace
                    </span>
                  </h2>
                  <p className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto">
                    Your customers aren't watching TV anymore. They're scrolling, watching, and buying on social media.
                  </p>
                </div>
              </div>

              {/* Mind-Blowing Stats Grid */}
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 text-center border border-white/20 group hover:bg-white/20 transition-all duration-300 hover:-translate-y-2">
                  <div className="text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-orange-500">
                    3.2hrs
                  </div>
                  <div className="text-lg font-semibold mb-2">Daily video consumption</div>
                  <div className="text-sm text-gray-300">Average user watches 3+ hours of video content daily</div>
                </div>

                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 text-center border border-white/20 group hover:bg-white/20 transition-all duration-300 hover:-translate-y-2">
                  <div className="text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-pink-400 to-red-500">
                    1.7B
                  </div>
                  <div className="text-lg font-semibold mb-2">TikTok users</div>
                  <div className="text-sm text-gray-300">Most engaged social media platform globally</div>
                </div>

                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 text-center border border-white/20 group hover:bg-white/20 transition-all duration-300 hover:-translate-y-2">
                  <div className="text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500">
                    95%
                  </div>
                  <div className="text-lg font-semibold mb-2">Trust user content</div>
                  <div className="text-sm text-gray-300">Consumers trust user-generated content over brand ads</div>
                </div>

                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 text-center border border-white/20 group hover:bg-white/20 transition-all duration-300 hover:-translate-y-2">
                  <div className="text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-emerald-500">
                    84%
                  </div>
                  <div className="text-lg font-semibold mb-2">Purchase decisions</div>
                  <div className="text-sm text-gray-300">Made after watching social media content</div>
                </div>
              </div>

              {/* Platform Breakdown */}
              <div className="grid md:grid-cols-3 gap-8 mb-16">
                <div className="bg-gradient-to-br from-black/50 to-gray-900/50 rounded-2xl p-8 border border-white/10">
                  <div className="flex items-center mb-6">
                    <div className="h-16 w-16 rounded-fu flex items-center justify-center mr-4">
                      <span className=" font-bold text-xl">
                        <button className="group transition-all duration-500 hover:-translate-y-2">
                        <svg width="48" height="48" viewBox="0 0 92 92" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect x="0.138672" width="91.5618" height="91.5618" rx="15" fill="black"/>
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M55.6721 39.4285C58.7387 41.6085 62.4112 42.7733 66.1737 42.7592V35.3024C65.434 35.3045 64.6963 35.2253 63.9739 35.0663V41.0068C60.203 41.0135 56.5252 39.8354 53.4599 37.6389V52.9749C53.4507 55.4914 52.7606 57.9585 51.4628 60.1146C50.165 62.2706 48.3079 64.0353 46.0885 65.2215C43.8691 66.4076 41.37 66.9711 38.8563 66.852C36.3426 66.733 33.9079 65.9359 31.8105 64.5453C33.7506 66.5082 36.2295 67.8513 38.9333 68.4044C41.6372 68.9576 44.4444 68.6959 46.9994 67.6526C49.5545 66.6093 51.7425 64.8312 53.2864 62.5436C54.8302 60.256 55.6605 57.5616 55.6721 54.8018V39.4285ZM58.3938 31.8226C56.8343 30.1323 55.8775 27.9739 55.6721 25.6832V24.7139H53.5842C53.8423 26.1699 54.4039 27.5553 55.2326 28.78C56.0612 30.0048 57.1383 31.0414 58.3938 31.8226ZM36.645 58.642C35.9213 57.6957 35.4779 56.5653 35.365 55.3793C35.2522 54.1934 35.4746 52.9996 36.0068 51.9338C36.5391 50.8681 37.3598 49.9731 38.3757 49.3508C39.3915 48.7285 40.5616 48.4039 41.7529 48.4139C42.4106 48.4137 43.0644 48.5143 43.6916 48.7121V41.0068C42.9584 40.9097 42.2189 40.8682 41.4794 40.8826V46.8728C39.9522 46.39 38.2992 46.4998 36.8492 47.1803C35.3992 47.8608 34.2585 49.0621 33.6539 50.5454C33.0494 52.0286 33.0252 53.6851 33.5864 55.1853C34.1475 56.6855 35.2527 57.9196 36.6823 58.642H36.645Z" fill="#EE1D52"/>
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M53.4589 37.5892C56.5241 39.7857 60.2019 40.9638 63.9729 40.9571V35.0166C61.8243 34.5623 59.8726 33.4452 58.3927 31.8226C57.1372 31.0414 56.0601 30.0048 55.2315 28.78C54.4029 27.5553 53.8412 26.1699 53.5831 24.7139H48.09V54.8018C48.0849 56.1336 47.6629 57.4304 46.8831 58.51C46.1034 59.5897 45.0051 60.3981 43.7425 60.8217C42.4798 61.2453 41.1162 61.2629 39.8431 60.872C38.57 60.4811 37.4512 59.7012 36.6439 58.642C35.3645 57.9965 34.3399 56.9387 33.7354 55.6394C33.1309 54.3401 32.9818 52.875 33.3121 51.4805C33.6424 50.0861 34.4329 48.8435 35.556 47.9535C36.6791 47.0634 38.0693 46.5776 39.5023 46.5745C40.1599 46.5766 40.8134 46.6772 41.4411 46.8728V40.8826C38.7288 40.9477 36.0946 41.8033 33.8617 43.3444C31.6289 44.8855 29.8946 47.0451 28.8717 49.5579C27.8489 52.0708 27.5821 54.8276 28.1039 57.49C28.6258 60.1524 29.9137 62.6045 31.8095 64.5453C33.9073 65.9459 36.3458 66.7512 38.8651 66.8755C41.3845 66.9997 43.8904 66.4383 46.1158 65.2509C48.3413 64.0636 50.2031 62.2948 51.5027 60.133C52.8024 57.9712 53.4913 55.4973 53.4962 52.9749L53.4589 37.5892Z" fill="white"/>
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M63.9736 35.0161V33.4129C62.0005 33.4213 60.0655 32.8696 58.3934 31.8221C59.8695 33.4493 61.8229 34.5674 63.9736 35.0161ZM53.5838 24.7134C53.5838 24.4275 53.4968 24.1292 53.4596 23.8434V22.874H45.8785V52.9744C45.872 54.6598 45.197 56.2738 44.0017 57.4621C42.8064 58.6504 41.1885 59.3159 39.503 59.3126C38.5106 59.3176 37.5311 59.0876 36.6446 58.6415C37.4519 59.7007 38.5707 60.4805 39.8438 60.8715C41.1169 61.2624 42.4805 61.2448 43.7432 60.8212C45.0058 60.3976 46.1041 59.5892 46.8838 58.5095C47.6636 57.4298 48.0856 56.1331 48.0907 54.8013V24.7134H53.5838ZM41.4418 40.8696V39.167C38.3222 38.7432 35.1511 39.3885 32.4453 40.9977C29.7394 42.6069 27.6584 45.0851 26.5413 48.0284C25.4242 50.9718 25.337 54.2067 26.2938 57.206C27.2506 60.2053 29.195 62.792 31.8102 64.5448C29.9287 62.5995 28.6545 60.1484 28.1433 57.4908C27.6321 54.8333 27.906 52.0844 28.9315 49.5799C29.957 47.0755 31.6897 44.924 33.918 43.3882C36.1463 41.8524 38.7736 40.9988 41.4791 40.9318L41.4418 40.8696Z" fill="#69C9D0"/>
                        </svg>
                        </button> 
                      </span>
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold">TikTok</h3>
                      <p className="text-gray-300">The viral engine</p>
                    </div>
                  </div>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-300">Daily active users:</span>
                      <span className="font-semibold text-white">1.7B+</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-300">Avg. session time:</span>
                      <span className="font-semibold text-white">95 minutes</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-300">Video views/day:</span>
                      <span className="font-semibold text-white">1B+ hours</span>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-purple-900/50 to-pink-900/50 rounded-2xl p-8 border border-white/10">
                  <div className="flex items-center mb-6">
                    <div className="h-16 w-16 rounded-full flex items-center justify-center mr-4">
                      <span className="text-white font-bold text-xl">
                        <button className="group transition-all duration-500 hover:-translate-y-2">
                        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 93 92" fill="none">
                        <rect x="1.13867" width="91.5618" height="91.5618" rx="15" fill="url(#paint0_linear_7092_54439)"/>
                        <path d="M38.3762 45.7808C38.3762 41.1786 42.1083 37.4468 46.7132 37.4468C51.3182 37.4468 55.0522 41.1786 55.0522 45.7808C55.0522 50.383 51.3182 54.1148 46.7132 54.1148C42.1083 54.1148 38.3762 50.383 38.3762 45.7808ZM33.8683 45.7808C33.8683 52.8708 39.619 58.618 46.7132 58.618C53.8075 58.618 59.5581 52.8708 59.5581 45.7808C59.5581 38.6908 53.8075 32.9436 46.7132 32.9436C39.619 32.9436 33.8683 38.6908 33.8683 45.7808ZM57.0648 32.4346C57.0646 33.0279 57.2404 33.608 57.5701 34.1015C57.8997 34.595 58.3684 34.9797 58.9168 35.2069C59.4652 35.4342 60.0688 35.4939 60.6511 35.3784C61.2334 35.2628 61.7684 34.9773 62.1884 34.5579C62.6084 34.1385 62.8945 33.6041 63.0105 33.0222C63.1266 32.4403 63.0674 31.8371 62.8404 31.2888C62.6134 30.7406 62.2289 30.2719 61.7354 29.942C61.2418 29.6122 60.6615 29.436 60.0679 29.4358H60.0667C59.2708 29.4361 58.5077 29.7522 57.9449 30.3144C57.3821 30.8767 57.0655 31.6392 57.0648 32.4346ZM36.6072 66.1302C34.1683 66.0192 32.8427 65.6132 31.9618 65.2702C30.7939 64.8158 29.9606 64.2746 29.0845 63.4002C28.2083 62.5258 27.666 61.6938 27.2133 60.5266C26.8699 59.6466 26.4637 58.3214 26.3528 55.884C26.2316 53.2488 26.2073 52.4572 26.2073 45.781C26.2073 39.1048 26.2336 38.3154 26.3528 35.678C26.4639 33.2406 26.8731 31.918 27.2133 31.0354C27.668 29.8682 28.2095 29.0354 29.0845 28.1598C29.9594 27.2842 30.7919 26.7422 31.9618 26.2898C32.8423 25.9466 34.1683 25.5406 36.6072 25.4298C39.244 25.3086 40.036 25.2844 46.7132 25.2844C53.3904 25.2844 54.1833 25.3106 56.8223 25.4298C59.2612 25.5408 60.5846 25.9498 61.4677 26.2898C62.6356 26.7422 63.4689 27.2854 64.345 28.1598C65.2211 29.0342 65.7615 29.8682 66.2161 31.0354C66.5595 31.9154 66.9658 33.2406 67.0767 35.678C67.1979 38.3154 67.2221 39.1048 67.2221 45.781C67.2221 52.4572 67.1979 53.2466 67.0767 55.884C66.9656 58.3214 66.5573 59.6462 66.2161 60.5266C65.7615 61.6938 65.2199 62.5266 64.345 63.4002C63.4701 64.2738 62.6356 64.8158 61.4677 65.2702C60.5872 65.6134 59.2612 66.0194 56.8223 66.1302C54.1855 66.2514 53.3934 66.2756 46.7132 66.2756C40.033 66.2756 39.2432 66.2514 36.6072 66.1302ZM36.4001 20.9322C33.7371 21.0534 31.9174 21.4754 30.3282 22.0934C28.6824 22.7316 27.2892 23.5878 25.897 24.977C24.5047 26.3662 23.6502 27.7608 23.0116 29.4056C22.3933 30.9948 21.971 32.8124 21.8497 35.4738C21.7265 38.1394 21.6982 38.9916 21.6982 45.7808C21.6982 52.57 21.7265 53.4222 21.8497 56.0878C21.971 58.7494 22.3933 60.5668 23.0116 62.156C23.6502 63.7998 24.5049 65.196 25.897 66.5846C27.289 67.9732 28.6824 68.8282 30.3282 69.4682C31.9204 70.0862 33.7371 70.5082 36.4001 70.6294C39.0687 70.7506 39.92 70.7808 46.7132 70.7808C53.5065 70.7808 54.3592 70.7526 57.0264 70.6294C59.6896 70.5082 61.5081 70.0862 63.0983 69.4682C64.7431 68.8282 66.1373 67.9738 67.5295 66.5846C68.9218 65.1954 69.7745 63.7998 70.4149 62.156C71.0332 60.5668 71.4575 58.7492 71.5768 56.0878C71.698 53.4202 71.7262 52.57 71.7262 45.7808C71.7262 38.9916 71.698 38.1394 71.5768 35.4738C71.4555 32.8122 71.0332 30.9938 70.4149 29.4056C69.7745 27.7618 68.9196 26.3684 67.5295 24.977C66.1395 23.5856 64.7431 22.7316 63.1003 22.0934C61.5081 21.4754 59.6894 21.0514 57.0284 20.9322C54.3612 20.811 53.5085 20.7808 46.7152 20.7808C39.922 20.7808 39.0687 20.809 36.4001 20.9322Z" fill="white"/>
                        <defs>
                          <linearGradient id="paint0_linear_7092_54439" x1="90.9407" y1="91.5618" x2="-0.621143" y2="-2.46459e-06" gradientUnits="userSpaceOnUse">
                            <stop stop-color="#FBE18A"/>
                            <stop offset="0.21" stop-color="#FCBB45"/>
                            <stop offset="0.38" stop-color="#F75274"/>
                            <stop offset="0.52" stop-color="#D53692"/>
                            <stop offset="0.74" stop-color="#8F39CE"/>
                            <stop offset="1" stop-color="#5B4FE9"/>
                          </linearGradient>
                        </defs>
                        </svg>
                        </button>
                      </span>
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold">Instagram</h3>
                      <p className="text-gray-300">Visual Storytelling</p>
                    </div>
                  </div>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-300">Monthly users:</span>
                      <span className="font-semibold text-white">2.4B+</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-300">Stories Views/Day:</span>
                      <span className="font-semibold text-white">500M+</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-300">Shopping users:</span>
                      <span className="font-semibold text-white">130M+</span>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-blue-900/50 to-black/50 rounded-2xl p-8 border border-white/10">
                  <div className="flex items-center mb-6">
                    <div className="h-16 w-16 rounded-full flex items-center justify-center mr-4">
                      <span className="text-white font-bold text-xl">
                        <button className="group transition-all duration-500 hover:-translate-y-2">
                        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 93 92" fill="none">
                        <rect x="0.138672" width="91.5618" height="91.5618" rx="15" fill="black"/>
                        <path d="M50.7568 42.1716L69.3704 21H64.9596L48.7974 39.383L35.8887 21H21L40.5205 48.7983L21 71H25.4111L42.4788 51.5869L56.1113 71H71L50.7557 42.1716H50.7568ZM44.7152 49.0433L42.7374 46.2752L27.0005 24.2492H33.7756L46.4755 42.0249L48.4533 44.7929L64.9617 67.8986H58.1865L44.7152 49.0443V49.0433Z" fill="white"/>
                        </svg>
                        </button>
                      </span>
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold">X</h3>
                      <p className="text-gray-300">Real-Time Buzz</p>
                    </div>
                  </div>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-300">Daily users:</span>
                      <span className="font-semibold text-white">450M+</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-300">Tweets/Day:</span>
                      <span className="font-semibold text-white">500M+</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-300">Video Views/Day:</span>
                      <span className="font-semibold text-white">2B+</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* The Shift Comparison */}

              {/* Why QuestPanda Method Works */}
              <div className="mt-16 text-center">
                <h3 className="text-3xl md:text-4xl font-bold mb-8">
                  Why our method is{" "}
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-pink-400">
                    unstoppable
                  </span>
                </h3>
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                    <div className="text-4xl mb-4">🎯</div>
                    <h4 className="text-xl font-bold mb-3">Native content</h4>
                    <p className="text-gray-300">
                      Creators make content that feels natural to each platform, not like ads
                    </p>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                    <div className="text-4xl mb-4">🔥</div>
                    <h4 className="text-xl font-bold mb-3">Algorithm friendly</h4>
                    <p className="text-gray-300">User-generated content gets 6.7x more engagement than brand content</p>
                  </div>
                  {/* <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                    <div className="text-4xl mb-4">💰</div>
                    <h4 className="text-xl font-bold mb-3">Cost Effective</h4>
                    <p className="text-gray-300">87% lower cost per engagement compared to traditional advertising</p>
                  </div> */}
                </div>
              </div>

            </div>
          </div>
        </section>


        {/* Floating Call-to-Action */}
        <div className="fixed bottom-8 right-8 z-50 hidden lg:block">
          <div className="bg-gradient-to-r from-brand-purple to-brand-pink rounded-full p-1 shadow-2xl animate-pulse">
            <Button
              asChild
              size="lg"
              className="bg-white text-brand-purple hover:bg-gray-50 rounded-full px-6 py-3 font-bold shadow-lg"
            >
              <Link href="/brand/quests/create">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  ></path>
                </svg>
                Start Now
              </Link>
            </Button>
          </div>
        </div>

        <section className="mb-24">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-gray-100 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-radial from-brand-purple/20 to-transparent"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-radial from-brand-teal/20 to-transparent"></div>

            {/* Decorative circles */}
            <div className="absolute top-12 right-12 h-20 w-20 rounded-full border-4 border-dashed border-brand-yellow/30 animate-spin-slow"></div>
            <div
              className="absolute bottom-12 left-12 h-16 w-16 rounded-full border-4 border-dotted border-brand-purple/30 animate-spin-slow"
              style={{ animationDirection: "reverse", animationDuration: "15s" }}
            ></div>

            <div className="grid md:grid-cols-2 gap-12 items-center relative z-10">
              <div
                className="opacity-0 -translate-x-4 animate-fade-in"
                style={{
                  animationDelay: "0.2s",
                  animationFillMode: "forwards",
                  transform: `translateY(${scrollY * 0.05}px) translateX(0px)`,
                }}
              >
                <h2 className="text-3xl md:text-4xl font-bold mb-6 text-brand-dark">How it works for brands</h2>
                <ul className="space-y-6">
                  <li className="flex gap-4">
                    <span className="flex-shrink-0 h-10 w-10 rounded-full bg-gradient-to-r from-brand-purple to-brand-pink text-white flex items-center justify-center shadow-md">
                      1
                    </span>
                    <div>
                      <h3 className="font-semibold text-xl text-brand-dark">Create a quest</h3>
                      <p className="text-gray-600">
                        Define your campaign objective, i.e Create a video talking about our product
                      </p>
                    </div>
                  </li>

                  <li className="flex gap-4">
                    <span className="flex-shrink-0 h-10 w-10 rounded-full bg-gradient-to-r from-brand-pink to-brand-purple text-white flex items-center justify-center shadow-md">
                      2
                    </span>
                    <div>
                      <h3 className="font-semibold text-xl text-brand-dark">Set the prize pool</h3>
                      <p className="text-gray-600">
                        Define the total amount you shall reward creators for creating and sharing these videos on
                        social media
                      </p>
                    </div>
                  </li>

                  <li className="flex gap-4">
                    <span className="flex-shrink-0 h-10 w-10 rounded-full bg-gradient-to-r from-brand-teal to-brand-blue text-white flex items-center justify-center shadow-md">
                      3
                    </span>
                    <div>
                      <h3 className="font-semibold text-xl text-brand-dark">Review submissions</h3>
                      <p className="text-gray-600">Approve high-quality content that aligns with your brand values</p>
                    </div>
                  </li>
                  <li className="flex gap-4">
                    <span className="flex-shrink-0 h-10 w-10 rounded-full bg-gradient-to-r from-brand-yellow to-brand-coral text-white flex items-center justify-center shadow-md">
                      4
                    </span>
                    <div>
                      <h3 className="font-semibold text-xl text-brand-dark">Reward creators</h3>
                      <p className="text-gray-600">Automatically pay creators for approved submissions</p>
                    </div>
                  </li>
                </ul>
              </div>

              <div
                className="opacity-0 translate-x-4 animate-fade-in bg-gradient-to-br from-white to-brand-light rounded-xl p-8 shadow-lg border border-gray-100"
                style={{
                  animationDelay: "0.4s",
                  animationFillMode: "forwards",
                  transform: `translateY(${scrollY * -0.05}px) translateX(0px)`,
                }}
              >
                <div className="text-center mb-6">
                  <div className="inline-block p-4 bg-brand-purple/10 rounded-full mb-4 relative">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
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
                      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                      <polyline points="3.29 7 12 12 20.71 7"></polyline>
                      <line x1="12" y1="22" x2="12" y2="12"></line>
                    </svg>

                    {/* Animated dots around the icon */}
                    <div
                      className="absolute top-0 left-1/2 h-2 w-2 rounded-full bg-brand-purple/40 animate-ping"
                      style={{ animationDelay: "0s", animationDuration: "3s" }}
                    ></div>
                    <div
                      className="absolute top-1/2 right-0 h-2 w-2 rounded-full bg-brand-pink/40 animate-ping"
                      style={{ animationDelay: "0.5s", animationDuration: "3s" }}
                    ></div>
                    <div
                      className="absolute bottom-0 left-1/2 h-2 w-2 rounded-full bg-brand-teal/40 animate-ping"
                      style={{ animationDelay: "1s", animationDuration: "3s" }}
                    ></div>
                    <div
                      className="absolute top-1/2 left-0 h-2 w-2 rounded-full bg-brand-yellow/40 animate-ping"
                      style={{ animationDelay: "1.5s", animationDuration: "3s" }}
                    ></div>
                  </div>
                  <h3 className="text-3xl font-bold text-brand-dark">12.4M+</h3>
                  <p className="text-gray-600">Total audience reach</p>
                </div>
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div className="bg-white p-4 rounded-lg shadow-md border border-gray-100">
                    <h4 className="text-2xl font-bold text-brand-purple">8.5x</h4>
                    <p className="text-gray-600">Average ROI</p>
                  </div>
                  <div className="bg-white p-4 rounded-lg shadow-md border border-gray-100">
                    <h4 className="text-2xl font-bold text-brand-teal">92%</h4>
                    <p className="text-gray-600">Completion Rate</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>





        {/* Viral Success Section */}
        <section className="mb-24 hidden">
          <div className="bg-gradient-to-r from-brand-purple/10 via-brand-pink/10 to-brand-teal/10 rounded-2xl p-8 shadow-xl border border-gray-100 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-radial from-brand-purple/20 to-transparent opacity-50"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-radial from-brand-teal/20 to-transparent opacity-50"></div>

            <div className="text-center mb-12 relative z-10 hidden">
              <div className="inline-block mb-6">
                <div className="relative">
                  <h2 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-brand-purple via-brand-pink to-brand-teal mb-4">
                    Make Your Product Go VIRAL
                  </h2>
                  <div className="absolute -top-2 -right-2 animate-bounce">
                    <span className="text-2xl">🚀</span>
                  </div>
                </div>
                <p className="text-xl text-gray-700 max-w-3xl mx-auto">
                  Join the brands that have seen their products explode across social media with authentic creator
                  content
                </p>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-8 mb-12 relative z-10">
              <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-gray-100 text-center group hover:-translate-y-2 transition-all duration-300">
                <div className="text-4xl font-bold text-brand-purple mb-2">2.5M+</div>
                <div className="text-gray-600 mb-2">Average Video Views</div>
                <div className="text-sm text-brand-purple font-semibold">Per Quest Campaign</div>
              </div>
              <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-gray-100 text-center group hover:-translate-y-2 transition-all duration-300">
                <div className="text-4xl font-bold text-brand-pink mb-2">847%</div>
                <div className="text-gray-600 mb-2">Engagement Increase</div>
                <div className="text-sm text-brand-pink font-semibold">Compared to Traditional Ads</div>
              </div>
              <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-gray-100 text-center group hover:-translate-y-2 transition-all duration-300">
                <div className="text-4xl font-bold text-brand-teal mb-2">72hrs</div>
                <div className="text-gray-600 mb-2">Average Time to Viral</div>
                <div className="text-sm text-brand-teal font-semibold">From Campaign Launch</div>
              </div>
            </div>

            <div className="text-center relative z-10">
              <div className="bg-gradient-to-r from-brand-yellow/20 to-brand-coral/20 rounded-xl p-6 inline-block">
                <p className="text-lg font-semibold text-brand-dark mb-2">
                  🔥 Last month: 3 products went viral with 10M+ combined views
                </p>
                <p className="text-gray-600">Your product could be next!</p>
              </div>
            </div>
          </div>
        </section>

        {/* Pay After Results Section */}
        {/* <section className="mb-24">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-gray-100">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <div className="flex items-center mb-6">
                  <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center mr-4">
                    <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                      ></path>
                    </svg>
                  </div>
                  <h2 className="text-3xl md:text-4xl font-bold text-brand-dark">Secure Escrow System</h2>
                </div>
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="h-8 w-8 rounded-full bg-brand-purple/10 flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-brand-purple font-bold">1</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg text-brand-dark">Deposit to Escrow</h3>
                      <p className="text-gray-600">
                        When creating a quest, deposit your prize pool to our secure escrow system
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="h-8 w-8 rounded-full bg-brand-pink/10 flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-brand-pink font-bold">2</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg text-brand-dark">Content Creation</h3>
                      <p className="text-gray-600">Creators produce and submit content for your review and approval</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="h-8 w-8 rounded-full bg-brand-teal/10 flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-brand-teal font-bold">3</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg text-brand-dark">Automatic Release</h3>
                      <p className="text-gray-600">
                        Funds are released to creators only after content is posted and approved
                      </p>
                    </div>
                  </div>
                </div>
                <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-center gap-2 mb-2">
                    <svg className="h-5 w-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                      ></path>
                    </svg>
                    <span className="font-semibold text-green-800">100% Secure & Protected</span>
                  </div>
                  <p className="text-green-700 text-sm">
                    Your funds are protected until you're completely satisfied with the results
                  </p>
                </div>
              </div>
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-8 border border-green-200">
                <div className="text-center">
                  <div className="text-6xl mb-4">🔒</div>
                  <h3 className="text-2xl font-bold text-green-800 mb-4">Escrow Protection</h3>
                  <div className="bg-white rounded-lg p-4 shadow-sm mb-4">
                    <div className="text-sm text-gray-600 mb-2">Without Escrow</div>
                    <div className="text-red-600 font-bold text-xl">Pay creators directly</div>
                    <div className="text-red-600 text-sm">Hope they deliver quality</div>
                  </div>
                  <div className="text-2xl font-bold text-green-600 mb-2">VS</div>
                  <div className="bg-gradient-to-r from-green-100 to-emerald-100 rounded-lg p-4 shadow-sm">
                    <div className="text-sm text-gray-600 mb-2">Questpanda Escrow</div>
                    <div className="text-green-600 font-bold text-xl">Funds held securely</div>
                    <div className="text-green-600 text-sm">Released only after approval</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section> */}

        

        {/* Price Comparison Section */}
        {/* <section className="mb-24">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-brand-dark">
              Why Pay More <span className="text-brand-purple">Elsewhere?</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Compare our creator marketing costs with traditional advertising
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-red-50 rounded-xl p-6 border-2 border-red-200 relative">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-4 py-1 rounded-full text-sm font-bold">
                EXPENSIVE
              </div>
              <div className="text-center pt-4">
                <h3 className="text-xl font-bold text-red-800 mb-4">Traditional Ads</h3>
                <div className="text-4xl font-bold text-red-600 mb-2">$15,000+</div>
                <div className="text-red-600 mb-4">Per Campaign</div>
                <ul className="text-left space-y-2 text-red-700">
                  <li>❌ High upfront costs</li>
                  <li>❌ No guarantee of engagement</li>
                  <li>❌ Generic, impersonal content</li>
                  <li>❌ Limited audience trust</li>
                </ul>
              </div>
            </div>

            <div className="bg-yellow-50 rounded-xl p-6 border-2 border-yellow-200 relative">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-yellow-500 text-white px-4 py-1 rounded-full text-sm font-bold">
                RISKY
              </div>
              <div className="text-center pt-4">
                <h3 className="text-xl font-bold text-yellow-800 mb-4">Influencer Agencies</h3>
                <div className="text-4xl font-bold text-yellow-600 mb-2">$8,000+</div>
                <div className="text-yellow-600 mb-4">Per Campaign</div>
                <ul className="text-left space-y-2 text-yellow-700">
                  <li>⚠️ Pay before seeing results</li>
                  <li>⚠️ Limited creator pool</li>
                  <li>⚠️ High agency fees</li>
                  <li>⚠️ Slow campaign setup</li>
                </ul>
              </div>
            </div>


            <div className="bg-gradient-to-br from-brand-purple/10 to-brand-pink/10 rounded-xl p-6 border-2 border-brand-purple relative transform scale-105 shadow-xl">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-brand-purple to-brand-pink text-white px-4 py-1 rounded-full text-sm font-bold">
                BEST VALUE
              </div>
              <div className="text-center pt-4">
                <h3 className="text-xl font-bold text-brand-dark mb-4">QuestPanda</h3>
                <div className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-brand-purple to-brand-pink mb-2">
                  $2,000+
                </div>
                <div className="text-brand-purple mb-4">Per Campaign</div>
                <ul className="text-left space-y-2 text-brand-dark">
                  <li className="flex items-center gap-2">
                    <span className="text-green-500">✅</span> Pay only after results
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-500">✅</span> 3,000+ verified creators
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-500">✅</span> Authentic user content
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-500">✅</span> Launch in 24 hours
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="text-center mt-12">
            <div className="bg-gradient-to-r from-brand-purple/20 to-brand-pink/20 rounded-xl p-6 inline-block">
              <p className="text-2xl font-bold text-brand-dark mb-2">💡 Save up to 85% on marketing costs</p>
              <p className="text-gray-600">While getting 10x better engagement rates</p>
            </div>
          </div>
        </section> */}

        {/* FOMO Section */}
        {/* <section className="mb-24">
          <div className="bg-gradient-to-r from-red-500 to-pink-500 rounded-2xl p-8 shadow-xl text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>

            <div className="text-center relative z-10">
              <div className="text-6xl mb-4">⚡</div>
              <h2 className="text-4xl md:text-5xl font-bold mb-6">Don't Let Your Competitors Win</h2>
              <p className="text-xl mb-8 max-w-3xl mx-auto opacity-90">
                While you're thinking, your competitors are already using creator marketing to dominate social media
              </p>

              <div className="grid md:grid-cols-2 gap-8 mb-8">
                <div className="bg-white/20 backdrop-blur-sm rounded-xl p-6">
                  <div className="text-3xl font-bold mb-2">47%</div>
                  <div className="text-lg">of brands increased creator marketing budget in 2024</div>
                </div>
                <div className="bg-white/20 backdrop-blur-sm rounded-xl p-6">
                  <div className="text-3xl font-bold mb-2">3.2x</div>
                  <div className="text-lg">higher ROI than traditional advertising</div>
                </div>
              </div>

              <div className="bg-white/20 backdrop-blur-sm rounded-xl p-6 mb-8">
                <p className="text-lg font-semibold mb-2">🔥 Limited Time: First 100 brands get</p>
                <p className="text-2xl font-bold">50% OFF their first campaign</p>
                <p className="text-sm opacity-80 mt-2">Only 23 spots remaining this month</p>
              </div>

              <div className="flex flex-wrap justify-center gap-4">
                <Button
                  asChild
                  size="lg"
                  className="bg-white text-red-500 hover:bg-gray-100 shadow-lg text-lg px-8 py-6 h-auto font-bold"
                >
                  <Link href="/brand/dashboard">Claim Your Spot Now</Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="border-white text-white hover:bg-white hover:text-red-500 shadow-lg text-lg px-8 py-6 h-auto font-bold bg-transparent"
                >
                  <Link href="/brand/quests/create">Start First Campaign</Link>
                </Button>
              </div>
            </div>
          </div>
        </section> */}

        {/* Social Proof Section */}
                {/* Mid-page CTA */}
        <section className="mb-24">
          <div className="bg-gradient-to-r from-brand-purple via-brand-pink to-brand-teal p-1 rounded-3xl shadow-2xl">
            <div className="bg-white rounded-3xl p-12 text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-brand-dark">Ready to Get Started?</h2>
              <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                Don't wait while your competitors gain the advantage. Launch your first campaign today!
              </p>

              <div className="flex flex-col sm:flex-row justify-center gap-6">
                <Button
                  asChild
                  size="lg"
                  className="bg-gradient-to-r from-brand-purple to-brand-pink hover:from-brand-purple/90 hover:to-brand-pink/90 text-white shadow-xl transition-all duration-300 hover:shadow-2xl hover:scale-105 text-xl px-12 py-5 h-auto font-bold rounded-xl"
                >
                  <Link href="/brand/quests/create">
                    <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M13 10V3L4 14h7v7l9-11h-7z"
                      ></path>
                    </svg>
                    Create Your First Quest
                  </Link>
                </Button>

                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="border-2 border-brand-purple text-brand-purple hover:bg-brand-purple hover:text-white bg-white shadow-xl transition-all duration-300 hover:shadow-2xl hover:scale-105 text-xl px-12 py-5 h-auto font-bold rounded-xl"
                >
                  <Link href="/brand/dashboard">
                    <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                      ></path>
                    </svg>
                    View Dashboard
                  </Link>
                </Button>
              </div>

              <div className="mt-8 flex justify-center items-center gap-4 text-sm text-gray-500">
                <div className="flex items-center gap-1">
                  <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span>Easy setup</span>
                </div>
                <div className="flex items-center gap-1">
                  <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span>Launch in 3 minutes</span>
                </div>
                <div className="flex items-center gap-1">
                  <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span>Pay creators after results</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mb-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-brand-dark">
              Join <span className="text-brand-purple">500+</span> Smart Brands
            </h2>
            <p className="text-gray-600">Who chose Questpanda</p>
          </div>

          {/* <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { name: "TechFlow", industry: "SaaS", result: "+340% leads", color: "purple" },
              { name: "StyleCo", industry: "Fashion", result: "2.1M views", color: "pink" },
              { name: "FitLife", industry: "Fitness", result: "+180% sales", color: "teal" },
              { name: "GamerHub", industry: "Gaming", result: "850K followers", color: "yellow" },
            ].map((brand, index) => (
              <div
                key={index}
                className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 text-center group hover:-translate-y-1 transition-all duration-300"
              >
                <div
                  className={`h-16 w-16 rounded-full bg-brand-${brand.color}/10 flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-brand-${brand.color}`}
                >
                  {brand.name.charAt(0)}
                </div>
                <h3 className="font-bold text-brand-dark mb-1">{brand.name}</h3>
                <p className="text-gray-600 text-sm mb-2">{brand.industry}</p>
                <div className={`font-bold text-brand-${brand.color}`}>{brand.result}</div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <div className="bg-gradient-to-r from-green-100 to-emerald-100 rounded-xl p-6 inline-block border border-green-200">
              <p className="text-lg font-semibold text-green-800 mb-2">⭐ 4.9/5 Average Brand Satisfaction</p>
              <p className="text-green-600">"Best marketing investment we've made" - CEO, TechFlow</p>
            </div>
          </div> */}


        </section>
      </div>
    </div>
  )
}
