import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Blog - Whenny Date Library',
  description: 'Thoughts on dates, timezones, AI-friendly APIs, and building developer tools. Learn about TypeScript date handling, the timestamp trap, and more.',
  keywords: [
    'typescript blog',
    'javascript dates',
    'timezone handling',
    'ai coding',
    'developer tools',
    'date formatting',
  ],
  openGraph: {
    title: 'Blog - Whenny Date Library',
    description: 'Thoughts on dates, timezones, AI-friendly APIs, and building developer tools.',
    url: 'https://whenny.dev/blog',
  },
}

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
