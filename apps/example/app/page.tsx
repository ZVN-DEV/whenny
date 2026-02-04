'use client'

import Link from 'next/link'
import { useMemo, useState, useEffect } from 'react'
import { whenny, duration, compare, configure } from 'whenny'
import { useRelativeTime } from 'whenny-react'

// Fade-in animation wrapper
function FadeIn({ children, delay = 0, className = '' }: { children: React.ReactNode; delay?: number; className?: string }) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), delay)
    return () => clearTimeout(timer)
  }, [delay])

  return (
    <div
      className={`transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'} ${className}`}
    >
      {children}
    </div>
  )
}

// Copyable code block with syntax highlighting
function CodeBlock({
  children,
  title,
  language = 'typescript'
}: {
  children: string
  title?: string
  language?: string
}) {
  const [copied, setCopied] = useState(false)

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(children)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  // Simple syntax highlighting
  const highlighted = highlightCode(children, language)

  return (
    <div className="group relative rounded-lg overflow-hidden border border-slate-200 bg-slate-950">
      {title && (
        <div className="flex items-center justify-between px-4 py-2 bg-slate-900 border-b border-slate-800">
          <span className="text-xs font-medium text-slate-400">{title}</span>
        </div>
      )}
      <div className="relative">
        <pre className="p-4 overflow-x-auto text-sm leading-relaxed">
          <code
            className="font-mono"
            dangerouslySetInnerHTML={{ __html: highlighted }}
          />
        </pre>
        <button
          onClick={copyToClipboard}
          className="absolute top-3 right-3 p-2 rounded-md bg-slate-800 hover:bg-slate-700 transition-colors opacity-0 group-hover:opacity-100"
          aria-label="Copy code"
        >
          {copied ? (
            <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          ) : (
            <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          )}
        </button>
      </div>
    </div>
  )
}

