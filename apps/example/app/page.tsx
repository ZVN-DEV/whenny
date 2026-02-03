'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { whenny, duration } from 'whenny'
import { useRelativeTime, useCountdown } from '@whenny/react'

export default function LandingPage() {
  const [mounted, setMounted] = useState(false)

  // Demo dates
  const now = new Date()
  const fiveMinutesAgo = new Date(now.getTime() - 5 * 60 * 1000)
  const nextYear = new Date(now.getFullYear() + 1, 0, 1)

  // Live hooks
  const relativeTime = useRelativeTime(fiveMinutesAgo)
  const countdown = useCountdown(nextYear)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Hero */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(45%_50%_at_50%_0%,rgba(59,130,246,0.1),transparent)]" />
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-24">
          <div className="text-center">
            <div className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-50 text-blue-700 border border-blue-100 mb-6">
              v1.0.0 — Production Ready
            </div>
            <h1 className="text-5xl sm:text-7xl font-bold tracking-tight text-slate-900 mb-6">
              Whenny
            </h1>
            <p className="text-xl sm:text-2xl text-slate-600 max-w-2xl mx-auto mb-4">
              A modern date library for the AI era.
            </p>
            <p className="text-lg text-slate-500 max-w-xl mx-auto mb-10">
              Own your code. Configure your voice. Never think about timezones again.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/demo"
                className="inline-flex items-center justify-center px-6 py-3 text-base font-medium rounded-lg text-white bg-slate-900 hover:bg-slate-800 transition-colors"
              >
                View Demo
              </Link>
              <a
                href="https://github.com/whenny/whenny"
                className="inline-flex items-center justify-center px-6 py-3 text-base font-medium rounded-lg text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 transition-colors"
              >
                GitHub
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Live Demo */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        <div className="bg-slate-900 rounded-2xl p-8 shadow-2xl">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-3 h-3 rounded-full bg-red-500" />
            <div className="w-3 h-3 rounded-full bg-yellow-500" />
            <div className="w-3 h-3 rounded-full bg-green-500" />
            <span className="ml-4 text-slate-400 text-sm font-mono">Live Demo</span>
          </div>
          {mounted && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <LiveDemo
                label="Smart Format"
                code="whenny(date).smart()"
                result={whenny(fiveMinutesAgo).smart()}
              />
              <LiveDemo
                label="Auto-updating"
                code="useRelativeTime(date)"
                result={relativeTime}
                live
              />
              <LiveDemo
                label="Countdown"
                code="useCountdown(newYear)"
                result={`${countdown.days}d ${countdown.hours}h ${countdown.minutes}m ${countdown.seconds}s`}
                live
              />
            </div>
          )}
        </div>
      </div>

      {/* Features */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        <h2 className="text-3xl font-bold text-center text-slate-900 mb-4">
          Why Whenny?
        </h2>
        <p className="text-center text-slate-500 mb-12 max-w-2xl mx-auto">
          Built from scratch for modern applications. Three core ideas make it different.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <FeatureCard
            icon="🎯"
            title="Own Your Code"
            description="Like shadcn/ui, Whenny copies code directly into your project. Your AI assistant can read and modify it. No dependency lock-in."
          />
          <FeatureCard
            icon="🎨"
            title="Configure Your Voice"
            description="One config file controls every string Whenny outputs. Want formal? Casual? Emoji-heavy? Change it once, update everywhere."
          />
          <FeatureCard
            icon="🌍"
            title="Timezone Solved"
            description="The Transfer Protocol carries timezone context across the wire. Server and browser always show the right time. Automatically."
          />
        </div>
      </div>

      {/* Code Examples */}
      <div className="bg-slate-50 py-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-slate-900 mb-12">
            Clean, Intuitive API
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <CodeExample
              title="Smart Formatting"
              description="Context-aware output that picks the best representation"
              code={`import { whenny } from 'whenny'

// Automatically picks the best format
whenny(date).smart()
// → "just now"
// → "5 minutes ago"
// → "Yesterday at 3:45 PM"
// → "Monday at 9:00 AM"
// → "Jan 15"`}
            />
            <CodeExample
              title="Configurable Output"
              description="Every string is customizable via your config"
              code={`// whenny.config.ts
export default defineConfig({
  relative: {
    justNow: 'moments ago',
    minutesAgo: (n) => \`\${n}m ago\`,
    hoursAgo: (n) => \`\${n}h ago\`,
  },
  formats: {
    presets: {
      short: '{day}/{month}/{year}',
    }
  }
})`}
            />
            <CodeExample
              title="React Hooks"
              description="Auto-updating times with zero boilerplate"
              code={`import { useRelativeTime, useCountdown } from '@whenny/react'

function Comment({ createdAt }) {
  // Updates automatically every minute
  const time = useRelativeTime(createdAt)
  return <span>{time}</span>
}

function Sale({ endsAt }) {
  const { days, hours, minutes } = useCountdown(endsAt)
  return <span>{days}d {hours}h {minutes}m</span>
}`}
            />
            <CodeExample
              title="Transfer Protocol"
              description="Timezones that work across server and browser"
              code={`// Server: serialize with context
import { transfer } from 'whenny'

const data = {
  createdAt: transfer.toJSON(event.createdAt, 'America/New_York')
}

// Browser: deserialize and format
const { date, originZone } = transfer.fromJSON(data.createdAt)
// Shows "3:00 PM ET" - original timezone preserved!`}
            />
          </div>
        </div>
      </div>

      {/* Installation */}
      <div className="py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-slate-900 mb-4">
            Get Started
          </h2>
          <p className="text-center text-slate-500 mb-12">
            Choose your style: package or copy
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white rounded-xl border border-slate-200 p-6">
              <h3 className="font-semibold text-slate-900 mb-2">NPM Package</h3>
              <p className="text-sm text-slate-500 mb-4">
                Traditional installation. Works great.
              </p>
              <pre className="bg-slate-900 text-slate-100 p-4 rounded-lg text-sm overflow-x-auto">
                <code>npm install whenny @whenny/react</code>
              </pre>
            </div>
            <div className="bg-white rounded-xl border-2 border-blue-200 p-6 relative">
              <div className="absolute -top-3 left-4 px-2 bg-white text-blue-600 text-xs font-medium">
                RECOMMENDED
              </div>
              <h3 className="font-semibold text-slate-900 mb-2">shadcn Style</h3>
              <p className="text-sm text-slate-500 mb-4">
                Copy code into your project. Full ownership.
              </p>
              <pre className="bg-slate-900 text-slate-100 p-4 rounded-lg text-sm overflow-x-auto">
                <code>{`npx whenny init
npx whenny add relative smart`}</code>
              </pre>
            </div>
          </div>
        </div>
      </div>

      {/* Themes */}
      <div className="bg-slate-900 py-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-white mb-4">
            Pre-built Themes
          </h2>
          <p className="text-center text-slate-400 mb-12 max-w-2xl mx-auto">
            Start with a theme that matches your product's personality
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <ThemeCard name="Casual" example="5 mins ago" desc="Default, friendly" />
            <ThemeCard name="Formal" example="5 minutes ago" desc="Professional" />
            <ThemeCard name="Slack" example="5m" desc="Compact" />
            <ThemeCard name="Twitter" example="5m" desc="Social media" />
            <ThemeCard name="Discord" example="Today at 3:45 PM" desc="Chat apps" />
            <ThemeCard name="GitHub" example="5 minutes ago" desc="Dev tools" />
            <ThemeCard name="Minimal" example="5 min" desc="Clean, simple" />
            <ThemeCard name="Technical" example="300s" desc="Precise, numeric" />
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">
            Ready to try it?
          </h2>
          <p className="text-slate-500 mb-8">
            Join developers who are tired of fighting with dates.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/demo"
              className="inline-flex items-center justify-center px-8 py-4 text-lg font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition-colors"
            >
              Explore Demo
            </Link>
            <a
              href="https://github.com/whenny/whenny"
              className="inline-flex items-center justify-center px-8 py-4 text-lg font-medium rounded-lg text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 transition-colors"
            >
              Read the Docs
            </a>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-slate-200 py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-slate-500 text-sm">
              Whenny — Own your code. Configure your voice.
            </p>
            <div className="flex gap-6">
              <a href="https://github.com/whenny/whenny" className="text-slate-500 hover:text-slate-700 text-sm">
                GitHub
              </a>
              <a href="/demo" className="text-slate-500 hover:text-slate-700 text-sm">
                Demo
              </a>
              <a href="/docs" className="text-slate-500 hover:text-slate-700 text-sm">
                Docs
              </a>
            </div>
          </div>
        </div>
      </footer>
    </main>
  )
}

