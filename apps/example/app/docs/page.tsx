'use client'

import Link from 'next/link'
import { useState } from 'react'

type Section = 'installation' | 'quickstart' | 'core' | 'formatting' | 'relative' | 'smart' | 'compare' | 'duration' | 'timezone' | 'calendar' | 'natural' | 'react' | 'config' | 'cli'

// Simple copyable code block - no syntax highlighting
function CodeBlock({ children, title }: { children: string; title?: string }) {
  const [copied, setCopied] = useState(false)

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(children)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="group relative my-4 rounded-lg overflow-hidden border border-slate-200 bg-slate-900">
      {title && (
        <div className="px-4 py-2 bg-slate-800 border-b border-slate-700">
          <span className="text-xs font-medium text-slate-400">{title}</span>
        </div>
      )}
      <div className="relative">
        <pre className="p-4 overflow-x-auto text-sm leading-relaxed">
          <code className="text-slate-100 font-mono whitespace-pre">{children}</code>
        </pre>
        <button
          onClick={copyToClipboard}
          className="absolute top-3 right-3 p-2 rounded-md bg-slate-700 hover:bg-slate-600 transition-colors opacity-0 group-hover:opacity-100"
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

// Navigation items for mobile chips
const navItems: { section: Section; label: string }[] = [
  { section: 'installation', label: 'Install' },
  { section: 'quickstart', label: 'Quick Start' },
  { section: 'core', label: 'whenny()' },
  { section: 'formatting', label: 'Formatting' },
  { section: 'relative', label: 'Relative' },
  { section: 'smart', label: 'Smart' },
  { section: 'compare', label: 'Compare' },
  { section: 'duration', label: 'Duration' },
  { section: 'timezone', label: 'Timezones' },
  { section: 'calendar', label: 'Calendar' },
  { section: 'natural', label: 'Natural' },
  { section: 'react', label: 'React' },
  { section: 'config', label: 'Config' },
  { section: 'cli', label: 'CLI' },
]

export default function DocsPage() {
  const [activeSection, setActiveSection] = useState<Section>('installation')

  return (
    <main className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white/90 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between">
          <div className="flex items-center gap-3 sm:gap-6">
            <Link href="/" className="font-semibold text-slate-900">Whenny</Link>
            <span className="text-xs sm:text-sm text-slate-400 hidden xs:inline">Documentation</span>
          </div>
          <div className="flex items-center gap-3 sm:gap-6">
            <Link href="/demo" className="text-xs sm:text-sm text-slate-600 hover:text-slate-900 transition-colors">Demo</Link>
            <Link href="/server" className="text-xs sm:text-sm text-slate-600 hover:text-slate-900 transition-colors hidden sm:inline">Server</Link>
            <a href="https://github.com/ZVN-DEV/whenny" className="text-xs sm:text-sm text-slate-600 hover:text-slate-900 transition-colors">GitHub</a>
          </div>
        </div>
      </header>

      {/* Mobile Navigation - Scrollable Chips */}
      <div className="lg:hidden border-b border-slate-200 bg-slate-50 sticky top-[49px] sm:top-[57px] z-10">
        <div className="overflow-x-auto scrollbar-hide">
          <div className="flex gap-2 px-4 py-3 min-w-max">
            {navItems.map((item) => (
              <button
                key={item.section}
                onClick={() => setActiveSection(item.section)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                  activeSection === item.section
                    ? 'bg-slate-900 text-white'
                    : 'bg-white text-slate-600 border border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <div className="flex gap-12">
          {/* Sidebar - Desktop only */}
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

function DocSection({ title, children, cli }: { title: string; children: React.ReactNode; cli?: string }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-slate-900">{title}</h1>
        {cli && (
          <code className="px-3 py-1.5 bg-slate-900 text-green-400 text-xs rounded-lg font-mono">
            npx whenny add {cli}
          </code>
        )}
      </div>
      {children}
    </div>
  )
}

function InstallationSection() {
  const [selectedModules, setSelectedModules] = useState<string[]>(['relative', 'smart'])
  const [copied, setCopied] = useState(false)

  const modules = [
    { name: 'core', description: 'Core whenny() function (always included)', required: true },
    { name: 'relative', description: 'Relative time formatting ("5 minutes ago")' },
    { name: 'smart', description: 'Context-aware smart formatting' },
    { name: 'compare', description: 'Date comparison and distance calculations' },
    { name: 'duration', description: 'Duration formatting ("2h 30m")' },
    { name: 'timezone', description: 'Timezone utilities and conversions' },
    { name: 'calendar', description: 'Calendar helpers (isToday, isWeekend, etc.)' },
    { name: 'transfer', description: 'Server/browser transfer protocol' },
    { name: 'natural', description: 'Natural language date parsing' },
    { name: 'react', description: 'React hooks (useRelativeTime, useCountdown)' },
  ]

  const toggleModule = (name: string) => {
    if (name === 'core') return // Can't toggle core
    setSelectedModules(prev =>
      prev.includes(name)
        ? prev.filter(m => m !== name)
        : [...prev, name]
    )
  }

  const selectAll = () => {
    setSelectedModules(modules.filter(m => !m.required).map(m => m.name))
  }

  const selectNone = () => {
    setSelectedModules([])
  }

  const addCommand = selectedModules.length === modules.length - 1
    ? 'npx whenny add all'
    : selectedModules.length === 0
    ? 'npx whenny init'
    : `npx whenny add ${selectedModules.join(' ')}`

  const copyCommand = async () => {
    await navigator.clipboard.writeText(addCommand)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <DocSection title="Installation">
      <p className="text-slate-600 mb-6">Two ways to add Whenny to your project. Choose your style.</p>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
        <h2 className="text-lg font-medium text-blue-900 mb-2">Recommended: shadcn-style (Own Your Code)</h2>
        <p className="text-sm text-blue-700 mb-4">Copy code directly into your project. Full ownership, full customization.</p>

        {/* Step 1: Init */}
        <div className="mb-4">
          <p className="text-xs font-medium text-blue-800 mb-2">Step 1: Initialize</p>
          <button
            onClick={async () => {
              await navigator.clipboard.writeText('npx whenny init')
              setCopied(true)
              setTimeout(() => setCopied(false), 2000)
            }}
            className="group w-full flex items-center justify-between px-4 py-3 bg-slate-900 rounded-lg text-left hover:bg-slate-800 transition-colors"
          >
            <code className="text-sm text-green-400 font-mono">npx whenny init</code>
            <span className="text-slate-500 group-hover:text-slate-400">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </span>
          </button>
        </div>

        {/* Step 2: Select modules */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs font-medium text-blue-800">Step 2: Select modules</p>
            <div className="flex gap-2">
              <button onClick={selectAll} className="text-xs text-blue-600 hover:text-blue-800">Select all</button>
              <span className="text-blue-300">|</span>
              <button onClick={selectNone} className="text-xs text-blue-600 hover:text-blue-800">Clear</button>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {modules.map(mod => (
              <button
                key={mod.name}
                onClick={() => toggleModule(mod.name)}
                disabled={mod.required}
                className={`group p-3 rounded-lg border text-left transition-all ${
                  mod.required
                    ? 'bg-slate-100 border-slate-200 cursor-not-allowed opacity-60'
                    : selectedModules.includes(mod.name)
                    ? 'bg-blue-100 border-blue-300 hover:bg-blue-200'
                    : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                }`}
                title={mod.description}
              >
                <div className="flex items-center gap-2">
                  <div className={`w-4 h-4 rounded border flex items-center justify-center ${
                    mod.required || selectedModules.includes(mod.name)
                      ? 'bg-blue-600 border-blue-600'
                      : 'border-slate-300'
                  }`}>
                    {(mod.required || selectedModules.includes(mod.name)) && (
                      <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                  <code className="text-xs font-mono text-slate-700">{mod.name}</code>
                </div>
                <p className="mt-1 text-[10px] text-slate-500 leading-tight">{mod.description}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Generated command */}
        <div>
          <p className="text-xs font-medium text-blue-800 mb-2">Step 3: Run this command</p>
          <button
            onClick={copyCommand}
            className="group w-full flex items-center justify-between px-4 py-3 bg-slate-900 rounded-lg text-left hover:bg-slate-800 transition-colors"
          >
            <code className="text-sm text-green-400 font-mono">{addCommand}</code>
            <span className={`transition-colors ${copied ? 'text-green-400' : 'text-slate-500 group-hover:text-slate-400'}`}>
              {copied ? (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              )}
            </span>
          </button>
        </div>
      </div>

      <h2 className="text-lg font-medium text-slate-900 mt-8 mb-3">Alternative: npm package</h2>
      <CodeBlock>{`npm install whenny whenny-react`}</CodeBlock>

      <h2 className="text-lg font-medium text-slate-900 mt-8 mb-3">Import</h2>
      <CodeBlock>{`import { whenny, compare, duration, calendar } from 'whenny'
import { useRelativeTime, useCountdown } from 'whenny-react'`}</CodeBlock>
    </DocSection>
  )
}

function QuickStartSection() {
  return (
    <DocSection title="Quick Start" cli="core">
      <p className="text-slate-600 mb-6">Get up and running in minutes.</p>

      <h2 className="text-lg font-medium text-slate-900 mt-8 mb-3">Datewind Styles (Recommended)</h2>
      <CodeBlock>{`import { whenny } from 'whenny'

// Datewind - like Tailwind for dates
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
    <DocSection title="The whenny() Function" cli="core">
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
    <DocSection title="Relative Time" cli="relative">
      <p className="text-slate-600 mb-6">Display human-readable time distances like "5 minutes ago" or "in 3 days".</p>

      <h2 className="text-lg font-medium text-slate-900 mt-8 mb-3">Basic Usage</h2>
      <CodeBlock>{`import { whenny, relative } from 'whenny'

// Using whenny instance
whenny(date).relative()               // "5 minutes ago"
whenny(futureDate).relative()         // "in 3 days"

// Direct function
relative(date)                        // "5 minutes ago"

// Relative to another date (not now)
whenny(date).from(otherDate)          // "3 days ago"`}</CodeBlock>
    </DocSection>
  )
}

function SmartSection() {
  return (
    <DocSection title="Smart Formatting" cli="smart">
      <p className="text-slate-600 mb-6">Context-aware formatting that automatically picks the best representation.</p>

      <h2 className="text-lg font-medium text-slate-900 mt-8 mb-3">Basic Usage</h2>
      <CodeBlock>{`import { whenny, smart } from 'whenny'

// Using whenny instance
whenny(date).smart()

// Direct function
smart(date)

// With timezone context (required on server)
whenny(date).smart({ for: 'America/New_York' })`}</CodeBlock>

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
    <DocSection title="Date Comparison" cli="compare">
      <p className="text-slate-600 mb-6">Compare two dates and get human-readable descriptions.</p>

      <h2 className="text-lg font-medium text-slate-900 mt-8 mb-3">Basic Usage</h2>
      <CodeBlock>{`import { compare } from 'whenny'

const result = compare(dateA, dateB)

// Human-readable comparison
result.smart()        // "3 days before" or "2 hours after"

// Raw values
result.days()         // -3 (negative = before)
result.hours()        // -72
result.minutes()      // -4320`}</CodeBlock>
    </DocSection>
  )
}

function DurationSection() {
  return (
    <DocSection title="Duration" cli="duration">
      <p className="text-slate-600 mb-6">Format time durations in various styles.</p>

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
    <DocSection title="Timezones" cli="timezone">
      <p className="text-slate-600 mb-6">Handle timezones with the Transfer Protocol - designed for server/browser sync.</p>

      <h2 className="text-lg font-medium text-slate-900 mt-8 mb-3">The Problem</h2>
      <p className="text-slate-600 mb-4">
        When a user schedules an event, how do you ensure it displays correctly across timezones?
        The answer is UTC. There&apos;s one point in time, universally.
      </p>

      <h2 className="text-lg font-medium text-slate-900 mt-8 mb-3">Browser to Server</h2>
      <CodeBlock title="Creating a Transfer">{`import { createTransfer } from 'whenny'

// User selects a date in their local timezone
const payload = createTransfer(selectedDate, {
  timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
})

// Result:
// {
//   iso: "2024-01-15T20:00:00.000Z",
//   originZone: "America/New_York",
//   originOffset: -300
// }

fetch('/api/events', {
  method: 'POST',
  body: JSON.stringify({ scheduledAt: payload })
})`}</CodeBlock>

      <h2 className="text-lg font-medium text-slate-900 mt-8 mb-3">Server: Receiving</h2>
      <CodeBlock title="Processing the Transfer">{`import { fromTransfer } from 'whenny'

const received = fromTransfer(body.scheduledAt)

received.date           // JavaScript Date object (UTC)
received.originZone     // "America/New_York"
received.originOffset   // -300

// Store in database
await db.events.create({
  datetime: received.date,        // Store as UTC
  timezone: received.originZone,  // Remember origin
})`}</CodeBlock>

      <h2 className="text-lg font-medium text-slate-900 mt-8 mb-3">Displaying Correctly</h2>
      <CodeBlock>{`import { whenny } from 'whenny'

// Display in original timezone
whenny(event.datetime).inZone(event.timezone).format('{time}')
// "3:00 PM EST"

// Display in viewer's local timezone
whenny(event.datetime).format('{time}')
// "12:00 PM" (if viewer is in PST)`}</CodeBlock>
    </DocSection>
  )
}

function CalendarSection() {
  return (
    <DocSection title="Calendar Helpers" cli="calendar">
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
    <DocSection title="Natural Language" cli="natural">
      <p className="text-slate-600 mb-6">Parse human-friendly date expressions into Date objects.</p>

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
    </DocSection>
  )
}

function ReactSection() {
  return (
    <DocSection title="React Hooks" cli="react">
      <p className="text-slate-600 mb-6">React bindings for common date patterns.</p>
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
      <p className="text-slate-600 mb-6">The Whenny CLI lets you add modules directly to your project (shadcn style).</p>

      <h2 className="text-lg font-medium text-slate-900 mt-8 mb-3">Initialize</h2>
      <CodeBlock>{`npx whenny init

# Options
npx whenny init --minimal    # Just core, nothing else
npx whenny init --full       # Everything included
npx whenny init -y           # Skip prompts, use defaults`}</CodeBlock>

      <h2 className="text-lg font-medium text-slate-900 mt-8 mb-3">Add Modules</h2>
      <CodeBlock>{`npx whenny add relative
npx whenny add smart timezone
npx whenny add all`}</CodeBlock>
    </DocSection>
  )
}
