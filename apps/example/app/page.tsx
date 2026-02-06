'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { whenny } from 'whenny'
import { useRelativeTime } from 'whenny-react'

// Fade-in animation wrapper
function FadeIn({ children, delay = 0, className = '' }: { children: React.ReactNode; delay?: number; className?: string }) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), delay)
    return () => clearTimeout(timer)
  }, [delay])

  return (
    <div className={`transition-all duration-700 ease-out ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'} ${className}`}>
      {children}
    </div>
  )
}

// Copyable command
function CommandBlock({ command, variant = 'dark' }: { command: string; variant?: 'dark' | 'light' }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(command)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const isDark = variant === 'dark'

  return (
    <button
      onClick={handleCopy}
      className={`group relative px-5 py-3 rounded-full text-sm font-mono flex items-center gap-3 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] ${
        isDark
          ? 'bg-slate-900 text-slate-100 hover:bg-slate-800 shadow-lg shadow-slate-900/20'
          : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200'
      }`}
    >
      <span>{command}</span>
      <span className={`transition-all ${copied ? 'text-green-400' : isDark ? 'text-slate-500 group-hover:text-slate-300' : 'text-slate-400 group-hover:text-slate-600'}`}>
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
  )
}

export default function HomePage() {
  const now = new Date()
  const fiveMinutesAgo = new Date(now.getTime() - 5 * 60 * 1000)
  const liveTime = useRelativeTime(fiveMinutesAgo)

  return (
    <main className="min-h-screen bg-white">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md z-50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="text-lg font-semibold text-slate-900 tracking-tight">whenny</Link>
          <nav className="flex items-center gap-8">
            <Link href="/demo" className="text-sm text-slate-500 hover:text-slate-900 transition-colors">Demo</Link>
            <Link href="/docs" className="text-sm text-slate-500 hover:text-slate-900 transition-colors">Docs</Link>
            <Link href="/blog" className="text-sm text-slate-500 hover:text-slate-900 transition-colors">Blog</Link>
            <a href="https://github.com/ZVN-DEV/whenny" className="text-sm text-slate-500 hover:text-slate-900 transition-colors">GitHub</a>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="min-h-screen flex items-center justify-center px-6 pt-16">
        <div className="max-w-4xl mx-auto text-center">
          <FadeIn>
            <p className="text-sm font-medium text-slate-400 tracking-widest uppercase mb-8">
              A date library for the AI era
            </p>
          </FadeIn>

          <FadeIn delay={100}>
            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-slate-900 tracking-tight leading-[0.9] mb-8">
              Dates that
              <br />
              <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 bg-clip-text text-transparent">
                just work.
              </span>
            </h1>
          </FadeIn>

          <FadeIn delay={200}>
            <p className="text-xl sm:text-2xl text-slate-500 max-w-2xl mx-auto leading-relaxed mb-12">
              Built for AI. Built for humans.
              <br className="hidden sm:block" />
              Own your code.
            </p>
          </FadeIn>

          <FadeIn delay={300}>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
              <CommandBlock command="npx create-whenny" variant="dark" />
              <CommandBlock command="npm install whenny" variant="light" />
            </div>
          </FadeIn>

          <FadeIn delay={400}>
            <div className="flex flex-wrap justify-center gap-3">
              <span className="px-4 py-2 rounded-full text-xs font-medium bg-slate-50 text-slate-600 border border-slate-100">AI-Optimized</span>
              <span className="px-4 py-2 rounded-full text-xs font-medium bg-slate-50 text-slate-600 border border-slate-100">Zero Dependencies</span>
              <span className="px-4 py-2 rounded-full text-xs font-medium bg-slate-50 text-slate-600 border border-slate-100">Own Your Code</span>
              <span className="px-4 py-2 rounded-full text-xs font-medium bg-slate-50 text-slate-600 border border-slate-100">Server/Client Sync</span>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Size-based styles */}
      <section className="py-32 px-6 bg-slate-50">
        <div className="max-w-5xl mx-auto">
          <FadeIn>
            <p className="text-sm font-medium text-slate-400 tracking-widest uppercase text-center mb-4">
              Intuitive API
            </p>
            <h2 className="text-4xl sm:text-5xl font-bold text-slate-900 text-center mb-6 tracking-tight">
              Size up your dates.
            </h2>
            <p className="text-lg text-slate-500 text-center max-w-xl mx-auto mb-16">
              Like Tailwind for dates — simple properties, consistent output.
              No format strings to remember.
            </p>
          </FadeIn>

          <FadeIn delay={100}>
            <div className="bg-slate-900 rounded-2xl p-8 shadow-2xl shadow-slate-900/30 mb-8">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
              </div>
              <pre className="text-sm sm:text-base leading-loose overflow-x-auto">
                <code className="text-slate-300">
                  <span className="text-blue-400">whenny</span>(date).<span className="text-emerald-400">xs</span>       <span className="text-slate-500">// "{whenny(now).xs}"</span>{'\n'}
                  <span className="text-blue-400">whenny</span>(date).<span className="text-emerald-400">sm</span>       <span className="text-slate-500">// "{whenny(now).sm}"</span>{'\n'}
                  <span className="text-blue-400">whenny</span>(date).<span className="text-emerald-400">md</span>       <span className="text-slate-500">// "{whenny(now).md}"</span>{'\n'}
                  <span className="text-blue-400">whenny</span>(date).<span className="text-emerald-400">lg</span>       <span className="text-slate-500">// "{whenny(now).lg}"</span>{'\n'}
                  <span className="text-blue-400">whenny</span>(date).<span className="text-emerald-400">xl</span>       <span className="text-slate-500">// "{whenny(now).xl}"</span>{'\n'}
                  {'\n'}
                  <span className="text-blue-400">whenny</span>(date).<span className="text-amber-400">clock</span>    <span className="text-slate-500">// "{whenny(now).clock}"</span>{'\n'}
                  <span className="text-blue-400">whenny</span>(date).<span className="text-amber-400">sortable</span> <span className="text-slate-500">// "{whenny(now).sortable}"</span>
                </code>
              </pre>
            </div>
          </FadeIn>

          <FadeIn delay={150}>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
              <StyleDemo label=".xs" value={whenny(now).xs} />
              <StyleDemo label=".sm" value={whenny(now).sm} />
              <StyleDemo label=".md" value={whenny(now).md} />
              <StyleDemo label=".lg" value={whenny(now).lg} />
              <StyleDemo label=".xl" value={whenny(now).xl} className="col-span-2 sm:col-span-1" />
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Why Whenny */}
      <section className="py-32 px-6">
        <div className="max-w-5xl mx-auto">
          <FadeIn>
            <p className="text-sm font-medium text-slate-400 tracking-widest uppercase text-center mb-4">
              Why Whenny?
            </p>
            <h2 className="text-4xl sm:text-5xl font-bold text-slate-900 text-center mb-20 tracking-tight">
              Built different.
            </h2>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-16">
            <FadeIn delay={100}>
              <Feature
                number="01"
                title="AI-First Design"
                description="Clean, predictable API optimized for AI code generation. Every function does one thing well. AI assistants write better code with Whenny."
              />
            </FadeIn>
            <FadeIn delay={150}>
              <Feature
                number="02"
                title="Own Your Code"
                description="shadcn-style install. Pull functions directly into your codebase. Customize everything. No dependency lock-in. It's your code now."
              />
            </FadeIn>
            <FadeIn delay={200}>
              <Feature
                number="03"
                title="Server/Client Sync"
                description="The Transfer Protocol carries timezone context across the wire. Store UTC, display local. Server and client finally agree on what time it is."
              />
            </FadeIn>
            <FadeIn delay={250}>
              <Feature
                number="04"
                title="MCP Server"
                description="Expose all functions to AI assistants through the Model Context Protocol. Let Claude pick the right date utilities for your task."
              />
            </FadeIn>
          </div>
        </div>
      </section>

      {/* API Examples */}
      <section className="py-32 px-6 bg-gradient-to-b from-white via-blue-50/30 to-white">
        <div className="max-w-5xl mx-auto">
          <FadeIn>
            <p className="text-sm font-medium text-slate-400 tracking-widest uppercase text-center mb-4">
              Simple API
            </p>
            <h2 className="text-4xl sm:text-5xl font-bold text-slate-900 text-center mb-6 tracking-tight">
              Dead simple.
            </h2>
            <p className="text-lg text-slate-500 text-center max-w-xl mx-auto mb-20">
              Every function is predictable. Every output is useful.
            </p>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FadeIn delay={100}>
              <APICard
                title="Smart Formatting"
                code="whenny(date).smart()"
                examples={[
                  { label: 'now', value: 'just now' },
                  { label: '5m ago', value: '5 minutes ago' },
                  { label: 'yesterday', value: 'Yesterday at 3:45 PM' },
                ]}
              />
            </FadeIn>
            <FadeIn delay={150}>
              <APICard
                title="Duration"
                code="duration(3661)"
                examples={[
                  { label: '.long()', value: '1 hour, 1 minute, 1 second' },
                  { label: '.compact()', value: '1h 1m 1s' },
                  { label: '.timer()', value: '01:01:01' },
                ]}
              />
            </FadeIn>
            <FadeIn delay={200}>
              <APICard
                title="Calendar"
                code="calendar"
                examples={[
                  { label: '.isToday(date)', value: 'true / false' },
                  { label: '.isBusinessDay(date)', value: 'true / false' },
                  { label: '.addBusinessDays(date, 5)', value: 'Next Monday' },
                ]}
              />
            </FadeIn>
            <FadeIn delay={250}>
              <APICard
                title="React Hooks"
                code="useRelativeTime(date)"
                examples={[
                  { label: 'Live update', value: liveTime },
                  { label: 'useCountdown()', value: '3d 5h 30m 15s' },
                ]}
                live
              />
            </FadeIn>
          </div>
        </div>
      </section>

      {/* shadcn Install */}
      <section className="py-32 px-6">
        <div className="max-w-4xl mx-auto">
          <FadeIn>
            <p className="text-sm font-medium text-slate-400 tracking-widest uppercase text-center mb-4">
              shadcn-style
            </p>
            <h2 className="text-4xl sm:text-5xl font-bold text-slate-900 text-center mb-6 tracking-tight">
              Pull only what you need.
            </h2>
            <p className="text-lg text-slate-500 text-center max-w-xl mx-auto mb-16">
              Like shadcn/ui — copy code directly into your project.
              Full ownership, full control.
            </p>
          </FadeIn>

          <FadeIn delay={100}>
            <div className="bg-slate-900 rounded-2xl p-8 shadow-2xl mb-8">
              <div className="space-y-4">
                <CLILine comment="Initialize whenny in your project" command="npx create-whenny" />
                <div className="h-4"></div>
                <CLILine comment="Add only the modules you need" command="npx create-whenny add relative" />
                <CLILine command="npx create-whenny add smart calendar" />
                <CLILine command="npx create-whenny add duration" />
                <div className="h-4"></div>
                <CLILine comment="Or grab everything" command="npx create-whenny add all" />
              </div>
            </div>
          </FadeIn>

          <FadeIn delay={150}>
            <p className="text-center text-sm text-slate-400 mb-6">Available modules:</p>
            <div className="flex flex-wrap justify-center gap-3">
              {['core', 'relative', 'smart', 'duration', 'calendar', 'timezone', 'transfer', 'react'].map((mod) => (
                <ModuleChip key={mod} name={mod} />
              ))}
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Transfer Protocol */}
      <section className="py-32 px-6 bg-slate-900 text-white">
        <div className="max-w-5xl mx-auto">
          <FadeIn>
            <p className="text-sm font-medium text-slate-500 tracking-widest uppercase text-center mb-4">
              Transfer Protocol
            </p>
            <h2 className="text-4xl sm:text-5xl font-bold text-white text-center mb-6 tracking-tight">
              Server and client,
              <br />
              finally in sync.
            </h2>
            <p className="text-lg text-slate-400 text-center max-w-xl mx-auto mb-20">
              The Transfer Protocol carries timezone context across the wire.
              Store UTC, display local. Automatically.
            </p>
          </FadeIn>

          <FadeIn delay={100}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-slate-800 rounded-xl p-6">
                <div className="flex items-center gap-2 mb-4">
                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-slate-700 text-slate-300">Server</span>
                </div>
                <pre className="text-sm text-slate-300 leading-relaxed">
{`// Store UTC, preserve origin
const payload = createTransfer(date, {
  timezone: 'America/New_York'
})

// { iso, originZone, originOffset }`}
                </pre>
              </div>

              <div className="bg-slate-800 rounded-xl p-6">
                <div className="flex items-center gap-2 mb-4">
                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-600 text-white">Client</span>
                </div>
                <pre className="text-sm text-slate-300 leading-relaxed">
{`// Display in user's local time
const event = fromTransfer(payload)

whenny(event.date).smart()
// "3:00 PM" (auto-converted)`}
                </pre>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* CTA */}
      <section className="py-32 px-6">
        <div className="max-w-2xl mx-auto text-center">
          <FadeIn>
            <h2 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-6 tracking-tight">
              Ready to simplify dates?
            </h2>
            <p className="text-lg text-slate-500 mb-12">
              Start with the CLI or install the package. Your choice.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/docs"
                className="px-8 py-4 bg-slate-900 text-white rounded-full font-medium hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/20 hover:shadow-xl hover:shadow-slate-900/30"
              >
                Read the Docs
              </Link>
              <Link
                href="/demo"
                className="px-8 py-4 bg-white text-slate-900 border border-slate-200 rounded-full font-medium hover:bg-slate-50 transition-all"
              >
                Try the Demo
              </Link>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-100 py-12 px-6">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
          <p className="text-sm text-slate-400">Built for the AI era. Own your code.</p>
          <nav className="flex items-center gap-8">
            <Link href="/docs" className="text-sm text-slate-400 hover:text-slate-900 transition-colors">Docs</Link>
            <Link href="/demo" className="text-sm text-slate-400 hover:text-slate-900 transition-colors">Demo</Link>
            <Link href="/blog" className="text-sm text-slate-400 hover:text-slate-900 transition-colors">Blog</Link>
            <a href="https://github.com/ZVN-DEV/whenny" className="text-sm text-slate-400 hover:text-slate-900 transition-colors">GitHub</a>
          </nav>
        </div>
      </footer>
    </main>
  )
}

