'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'

type Section = 'installation' | 'quickstart' | 'core' | 'formatting' | 'relative' | 'smart' | 'compare' | 'duration' | 'timezone' | 'calendar' | 'natural' | 'react' | 'config' | 'cli'

// Fade-in animation wrapper
function FadeIn({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), delay)
    return () => clearTimeout(timer)
  }, [delay])

  return (
    <div className={`transition-all duration-500 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}>
      {children}
    </div>
  )
}

// Copyable code block with syntax highlighting
function CodeBlock({ children, title }: { children: string; title?: string }) {
  const [copied, setCopied] = useState(false)

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(children)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const highlighted = highlightCode(children)

  return (
    <div className="group relative my-4 rounded-lg overflow-hidden border border-slate-200 bg-slate-950">
      {title && (
        <div className="flex items-center justify-between px-4 py-2 bg-slate-900 border-b border-slate-800">
          <span className="text-xs font-medium text-slate-400">{title}</span>
        </div>
      )}
      <div className="relative">
        <pre className="p-4 overflow-x-auto text-sm leading-relaxed">
          <code className="font-mono" dangerouslySetInnerHTML={{ __html: highlighted }} />
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

// Simple syntax highlighting
function highlightCode(code: string): string {
  let result = code
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')

  // Comments
  result = result.replace(/(\/\/.*$)/gm, '<span class="text-slate-500">$1</span>')

  // Strings
  result = result.replace(/(['"`])((?:\\.|(?!\1)[^\\])*?)\1/g, '<span class="text-emerald-400">$1$2$1</span>')

  // Keywords
  const keywords = ['import', 'export', 'from', 'const', 'let', 'var', 'function', 'return', 'if', 'else', 'async', 'await', 'new', 'class', 'extends', 'true', 'false', 'null', 'undefined']
  keywords.forEach(kw => {
    result = result.replace(new RegExp(`\\b(${kw})\\b`, 'g'), '<span class="text-purple-400">$1</span>')
  })

  // Functions
  result = result.replace(/\b([a-zA-Z_]\w*)\s*\(/g, '<span class="text-blue-400">$1</span>(')

  // Numbers
  result = result.replace(/\b(\d+)\b/g, '<span class="text-amber-400">$1</span>')

  return result
}

export default function DocsPage() {
  const [activeSection, setActiveSection] = useState<Section>('installation')

  return (
    <main className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/" className="font-semibold text-slate-900">
              Whenny
            </Link>
            <span className="text-sm text-slate-400">Documentation</span>
          </div>
          <div className="flex items-center gap-6">
            <Link href="/demo" className="text-sm text-slate-600 hover:text-slate-900 transition-colors">
              Demo
            </Link>
            <Link href="/server" className="text-sm text-slate-600 hover:text-slate-900 transition-colors">
              Server
            </Link>
            <a href="https://github.com/ZVN-DEV/whenny" className="text-sm text-slate-600 hover:text-slate-900 transition-colors">
              GitHub
            </a>
          </div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-6 py-8">
        <div className="flex gap-12">
          {/* Sidebar */}
          <nav className="w-56 flex-shrink-0 hidden lg:block">
            <div className="sticky top-24 space-y-1">
              <NavSection title="Getting Started">
                <NavItem section="installation" active={activeSection} onClick={setActiveSection}>Installation</NavItem>
                <NavItem section="quickstart" active={activeSection} onClick={setActiveSection}>Quick Start</NavItem>
              </NavSection>
              <NavSection title="Core API">
                <NavItem section="core" active={activeSection} onClick={setActiveSection}>whenny()</NavItem>
                <NavItem section="formatting" active={activeSection} onClick={setActiveSection}>Formatting</NavItem>
                <NavItem section="relative" active={activeSection} onClick={setActiveSection}>Relative Time</NavItem>
                <NavItem section="smart" active={activeSection} onClick={setActiveSection}>Smart Formatting</NavItem>
                <NavItem section="compare" active={activeSection} onClick={setActiveSection}>Comparison</NavItem>
                <NavItem section="duration" active={activeSection} onClick={setActiveSection}>Duration</NavItem>
              </NavSection>
              <NavSection title="Advanced">
                <NavItem section="timezone" active={activeSection} onClick={setActiveSection}>Timezones</NavItem>
                <NavItem section="calendar" active={activeSection} onClick={setActiveSection}>Calendar</NavItem>
                <NavItem section="natural" active={activeSection} onClick={setActiveSection}>Natural Language</NavItem>
              </NavSection>
              <NavSection title="Integrations">
                <NavItem section="react" active={activeSection} onClick={setActiveSection}>React Hooks</NavItem>
              </NavSection>
              <NavSection title="Configuration">
                <NavItem section="config" active={activeSection} onClick={setActiveSection}>Config</NavItem>
                <NavItem section="cli" active={activeSection} onClick={setActiveSection}>CLI</NavItem>
              </NavSection>
            </div>
          </nav>

          {/* Content */}
          <div className="flex-1 min-w-0 max-w-2xl">
            <FadeIn key={activeSection}>
              {activeSection === 'installation' && <InstallationSection />}
              {activeSection === 'quickstart' && <QuickStartSection />}
              {activeSection === 'core' && <CoreSection />}
              {activeSection === 'formatting' && <FormattingSection />}
              {activeSection === 'relative' && <RelativeSection />}
              {activeSection === 'smart' && <SmartSection />}
              {activeSection === 'compare' && <CompareSection />}
              {activeSection === 'duration' && <DurationSection />}
              {activeSection === 'timezone' && <TimezoneSection />}
              {activeSection === 'calendar' && <CalendarSection />}
              {activeSection === 'natural' && <NaturalSection />}
              {activeSection === 'react' && <ReactSection />}
              {activeSection === 'config' && <ConfigSection />}
              {activeSection === 'cli' && <CLISection />}
            </FadeIn>
          </div>
        </div>
      </div>
    </main>
  )
}

function NavSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="py-3">
      <h3 className="text-[11px] font-medium text-slate-400 uppercase tracking-wider mb-2">{title}</h3>
      <div className="space-y-0.5">{children}</div>
    </div>
  )
}

function NavItem({ section, active, onClick, children }: { section: Section; active: Section; onClick: (s: Section) => void; children: React.ReactNode }) {
  const isActive = section === active
  return (
    <button
      onClick={() => onClick(section)}
      className={`block w-full text-left px-3 py-1.5 text-sm rounded-md transition-colors ${
        isActive ? 'bg-slate-100 text-slate-900 font-medium' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
      }`}
    >
      {children}
    </button>
  )
}

function DocSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h1 className="text-2xl font-semibold text-slate-900 mb-6">{title}</h1>
      {children}
    </div>
  )
}

function InstallationSection() {
  return (
    <DocSection title="Installation">
      <p className="text-slate-600 mb-6">
        Install Whenny via npm. Works in browser and Node.js.
      </p>

      <h2 className="text-lg font-medium text-slate-900 mt-8 mb-3">Core library</h2>
      <CodeBlock>{`npm install whenny`}</CodeBlock>

      <h2 className="text-lg font-medium text-slate-900 mt-8 mb-3">With React hooks</h2>
      <CodeBlock>{`npm install whenny whenny-react`}</CodeBlock>

      <h2 className="text-lg font-medium text-slate-900 mt-8 mb-3">Import</h2>
      <CodeBlock>{`import { whenny, compare, duration, calendar } from 'whenny'
import { useRelativeTime, useCountdown } from 'whenny-react'`}</CodeBlock>
    </DocSection>
  )
}

function QuickStartSection() {
  return (
    <DocSection title="Quick Start">
      <p className="text-slate-600 mb-6">
        Get up and running in minutes.
      </p>

      <h2 className="text-lg font-medium text-slate-900 mt-8 mb-3">Basic Usage</h2>
      <CodeBlock>{`import { whenny } from 'whenny'

// Smart formatting - picks the best format automatically
whenny(new Date()).smart()           // "just now"
whenny(fiveMinutesAgo).smart()       // "5 minutes ago"
whenny(yesterday).smart()            // "Yesterday at 3:45 PM"
whenny(lastWeek).smart()             // "Monday at 9:00 AM"
whenny(lastMonth).smart()            // "Jan 15"

// Relative time
whenny(date).relative()              // "5 minutes ago"
whenny(futureDate).relative()        // "in 3 days"

// Format presets
whenny(date).short()                 // "Jan 15"
whenny(date).long()                  // "January 15, 2024"
whenny(date).time()                  // "3:45 PM"
whenny(date).iso()                   // "2024-01-15T15:45:00.000Z"

// Custom formats
whenny(date).format('{weekday}, {monthFull} {day}')`}</CodeBlock>

      <h2 className="text-lg font-medium text-slate-900 mt-8 mb-3">React Hooks</h2>
      <CodeBlock>{`import { useRelativeTime, useCountdown } from 'whenny-react'

function Comment({ createdAt }) {
  // Auto-updates every minute
  const timeAgo = useRelativeTime(createdAt)
  return <span>{timeAgo}</span>
}

function Timer({ deadline }) {
  const { days, hours, minutes, seconds } = useCountdown(deadline)
  return <span>{days}d {hours}h {minutes}m {seconds}s</span>
}`}</CodeBlock>
    </DocSection>
  )
}

