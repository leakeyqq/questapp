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
                        <a
              href="https://t.me/questpanda"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative inline-flex items-center justify-center px-6 py-3.5 mb-6 overflow-hidden rounded-full bg-gradient-to-r from-brand-purple to-brand-pink text-white font-medium shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-white/20"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-brand-purple via-brand-pink to-brand-teal opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-lg"></span>
              <span className="absolute -inset-1 rounded-full bg-gradient-to-r from-brand-purple via-brand-pink to-brand-teal opacity-30 group-hover:opacity-50 animate-pulse transition-opacity duration-500 blur-sm"></span>
              <span className="relative flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="mr-2 transform group-hover:scale-110 transition-transform duration-300"
                >
                  <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
                </svg>
                <span className="font-semibold">Join our Telegram</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="ml-2 transform group-hover:translate-x-1 transition-transform duration-300"
                >
                  <path d="M5 12h14"></path>
                  <path d="m12 5 7 7-7 7"></path>
                </svg>
              </span>
            </a>
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

           {/* <div>
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
          </div> */}

          <div>
            <h4 className="text-gray-800 font-bold mb-4">Resources</h4>
            <ul className="space-y-2">
              {/* <li>
                <Link href="/help" className="hover:text-brand-purple transition-colors">
                  Help Center
                </Link>
              </li>
              <li>
                <Link href="/blog" className="hover:text-brand-purple transition-colors">
                  Blog
                </Link>
              </li> */}
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
          <p>&copy; 2025 QuestPanda. All rights reserved.</p>
          {/* <div className="mt-4 md:mt-0">
            <select className="bg-white border border-gray-300 text-gray-700 rounded-md px-3 py-1">
              <option>English</option>
              <option>Spanish</option>
              <option>French</option>
            </select>
          </div> */}
        </div>
      </div>
    </footer>
  )
}
