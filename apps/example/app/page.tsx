'use client'

import Link from 'next/link'
import { useMemo } from 'react'
import { whenny, duration, compare, configure } from 'whenny'
import { useRelativeTime } from 'whenny-react'

export default function LandingPage() {
  // Memoize dates to prevent flickering
  const dates = useMemo(() => {
    const now = new Date()
    return {
      now,
      fiveMinutesAgo: new Date(now.getTime() - 5 * 60 * 1000),
      yesterday: new Date(now.getTime() - 24 * 60 * 60 * 1000),
      lastWeek: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000),
      nextWeek: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000),
    }
  }, [])

  const { now, fiveMinutesAgo, yesterday, lastWeek, nextWeek } = dates

  // Live auto-updating time
  const relativeTime = useRelativeTime(fiveMinutesAgo)

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Hero */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(45%_50%_at_50%_0%,rgba(59,130,246,0.1),transparent)]" />
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-24">
          <div className="text-center">
            <div className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-amber-50 text-amber-700 border border-amber-200 mb-6">
              v0.0.1 Alpha
            </div>
            <h1 className="text-5xl sm:text-7xl font-bold tracking-tight text-slate-900 mb-6">
              Whenny
            </h1>
            <p className="text-xl sm:text-2xl text-slate-600 max-w-2xl mx-auto mb-4">
              A modern, human-friendly date library for JavaScript and TypeScript.
            </p>
            <p className="text-lg text-slate-500 max-w-xl mx-auto mb-10">
              Smart formatting. Auto-updating times. Timezone handling that actually works.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/demo"
                className="inline-flex items-center justify-center px-6 py-3 text-base font-medium rounded-lg text-white bg-slate-900 hover:bg-slate-800 transition-colors"
              >
                View Demo
              </Link>
              <a
                href="https://github.com/ZVN-DEV/whenny"
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <LiveDemo
              label="Smart Format"
              code="whenny(date).smart()"
              result={whenny(yesterday).smart()}
            />
            <LiveDemo
              label="Auto-updating"
              code="useRelativeTime(date)"
              result={relativeTime}
              live
            />
            <LiveDemo
              label="Date Comparison"
              code="compare(a, b).smart()"
              result={compare(lastWeek, now).smart()}
            />
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        <h2 className="text-3xl font-bold text-center text-slate-900 mb-4">
          Why Whenny?
        </h2>
        <p className="text-center text-slate-500 mb-12 max-w-2xl mx-auto">
          Built for modern applications that need dates to be human-readable, not just machine-readable.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <FeatureCard
            title="Smart Formatting"
            description="Automatically picks the best format based on context. 'just now', '5 minutes ago', 'Yesterday at 3pm', 'Jan 15'."
          />
          <FeatureCard
            title="React Hooks"
            description="Auto-updating relative times with useRelativeTime(). Countdown timers with useCountdown(). Zero boilerplate."
          />
          <FeatureCard
            title="Timezone Support"
            description="Transfer Protocol preserves timezone context between server and client. Display times in their original timezone."
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
            >
{`import { whenny } from 'whenny'

// Automatically picks the best format
whenny(date).smart()
// "just now"
// "5 minutes ago"
// "Yesterday at 3:45 PM"
// "Monday at 9:00 AM"
// "Jan 15"`}
            </CodeExample>
            <CodeExample
              title="Date Comparisons"
              description="Human-readable descriptions of time differences"
            >
{`import { compare } from 'whenny'

compare(eventDate, now).smart()
// "3 days before"
// "2 hours after"

compare(startDate, endDate).days()
// 14

compare(birthday, today).hours()
// 48`}
            </CodeExample>
            <CodeExample
              title="React Hooks"
              description="Auto-updating times with zero boilerplate"
            >
{`import { useRelativeTime } from 'whenny-react'

function Comment({ createdAt }) {
  // Updates automatically every minute
  const time = useRelativeTime(createdAt)
  return <span>{time}</span>
}

// "5 minutes ago" -> "6 minutes ago" -> ...`}
            </CodeExample>
            <CodeExample
              title="Configurable Output"
              description="Customize all strings to match your product's voice"
            >
{`import { configure } from 'whenny'

configure({
  relative: {
    justNow: 'moments ago',
    minutesAgo: (n) => \`\${n}m ago\`,
    hoursAgo: (n) => \`\${n}h ago\`,
  }
})

// Now: "moments ago", "5m ago", "2h ago"`}
            </CodeExample>
          </div>
        </div>
      </div>

      {/* Server/Client Example */}
      <div className="py-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-slate-900 mb-4">
            Server and Client, In Sync
          </h2>
          <p className="text-center text-slate-500 mb-12 max-w-2xl mx-auto">
            The Transfer Protocol carries timezone context across the wire.
            Server and browser always show the right time.
          </p>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <CodeExample
              title="Server Side"
              description="Serialize dates with timezone context"
            >
{`// API route or server component
import { createTransfer } from 'whenny'

const event = {
  name: 'Team Meeting',
  // Serialize with timezone context
  datetime: createTransfer(
    eventDate,
    { timezone: 'America/New_York' }
  )
}

return Response.json(event)`}
            </CodeExample>
            <CodeExample
              title="Client Side"
              description="Deserialize and display in original timezone"
            >
{`// Client component
import { fromTransfer, whenny } from 'whenny'

const { date, originZone } = fromTransfer(event.datetime)

// Display in event's original timezone
whenny(date).inZone(originZone).format('{time} {timezone}')
// "3:00 PM EST"

// Or in user's local timezone
whenny(date).format('{time}')
// "12:00 PM" (if user is in PST)`}
            </CodeExample>
          </div>
        </div>
      </div>

      {/* Installation */}
      <div className="bg-slate-50 py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-slate-900 mb-4">
            Get Started
          </h2>
          <p className="text-center text-slate-500 mb-12">
            Install via npm
          </p>
          <div className="bg-white rounded-xl border border-slate-200 p-6 max-w-lg mx-auto">
            <pre className="bg-slate-900 text-slate-100 p-4 rounded-lg text-sm overflow-x-auto">
              <code>npm install whenny whenny-react</code>
            </pre>
            <p className="text-sm text-slate-500 mt-4 text-center">
              Then import and use:
            </p>
            <pre className="bg-slate-900 text-slate-100 p-4 rounded-lg text-sm overflow-x-auto mt-2">
              <code>{`import { whenny } from 'whenny'
import { useRelativeTime } from 'whenny-react'`}</code>
            </pre>
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
            Check out the interactive demo or dive into the code.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/demo"
              className="inline-flex items-center justify-center px-8 py-4 text-lg font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition-colors"
            >
              Explore Demo
            </Link>
            <a
              href="https://github.com/ZVN-DEV/whenny"
              className="inline-flex items-center justify-center px-8 py-4 text-lg font-medium rounded-lg text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 transition-colors"
            >
              View on GitHub
            </a>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-slate-200 py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-slate-500 text-sm">
              Whenny - A modern date library
            </p>
            <div className="flex gap-6">
              <a href="https://github.com/ZVN-DEV/whenny" className="text-slate-500 hover:text-slate-700 text-sm">
                GitHub
              </a>
              <Link href="/docs" className="text-slate-500 hover:text-slate-700 text-sm">
                Docs
              </Link>
              <Link href="/demo" className="text-slate-500 hover:text-slate-700 text-sm">
                Demo
              </Link>
              <Link href="/server" className="text-slate-500 hover:text-slate-700 text-sm">
                Server Example
              </Link>
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

function FeatureCard({ title, description }: { title: string; description: string }) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6 hover:shadow-lg transition-shadow">
      <h3 className="text-lg font-semibold text-slate-900 mb-2">{title}</h3>
      <p className="text-slate-500">{description}</p>
    </div>
  )
}

function CodeExample({ title, description, children }: { title: string; description: string; children: string }) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
      <div className="p-4 border-b border-slate-100">
        <h3 className="font-semibold text-slate-900">{title}</h3>
        <p className="text-sm text-slate-500">{description}</p>
      </div>
      <pre className="p-4 bg-slate-900 text-sm overflow-x-auto">
        <code className="text-slate-100 whitespace-pre">{children}</code>
      </pre>
    </div>
  )
}