function CoreSection() {
  return (
    <DocSection title="The whenny() Function">
      <p className="text-slate-600 mb-6">
        The <code className="bg-slate-100 px-1.5 py-0.5 rounded text-sm font-mono">whenny()</code> function is your entry point for all date operations.
      </p>

      <h2 className="text-lg font-medium text-slate-900 mt-8 mb-3">Creating Instances</h2>
      <CodeBlock>{`import { whenny, now, utcNow, localNow, inZone } from 'whenny'

// From various inputs
whenny(new Date())                    // From Date object
whenny('2024-01-15T10:30:00Z')        // From ISO string
whenny(1705312200000)                 // From Unix timestamp (ms)
whenny('2024-01-15')                  // From date string

// Current time helpers
now()                                 // Current time
utcNow()                              // Current UTC time
localNow()                            // Current local time
inZone('America/New_York')            // Current time in specific zone`}</CodeBlock>

      <h2 className="text-lg font-medium text-slate-900 mt-8 mb-3">Chaining Methods</h2>
      <CodeBlock>{`const date = whenny('2024-01-15T15:30:00Z')

// All methods return strings
date.smart()                          // Context-aware format
date.relative()                       // Relative to now
date.short()                          // "Jan 15"
date.long()                           // "January 15, 2024"
date.time()                           // "3:30 PM"
date.datetime()                       // "Jan 15, 3:30 PM"
date.iso()                            // ISO 8601 format
date.format('{...}')                  // Custom format`}</CodeBlock>

      <h2 className="text-lg font-medium text-slate-900 mt-8 mb-3">Timezone Methods</h2>
      <CodeBlock>{`const date = whenny('2024-01-15T15:30:00Z')

date.inZone('America/New_York')       // Convert to timezone
date.zone                             // Get current timezone
date.offset                           // Get offset in minutes
date.transfer()                       // Create transfer payload`}</CodeBlock>
    </DocSection>
  )
}

