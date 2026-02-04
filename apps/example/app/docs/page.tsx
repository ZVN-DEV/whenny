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

// Simple syntax highlighting using token-based approach to avoid regex conflicts
function highlightCode(code: string): string {
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
  const keywords = ['import', 'export', 'from', 'const', 'let', 'var', 'function', 'return', 'if', 'else', 'async', 'await', 'new', 'class', 'extends', 'true', 'false', 'null', 'undefined']
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

      <h2 className="text-lg font-medium text-slate-900 mt-8 mb-3">Style Properties (Recommended)</h2>
      <CodeBlock>{`import { whenny } from 'whenny'

// T-shirt sizes - like Tailwind for dates
whenny(date).xs        // "1/15"
whenny(date).sm        // "Jan 15"
whenny(date).md        // "Jan 15, 2024"
whenny(date).lg        // "January 15th, 2024"
whenny(date).xl        // "Wednesday, January 15th, 2024"

// Utility formats
whenny(date).clock     // "3:45 PM"
whenny(date).sortable  // "2024-01-15"
whenny(date).log       // "2024-01-15 15:45:00"`}</CodeBlock>

      <h2 className="text-lg font-medium text-slate-900 mt-8 mb-3">Smart & Relative</h2>
      <CodeBlock>{`// Smart formatting - picks the best format automatically
whenny(new Date()).smart()           // "just now"
whenny(fiveMinutesAgo).smart()       // "5 minutes ago"
whenny(yesterday).smart()            // "Yesterday at 3:45 PM"
whenny(lastWeek).smart()             // "Monday at 9:00 AM"

// Relative time
whenny(date).relative()              // "5 minutes ago"
whenny(futureDate).relative()        // "in 3 days"`}</CodeBlock>

      <h2 className="text-lg font-medium text-slate-900 mt-8 mb-3">Custom Patterns</h2>
      <CodeBlock>{`// Moment.js-style patterns when you need them
whenny(date).format('YYYY-MM-DD')          // "2024-01-15"
whenny(date).format('dddd, MMMM Do')       // "Wednesday, January 15th"
whenny(date).format('h:mm A')              // "3:45 PM"
whenny(date).format('[Today is] dddd')     // "Today is Wednesday"`}</CodeBlock>

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

      <h2 className="text-lg font-medium text-slate-900 mt-8 mb-3">Style Properties</h2>
      <CodeBlock>{`const date = whenny('2024-01-15T15:30:00Z')

// T-shirt sizes (configurable)
date.xs         // "1/15"
date.sm         // "Jan 15"
date.md         // "Jan 15, 2024"
date.lg         // "January 15th, 2024"
date.xl         // "Wednesday, January 15th, 2024"

// Utility formats
date.clock      // "3:30 PM"
date.sortable   // "2024-01-15"
date.log        // "2024-01-15 15:30:00"`}</CodeBlock>

      <h2 className="text-lg font-medium text-slate-900 mt-8 mb-3">Formatting Methods</h2>
      <CodeBlock>{`const date = whenny('2024-01-15T15:30:00Z')

date.smart()                          // Context-aware format
date.relative()                       // Relative to now
date.short()                          // "Jan 15"
date.long()                           // "January 15, 2024"
date.time()                           // "3:30 PM"
date.datetime()                       // "Jan 15, 3:30 PM"
date.iso()                            // ISO 8601 format
date.format('dddd, MMMM Do')          // Custom pattern`}</CodeBlock>

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
        Format dates using style properties, pattern syntax, or presets.
      </p>

      <h2 className="text-lg font-medium text-slate-900 mt-8 mb-3">Style Properties (Recommended)</h2>
      <p className="text-slate-600 mb-3">
        Like Tailwind for dates. Configure once, use everywhere with simple properties.
      </p>
      <CodeBlock>{`const date = whenny('2024-01-15T15:30:00Z')

// T-shirt sizes - no format strings needed
date.xs         // "1/15"
date.sm         // "Jan 15"
date.md         // "Jan 15, 2024"
date.lg         // "January 15th, 2024"
date.xl         // "Wednesday, January 15th, 2024"

// Utility formats
date.clock      // "3:30 PM"
date.sortable   // "2024-01-15"
date.log        // "2024-01-15 15:30:00"`}</CodeBlock>

      <h2 className="text-lg font-medium text-slate-900 mt-8 mb-3">Customize Styles</h2>
      <CodeBlock>{`import { configure } from 'whenny'

// Configure your styles once
configure({
  styles: {
    xs: 'D/M',
    sm: 'D MMM',
    md: 'D MMM YYYY',
    lg: 'Do MMMM, YYYY',
    xl: 'dddd, Do MMMM, YYYY',
    time: 'HH:mm',
  }
})

// Use everywhere
whenny(date).md  // "15 Jan 2024"`}</CodeBlock>

      <h2 className="text-lg font-medium text-slate-900 mt-8 mb-3">Pattern Syntax (Moment.js-style)</h2>
      <CodeBlock>{`// Custom format patterns when you need them
date.format('YYYY-MM-DD')           // "2024-01-15"
date.format('dddd, MMMM Do')        // "Wednesday, January 15th"
date.format('h:mm A')               // "3:30 PM"
date.format('[Today is] dddd')      // "Today is Wednesday"
date.format('MMM Do, YYYY')         // "Jan 15th, 2024"`}</CodeBlock>

      <h2 className="text-lg font-medium text-slate-900 mt-8 mb-3">Presets</h2>
      <CodeBlock>{`date.short()      // "Jan 15"
date.long()       // "January 15, 2024"
date.time()       // "3:30 PM"
date.datetime()   // "Jan 15, 3:30 PM"
date.iso()        // "2024-01-15T15:30:00.000Z"`}</CodeBlock>

      <h2 className="text-lg font-medium text-slate-900 mt-8 mb-3">Available Pattern Tokens</h2>
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
            <tr><td className="px-4 py-2 font-mono text-xs text-slate-800">YYYY</td><td className="px-4 py-2">Full year</td><td className="px-4 py-2">2024</td></tr>
            <tr><td className="px-4 py-2 font-mono text-xs text-slate-800">YY</td><td className="px-4 py-2">2-digit year</td><td className="px-4 py-2">24</td></tr>
            <tr><td className="px-4 py-2 font-mono text-xs text-slate-800">MMMM</td><td className="px-4 py-2">Full month name</td><td className="px-4 py-2">January</td></tr>
            <tr><td className="px-4 py-2 font-mono text-xs text-slate-800">MMM</td><td className="px-4 py-2">Short month name</td><td className="px-4 py-2">Jan</td></tr>
            <tr><td className="px-4 py-2 font-mono text-xs text-slate-800">MM</td><td className="px-4 py-2">Month (padded)</td><td className="px-4 py-2">01</td></tr>
            <tr><td className="px-4 py-2 font-mono text-xs text-slate-800">M</td><td className="px-4 py-2">Month</td><td className="px-4 py-2">1</td></tr>
            <tr><td className="px-4 py-2 font-mono text-xs text-slate-800">dddd</td><td className="px-4 py-2">Full weekday</td><td className="px-4 py-2">Wednesday</td></tr>
            <tr><td className="px-4 py-2 font-mono text-xs text-slate-800">ddd</td><td className="px-4 py-2">Short weekday</td><td className="px-4 py-2">Wed</td></tr>
            <tr><td className="px-4 py-2 font-mono text-xs text-slate-800">DD</td><td className="px-4 py-2">Day (padded)</td><td className="px-4 py-2">03</td></tr>
            <tr><td className="px-4 py-2 font-mono text-xs text-slate-800">D</td><td className="px-4 py-2">Day</td><td className="px-4 py-2">3</td></tr>
            <tr><td className="px-4 py-2 font-mono text-xs text-slate-800">Do</td><td className="px-4 py-2">Day with ordinal</td><td className="px-4 py-2">3rd</td></tr>
            <tr><td className="px-4 py-2 font-mono text-xs text-slate-800">HH</td><td className="px-4 py-2">Hour 24h (padded)</td><td className="px-4 py-2">15</td></tr>
            <tr><td className="px-4 py-2 font-mono text-xs text-slate-800">H</td><td className="px-4 py-2">Hour 24h</td><td className="px-4 py-2">15</td></tr>
            <tr><td className="px-4 py-2 font-mono text-xs text-slate-800">hh</td><td className="px-4 py-2">Hour 12h (padded)</td><td className="px-4 py-2">03</td></tr>
            <tr><td className="px-4 py-2 font-mono text-xs text-slate-800">h</td><td className="px-4 py-2">Hour 12h</td><td className="px-4 py-2">3</td></tr>
            <tr><td className="px-4 py-2 font-mono text-xs text-slate-800">mm</td><td className="px-4 py-2">Minute (padded)</td><td className="px-4 py-2">30</td></tr>
            <tr><td className="px-4 py-2 font-mono text-xs text-slate-800">ss</td><td className="px-4 py-2">Second (padded)</td><td className="px-4 py-2">45</td></tr>
            <tr><td className="px-4 py-2 font-mono text-xs text-slate-800">A</td><td className="px-4 py-2">AM/PM uppercase</td><td className="px-4 py-2">PM</td></tr>
            <tr><td className="px-4 py-2 font-mono text-xs text-slate-800">a</td><td className="px-4 py-2">am/pm lowercase</td><td className="px-4 py-2">pm</td></tr>
            <tr><td className="px-4 py-2 font-mono text-xs text-slate-800">Z</td><td className="px-4 py-2">Timezone offset</td><td className="px-4 py-2">+05:30</td></tr>
            <tr><td className="px-4 py-2 font-mono text-xs text-slate-800">[text]</td><td className="px-4 py-2">Escaped literal</td><td className="px-4 py-2">text</td></tr>
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

      <h2 className="text-lg font-medium text-slate-900 mt-8 mb-3">Format Methods</h2>
      <CodeBlock>{`import { duration } from 'whenny'

const d = duration(3661)  // 1 hour, 1 minute, 1 second

// Different formats for different use cases
d.long()      // "1 hour, 1 minute, 1 second"
d.compact()   // "1h 1m 1s"
d.brief()     // "1h 1m"        (no seconds unless < 1 minute)
d.clock()     // "1:01:01"      (like media player)
d.timer()     // "01:01:01"     (padded, like stopwatch)
d.minimal()   // "1h"           (largest unit only)
d.human()     // "about 1 hour" (approximate)`}</CodeBlock>

      <h2 className="text-lg font-medium text-slate-900 mt-8 mb-3">Creating Durations</h2>
      <CodeBlock>{`import { duration, durationMs, durationBetween, until, since } from 'whenny'

// From seconds
duration(3661).compact()              // "1h 1m 1s"

// From milliseconds
durationMs(3661000).compact()         // "1h 1m 1s"

// Between two dates
durationBetween(start, end).brief()   // "2h 30m"

// From now to a future date
until(deadline).timer()               // "02:30:45"

// From a past date to now
since(createdAt).human()              // "about 3 hours"`}</CodeBlock>

      <h2 className="text-lg font-medium text-slate-900 mt-8 mb-3">Parse Duration Strings</h2>
      <CodeBlock>{`import { parseDuration } from 'whenny'

parseDuration('1h 30m')        // 5400 (seconds)
parseDuration('90m')           // 5400
parseDuration('2h 30m 15s')    // 9015`}</CodeBlock>

      <h2 className="text-lg font-medium text-slate-900 mt-8 mb-3">Accessing Parts</h2>
      <CodeBlock>{`const d = duration(3661)

d.hours         // 1
d.minutes       // 1
d.seconds       // 1
d.totalSeconds  // 3661
d.totalMinutes  // 61
d.totalHours    // 1`}</CodeBlock>
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
        Utility functions for common calendar operations including business days.
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

      <h2 className="text-lg font-medium text-slate-900 mt-8 mb-3">Business Days</h2>
      <CodeBlock>{`import { calendar } from 'whenny'

// Check if a date is a business day
calendar.isBusinessDay(date)              // true/false

// Get next/previous business day
calendar.nextBusinessDay()                // Next business day from today
calendar.nextBusinessDay(date)            // Next business day from date
calendar.previousBusinessDay(date)        // Previous business day

// Add/subtract business days
calendar.addBusinessDays(date, 5)         // Skip weekends
calendar.addBusinessDays(date, -3)        // Go backwards
calendar.subtractBusinessDays(date, 5)    // Same as add -5

// Count business days between dates
calendar.businessDaysBetween(start, end)  // 10`}</CodeBlock>

      <h2 className="text-lg font-medium text-slate-900 mt-8 mb-3">Configure Business Days</h2>
      <CodeBlock>{`import { configure } from 'whenny'

configure({
  calendar: {
    weekStartsOn: 'monday',
    businessDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
  }
})

// Now all business day functions use your config`}</CodeBlock>

      <h2 className="text-lg font-medium text-slate-900 mt-8 mb-3">Boundaries</h2>
      <CodeBlock>{`calendar.startOf(date, 'day')
calendar.startOf(date, 'week')
calendar.startOf(date, 'month')
calendar.startOf(date, 'year')

calendar.endOf(date, 'day')
calendar.endOf(date, 'week')
calendar.endOf(date, 'month')
calendar.endOf(date, 'year')`}</CodeBlock>

      <h2 className="text-lg font-medium text-slate-900 mt-8 mb-3">Date Arithmetic</h2>
      <CodeBlock>{`calendar.add(date, 5, 'day')        // Add 5 days
calendar.add(date, 2, 'week')       // Add 2 weeks
calendar.subtract(date, 1, 'month') // Subtract 1 month

calendar.daysUntil(futureDate)      // Days until a future date
calendar.daysSince(pastDate)        // Days since a past date`}</CodeBlock>
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
        Customize Whenny's output by configuring styles, strings, thresholds, and formats.
      </p>

      <h2 className="text-lg font-medium text-slate-900 mt-8 mb-3">Style Configuration</h2>
      <CodeBlock>{`import { configure } from 'whenny'

// Configure your T-shirt size styles
configure({
  styles: {
    xs: 'D/M',                     // Extra small
    sm: 'D MMM',                   // Small
    md: 'D MMM YYYY',              // Medium
    lg: 'Do MMMM, YYYY',           // Large
    xl: 'dddd, Do MMMM, YYYY',     // Extra large
    time: 'HH:mm',                 // Time only
    sortable: 'YYYY-MM-DD',        // Machine sortable
    log: 'YYYY-MM-DD HH:mm:ss',    // Log format
  }
})

// Now use everywhere
whenny(date).md  // "3 Feb 2024"`}</CodeBlock>

      <h2 className="text-lg font-medium text-slate-900 mt-8 mb-3">Relative Time Configuration</h2>
      <CodeBlock>{`configure({
  relative: {
    justNow: 'moments ago',
    minutesAgo: (n) => \`\${n}m ago\`,
    hoursAgo: (n) => \`\${n}h ago\`,
    thresholds: {
      justNow: 30,        // < 30s = "just now"
      seconds: 60,        // < 60s = "X seconds ago"
      minutes: 3600,      // < 1hr = "X minutes ago"
      hours: 86400,       // < 24hr = "X hours ago"
    },
  }
})

// Now all relative times use your config
whenny(date).relative()  // "moments ago", "5m ago", "2h ago"`}</CodeBlock>

      <h2 className="text-lg font-medium text-slate-900 mt-8 mb-3">Business Days Configuration</h2>
      <CodeBlock>{`configure({
  calendar: {
    weekStartsOn: 'monday',
    businessDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
  }
})`}</CodeBlock>

      <h2 className="text-lg font-medium text-slate-900 mt-8 mb-3">Using Themes</h2>
      <CodeBlock>{`import { configure } from 'whenny'
import { slack, twitter, formal, technical, github } from 'whenny/themes'

// Use a pre-built theme
configure(slack)

// Or extend one
configure({
  ...slack,
  styles: {
    ...slack.styles,
    md: 'MMM Do, YYYY',
  },
  relative: {
    ...slack.relative,
    justNow: 'right now',
  }
})`}</CodeBlock>

      <h2 className="text-lg font-medium text-slate-900 mt-8 mb-3">Available Themes</h2>
      <div className="overflow-x-auto my-4">
        <table className="w-full text-sm border border-slate-200 rounded-lg overflow-hidden">
          <thead className="bg-slate-50">
            <tr>
              <th className="text-left px-4 py-2 border-b border-slate-200 font-medium text-slate-700">Theme</th>
              <th className="text-left px-4 py-2 border-b border-slate-200 font-medium text-slate-700">Style</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 text-slate-600">
            <tr><td className="px-4 py-2 font-mono text-xs text-slate-800">casual</td><td className="px-4 py-2">Default friendly: "just now", "5 minutes ago"</td></tr>
            <tr><td className="px-4 py-2 font-mono text-xs text-slate-800">formal</td><td className="px-4 py-2">Professional: "a moment ago", "January 15th, 2024"</td></tr>
            <tr><td className="px-4 py-2 font-mono text-xs text-slate-800">slack</td><td className="px-4 py-2">Slack-style: "just now", "5 min", "Yesterday at 3:45 PM"</td></tr>
            <tr><td className="px-4 py-2 font-mono text-xs text-slate-800">twitter</td><td className="px-4 py-2">Ultra-compact: "now", "5m", "1h", "Jan 15"</td></tr>
            <tr><td className="px-4 py-2 font-mono text-xs text-slate-800">minimal</td><td className="px-4 py-2">Clean: "now", "5m ago", "1d ago"</td></tr>
            <tr><td className="px-4 py-2 font-mono text-xs text-slate-800">technical</td><td className="px-4 py-2">ISO 8601: "2024-01-15T15:45:00Z"</td></tr>
            <tr><td className="px-4 py-2 font-mono text-xs text-slate-800">discord</td><td className="px-4 py-2">Discord-style: "Today at 3:45 PM"</td></tr>
            <tr><td className="px-4 py-2 font-mono text-xs text-slate-800">github</td><td className="px-4 py-2">GitHub-style: "now", "2 minutes ago", "on Jan 15, 2024"</td></tr>
          </tbody>
        </table>
      </div>
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
