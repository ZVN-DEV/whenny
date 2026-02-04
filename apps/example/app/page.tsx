'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { whenny } from 'whenny'
import { useRelativeTime } from 'whenny-react'

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

export default function HomePage() {
  const now = new Date()
  const fiveMinutesAgo = new Date(now.getTime() - 5 * 60 * 1000)
  const liveTime = useRelativeTime(fiveMinutesAgo)

  return (
    <main className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white/90 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="font-semibold text-slate-900">Whenny</Link>
          <div className="flex items-center gap-6">
            <Link href="/demo" className="text-sm text-slate-600 hover:text-slate-900 transition-colors">Demo</Link>
            <Link href="/docs" className="text-sm text-slate-600 hover:text-slate-900 transition-colors">Docs</Link>
            <a href="https://github.com/ZVN-DEV/whenny" className="text-sm text-slate-600 hover:text-slate-900 transition-colors">GitHub</a>
          </div>
        </div>
      </header>

      {/* Hero - Why Whenny */}
      <section className="py-20 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <FadeIn>
            <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-6">
              Dates that just work.
            </h1>
            <p className="text-xl text-slate-600 mb-4">
              Built for AI. Built for humans. Own your code.
            </p>
            <p className="text-slate-500 mb-8 max-w-xl mx-auto">
              Stop fighting timezones. Stop memorizing format tokens. Pull only the functions you need directly into your codebase.
            </p>
          </FadeIn>

          <FadeIn delay={100}>
            <div className="flex flex-wrap justify-center gap-3 mb-12">
              <span className="px-3 py-1 rounded-full text-xs bg-blue-50 text-blue-700 border border-blue-200">AI-Optimized API</span>
              <span className="px-3 py-1 rounded-full text-xs bg-green-50 text-green-700 border border-green-200">Server/Client Sync</span>
              <span className="px-3 py-1 rounded-full text-xs bg-purple-50 text-purple-700 border border-purple-200">Zero Dependencies</span>
              <span className="px-3 py-1 rounded-full text-xs bg-amber-50 text-amber-700 border border-amber-200">Own Your Code</span>
            </div>
          </FadeIn>

          <FadeIn delay={150}>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <code className="px-4 py-3 bg-slate-900 text-slate-100 rounded-lg text-sm font-mono">
                npx whenny init
              </code>
              <code className="px-4 py-3 bg-slate-100 text-slate-700 rounded-lg text-sm font-mono">
                npm install whenny
              </code>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Datewind - The Hero Feature */}
      <section className="bg-gradient-to-b from-slate-50 to-white py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <FadeIn>
            <div className="text-center mb-12">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs bg-blue-600 text-white mb-4">
                Introducing Datewind
              </span>
              <h2 className="text-3xl font-bold text-slate-900 mb-3">
                Tailwind for dates.
              </h2>
              <p className="text-slate-600 max-w-lg mx-auto">
                Configure your date styles once. Use them everywhere with simple properties. No format strings to remember.
              </p>
            </div>
          </FadeIn>

          <FadeIn delay={100}>
            <div className="bg-slate-900 rounded-xl p-6 shadow-2xl">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
              </div>
              <pre className="text-sm leading-relaxed overflow-x-auto">
                <code className="text-slate-300">
                  <span className="text-blue-400">whenny</span>(date).<span className="text-green-400">xs</span>       <span className="text-slate-500">// "{whenny(now).xs}"</span>{'\n'}
                  <span className="text-blue-400">whenny</span>(date).<span className="text-green-400">sm</span>       <span className="text-slate-500">// "{whenny(now).sm}"</span>{'\n'}
                  <span className="text-blue-400">whenny</span>(date).<span className="text-green-400">md</span>       <span className="text-slate-500">// "{whenny(now).md}"</span>{'\n'}
                  <span className="text-blue-400">whenny</span>(date).<span className="text-green-400">lg</span>       <span className="text-slate-500">// "{whenny(now).lg}"</span>{'\n'}
                  <span className="text-blue-400">whenny</span>(date).<span className="text-green-400">xl</span>       <span className="text-slate-500">// "{whenny(now).xl}"</span>{'\n'}
                  {'\n'}
                  <span className="text-blue-400">whenny</span>(date).<span className="text-yellow-400">clock</span>    <span className="text-slate-500">// "{whenny(now).clock}"</span>{'\n'}
                  <span className="text-blue-400">whenny</span>(date).<span className="text-yellow-400">sortable</span> <span className="text-slate-500">// "{whenny(now).sortable}"</span>
                </code>
              </pre>
            </div>
          </FadeIn>

          <FadeIn delay={150}>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6">
              <StyleDemo label=".xs" value={whenny(now).xs} />
              <StyleDemo label=".sm" value={whenny(now).sm} />
              <StyleDemo label=".md" value={whenny(now).md} />
              <StyleDemo label=".lg" value={whenny(now).lg} />
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Why Whenny Grid */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <FadeIn>
            <h2 className="text-2xl font-bold text-slate-900 text-center mb-12">Why Whenny?</h2>
          </FadeIn>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <FadeIn delay={100}>
              <FeatureCard
                title="AI-First Design"
                description="Clean, predictable API optimized for AI code generation. Every function does one thing well."
              />
            </FadeIn>
            <FadeIn delay={125}>
              <FeatureCard
                title="Own Your Code"
                description="shadcn-style install. Pull functions directly into your codebase. No dependency lock-in."
              />
            </FadeIn>
            <FadeIn delay={150}>
              <FeatureCard
                title="Server/Client Sync"
                description="Transfer Protocol preserves timezone context. One point in time, displayed correctly everywhere."
              />
            </FadeIn>
            <FadeIn delay={175}>
              <FeatureCard
                title="Datewind Styles"
                description="Configure date formats once like Tailwind utilities. Use .xs .sm .md .lg everywhere."
              />
            </FadeIn>
            <FadeIn delay={200}>
              <FeatureCard
                title="Smart Defaults"
                description="Context-aware formatting. 'just now', '5 min ago', 'Yesterday at 3pm' - automatic."
              />
            </FadeIn>
            <FadeIn delay={225}>
              <FeatureCard
                title="MCP Server"
                description="Expose all functions to AI assistants. Let AI pick the right date utilities for you."
              />
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Quick Examples */}
      <section className="bg-slate-50 py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <FadeIn>
            <h2 className="text-2xl font-bold text-slate-900 text-center mb-3">Dead Simple API</h2>
            <p className="text-slate-600 text-center mb-12 max-w-lg mx-auto">
              Every function is predictable. Every output is useful.
            </p>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FadeIn delay={100}>
              <QuickExample
                title="Smart Formatting"
                code={`whenny(date).smart()`}
                outputs={[
                  { input: 'now', output: 'just now' },
                  { input: '5m ago', output: '5 minutes ago' },
                  { input: 'yesterday', output: 'Yesterday at 3:45 PM' },
                ]}
              />
            </FadeIn>

            <FadeIn delay={150}>
              <QuickExample
                title="Duration"
                code={`duration(seconds)`}
                outputs={[
                  { input: '3661', output: '1h 1m 1s' },
                  { input: '.timer()', output: '01:01:01' },
                  { input: '.human()', output: 'about 1 hour' },
                ]}
              />
            </FadeIn>

            <FadeIn delay={200}>
              <QuickExample
                title="Business Days"
                code={`calendar.addBusinessDays(date, 5)`}
                outputs={[
                  { input: 'Mon + 5', output: 'Next Monday' },
                  { input: 'isBusinessDay', output: 'true/false' },
                  { input: 'nextBusinessDay', output: 'Next working day' },
                ]}
              />
            </FadeIn>

            <FadeIn delay={250}>
              <QuickExample
                title="React Hooks"
                code={`useRelativeTime(date)`}
                outputs={[
                  { input: 'auto-updates', output: liveTime },
                  { input: 'useCountdown', output: '3d 5h 30m 15s' },
                ]}
                live
              />
            </FadeIn>
          </div>
        </div>
      </section>

      {/* shadcn-style Install */}
      <section className="py-20 px-6">
        <div className="max-w-3xl mx-auto">
          <FadeIn>
            <div className="text-center mb-12">
              <h2 className="text-2xl font-bold text-slate-900 mb-3">
                Pull only what you need.
              </h2>
              <p className="text-slate-600">
                Like shadcn/ui - copy code directly into your project. Full ownership, full control.
              </p>
            </div>
          </FadeIn>

          <FadeIn delay={100}>
            <div className="bg-slate-900 rounded-xl p-6 shadow-xl">
              <pre className="text-sm leading-loose overflow-x-auto">
                <code className="text-slate-300">
                  <span className="text-slate-500"># Initialize whenny in your project</span>{'\n'}
                  <span className="text-green-400">npx whenny init</span>{'\n'}
                  {'\n'}
                  <span className="text-slate-500"># Add only the modules you need</span>{'\n'}
                  <span className="text-green-400">npx whenny add relative</span>{'\n'}
                  <span className="text-green-400">npx whenny add smart calendar</span>{'\n'}
                  <span className="text-green-400">npx whenny add duration</span>{'\n'}
                  {'\n'}
                  <span className="text-slate-500"># Or grab everything</span>{'\n'}
                  <span className="text-green-400">npx whenny add all</span>
                </code>
              </pre>
            </div>
          </FadeIn>

          <FadeIn delay={150}>
            <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3">
              <ModuleChip name="core" />
              <ModuleChip name="relative" />
              <ModuleChip name="smart" />
              <ModuleChip name="duration" />
              <ModuleChip name="calendar" />
              <ModuleChip name="timezone" />
              <ModuleChip name="transfer" />
              <ModuleChip name="react" />
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Server/Client Sync */}
      <section className="bg-gradient-to-b from-blue-50 to-white py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <FadeIn>
            <div className="text-center mb-12">
              <h2 className="text-2xl font-bold text-slate-900 mb-3">
                Server and client, finally in sync.
              </h2>
              <p className="text-slate-600 max-w-lg mx-auto">
                The Transfer Protocol carries timezone context across the wire. Store UTC, display local. Automatically.
              </p>
            </div>
          </FadeIn>

          <FadeIn delay={100}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl border border-slate-200 p-5">
                <div className="flex items-center gap-2 mb-3">
                  <span className="px-2 py-1 rounded text-xs bg-slate-100 text-slate-700 font-medium">Server</span>
                </div>
                <pre className="text-xs text-slate-700 overflow-x-auto">
{`// Store UTC, preserve origin
const payload = createTransfer(date, {
  timezone: 'America/New_York'
})
// { iso, originZone, originOffset }`}
                </pre>
              </div>

              <div className="bg-white rounded-xl border border-slate-200 p-5">
                <div className="flex items-center gap-2 mb-3">
                  <span className="px-2 py-1 rounded text-xs bg-blue-100 text-blue-700 font-medium">Client</span>
                </div>
                <pre className="text-xs text-slate-700 overflow-x-auto">
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
      <section className="py-20 px-6">
        <div className="max-w-2xl mx-auto text-center">
          <FadeIn>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Ready to simplify dates?</h2>
            <p className="text-slate-600 mb-8">Start with the CLI or install the package. Your choice.</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/docs" className="px-6 py-3 bg-slate-900 text-white rounded-lg font-medium hover:bg-slate-800 transition-colors">
                Read the Docs
              </Link>
              <Link href="/demo" className="px-6 py-3 bg-white text-slate-900 border border-slate-200 rounded-lg font-medium hover:bg-slate-50 transition-colors">
                Try the Demo
              </Link>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 py-8 px-6">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-slate-500">Built for the AI era. Own your code.</p>
          <div className="flex items-center gap-6">
            <Link href="/docs" className="text-sm text-slate-600 hover:text-slate-900">Docs</Link>
            <Link href="/demo" className="text-sm text-slate-600 hover:text-slate-900">Demo</Link>
            <a href="https://github.com/ZVN-DEV/whenny" className="text-sm text-slate-600 hover:text-slate-900">GitHub</a>
          </div>
        </div>
      </footer>
    </main>
  )
}