function FormattingSection() {
  return (
    <DocSection title="Formatting">
      <p className="text-slate-600 mb-6">
        Format dates using presets or custom format strings with tokens.
      </p>

      <h2 className="text-lg font-medium text-slate-900 mt-8 mb-3">Presets</h2>
      <CodeBlock>{`const date = whenny('2024-01-15T15:30:00Z')

date.short()      // "Jan 15"
date.long()       // "January 15, 2024"
date.time()       // "3:30 PM"
date.datetime()   // "Jan 15, 3:30 PM"
date.iso()        // "2024-01-15T15:30:00.000Z"`}</CodeBlock>

      <h2 className="text-lg font-medium text-slate-900 mt-8 mb-3">Custom Formats</h2>
      <CodeBlock>{`date.format('{monthFull} {day}, {year}')       // "January 15, 2024"
date.format('{weekday}, {monthShort} {day}')   // "Monday, Jan 15"
date.format('{year}-{month}-{day}')            // "2024-01-15"
date.format('{hour}:{minute} {ampm}')          // "3:30 PM"
date.format('{hour24}:{minute}:{second}')      // "15:30:00"`}</CodeBlock>

      <h2 className="text-lg font-medium text-slate-900 mt-8 mb-3">Available Tokens</h2>
      <div className="overflow-x-auto my-4">
        <table className="w-full text-sm border border-slate-200 rounded-lg overflow-hidden">
          <thead className="bg-slate-50">
            <tr>
              <th className="text-left px-4 py-2 border-b border-slate-200 font-medium text-slate-700">Token</th>
              <th className="text-left px-4 py-2 border-b border-slate-200 font-medium text-slate-700">Output</th>
              <th className="text-left px-4 py-2 border-b border-slate-200 font-medium text-slate-700">Example</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 text-slate-600">
            <tr><td className="px-4 py-2 font-mono text-xs text-slate-800">{'{year}'}</td><td className="px-4 py-2">Full year</td><td className="px-4 py-2">2024</td></tr>
            <tr><td className="px-4 py-2 font-mono text-xs text-slate-800">{'{month}'}</td><td className="px-4 py-2">Month (padded)</td><td className="px-4 py-2">01</td></tr>
            <tr><td className="px-4 py-2 font-mono text-xs text-slate-800">{'{monthShort}'}</td><td className="px-4 py-2">Month name short</td><td className="px-4 py-2">Jan</td></tr>
            <tr><td className="px-4 py-2 font-mono text-xs text-slate-800">{'{monthFull}'}</td><td className="px-4 py-2">Month name full</td><td className="px-4 py-2">January</td></tr>
            <tr><td className="px-4 py-2 font-mono text-xs text-slate-800">{'{day}'}</td><td className="px-4 py-2">Day of month</td><td className="px-4 py-2">15</td></tr>
            <tr><td className="px-4 py-2 font-mono text-xs text-slate-800">{'{dayOrdinal}'}</td><td className="px-4 py-2">Day with suffix</td><td className="px-4 py-2">15th</td></tr>
            <tr><td className="px-4 py-2 font-mono text-xs text-slate-800">{'{weekday}'}</td><td className="px-4 py-2">Weekday name</td><td className="px-4 py-2">Monday</td></tr>
            <tr><td className="px-4 py-2 font-mono text-xs text-slate-800">{'{weekdayShort}'}</td><td className="px-4 py-2">Weekday short</td><td className="px-4 py-2">Mon</td></tr>
            <tr><td className="px-4 py-2 font-mono text-xs text-slate-800">{'{hour}'}</td><td className="px-4 py-2">Hour (12h)</td><td className="px-4 py-2">3</td></tr>
            <tr><td className="px-4 py-2 font-mono text-xs text-slate-800">{'{hour24}'}</td><td className="px-4 py-2">Hour (24h)</td><td className="px-4 py-2">15</td></tr>
            <tr><td className="px-4 py-2 font-mono text-xs text-slate-800">{'{minute}'}</td><td className="px-4 py-2">Minute</td><td className="px-4 py-2">30</td></tr>
            <tr><td className="px-4 py-2 font-mono text-xs text-slate-800">{'{second}'}</td><td className="px-4 py-2">Second</td><td className="px-4 py-2">00</td></tr>
            <tr><td className="px-4 py-2 font-mono text-xs text-slate-800">{'{ampm}'}</td><td className="px-4 py-2">AM/PM</td><td className="px-4 py-2">PM</td></tr>
          </tbody>
        </table>
      </div>
    </DocSection>
  )
}

function RelativeSection() {
  return (
    <DocSection title="Relative Time">
      <p className="text-slate-600 mb-6">
        Display human-readable time distances like "5 minutes ago" or "in 3 days".
      </p>

      <h2 className="text-lg font-medium text-slate-900 mt-8 mb-3">Basic Usage</h2>
      <CodeBlock>{`import { whenny, relative } from 'whenny'

// Using whenny instance
whenny(date).relative()               // "5 minutes ago"
whenny(futureDate).relative()         // "in 3 days"

// Direct function
relative(date)                        // "5 minutes ago"

// Relative to another date (not now)
whenny(date).from(otherDate)          // "3 days ago"`}</CodeBlock>

      <h2 className="text-lg font-medium text-slate-900 mt-8 mb-3">Output Examples</h2>
      <div className="overflow-x-auto my-4">
        <table className="w-full text-sm border border-slate-200 rounded-lg overflow-hidden">
          <thead className="bg-slate-50">
            <tr>
              <th className="text-left px-4 py-2 border-b border-slate-200 font-medium text-slate-700">Time Difference</th>
              <th className="text-left px-4 py-2 border-b border-slate-200 font-medium text-slate-700">Output</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 text-slate-600">
            <tr><td className="px-4 py-2">&lt; 30 seconds</td><td className="px-4 py-2">just now</td></tr>
            <tr><td className="px-4 py-2">&lt; 1 minute</td><td className="px-4 py-2">45 seconds ago</td></tr>
            <tr><td className="px-4 py-2">&lt; 1 hour</td><td className="px-4 py-2">5 minutes ago</td></tr>
            <tr><td className="px-4 py-2">&lt; 24 hours</td><td className="px-4 py-2">3 hours ago</td></tr>
            <tr><td className="px-4 py-2">Yesterday</td><td className="px-4 py-2">yesterday</td></tr>
            <tr><td className="px-4 py-2">&lt; 7 days</td><td className="px-4 py-2">5 days ago</td></tr>
            <tr><td className="px-4 py-2">&lt; 30 days</td><td className="px-4 py-2">2 weeks ago</td></tr>
            <tr><td className="px-4 py-2">&lt; 365 days</td><td className="px-4 py-2">3 months ago</td></tr>
            <tr><td className="px-4 py-2">&gt; 365 days</td><td className="px-4 py-2">2 years ago</td></tr>
          </tbody>
        </table>
      </div>
    </DocSection>
  )
}

