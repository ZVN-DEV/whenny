import type { Metadata } from 'next'
import './globals.css'

const title = 'Whenny - The Modern TypeScript Date Library for the AI Era'
const description = 'A modern date library that makes dates just work. Zero-config timezone handling, AI-friendly API, shadcn-style code ownership. The friendly alternative to Moment.js, Day.js, and date-fns for TypeScript developers.'
const url = 'https://whenny.dev'

export const metadata: Metadata = {
  metadataBase: new URL(url),
  title: {
    default: title,
    template: '%s | Whenny',
  },
  description,
  keywords: [
    'typescript date library',
    'javascript date library',
    'date formatting',
    'timezone handling',
    'moment.js alternative',
    'dayjs alternative',
    'date-fns alternative',
    'relative time',
    'time ago',
    'countdown timer',
    'duration formatting',
    'natural language dates',
    'business days calculator',
    'shadcn components',
    'AI-friendly dates',
    'MCP server',
    'date parser',
    'smart date formatting',
    'i18n dates',
    'internationalization',
    'TypeScript',
    'React hooks',
    'server client sync',
    'timezone transfer',
  ],
  authors: [{ name: 'Whenny Contributors' }],
  creator: 'Whenny',
  publisher: 'Whenny',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url,
    title,
    description,
    siteName: 'Whenny',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Whenny - The Modern TypeScript Date Library',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title,
    description,
    images: ['/og-image.png'],
  },
  alternates: {
    canonical: url,
  },
  category: 'technology',
  classification: 'Software Development',
}

// JSON-LD Structured Data for rich search results
const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'Whenny',
  applicationCategory: 'DeveloperApplication',
  operatingSystem: 'Cross-platform',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
  },
  description,
  url,
  author: {
    '@type': 'Organization',
    name: 'Whenny Contributors',
  },
  programmingLanguage: ['TypeScript', 'JavaScript'],
  keywords: 'date library, typescript, timezone, moment.js alternative, AI-friendly',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="font-sans">{children}</body>
    </html>
  )
}
