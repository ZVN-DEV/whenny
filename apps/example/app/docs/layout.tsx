import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Documentation - Whenny Date Library',
  description: 'Complete documentation for Whenny, the modern TypeScript date library. Learn formatting, relative time, timezones, React hooks, and more. API reference with code examples.',
  keywords: [
    'date library documentation',
    'typescript date api',
    'date formatting guide',
    'timezone handling tutorial',
    'react date hooks',
    'moment.js migration',
    'dayjs alternative docs',
    'date-fns comparison',
  ],
  openGraph: {
    title: 'Documentation - Whenny Date Library',
    description: 'Complete documentation for Whenny. Learn formatting, relative time, timezones, React hooks, and more.',
    url: 'https://whenny.dev/docs',
  },
}

export default function DocsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