function SmartSection() {
  return (
    <DocSection title="Smart Formatting">
      <p className="text-slate-600 mb-6">
        Context-aware formatting that automatically picks the best representation based on how far away the date is.
      </p>

      <h2 className="text-lg font-medium text-slate-900 mt-8 mb-3">Basic Usage</h2>
      <CodeBlock>{`import { whenny, smart } from 'whenny'

// Using whenny instance
whenny(date).smart()

// Direct function
smart(date)

// With timezone context (required on server)
whenny(date).smart({ for: 'America/New_York' })

// Relative to a specific time (not now)
whenny(date).smart({ from: referenceDate })`}</CodeBlock>

      <h2 className="text-lg font-medium text-slate-900 mt-8 mb-3">Output Buckets</h2>
      <div className="overflow-x-auto my-4">
        <table className="w-full text-sm border border-slate-200 rounded-lg overflow-hidden">
          <thead className="bg-slate-50">
            <tr>
              <th className="text-left px-4 py-2 border-b border-slate-200 font-medium text-slate-700">When</th>
              <th className="text-left px-4 py-2 border-b border-slate-200 font-medium text-slate-700">Output</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 text-slate-600">
            <tr><td className="px-4 py-2">Within last minute</td><td className="px-4 py-2">just now</td></tr>
            <tr><td className="px-4 py-2">Within last hour</td><td className="px-4 py-2">5 minutes ago</td></tr>
            <tr><td className="px-4 py-2">Today</td><td className="px-4 py-2">3:45 PM</td></tr>
            <tr><td className="px-4 py-2">Yesterday</td><td className="px-4 py-2">Yesterday at 3:45 PM</td></tr>
            <tr><td className="px-4 py-2">Within last week</td><td className="px-4 py-2">Tuesday at 3:45 PM</td></tr>
            <tr><td className="px-4 py-2">Within this year</td><td className="px-4 py-2">Jan 15</td></tr>
            <tr><td className="px-4 py-2">Older</td><td className="px-4 py-2">Jan 15, 2023</td></tr>
          </tbody>
        </table>
      </div>
    </DocSection>
  )
}

function CompareSection() {
  return (
    <DocSection title="Date Comparison">
      <p className="text-slate-600 mb-6">
        Compare two dates and get human-readable descriptions of the difference.
      </p>

      <h2 className="text-lg font-medium text-slate-900 mt-8 mb-3">Basic Usage</h2>
      <CodeBlock>{`import { compare } from 'whenny'

const result = compare(dateA, dateB)

// Human-readable comparison
result.smart()        // "3 days before" or "2 hours after"

// Raw values
result.days()         // -3 (negative = before)
result.hours()        // -72
result.minutes()      // -4320`}</CodeBlock>

      <h2 className="text-lg font-medium text-slate-900 mt-8 mb-3">Distance (No Direction)</h2>
      <CodeBlock>{`import { distance } from 'whenny'

const dist = distance(dateA, dateB)

dist.human()          // "3 days"
dist.exact()          // "3 days, 4 hours, 30 minutes"
dist.days             // 3
dist.hours            // 4
dist.minutes          // 30`}</CodeBlock>
    </DocSection>
  )
}

