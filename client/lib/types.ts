export interface Quest {
  id: string
  title: string
  brand: string
  category: string
  description: string
  longDescription?: string
  imageUrl: string
  prizePool: string
  deadline: string
  submissions: number
  maxParticipants: number
  minFollowers: number
  requirements: string[]
  featured?: boolean
  recentSubmissions?: {
    username: string
    date: string
    comment: string
    link: string
  }[]
}