function LiveDemo({ label, code, result, live }: { label: string; code: string; result: string; live?: boolean }) {
  return (
    <div className="bg-slate-800 rounded-lg p-4">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-slate-400 text-sm">{label}</span>
        {live && <span className="px-1.5 py-0.5 rounded text-xs bg-green-500/20 text-green-400">LIVE</span>}
      </div>
      <code className="text-blue-400 text-xs block mb-3">{code}</code>
      <p className="text-white text-xl font-semibold">{result}</p>
    </div>
  )
}

function FeatureCard({ icon, title, description }: { icon: string; title: string; description: string }) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6 hover:shadow-lg transition-shadow">
      <span className="text-3xl mb-4 block">{icon}</span>
      <h3 className="text-lg font-semibold text-slate-900 mb-2">{title}</h3>
      <p className="text-slate-500">{description}</p>
    </div>
  )
}

function CodeExample({ title, description, code }: { title: string; description: string; code: string }) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
      <div className="p-4 border-b border-slate-100">
        <h3 className="font-semibold text-slate-900">{title}</h3>
        <p className="text-sm text-slate-500">{description}</p>
      </div>
      <pre className="p-4 bg-slate-900 text-sm overflow-x-auto">
        <code className="text-slate-100">{code}</code>
      </pre>
    </div>
  )
}

function ThemeCard({ name, example, desc }: { name: string; example: string; desc: string }) {
  return (
    <div className="bg-slate-800 rounded-lg p-4 hover:bg-slate-700 transition-colors cursor-pointer">
      <p className="text-white font-medium mb-1">{name}</p>
      <p className="text-blue-400 text-sm mb-1">{example}</p>
      <p className="text-slate-500 text-xs">{desc}</p>
    </div>
  )
}