function DurationSection() {
  return (
    <DocSection title="Duration">
      <p className="text-slate-600 mb-6">
        Format time durations in various styles. Great for video lengths, timers, and countdowns.
      </p>

      <h2 className="text-lg font-medium text-slate-900 mt-8 mb-3">Basic Usage</h2>
      <CodeBlock>{`import { duration, durationMs, durationBetween } from 'whenny'

// From seconds
duration(3661).long()      // "1 hour, 1 minute, 1 second"
duration(3661).compact()   // "1h 1m 1s"
duration(3661).clock()     // "1:01:01"
duration(3661).human()     // "about 1 hour"

// From milliseconds
durationMs(3661000).compact()   // "1h 1m 1s"

// Between two dates
durationBetween(startDate, endDate).compact()`}</CodeBlock>

      <h2 className="text-lg font-medium text-slate-900 mt-8 mb-3">Accessing Parts</h2>
      <CodeBlock>{`const d = duration(3661)

d.hours        // 1
d.minutes      // 1
d.seconds      // 1
d.totalSeconds // 3661`}</CodeBlock>
    </DocSection>
  )
}

function TimezoneSection() {
  return (
    <DocSection title="Timezones">
      <p className="text-slate-600 mb-6">
        Handle timezones properly with the Transfer Protocol - designed to solve server/browser confusion.
      </p>

      <h2 className="text-lg font-medium text-slate-900 mt-8 mb-3">The Problem</h2>
      <p className="text-slate-600 mb-4">
        When a user in New York schedules an event at 3pm, and you save it to your database, how do you make sure it displays as 3pm EST for them and 12pm PST for someone in California?
      </p>
      <p className="text-slate-600 mb-6">
        The answer is UTC. There's one point in time, universally. The Transfer Protocol preserves the original timezone context alongside the UTC timestamp.
      </p>

      <h2 className="text-lg font-medium text-slate-900 mt-8 mb-3">Browser to Server</h2>
      <CodeBlock title="Browser: Creating a Transfer">{`import { createTransfer } from 'whenny'

// User selects a date in their local timezone
const selectedDate = new Date('2024-01-15T15:00:00')

// Create a transfer payload with timezone context
const payload = createTransfer(selectedDate, {
  timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
})

// Result:
// {
//   iso: "2024-01-15T20:00:00.000Z",  // UTC timestamp
//   originZone: "America/New_York",    // Where user was
//   originOffset: -300                 // UTC offset in minutes
// }

// Send to your API
fetch('/api/events', {
  method: 'POST',
  body: JSON.stringify({ scheduledAt: payload })
})`}</CodeBlock>

      <h2 className="text-lg font-medium text-slate-900 mt-8 mb-3">Server: Receiving and Storing</h2>
      <CodeBlock title="Server: Processing the Transfer">{`import { fromTransfer, whenny } from 'whenny'

// Receive the transfer payload
const received = fromTransfer(body.scheduledAt)

received.date           // JavaScript Date object (UTC)
received.originZone     // "America/New_York"
received.originOffset   // -300

// Store in database: save both the UTC timestamp AND the origin zone
await db.events.create({
  datetime: received.date,        // Store as UTC
  timezone: received.originZone,  // Remember where it was created
})

// The UTC timestamp is the universal truth.
// The timezone tells you how to display it.`}</CodeBlock>

      <h2 className="text-lg font-medium text-slate-900 mt-8 mb-3">Displaying Correctly</h2>
      <CodeBlock title="Displaying in Different Contexts">{`import { whenny } from 'whenny'

// Display in the event's original timezone
whenny(event.datetime).inZone(event.timezone).format('{time} {timezone}')
// "3:00 PM EST"

// Display in viewer's local timezone
whenny(event.datetime).format('{time}')
// "12:00 PM" (for someone in PST)

// Display in UTC
whenny(event.datetime).inZone('UTC').format('{time} UTC')
// "8:00 PM UTC"`}</CodeBlock>

      <h2 className="text-lg font-medium text-slate-900 mt-8 mb-3">Timezone Utilities</h2>
      <CodeBlock>{`import { tz, inZone } from 'whenny'

// Get user's local timezone
tz.local()                               // "America/New_York"

// All IANA timezone names
tz.list()                                // ["Africa/Abidjan", ...]

// Get current offset for a timezone
tz.offset('America/New_York')            // -300 (or -240 during DST)

// Get abbreviation
tz.abbreviation('America/New_York')      // "EST" or "EDT"`}</CodeBlock>
    </DocSection>
  )
}

