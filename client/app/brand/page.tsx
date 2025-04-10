"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CardContent } from "@/components/ui/card"

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

      <div className="container mx-auto px-4 py-16 relative z-10">
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
                QuestPanda connects your brand with thousands of authentic content creators
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

              {/* Premium Content Box */}
              {/*<div
                className="opacity-0 translate-y-4 animate-fade-in bg-gradient-to-br from-white to-brand-teal/5 p-4 rounded-lg shadow-sm border border-gray-300 text-center group hover:-translate-y-1 transition-all duration-300"
                style={{ animationDelay: "0.6s", animationFillMode: "forwards" }}
              >
                <div className="flex justify-center mb-3">
                  <div className="relative h-20 w-20">
                    <svg viewBox="0 0 100 100" className="h-full w-full text-brand-teal">
                      <path d="M50 20 V80" stroke="currentColor" strokeWidth="5" strokeLinecap="round" />
                      <path
                        d="M40 30 Q50 25 60 30 Q65 40 60 50 Q55 60 50 65 Q40 70 35 60"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="5"
                      />
                      <path d="M40 50 Q50 55 60 50" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                    </svg>
                    <div className="absolute inset-0 rounded-full bg-gradient-to-br from-brand-teal/10 to-transparent opacity-70 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                </div>
                <h3 className="text-lg font-bold text-brand-dark mb-1 group-hover:text-brand-teal transition-colors duration-300">
                  Premium Content
                </h3>
                <p className="text-gray-600 text-sm">Get authentic creator content that delivers results</p>
              </div>*/}



            </div>

            <div
              className="opacity-0 scale-95 animate-fade-in text-center"
              style={{ animationDelay: "0.8s", animationFillMode: "forwards" }}
            >
              <div className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-xl border border-gray-100 mb-8">
                <p className="text-lg text-gray-700 mb-8 max-w-2xl mx-auto">
                  <span className="font-semibold text-brand-purple">QuestPanda</span> helps brands like yours create
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
                  {/*<Button
                    asChild
                    size="lg"
                    variant="outline"
                    className="border-brand-purple text-brand-purple/95 hover:text-brand-purple hover:bg-brand-purple/10 shadow-md transition-all duration-300 hover:shadow-lg"
                  >
                    <Link href="/brand/quests/create">Create first quest</Link>
                  </Button>*/}

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
            </div>
          </div>
        </header>

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

        {/*<section className="mb-24">
          <div
            className="opacity-0 translate-y-4 animate-fade-in"
            style={{ animationDelay: "0.2s", animationFillMode: "forwards" }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center text-brand-dark">
              Why brands <span className="text-brand-purple">choose</span> QuestPanda
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div
                className="opacity-0 translate-y-4 animate-fade-in bg-gradient-to-br from-white to-brand-purple/5 rounded-xl shadow-lg border border-gray-100 overflow-hidden group hover:-translate-y-2 transition-all duration-300"
                style={{ animationDelay: "0.3s", animationFillMode: "forwards" }}
              >
                <div className="h-2 bg-gradient-to-r from-brand-purple to-brand-pink"></div>
                <CardContent className="pt-8">
                  <div className="mb-6 h-16 w-16 rounded-full bg-brand-purple/10 flex items-center justify-center mx-auto group-hover:bg-brand-purple/20 transition-colors duration-300">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="28"
                      height="28"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-brand-purple"
                    >
                      <path d="M17 18a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v12Z"></path>
                      <path d="M9 22h6"></path>
                      <path d="M9 6h6"></path>
                      <path d="M12 17v.01"></path>
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-brand-dark text-center">Authentic Content</h3>
                  <p className="text-gray-600 text-center">
                    Get genuine, creative content from real users who showcase your products in their unique style
                  </p>
                </CardContent>
              </div>

              <div
                className="opacity-0 translate-y-4 animate-fade-in bg-gradient-to-br from-white to-brand-pink/5 rounded-xl shadow-lg border border-gray-100 overflow-hidden group hover:-translate-y-2 transition-all duration-300"
                style={{ animationDelay: "0.4s", animationFillMode: "forwards" }}
              >
                <div className="h-2 bg-gradient-to-r from-brand-pink to-brand-purple"></div>
                <CardContent className="pt-8">
                  <div className="mb-6 h-16 w-16 rounded-full bg-brand-pink/10 flex items-center justify-center mx-auto group-hover:bg-brand-pink/20 transition-colors duration-300">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="28"
                      height="28"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-brand-pink"
                    >
                      <path d="M3 3v18h18"></path>
                      <path d="m19 9-5 5-4-4-3 3"></path>
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-brand-dark text-center">Cost-Effective</h3>
                  <p className="text-gray-600 text-center">
                    Pay only for approved content, with transparent pricing and no hidden fees
                  </p>
                </CardContent>
              </div>

              <div
                className="opacity-0 translate-y-4 animate-fade-in bg-gradient-to-br from-white to-brand-teal/5 rounded-xl shadow-lg border border-gray-100 overflow-hidden group hover:-translate-y-2 transition-all duration-300"
                style={{ animationDelay: "0.5s", animationFillMode: "forwards" }}
              >
                <div className="h-2 bg-gradient-to-r from-brand-teal to-brand-blue"></div>
                <CardContent className="pt-8">
                  <div className="mb-6 h-16 w-16 rounded-full bg-brand-teal/10 flex items-center justify-center mx-auto group-hover:bg-brand-teal/20 transition-colors duration-300">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="28"
                      height="28"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-brand-teal"
                    >
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"></path>
                      <path d="m9 12 2 2 4-4"></path>
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-brand-dark text-center">Full Control</h3>
                  <p className="text-gray-600 text-center">
                    Set specific requirements, review submissions, and only approve content that meets your standards
                  </p>
                </CardContent>
              </div>
            </div>
          </div>
        </section>

        <section className="mb-24">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-gray-100">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-brand-dark">Success Stories</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                See how brands like yours have achieved remarkable results with QuestPanda
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  brand: "FashionBrand",
                  category: "Apparel",
                  result: "3.2x increase in social engagement",
                  quote: "QuestPanda helped us connect with creators who truly understand our brand aesthetic.",
                  color: "purple",
                  delay: "0.2s",
                },
                {
                  brand: "TechCorp",
                  category: "Electronics",
                  result: "42% boost in conversion rate",
                  quote: "The authentic reviews generated through QuestPanda significantly improved our sales.",
                  color: "pink",
                  delay: "0.4s",
                },
                {
                  brand: "GlowUp",
                  category: "Beauty",
                  result: "125K+ new followers across platforms",
                  quote:
                    "We've discovered amazing brand advocates who create content that resonates with our audience.",
                  color: "teal",
                  delay: "0.6s",
                },
              ].map((story, index) => (
                <div
                  key={index}
                  className={`opacity-0 translate-y-4 animate-fade-in bg-gradient-to-br from-white to-brand-${story.color}/5 rounded-xl shadow-lg border border-gray-100 p-6 group hover:-translate-y-1 transition-all duration-300`}
                  style={{ animationDelay: story.delay, animationFillMode: "forwards" }}
                >
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h3 className="font-bold text-brand-dark text-xl mb-2">{story.brand}</h3>
                      <Badge className={`bg-brand-${story.color}/10 text-brand-${story.color}`}>{story.category}</Badge>
                    </div>
                    <div
                      className={`h-12 w-12 rounded-full bg-brand-${story.color}/10 flex items-center justify-center text-brand-${story.color} text-lg font-bold group-hover:bg-brand-${story.color}/20 transition-colors duration-300`}
                    >
                      {story.brand.charAt(0)}
                    </div>
                  </div>
                  <div className="mb-4">
                    <div className={`font-bold text-brand-${story.color} mb-2 text-lg`}>{story.result}</div>
                    <p className="text-gray-600 italic">"{story.quote}"</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>*/}

        {/*<section className="text-center">
          <div
            className="opacity-0 scale-95 animate-fade-in"
            style={{ animationDelay: "0.2s", animationFillMode: "forwards" }}
          >
            <div className="bg-gradient-to-r from-brand-purple via-brand-pink to-brand-teal p-0.5 rounded-2xl shadow-xl">
              <div className="bg-white rounded-2xl p-12 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-radial from-brand-purple/10 to-transparent"></div>
                <div className="absolute bottom-0 left-0 w-40 h-40 bg-gradient-radial from-brand-teal/10 to-transparent"></div>

                <h2 className="text-3xl md:text-4xl font-bold mb-4 text-brand-dark">Ready to amplify your brand?</h2>
                <p className="text-gray-600 max-w-2xl mx-auto mb-8">
                  Join thousands of brands leveraging authentic creator content to drive engagement and sales
                </p>
                <Button
                  asChild
                  size="lg"
                  className="bg-gradient-to-r from-brand-purple to-brand-pink hover:opacity-90 text-white shadow-lg text-lg px-8 py-6 h-auto transition-all duration-300 hover:shadow-xl"
                >
                  <Link href="/brand/dashboard">Get Started Today</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>*/}
      </div>
    </div>
  )
}
