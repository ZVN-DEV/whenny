'use client'

import Link from 'next/link'
import { useParams } from 'next/navigation'
import { getPostBySlug, getAllPosts } from '../posts'
import { whenny } from 'whenny'
import ReactMarkdown from 'react-markdown'

export default function BlogPostPage() {
  const params = useParams()
  const slug = params.slug as string
  const post = getPostBySlug(slug)

  if (!post) {
    return (
      <main className="min-h-screen bg-white">
        <header className="border-b border-slate-200 bg-white/90 backdrop-blur-sm sticky top-0 z-10">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between">
            <Link href="/" className="font-semibold text-slate-900">Whenny</Link>
            <div className="flex items-center gap-3 sm:gap-6">
              <Link href="/blog" className="text-xs sm:text-sm text-slate-600 hover:text-slate-900">Blog</Link>
              <Link href="/docs" className="text-xs sm:text-sm text-slate-600 hover:text-slate-900">Docs</Link>
            </div>
          </div>
        </header>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16 text-center">
          <h1 className="text-2xl font-bold text-slate-900 mb-4">Post Not Found</h1>
          <p className="text-slate-600 mb-8">This post doesn't exist or hasn't been published yet.</p>
          <Link href="/blog" className="text-blue-600 hover:text-blue-700">
            ← Back to Blog
          </Link>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white/90 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between">
          <div className="flex items-center gap-3 sm:gap-6">
            <Link href="/" className="font-semibold text-slate-900">Whenny</Link>
            <Link href="/blog" className="text-xs sm:text-sm text-slate-400 hover:text-slate-600">Blog</Link>
          </div>
          <div className="flex items-center gap-3 sm:gap-6">
            <Link href="/demo" className="text-xs sm:text-sm text-slate-600 hover:text-slate-900 transition-colors">Demo</Link>
            <Link href="/docs" className="text-xs sm:text-sm text-slate-600 hover:text-slate-900 transition-colors">Docs</Link>
            <a href="https://github.com/ZVN-DEV/whenny" className="text-xs sm:text-sm text-slate-600 hover:text-slate-900 transition-colors">GitHub</a>
          </div>
        </div>
      </header>

      <article className="max-w-3xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        {/* Back link */}
        <Link href="/blog" className="text-sm text-slate-500 hover:text-slate-700 mb-8 inline-block">
          ← Back to Blog
        </Link>

        {/* Header */}
        <header className="mb-10">
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
            {post.title}
          </h1>
          <p className="text-xl text-slate-600 mb-6">{post.subtitle}</p>

          {/* Author and meta */}
          <div className="flex items-center gap-4 pb-6 border-b border-slate-200">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-semibold text-sm">
              {post.author.charAt(0)}
            </div>
            <div>
              <p className="font-medium text-slate-900">{post.author}</p>
              <div className="flex items-center gap-2 text-sm text-slate-500">
                <time dateTime={post.publishDate}>
                  {whenny(new Date(post.publishDate + 'T12:00:00')).lg}
                </time>
                <span>·</span>
                <span>{post.readTime}</span>
              </div>
            </div>
          </div>

          {/* Tags */}
          <div className="flex gap-2 mt-6">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="px-2.5 py-1 text-xs bg-slate-100 text-slate-600 rounded-full"
              >
                #{tag}
              </span>
            ))}
          </div>
        </header>

        {/* Content */}
        <div className="blog-content">
          <ReactMarkdown
            components={{
              h2: ({ children }) => (
                <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-16 mb-6 pb-3 border-b border-slate-100">
                  {children}
                </h2>
              ),
              h3: ({ children }) => (
                <h3 className="text-xl sm:text-2xl font-semibold text-slate-900 mt-12 mb-5">
                  {children}
                </h3>
              ),
              p: ({ children }) => (
                <p className="text-lg text-slate-600 leading-[1.8] mb-8">
                  {children}
                </p>
              ),
              ul: ({ children }) => (
                <ul className="space-y-4 mb-10 ml-1">
                  {children}
                </ul>
              ),
              ol: ({ children }) => (
                <ol className="space-y-4 mb-10 ml-1 list-decimal list-inside">
                  {children}
                </ol>
              ),
              li: ({ children }) => (
                <li className="text-lg text-slate-600 leading-[1.8] pl-2 flex gap-3">
                  <span className="text-slate-400 mt-1">•</span>
                  <span>{children}</span>
                </li>
              ),
              blockquote: ({ children }) => (
                <blockquote className="border-l-4 border-blue-500 bg-blue-50/50 pl-6 pr-6 py-5 my-10 rounded-r-lg">
                  <div className="text-lg text-slate-700 italic leading-relaxed">
                    {children}
                  </div>
                </blockquote>
              ),
              a: ({ href, children }) => (
                <a href={href} className="text-blue-600 hover:text-blue-800 underline underline-offset-2 decoration-blue-200 hover:decoration-blue-400 transition-colors">
                  {children}
                </a>
              ),
              strong: ({ children }) => (
                <strong className="font-semibold text-slate-900">{children}</strong>
              ),
              code: ({ className, children, ...props }) => {
                const isInline = !className
                if (isInline) {
                  return (
                    <code className="bg-slate-100 text-slate-800 px-2 py-1 rounded-md text-[0.9em] font-mono" {...props}>
                      {children}
                    </code>
                  )
                }
                return (
                  <code className={className} {...props}>
                    {children}
                  </code>
                )
              },
              pre: ({ children }) => (
                <pre className="bg-slate-900 text-slate-100 p-6 rounded-xl overflow-x-auto text-sm leading-relaxed my-10 shadow-lg">
                  {children}
                </pre>
              ),
              hr: () => (
                <hr className="my-16 border-none h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />
              ),
            }}
          >
            {post.content}
          </ReactMarkdown>
        </div>

        {/* Footer */}
        <footer className="mt-12 pt-8 border-t border-slate-200">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <p className="text-sm text-slate-500">Share this post</p>
              <div className="flex gap-3 mt-2">
                <a
                  href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(`https://whenny.dev/blog/${post.slug}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-400 hover:text-slate-600"
                >
                  Twitter
                </a>
                <a
                  href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(`https://whenny.dev/blog/${post.slug}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-400 hover:text-slate-600"
                >
                  LinkedIn
                </a>
              </div>
            </div>
            <Link href="/blog" className="text-blue-600 hover:text-blue-700 text-sm">
              ← More posts
            </Link>
          </div>
        </footer>
      </article>
    </main>
  )
}
