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

/*
 * JSON-LD Structured Data for rich search results.
 *
 * This object is fully static (no user input, no dynamic interpolation) and is
 * serialized into a <script type="application/ld+json"> tag via
 * dangerouslySetInnerHTML. This is the standard pattern recommended by Next.js
 * for JSON-LD (see https://nextjs.org/docs/app/building-your-application/optimizing/metadata#json-ld).
 * Because the data is a compile-time constant with no external or user-supplied
 * values, there is no XSS risk from using dangerouslySetInnerHTML here.
 */
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
} as const

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
      <body className="font-sans">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-slate-900 focus:text-white focus:rounded-lg focus:text-sm focus:font-medium focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2"
        >
          Skip to main content
        </a>
        <div id="main-content">
          {children}
        </div>
      </body>
    </html>
  )
}
