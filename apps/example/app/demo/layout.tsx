import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Interactive Demo - Whenny Date Library',
  description: 'Try Whenny live! Interactive examples of smart formatting, relative time, duration formatting, countdown timers, and calendar helpers. See how this modern TypeScript date library handles any date scenario.',
  keywords: [
    'date library demo',
    'typescript date examples',
    'relative time demo',
    'countdown timer react',
    'date formatting examples',
    'moment.js alternative demo',
    'smart date formatting',
  ],
  openGraph: {
    title: 'Interactive Demo - Whenny Date Library',
    description: 'Try Whenny live! Interactive examples of smart formatting, relative time, duration formatting, countdown timers, and calendar helpers.',
    url: 'https://whenny.dev/demo',
  },
}

export default function DemoLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