function CalendarSection() {
  return (
    <DocSection title="Calendar Helpers">
      <p className="text-slate-600 mb-6">
        Utility functions for common calendar operations.
      </p>

      <h2 className="text-lg font-medium text-slate-900 mt-8 mb-3">Day Queries</h2>
      <CodeBlock>{`import { calendar } from 'whenny'

calendar.isToday(date)
calendar.isYesterday(date)
calendar.isTomorrow(date)
calendar.isThisWeek(date)
calendar.isThisMonth(date)
calendar.isThisYear(date)

calendar.isWeekend(date)
calendar.isWeekday(date)
calendar.isBusinessDay(date)
calendar.isPast(date)
calendar.isFuture(date)`}</CodeBlock>

      <h2 className="text-lg font-medium text-slate-900 mt-8 mb-3">Boundaries</h2>
      <CodeBlock>{`calendar.startOf(date, 'day')
calendar.startOf(date, 'week')
calendar.startOf(date, 'month')
calendar.startOf(date, 'year')

calendar.endOf(date, 'day')
calendar.endOf(date, 'week')
calendar.endOf(date, 'month')
calendar.endOf(date, 'year')`}</CodeBlock>

      <h2 className="text-lg font-medium text-slate-900 mt-8 mb-3">Distances</h2>
      <CodeBlock>{`calendar.daysUntil(futureDate)      // 15
calendar.daysSince(pastDate)        // 7
calendar.businessDaysBetween(a, b)  // 10`}</CodeBlock>
    </DocSection>
  )
}

function NaturalSection() {
  return (
    <DocSection title="Natural Language">
      <p className="text-slate-600 mb-6">
        Parse human-friendly date expressions into Date objects.
      </p>

      <h2 className="text-lg font-medium text-slate-900 mt-8 mb-3">Basic Expressions</h2>
      <CodeBlock>{`import { parse } from 'whenny/natural'

parse('now')                    // Current date/time
parse('today')                  // Today at midnight
parse('tomorrow')               // Tomorrow at midnight
parse('yesterday')              // Yesterday at midnight

parse('next week')              // Start of next week
parse('last month')             // Start of last month
parse('next tuesday')           // The coming Tuesday`}</CodeBlock>

      <h2 className="text-lg font-medium text-slate-900 mt-8 mb-3">Time Expressions</h2>
      <CodeBlock>{`parse('tomorrow at 3pm')
parse('next friday at 10:30')
parse('in 2 hours')
parse('in 30 minutes')
parse('in 3 days')`}</CodeBlock>

      <h2 className="text-lg font-medium text-slate-900 mt-8 mb-3">Semantic Expressions</h2>
      <CodeBlock>{`parse('end of month')
parse('end of year')
parse('start of week')
parse('tomorrow morning')       // 9:00 AM
parse('tomorrow afternoon')     // 2:00 PM
parse('tomorrow evening')       // 6:00 PM`}</CodeBlock>
    </DocSection>
  )
}

function ReactSection() {
  return (
    <DocSection title="React Hooks">
      <p className="text-slate-600 mb-6">
        React bindings for common date patterns.
      </p>
      <CodeBlock>{`npm install whenny-react`}</CodeBlock>

      <h2 className="text-lg font-medium text-slate-900 mt-8 mb-3">useRelativeTime</h2>
      <p className="text-slate-600 mb-3">Auto-updating relative time display.</p>
      <CodeBlock>{`import { useRelativeTime } from 'whenny-react'

function Comment({ createdAt }) {
  const timeAgo = useRelativeTime(createdAt)
  // Automatically updates: "just now" -> "1 min ago" -> "2 min ago"

  return <span className="text-gray-500">{timeAgo}</span>
}

// With custom update interval
const timeAgo = useRelativeTime(createdAt, {
  updateInterval: 30000,  // Update every 30s (default: 60s)
})`}</CodeBlock>

      <h2 className="text-lg font-medium text-slate-900 mt-8 mb-3">useCountdown</h2>
      <p className="text-slate-600 mb-3">Countdown timer with all the parts.</p>
      <CodeBlock>{`import { useCountdown } from 'whenny-react'

function SaleTimer({ endsAt }) {
  const { days, hours, minutes, seconds, isExpired } = useCountdown(endsAt)

  if (isExpired) {
    return <span>Sale ended</span>
  }

  return (
    <div>
      <span>{days}d</span>
      <span>{hours}h</span>
      <span>{minutes}m</span>
      <span>{seconds}s</span>
    </div>
  )
}`}</CodeBlock>

      <h2 className="text-lg font-medium text-slate-900 mt-8 mb-3">useTimezone</h2>
      <p className="text-slate-600 mb-3">Access and manage timezone context.</p>
      <CodeBlock>{`import { useTimezone, TimezoneProvider } from 'whenny-react'

// Wrap your app
function App() {
  return (
    <TimezoneProvider>
      <MyApp />
    </TimezoneProvider>
  )
}

// Use anywhere
function TimeDisplay({ date }) {
  const { timezone, setTimezone } = useTimezone()

  return (
    <div>
      <span>{whenny(date).smart({ for: timezone })}</span>
      <select onChange={e => setTimezone(e.target.value)}>
        <option value="local">Local</option>
        <option value="UTC">UTC</option>
      </select>
    </div>
  )
}`}</CodeBlock>

      <h2 className="text-lg font-medium text-slate-900 mt-8 mb-3">useDateFormatter</h2>
      <p className="text-slate-600 mb-3">Memoized formatter that updates when config changes.</p>
      <CodeBlock>{`import { useDateFormatter } from 'whenny-react'

function EventDate({ date }) {
  const format = useDateFormatter()

  return (
    <div>
      <span>{format(date).smart()}</span>
      <span>{format(date).relative()}</span>
    </div>
  )
}`}</CodeBlock>
    </DocSection>
  )
}

