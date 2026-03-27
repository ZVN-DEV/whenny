'use client'

import Link from 'next/link'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <main className="min-h-screen bg-white flex items-center justify-center px-4 sm:px-6">
      <div className="max-w-md w-full text-center">
        <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-slate-100 flex items-center justify-center">
          <svg
            className="w-8 h-8 text-slate-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
            />
          </svg>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-3">
          Something went wrong
        </h1>
        <p className="text-sm sm:text-base text-slate-600 mb-8">
          An unexpected error occurred. Please try again or return to the home page.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={reset}
            className="px-5 py-2.5 bg-slate-900 text-white rounded-lg font-medium hover:bg-slate-800 transition-colors text-sm sm:text-base"
          >
            Try again
          </button>
          <Link
            href="/"
            className="px-5 py-2.5 bg-white text-slate-900 border border-slate-200 rounded-lg font-medium hover:bg-slate-50 transition-colors text-sm sm:text-base"
          >
            Go home
          </Link>
        </div>
      </div>
    </main>
  )
}