// Simple syntax highlighting using token-based approach to avoid regex conflicts
function highlightCode(code: string, _language: string): string {
  // First, escape HTML
  let result = code
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')

  // Use unique placeholders that won't conflict with code content
  const tokens: string[] = []
  const placeholder = (content: string) => {
    const idx = tokens.length
    tokens.push(content)
    return `\x00${idx}\x00`
  }

  // Comments first (highest priority)
  result = result.replace(/(\/\/.*$)/gm, (match) =>
    placeholder(`<span style="color:#64748b">${match}</span>`)
  )

  // Strings
  result = result.replace(/(&quot;|'|`)((?:\\.|(?!\1)[^\\])*?)\1/g, (match) =>
    placeholder(`<span style="color:#34d399">${match}</span>`)
  )

  // Keywords
  const keywords = ['import', 'export', 'from', 'const', 'let', 'var', 'function', 'return', 'if', 'else', 'async', 'await', 'new', 'class', 'extends']
  keywords.forEach(kw => {
    result = result.replace(new RegExp(`\\b(${kw})\\b`, 'g'), (match) =>
      placeholder(`<span style="color:#c084fc">${match}</span>`)
    )
  })

  // Function calls
  result = result.replace(/\b([a-zA-Z_]\w*)\s*\(/g, (match, name) =>
    placeholder(`<span style="color:#60a5fa">${name}</span>`) + '('
  )

  // Numbers (but not inside placeholders)
  result = result.replace(/\b(\d+)\b/g, (match) =>
    placeholder(`<span style="color:#fbbf24">${match}</span>`)
  )

  // Replace placeholders with actual HTML
  result = result.replace(/\x00(\d+)\x00/g, (_, idx) => tokens[parseInt(idx)])

  return result
}

// Install command with copy
function InstallCommand({ command }: { command: string }) {
  const [copied, setCopied] = useState(false)

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(command)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <button
      onClick={copyToClipboard}
      className="group flex items-center gap-3 px-4 py-3 bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors w-full max-w-md"
    >
      <span className="text-slate-500 text-sm">$</span>
      <code className="flex-1 text-left text-slate-100 font-mono text-sm">{command}</code>
      {copied ? (
        <svg className="w-4 h-4 text-green-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      ) : (
        <svg className="w-4 h-4 text-slate-500 group-hover:text-slate-300 flex-shrink-0 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
      )}
    </button>
  )
}

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
    <main className="min-h-screen bg-white">
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-sm border-b border-slate-100">
        <div className="max-w-3xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="font-semibold text-slate-900">Whenny</Link>
          <div className="flex items-center gap-6">
            <Link href="/docs" className="text-sm text-slate-600 hover:text-slate-900 transition-colors">Docs</Link>
            <Link href="/demo" className="text-sm text-slate-600 hover:text-slate-900 transition-colors">Demo</Link>
            <a href="https://github.com/ZVN-DEV/whenny" className="text-sm text-slate-600 hover:text-slate-900 transition-colors">GitHub</a>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <div className="pt-32 pb-16 px-6">
        <div className="max-w-3xl mx-auto">
          <FadeIn>
            <div className="inline-flex items-center px-3 py-1 rounded-full text-xs bg-amber-50 text-amber-700 border border-amber-200 mb-6">
              v0.0.1 Alpha
            </div>
          </FadeIn>

          <FadeIn delay={100}>
            <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight text-slate-900 mb-4">
              Whenny
            </h1>
          </FadeIn>

          <FadeIn delay={200}>
            <p className="text-xl text-slate-600 mb-8 max-w-xl">
              A modern, human-friendly date library for JavaScript and TypeScript.
            </p>
          </FadeIn>

          <FadeIn delay={300}>
            <div className="mb-8">
              <InstallCommand command="npm install whenny" />
            </div>
          </FadeIn>

          <FadeIn delay={400}>
            <div className="flex gap-3">
              <Link
                href="/demo"
                className="inline-flex items-center px-5 py-2.5 text-sm font-medium rounded-lg text-white bg-slate-900 hover:bg-slate-800 transition-colors"
              >
                View Demo
              </Link>
              <a
                href="https://github.com/ZVN-DEV/whenny"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-5 py-2.5 text-sm font-medium rounded-lg text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
              >
                GitHub
              </a>
            </div>
          </FadeIn>
        </div>
      </div>

      {/* Live Demo */}
      <FadeIn delay={500}>
        <div className="px-6 pb-24">
          <div className="max-w-3xl mx-auto">
            <div className="bg-slate-950 rounded-xl p-6 shadow-2xl shadow-slate-200">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-3 h-3 rounded-full bg-red-500/80" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                <div className="w-3 h-3 rounded-full bg-green-500/80" />
                <span className="ml-3 text-slate-500 text-xs font-mono">Live</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
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
                  label="Comparison"
                  code="compare(a, b).smart()"
                  result={compare(lastWeek, now).smart()}
                />
              </div>
            </div>
          </div>
        </div>
      </FadeIn>

      {/* Style Properties - Key Feature */}
      <div className="bg-slate-50 py-24 px-6">
        <div className="max-w-3xl mx-auto">
          <FadeIn>
            <div className="inline-flex items-center px-3 py-1 rounded-full text-xs bg-blue-50 text-blue-700 border border-blue-200 mb-4">
              New in v0.0.1
            </div>
            <h2 className="text-2xl font-semibold text-slate-900 mb-2">
              T-Shirt Size Formatting
            </h2>
            <p className="text-slate-600 mb-8">
              Like Tailwind, but for dates. Configure once, use everywhere with simple properties. No format strings needed.
            </p>
          </FadeIn>

          <div className="space-y-6">
            <FadeIn delay={100}>
              <CodeBlock title="Style Properties">
{`import { whenny } from 'whenny'

const date = new Date('2026-02-03T15:30:00')

// Semantic sizes - no format strings!
whenny(date).xs        // "2/3"
whenny(date).sm        // "Feb 3"
whenny(date).md        // "Feb 3, 2026"
whenny(date).lg        // "February 3rd, 2026"
whenny(date).xl        // "Tuesday, February 3rd, 2026"

// Utility formats
whenny(date).clock     // "3:30 PM"
whenny(date).sortable  // "2026-02-03"
whenny(date).log       // "2026-02-03 15:30:00"`}
              </CodeBlock>
            </FadeIn>

            <FadeIn delay={150}>
              <CodeBlock title="Customize Your Styles">
{`import { configure } from 'whenny'

// Set up your date styles once
configure({
  styles: {
    xs: 'D/M',
    sm: 'D MMM',
    md: 'D MMM YYYY',
    lg: 'Do MMMM, YYYY',
    xl: 'dddd, Do MMMM, YYYY',
  }
})

// Now use everywhere
whenny(date).md  // "3 Feb 2026"`}
              </CodeBlock>
            </FadeIn>

            <FadeIn delay={200}>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <StyleDemo label=".xs" value={whenny(new Date()).xs} />
                <StyleDemo label=".sm" value={whenny(new Date()).sm} />
                <StyleDemo label=".md" value={whenny(new Date()).md} />
                <StyleDemo label=".lg" value={whenny(new Date()).lg} />
              </div>
            </FadeIn>
          </div>
        </div>
      </div>

      {/* Code Examples */}
      <div className="py-24 px-6">
        <div className="max-w-3xl mx-auto">
          <FadeIn>
            <h2 className="text-2xl font-semibold text-slate-900 mb-2">
              Clean API
            </h2>
            <p className="text-slate-600 mb-8">
              Intuitive methods that return exactly what you expect.
            </p>
          </FadeIn>

          <div className="space-y-6">
            <FadeIn delay={100}>
              <CodeBlock title="Smart Formatting">
{`import { whenny } from 'whenny'

// Automatically picks the best format based on context
whenny(fiveMinutesAgo).smart()  // "5 minutes ago"
whenny(yesterday).smart()       // "Yesterday at 3:45 PM"
whenny(lastWeek).smart()        // "Monday at 9:00 AM"
whenny(lastMonth).smart()       // "Jan 15"`}
              </CodeBlock>
            </FadeIn>

            <FadeIn delay={150}>
              <CodeBlock title="Moment.js-Style Patterns">
{`import { whenny } from 'whenny'

// Custom format patterns when you need them
whenny(date).format('YYYY-MM-DD')           // "2026-02-03"
whenny(date).format('dddd, MMMM Do')        // "Tuesday, February 3rd"
whenny(date).format('h:mm A')               // "3:30 PM"
whenny(date).format('[Today is] dddd')      // "Today is Tuesday"`}
              </CodeBlock>
            </FadeIn>

            <FadeIn delay={200}>
              <CodeBlock title="Date Comparisons">
{`import { compare } from 'whenny'

// Human-readable comparisons
compare(eventDate, now).smart()   // "3 days before"
compare(startDate, endDate).days() // 14
compare(deadline, now).hours()     // 48`}
              </CodeBlock>
            </FadeIn>

            <FadeIn delay={250}>
              <CodeBlock title="Duration Formatting">
{`import { duration } from 'whenny'

duration(3661).long()     // "1 hour, 1 minute, 1 second"
duration(3661).compact()  // "1h 1m 1s"
duration(3661).brief()    // "1h 1m" (no seconds)
duration(3661).clock()    // "1:01:01"
duration(3661).timer()    // "01:01:01" (padded)
duration(3661).minimal()  // "1h" (largest unit only)
duration(3661).human()    // "about 1 hour"`}
              </CodeBlock>
            </FadeIn>

            <FadeIn delay={300}>
              <CodeBlock title="React Hooks">
{`import { useRelativeTime, useCountdown } from 'whenny-react'

function Comment({ createdAt }) {
  // Updates automatically every minute
  const time = useRelativeTime(createdAt)
  return <span>{time}</span>
}

function Timer({ deadline }) {
  const { days, hours, minutes, seconds } = useCountdown(deadline)
  return <span>{days}d {hours}h {minutes}m {seconds}s</span>
}`}
              </CodeBlock>
            </FadeIn>

            <FadeIn delay={350}>
              <CodeBlock title="Business Days">
{`import { calendar } from 'whenny'

// Business day calculations
calendar.isBusinessDay(date)           // true/false
calendar.nextBusinessDay()             // Next business day
calendar.addBusinessDays(date, 5)      // Add 5 business days
calendar.businessDaysBetween(a, b)     // Count business days`}
              </CodeBlock>
            </FadeIn>

            <FadeIn delay={400}>
              <CodeBlock title="Configurable Output">
{`import { configure } from 'whenny'

configure({
  relative: {
    justNow: 'moments ago',
    minutesAgo: (n) => \`\${n}m ago\`,
    hoursAgo: (n) => \`\${n}h ago\`,
  }
})

// Now: "moments ago", "5m ago", "2h ago"`}
              </CodeBlock>
            </FadeIn>
          </div>
        </div>
      </div>

      {/* Timezone Section */}
      <div className="py-24 px-6">
        <div className="max-w-3xl mx-auto">
          <FadeIn>
            <h2 className="text-2xl font-semibold text-slate-900 mb-2">
              Server and Client, In Sync
            </h2>
            <p className="text-slate-600 mb-8">
              The Transfer Protocol carries timezone context across the wire. One point in time, universal UTC, displayed correctly everywhere.
            </p>
          </FadeIn>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <FadeIn delay={100}>
              <CodeBlock title="Server Side">
{`import { createTransfer } from 'whenny'

// Serialize with timezone context
const event = {
  name: 'Team Meeting',
  datetime: createTransfer(eventDate, {
    timezone: 'America/New_York'
  })
}

return Response.json(event)`}
              </CodeBlock>
            </FadeIn>

            <FadeIn delay={200}>
              <CodeBlock title="Client Side">
{`import { fromTransfer, whenny } from 'whenny'

const { date, originZone } = fromTransfer(event.datetime)

// Display in original timezone
whenny(date).inZone(originZone).format('{time}')
// "3:00 PM EST"

// Or in user's local timezone
whenny(date).format('{time}')
// "12:00 PM" (if user is in PST)`}
              </CodeBlock>
            </FadeIn>
          </div>

          <FadeIn delay={300}>
            <div className="mt-6">
              <Link
                href="/server"
                className="text-sm text-blue-600 hover:text-blue-800 transition-colors"
              >
                See the full server/client demo →
              </Link>
            </div>
          </FadeIn>
        </div>
      </div>

      {/* Features */}
      <div className="bg-slate-50 py-24 px-6">
        <div className="max-w-3xl mx-auto">
          <FadeIn>
            <h2 className="text-2xl font-semibold text-slate-900 mb-8">
              Why Whenny?
            </h2>
          </FadeIn>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <FadeIn delay={100}>
              <div className="bg-white rounded-lg border border-slate-200 p-5">
                <h3 className="font-medium text-slate-900 mb-2">T-Shirt Sizes</h3>
                <p className="text-sm text-slate-600">
                  Tailwind-inspired API. Use .xs, .sm, .md, .lg, .xl for semantic formatting without format strings.
                </p>
              </div>
            </FadeIn>

            <FadeIn delay={125}>
              <div className="bg-white rounded-lg border border-slate-200 p-5">
                <h3 className="font-medium text-slate-900 mb-2">Smart Formatting</h3>
                <p className="text-sm text-slate-600">
                  Automatically picks the best format. "just now", "5 minutes ago", "Yesterday at 3pm".
                </p>
              </div>
            </FadeIn>

            <FadeIn delay={150}>
              <div className="bg-white rounded-lg border border-slate-200 p-5">
                <h3 className="font-medium text-slate-900 mb-2">React Hooks</h3>
                <p className="text-sm text-slate-600">
                  Auto-updating relative times with useRelativeTime(). Countdown timers with useCountdown().
                </p>
              </div>
            </FadeIn>

            <FadeIn delay={175}>
              <div className="bg-white rounded-lg border border-slate-200 p-5">
                <h3 className="font-medium text-slate-900 mb-2">Duration Formats</h3>
                <p className="text-sm text-slate-600">
                  Multiple formats: .compact(), .brief(), .timer(), .minimal(), .human() for any use case.
                </p>
              </div>
            </FadeIn>

            <FadeIn delay={200}>
              <div className="bg-white rounded-lg border border-slate-200 p-5">
                <h3 className="font-medium text-slate-900 mb-2">Timezone Support</h3>
                <p className="text-sm text-slate-600">
                  Transfer Protocol preserves timezone context between server and client.
                </p>
              </div>
            </FadeIn>

            <FadeIn delay={225}>
              <div className="bg-white rounded-lg border border-slate-200 p-5">
                <h3 className="font-medium text-slate-900 mb-2">Business Days</h3>
                <p className="text-sm text-slate-600">
                  Add/subtract business days, count working days, configurable work week.
                </p>
              </div>
            </FadeIn>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="py-24 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <FadeIn>
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">
              Get Started
            </h2>
          </FadeIn>

          <FadeIn delay={100}>
            <div className="flex flex-col items-center gap-4 mb-8">
              <InstallCommand command="npm install whenny whenny-react" />
            </div>
          </FadeIn>

          <FadeIn delay={200}>
            <div className="flex justify-center gap-4">
              <Link
                href="/docs"
                className="inline-flex items-center px-5 py-2.5 text-sm font-medium rounded-lg text-white bg-slate-900 hover:bg-slate-800 transition-colors"
              >
                Read the Docs
              </Link>
              <Link
                href="/demo"
                className="inline-flex items-center px-5 py-2.5 text-sm font-medium rounded-lg text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
              >
                View Demo
              </Link>
            </div>
          </FadeIn>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-slate-200 py-8 px-6">
        <div className="max-w-3xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-slate-500 text-sm">
            Whenny - A modern date library
          </p>
          <div className="flex gap-6">
            <a href="https://github.com/ZVN-DEV/whenny" className="text-slate-500 hover:text-slate-700 text-sm transition-colors">
              GitHub
            </a>
            <Link href="/docs" className="text-slate-500 hover:text-slate-700 text-sm transition-colors">
              Docs
            </Link>
            <Link href="/demo" className="text-slate-500 hover:text-slate-700 text-sm transition-colors">
              Demo
            </Link>
            <Link href="/server" className="text-slate-500 hover:text-slate-700 text-sm transition-colors">
              Server Example
            </Link>
          </div>
        </div>
      </footer>
    </main>
  )
}

function LiveDemo({ label, code, result, live }: { label: string; code: string; result: string; live?: boolean }) {
  return (
    <div className="bg-slate-900 rounded-lg p-4">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-slate-400 text-xs">{label}</span>
        {live && <span className="px-1.5 py-0.5 rounded text-[10px] bg-green-500/20 text-green-400">LIVE</span>}
      </div>
      <code className="text-blue-400 text-xs block mb-2 font-mono">{code}</code>
      <p className="text-white text-lg font-medium">{result}</p>
    </div>
  )
}

function StyleDemo({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-white rounded-lg border border-slate-200 p-4 text-center">
      <code className="text-blue-600 text-xs font-mono">{label}</code>
      <p className="text-slate-900 font-medium mt-1">{value}</p>
    </div>
  )
}