function StyleDemo({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-white rounded-lg border border-slate-200 p-3 text-center">
      <code className="text-blue-600 text-xs font-mono">{label}</code>
      <p className="text-slate-900 font-medium mt-1 text-sm">{value}</p>
    </div>
  )
}

function FeatureCard({ title, description }: { title: string; description: string }) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 hover:shadow-md transition-shadow">
      <h3 className="font-semibold text-slate-900 mb-2">{title}</h3>
      <p className="text-sm text-slate-600">{description}</p>
    </div>
  )
}

function QuickExample({ title, code, outputs, live }: {
  title: string
  code: string
  outputs: { input: string; output: string }[]
  live?: boolean
}) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5">
      <div className="flex items-center gap-2 mb-3">
        <h3 className="font-semibold text-slate-900">{title}</h3>
        {live && <span className="px-1.5 py-0.5 rounded text-[10px] bg-green-500 text-white">LIVE</span>}
      </div>
      <code className="text-xs text-blue-600 font-mono block mb-3">{code}</code>
      <div className="space-y-1">
        {outputs.map((o, i) => (
          <div key={i} className="flex justify-between text-sm">
            <span className="text-slate-500">{o.input}</span>
            <span className="text-slate-900 font-medium">{o.output}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function ModuleChip({ name }: { name: string }) {
  return (
    <div className="px-3 py-2 bg-white rounded-lg border border-slate-200 text-center">
      <code className="text-xs text-slate-700 font-mono">{name}</code>
    </div>
  )
}
