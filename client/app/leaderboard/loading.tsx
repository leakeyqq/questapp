export default function Loading() {
  return (
    <div className="min-h-screen bg-brand-light">
      <div className="bg-gradient-to-br from-brand-purple via-brand-pink to-brand-purple">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center text-white">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse"></div>
            <div className="h-12 bg-white/20 rounded-lg mx-auto mb-4 max-w-md animate-pulse"></div>
            <div className="h-6 bg-white/20 rounded-lg mx-auto max-w-lg animate-pulse"></div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 -mt-16 relative z-10">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white shadow-lg border-0 rounded-lg p-6 animate-pulse">
              <div className="w-12 h-12 bg-gray-200 rounded-full mx-auto mb-3"></div>
              <div className="h-8 bg-gray-200 rounded mb-2"></div>
              <div className="h-4 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>

        <div className="bg-white shadow-sm rounded-lg p-6 mb-8 animate-pulse">
          <div className="h-10 bg-gray-200 rounded mb-4"></div>
          <div className="flex gap-4">
            <div className="flex-1 h-10 bg-gray-200 rounded"></div>
            <div className="h-10 w-20 bg-gray-200 rounded"></div>
            <div className="h-10 w-20 bg-gray-200 rounded"></div>
          </div>
        </div>

        <div className="bg-white shadow-sm rounded-lg">
          <div className="p-6 border-b">
            <div className="h-8 bg-gray-200 rounded w-48 animate-pulse"></div>
          </div>
          <div className="space-y-4 p-6">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center gap-4 animate-pulse">
                <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                <div className="w-16 h-16 bg-gray-200 rounded-full"></div>
                <div className="flex-1">
                  <div className="h-6 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-32"></div>
                </div>
                <div className="flex gap-8">
                  <div className="text-center">
                    <div className="h-5 bg-gray-200 rounded w-16 mb-1"></div>
                    <div className="h-3 bg-gray-200 rounded w-12"></div>
                  </div>
                  <div className="text-center">
                    <div className="h-5 bg-gray-200 rounded w-16 mb-1"></div>
                    <div className="h-3 bg-gray-200 rounded w-12"></div>
                  </div>
                  <div className="text-center">
                    <div className="h-5 bg-gray-200 rounded w-16 mb-1"></div>
                    <div className="h-3 bg-gray-200 rounded w-12"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
