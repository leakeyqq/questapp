import type { Quest } from "./types"

export const quests: Quest[] = [
  {
    id: "quest-1",
    title: "Summer Collection Showcase",
    brand: "FashionBrand",
    category: "Create video",
    description: "Create a 60-second video showcasing our new summer collection in a creative way.",
    longDescription:
      "We're looking for creative content creators to showcase our new summer collection. Your video should highlight at least 3 items from our collection in a creative and engaging way. Be authentic and show your personal style!",
    imageUrl: "https://i.ytimg.com/vi/p2FYXTocqtM/maxresdefault.jpg?height=400&width=600",
    prizePool: "30 USD",
    deadline: "2025-04-12",
    submissions: 4,
    maxParticipants: 100,
    minFollowers: 5000,
    requirements: [
      "Create a 60-second video featuring at least 3 items from our summer collection",
      "Post the video on TikTok, Instagram, or YouTube with the hashtag #SummerFashion2023",
      "Include a link to our website in your post description",
      "Your account must have at least 5,000 followers",
    ],
    featured: false,
    recentSubmissions: [
      {
        username: "fashionista22",
        date: "2 days ago",
        comment: "Had so much fun creating this beach-themed showcase!",
        link: "https://example.com/video1",
      },
      {
        username: "style_creator",
        date: "3 days ago",
        comment: "Love the new collection, especially the summer dresses!",
        link: "https://example.com/video2",
      },
    ],
  },
  {
    id: "quest-2",
    title: "Tech Gadget Review",
    brand: "TechCorp",
    category: "Create video",
    description: "Create an video reviewing of our latest smart home device and share your experience.",
    longDescription:
      "We want authentic reviews of our new smart home hub. Share your honest thoughts, show the device in action, and highlight both pros and cons. We value genuine feedback!",
    imageUrl: "https://simbisakenya.co.ke/wp-content/uploads/2017/05/Simbisa-Brands-Kenya-LimitedHR.jpg?height=400&width=600",
    prizePool: "15 USD",
    deadline: "2025-04-20",
    submissions: 0,
    maxParticipants: 50,
    minFollowers: 10000,
    requirements: [
      "Create a 3-5 minute video review of our smart home hub",
      "Demonstrate at least 3 key features of the device",
      "Share both positive aspects and areas for improvement",
      "Post on YouTube or Instagram with the hashtag #TechCorpReview",
    ],
    featured: false,
  },
  {
    id: "quest-3",
    title: "Fitness Challenge",
    brand: "FitLife",
    category: "Create video",
    description: "Create a video show your followers how you incorporate our fitness products into your workout routine.",
    imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSxRhZQ4-XAVXa3zlm4g63ND1tr63z0ejRSQw&s?height=400&width=600",
    prizePool: "100 USD",
    deadline: "2025-04-10",
    submissions: 15,
    maxParticipants: 75,
    minFollowers: 3000,
    requirements: [
      "Create a workout video (1-3 minutes) featuring our resistance bands",
      "Demonstrate at least 5 different exercises",
      "Share the video on Instagram, TikTok, or YouTube with #FitLifeChallenge",
      "Tag our official account in your post",
    ],
  },
  {
    id: "quest-4",
    title: "Coffee Brewing Tutorial",
    brand: "BeanMaster",
    category: "Create video",
    description: "Create a step-by-step video tutorial showing how to brew the perfect cup using our specialty coffee.",
    imageUrl: "https://blog.twiva.co.ke/wp-content/uploads/2022/01/TWIVA-LAUNCH-119-576x1024.jpg?height=400&width=600",
    prizePool: "80 USD",
    deadline: "2025-04-11",
    submissions: 3,
    maxParticipants: 40,
    minFollowers: 2000,
    requirements: [
      "Create a tutorial video (2-4 minutes) showing your coffee brewing process",
      "Use our specialty coffee beans in your tutorial",
      "Highlight the unique features of our coffee",
      "Share on Instagram, YouTube, or TikTok with #BeanMasterBrew",
    ],
  },
  {
    id: "quest-5",
    title: "Gaming Headset Unboxing",
    brand: "GameTech",
    category: "Create video",
    description: "Create an unboxing video of our new gaming headset and share your first impressions.",
    imageUrl: "https://img1.wsimg.com/isteam/ip/d0e5736f-1d23-476a-a37a-f536dea1b248/photo_2024-01-06%2023.02.54.jpeg/:/cr=t:0%25,l:0%25,w:100%25,h:100%25/rs=w:1280?height=400&width=600",
    prizePool: "120 USD",
    deadline: "2025-04-14",
    submissions: 2,
    maxParticipants: 60,
    minFollowers: 5000,
    requirements: [
      "Create an unboxing video (3-5 minutes) of our new gaming headset",
      "Show the unboxing experience and first setup",
      "Share your first impressions and test the headset in a game",
      "Post on YouTube or Twitch with #GameTechUnboxed",
    ],
  },
  {
    id: "quest-6",
    title: "Skincare Routine",
    brand: "GlowUp",
    category: "Create video",
    description: "Create a video showing your skincare routine featuring our new natural skincare line.",
    imageUrl: "https://toasterding.com/wp-content/uploads/2024/04/photo_2024-05-22-16.54.06.jpeg?height=400&width=600",
    prizePool: "90 USD",
    deadline: "2025-04-14",
    submissions: 7,
    maxParticipants: 50,
    minFollowers: 3000,
    requirements: [
      "Create a video (2-5 minutes) showing your skincare routine",
      "Feature at least 3 products from our natural skincare line",
      "Explain the benefits of each product",
      "Share on Instagram or TikTok with #GlowUpRoutine",
    ],
  },
  {
    id: "quest-7",
    title: "Review Pretium app",
    brand: "Pretium",
    category: "Create video",
    description: "Create a video showing people how to make payments with Pretium app. Pretium allows users in Africa to do pay local merchants directly with stablecoins. Create a 3-minute educative video showing how you paid something on the streets with pretium app. Remember to use hashtag #pretium and include our website link https://pretium.finance on the video description",
    imageUrl: "https://www.techarena.co.ke/wp-content/uploads/2025/02/Pretium.webp?height=400&width=600",
    prizePool: "75 USD",
    deadline: "2025-04-14",
    submissions: 2,
    maxParticipants: 50,
    minFollowers: 100,
    requirements: [
      "Create a video (2-5 minutes) showing your skincare routine",
      "Feature at least 3 products from our natural skincare line",
      "Explain the benefits of each product",
      "Share on Instagram or TikTok with #GlowUpRoutine",
    ],
  },
  {
    id: "quest-8",
    title: "Review KBCC2024 event",
    brand: "Chasing Mavericks",
    category: "Create video",
    description: "Create a video showing your experience at our last year KBCC2024 conference. Say what you enjoyed most and why people should not miss KBCC2025. Use the Hashtag #KBCC2025. Include our website link in your video description https://kenyablockchainandcryptoconference.co.ke/.",
    imageUrl: "https://image.coinpedia.org/app_uploads/events/1729323924753bgx4ly8wjh.webp?height=400&width=600",
    prizePool: "100 USD",
    deadline: "2025-04-12",
    submissions: 0,
    maxParticipants: 50,
    minFollowers: 100,
    requirements: [
      "Create a video (2-5 minutes) showing your skincare routine",
      "Feature at least 3 products from our natural skincare line",
      "Explain the benefits of each product",
      "Share on Instagram or TikTok with #GlowUpRoutine",
    ],
  },
    {
    id: "quest-9",
    title: "Review Azza whatsapp experience",
    brand: "blocverse",
    category: "Create video",
    description: "Create a video showing newbies how to buy Crypto using our WhatsApp bot. Add link to our website on video description. https://www.useazza.com/",
    imageUrl: "https://miro.medium.com/v2/resize:fit:1400/1*jb3EFgrIcRwecPvNqNSxeQ.png?height=400&width=600",
    prizePool: "250 USD",
    deadline: "2025-04-12",
    submissions: 0,
    maxParticipants: 50,
    minFollowers: 100,
    requirements: [
      "Create a video (2-5 minutes) showing your skincare routine",
      "Feature at least 3 products from our natural skincare line",
      "Explain the benefits of each product",
      "Share on Instagram or TikTok with #GlowUpRoutine",
    ],
  },
]
