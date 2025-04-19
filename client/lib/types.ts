export interface Quest {
  _id: string
  id: string
  title: string
  brand: string
  brandName: string
  category: string
  description: string
  longDescription?: string
  imageUrl: string
  brandImageUrl: string
  prizePool: string
  deadline: string
  endsOn: string
  submissions: string[]
  maxParticipants: number
  minFollowers: number
  prizePoolUsd: number
  requirements: string[]
  rewardCriteria: string
  featured?: boolean
  recentSubmissions?: {
    username: string
    date: string
    comment: string
    link: string
  }[]
  minFollowerCount: number
}
