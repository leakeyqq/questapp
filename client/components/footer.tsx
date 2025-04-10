import Link from "next/link"

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 text-gray-600">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-brand-purple to-brand-pink mb-4">
              QuestPanda
            </h3>
            <p className="mb-4">Complete creative quests, earn USD.</p>
            <div className="flex space-x-4">
              <a href="#" className="text-brand-purple hover:text-brand-pink transition-colors">
                <span className="sr-only">Twitter</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
                </svg>
              </a>
              <a href="#" className="text-brand-purple hover:text-brand-pink transition-colors">
                <span className="sr-only">Instagram</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"></line>
                </svg>
              </a>
              <a href="#" className="text-brand-purple hover:text-brand-pink transition-colors">
                <span className="sr-only">Discord</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M9 2L15 22" />
                  <path d="M5 12L19 12" />
                </svg>
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-gray-800 font-bold mb-4">For Creators</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/quests" className="hover:text-brand-purple transition-colors">
                  Browse Quests
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="hover:text-brand-purple transition-colors">
                  Creator Dashboard
                </Link>
              </li>
              <li>
                <Link href="/leaderboard" className="hover:text-brand-purple transition-colors">
                  Leaderboard
                </Link>
              </li>
              <li>
                <Link href="/rewards" className="hover:text-brand-purple transition-colors">
                  Rewards Program
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-gray-800 font-bold mb-4">For Brands</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/brands" className="hover:text-brand-purple transition-colors">
                  Create Quests
                </Link>
              </li>
              <li>
                <Link href="/analytics" className="hover:text-brand-purple transition-colors">
                  Analytics
                </Link>
              </li>
              <li>
                <Link href="/case-studies" className="hover:text-brand-purple transition-colors">
                  Case Studies
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="hover:text-brand-purple transition-colors">
                  Pricing
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-gray-800 font-bold mb-4">Resources</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/help" className="hover:text-brand-purple transition-colors">
                  Help Center
                </Link>
              </li>
              <li>
                <Link href="/blog" className="hover:text-brand-purple transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-brand-purple transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-brand-purple transition-colors">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-200 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p>&copy; 2023 QuestChain. All rights reserved.</p>
          <div className="mt-4 md:mt-0">
            <select className="bg-white border border-gray-300 text-gray-700 rounded-md px-3 py-1">
              <option>English</option>
              <option>Spanish</option>
              <option>French</option>
            </select>
          </div>
        </div>
      </div>
    </footer>
  )
}
