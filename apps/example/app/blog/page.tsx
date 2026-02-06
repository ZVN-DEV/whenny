'use client'

import Link from 'next/link'
import { getPublishedPosts } from './posts'
import { whenny } from 'whenny'

export default function BlogPage() {
  const posts = getPublishedPosts()

  return (
    <main className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white/90 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between">
          <div className="flex items-center gap-3 sm:gap-6">
            <Link href="/" className="font-semibold text-slate-900">Whenny</Link>
            <span className="text-xs sm:text-sm text-slate-400">Blog</span>
          </div>
          <div className="flex items-center gap-3 sm:gap-6">
            <Link href="/demo" className="text-xs sm:text-sm text-slate-600 hover:text-slate-900 transition-colors">Demo</Link>
            <Link href="/docs" className="text-xs sm:text-sm text-slate-600 hover:text-slate-900 transition-colors">Docs</Link>
            <a href="https://github.com/ZVN-DEV/whenny" className="text-xs sm:text-sm text-slate-600 hover:text-slate-900 transition-colors">GitHub</a>
          </div>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">Blog</h1>
        <p className="text-slate-600 mb-12">
          Thoughts on dates, timezones, AI, and building developer tools.
        </p>

        {posts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-slate-500">No posts published yet. Check back soon!</p>
          </div>
        ) : (
          <div className="space-y-8">
            {posts.map((post) => (
              <article key={post.slug} className="group">
                <Link href={`/blog/${post.slug}`} className="block">
                  <div className="flex items-center gap-3 text-sm text-slate-500 mb-2">
                    <time dateTime={post.publishDate}>
                      {whenny(new Date(post.publishDate + 'T12:00:00')).lg}
                    </time>
                    <span>·</span>
                    <span>{post.readTime}</span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-semibold text-slate-900 group-hover:text-blue-600 transition-colors mb-2">
                    {post.title}
                  </h2>
                  <p className="text-slate-600 mb-3">{post.subtitle}</p>
                  <div className="flex gap-2">
                    {post.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-1 text-xs bg-slate-100 text-slate-600 rounded"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </Link>
              </article>
            ))}
          </div>
        )}

        {/* Coming Soon Section */}
        <div className="mt-16 pt-8 border-t border-slate-200">
          <h3 className="text-lg font-medium text-slate-900 mb-4">Coming Soon</h3>
          <div className="space-y-3 text-slate-500">
            <p className="flex items-center gap-2">
              <span className="w-2 h-2 bg-slate-300 rounded-full"></span>
              More posts on TypeScript date handling and AI integration
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}