function StyleDemo({ label, value, className = '' }: { label: string; value: string; className?: string }) {
  return (
    <div className={`bg-white rounded-xl border border-slate-200 p-4 text-center ${className}`}>
      <code className="text-blue-600 text-sm font-mono font-medium">{label}</code>
      <p className="text-slate-900 font-medium mt-2 text-sm truncate">{value}</p>
    </div>
  )
}

function Feature({ number, title, description }: { number: string; title: string; description: string }) {
  return (
    <div>
      <span className="text-sm font-mono text-slate-300 mb-3 block">{number}</span>
      <h3 className="text-xl font-semibold text-slate-900 mb-3">{title}</h3>
      <p className="text-slate-500 leading-relaxed">{description}</p>
    </div>
  )
}

function APICard({ title, code, examples, live }: {
  title: string
  code: string
  examples: { label: string; value: string }[]
  live?: boolean
}) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6 hover:shadow-lg hover:shadow-slate-100 transition-shadow">
      <div className="flex items-center gap-3 mb-4">
        <h3 className="font-semibold text-slate-900">{title}</h3>
        {live && <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-emerald-500 text-white uppercase tracking-wide">Live</span>}
      </div>
      <code className="text-sm text-blue-600 font-mono block mb-5">{code}</code>
      <div className="space-y-3">
        {examples.map((ex, i) => (
          <div key={i} className="flex justify-between text-sm">
            <span className="text-slate-400 font-mono">{ex.label}</span>
            <span className="text-slate-900 font-medium">{ex.value}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function CLILine({ comment, command }: { comment?: string; command: string }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(command)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <>
      {comment && <p className="text-slate-500 text-sm"># {comment}</p>}
      <button
        onClick={handleCopy}
        className="group w-full flex items-center justify-between px-4 py-2 rounded-lg hover:bg-slate-800 transition-colors text-left"
      >
        <code className="text-emerald-400 text-sm">{command}</code>
        <span className={`flex-shrink-0 transition-all ${copied ? 'text-emerald-400' : 'text-slate-600 group-hover:text-slate-400'}`}>
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
    </>
  )
}

function ModuleChip({ name }: { name: string }) {
  const [copied, setCopied] = useState(false)
  const command = `npx create-whenny add ${name}`

  const handleCopy = async () => {
    await navigator.clipboard.writeText(command)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <button
      onClick={handleCopy}
      className={`px-4 py-2 rounded-full text-sm font-mono transition-all hover:scale-105 active:scale-95 ${
        copied
          ? 'bg-emerald-500 text-white'
          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
      }`}
      title={`Copy: ${command}`}
    >
      {copied ? 'copied!' : name}
    </button>
  )
}