function ConfigSection() {
  return (
    <DocSection title="Configuration">
      <p className="text-slate-600 mb-6">
        Customize Whenny's output by configuring strings, thresholds, and formats.
      </p>

      <h2 className="text-lg font-medium text-slate-900 mt-8 mb-3">Runtime Configuration</h2>
      <CodeBlock>{`import { configure } from 'whenny'

configure({
  relative: {
    justNow: 'moments ago',
    minutesAgo: (n) => \`\${n}m ago\`,
    hoursAgo: (n) => \`\${n}h ago\`,
  }
})

// Now all relative times use your config
whenny(date).relative()  // "moments ago", "5m ago", "2h ago"`}</CodeBlock>

      <h2 className="text-lg font-medium text-slate-900 mt-8 mb-3">Thresholds</h2>
      <CodeBlock>{`configure({
  relative: {
    thresholds: {
      justNow: 30,        // < 30s = "just now"
      seconds: 60,        // < 60s = "X seconds ago"
      minutes: 3600,      // < 1hr = "X minutes ago"
      hours: 86400,       // < 24hr = "X hours ago"
      days: 604800,       // < 7 days = "X days ago"
      weeks: 2592000,     // < 30 days = "X weeks ago"
      months: 31536000,   // < 365 days = "X months ago"
    },
  }
})`}</CodeBlock>

      <h2 className="text-lg font-medium text-slate-900 mt-8 mb-3">Using Themes</h2>
      <CodeBlock>{`import { configure } from 'whenny'
import { slack, twitter, formal } from 'whenny/themes'

// Use a pre-built theme
configure(slack)

// Or extend one
configure({
  ...slack,
  relative: {
    ...slack.relative,
    justNow: 'right now',
  }
})`}</CodeBlock>
    </DocSection>
  )
}

function CLISection() {
  return (
    <DocSection title="CLI">
      <p className="text-slate-600 mb-6">
        The Whenny CLI lets you add modules directly to your project (shadcn style).
      </p>

      <h2 className="text-lg font-medium text-slate-900 mt-8 mb-3">Initialize</h2>
      <CodeBlock>{`npx whenny init

# Options
npx whenny init --minimal    # Just core, nothing else
npx whenny init --full       # Everything included
npx whenny init -y           # Skip prompts, use defaults`}</CodeBlock>

      <h2 className="text-lg font-medium text-slate-900 mt-8 mb-3">Add Modules</h2>
      <CodeBlock>{`npx whenny add relative
npx whenny add smart timezone
npx whenny add all

# Options
npx whenny add relative --path src/utils/whenny
npx whenny add relative --overwrite`}</CodeBlock>

      <h2 className="text-lg font-medium text-slate-900 mt-8 mb-3">List Available Modules</h2>
      <CodeBlock>{`npx whenny list
npx whenny ls --installed`}</CodeBlock>

      <h2 className="text-lg font-medium text-slate-900 mt-8 mb-3">Check for Updates</h2>
      <CodeBlock>{`npx whenny diff relative`}</CodeBlock>
    </DocSection>
  )
}
