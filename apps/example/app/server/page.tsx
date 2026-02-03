import { whenny, createTransfer, fromTransfer } from 'whenny'
import Link from 'next/link'

// This page demonstrates how timestamps travel between browser and server
// Key concept: UTC is the universal truth. Timezone context tells you how to display it.

export default async function ServerPage() {
  // Server's current time (in UTC - the universal truth)
  const serverNow = new Date()

  // Simulate receiving different timestamps from browsers around the world
  // In a real app, these would come from API requests with Transfer Protocol payloads
  const browserTimestamps = [
    {
      label: 'User in New York',
      // Simulating: User clicked "Submit" at 2:30 PM local time
      transfer: createTransfer(new Date(serverNow.getTime() - 30000), { timezone: 'America/New_York' }),
      action: 'Submitted form',
    },
    {
      label: 'User in London',
      // Simulating: User clicked "Submit" at 7:30 PM local time
      transfer: createTransfer(new Date(serverNow.getTime() - 45000), { timezone: 'Europe/London' }),
      action: 'Updated profile',
    },
    {
      label: 'User in Tokyo',
      // Simulating: User clicked "Submit" at 4:30 AM local time (next day)
      transfer: createTransfer(new Date(serverNow.getTime() - 15000), { timezone: 'Asia/Tokyo' }),
      action: 'Created post',
    },
  ]

  // Process each transfer to show how server handles it
  const processedEvents = browserTimestamps.map(event => {
    const received = fromTransfer(event.transfer)
    return {
      ...event,
      received,
      utcTime: received.date.toISOString(),
      serverRelative: whenny(received.date).relative(),
      displayInOrigin: whenny(received.date).inZone(received.originZone).format('{time} {timezone}'),
    }
  })

  return (
    <main className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/" className="font-semibold text-slate-900">Whenny</Link>
            <span className="text-sm text-slate-400">Server Demo</span>
          </div>
          <div className="flex items-center gap-6">
            <Link href="/docs" className="text-sm text-slate-600 hover:text-slate-900 transition-colors">Docs</Link>
            <Link href="/demo" className="text-sm text-slate-600 hover:text-slate-900 transition-colors">Demo</Link>
            <a href="https://github.com/ZVN-DEV/whenny" className="text-sm text-slate-600 hover:text-slate-900 transition-colors">GitHub</a>
          </div>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-6 py-12">
        {/* Intro */}
        <div className="mb-12">
          <Link href="/" className="text-sm text-blue-600 hover:text-blue-800 transition-colors mb-4 inline-block">
            ← Back
          </Link>
          <h1 className="text-2xl font-semibold text-slate-900 mb-3">
            Server-Side Timestamps
          </h1>
          <p className="text-slate-600">
            How to handle timestamps from browsers around the world. The key insight: <strong>there is one point in time universally, and it's UTC</strong>.
          </p>
        </div>

        {/* The Universal Truth */}
        <div className="mb-12">
          <div className="bg-slate-950 rounded-lg p-6 text-white">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <span className="text-sm text-slate-400 font-mono">Server Time (UTC)</span>
            </div>
            <p className="text-3xl font-mono mb-2">{serverNow.toISOString()}</p>
            <p className="text-slate-400 text-sm">
              This is the universal truth. Every timestamp from every timezone converts to this moment.
            </p>
          </div>
        </div>

        {/* The Flow */}
        <div className="mb-12">
          <h2 className="text-lg font-medium text-slate-900 mb-4">The Transfer Protocol Flow</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
              <div className="text-xs font-medium text-slate-500 uppercase mb-2">1. Browser</div>
              <p className="text-sm text-slate-700">
                User in New York clicks "Submit" at <strong>2:30 PM EST</strong>
              </p>
            </div>
            <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
              <div className="text-xs font-medium text-slate-500 uppercase mb-2">2. Transfer</div>
              <p className="text-sm text-slate-700">
                Whenny creates payload with UTC timestamp + timezone context
              </p>
            </div>
            <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
              <div className="text-xs font-medium text-slate-500 uppercase mb-2">3. Server</div>
              <p className="text-sm text-slate-700">
                Receives <strong>7:30 PM UTC</strong> and knows it originated in EST
              </p>
            </div>
          </div>
        </div>

        {/* Live Events */}
        <div className="mb-12">
          <h2 className="text-lg font-medium text-slate-900 mb-4">Simulated Events from Different Timezones</h2>
          <p className="text-slate-600 text-sm mb-6">
            These are simulated browser timestamps that arrived at the server. Each shows the same moment in time, displayed correctly for its origin timezone.
          </p>

          <div className="space-y-4">
            {processedEvents.map((event, i) => (
              <div key={i} className="bg-white rounded-lg border border-slate-200 overflow-hidden">
                <div className="p-4 border-b border-slate-100">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium text-slate-900">{event.label}</h3>
                      <p className="text-sm text-slate-500">{event.action}</p>
                    </div>
                    <span className="text-sm text-slate-500">{event.serverRelative}</span>
                  </div>
                </div>
                <div className="p-4 bg-slate-50">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="text-xs text-slate-500 mb-1">UTC (stored)</p>
                      <p className="font-mono text-slate-900 text-xs">{event.utcTime}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 mb-1">Origin timezone</p>
                      <p className="font-mono text-slate-900">{event.received.originZone}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 mb-1">Display (local to user)</p>
                      <p className="font-mono text-slate-900">{event.displayInOrigin}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Code Example */}
        <div className="mb-12">
          <h2 className="text-lg font-medium text-slate-900 mb-4">How It Works</h2>

          <div className="space-y-6">
            <CodeExample title="Browser: Send timestamp with context">
{`// When user clicks "Submit"
const payload = createTransfer(new Date(), {
  timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
})

// Result: { iso: "2024-01-15T19:30:00.000Z", originZone: "America/New_York", originOffset: -300 }

fetch('/api/events', {
  method: 'POST',
  body: JSON.stringify({ timestamp: payload })
})`}
            </CodeExample>

            <CodeExample title="Server: Receive and understand">
{`// API receives the transfer payload
const received = fromTransfer(body.timestamp)

received.date          // JavaScript Date (UTC)
received.originZone    // "America/New_York"
received.originOffset  // -300 (minutes)

// Store in database
await db.events.create({
  datetime: received.date,        // Always store UTC
  originZone: received.originZone // Remember where it came from
})`}
            </CodeExample>

            <CodeExample title="Display: Show correctly anywhere">
{`// Show to the original user (New York)
whenny(event.datetime).inZone(event.originZone).format('{time}')
// "2:30 PM"

// Show to a user in Tokyo
whenny(event.datetime).inZone('Asia/Tokyo').format('{time}')
// "4:30 AM"

// Show to a user in London
whenny(event.datetime).inZone('Europe/London').format('{time}')
// "7:30 PM"

// All showing the same moment in time, correctly localized.`}
            </CodeExample>
          </div>
        </div>

        {/* Key Insight */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-12">
          <h3 className="font-medium text-blue-900 mb-2">Key Insight</h3>
          <p className="text-blue-800 text-sm">
            When a user in New York clicks a button at 2:30 PM their time, and a user in Tokyo clicks a button at 4:30 AM their time (the next day), they might be clicking at <em>the exact same moment</em>. UTC is how you know that. The timezone context tells you how to display it back to each user correctly.
          </p>
        </div>

        {/* Footer */}
        <div className="pt-8 border-t border-slate-200 text-center">
          <p className="text-slate-500 text-sm mb-4">
            This page was server-rendered. All formatting happened before the HTML was sent.
          </p>
          <div className="flex justify-center gap-6">
            <Link href="/" className="text-blue-600 hover:text-blue-800 text-sm transition-colors">
              Home
            </Link>
            <Link href="/demo" className="text-blue-600 hover:text-blue-800 text-sm transition-colors">
              Interactive Demo
            </Link>
            <Link href="/docs" className="text-blue-600 hover:text-blue-800 text-sm transition-colors">
              Documentation
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}

function CodeExample({ title, children }: { title: string; children: string }) {
  return (
    <div className="rounded-lg overflow-hidden border border-slate-200 bg-slate-950">
      <div className="px-4 py-2 bg-slate-900 border-b border-slate-800">
        <span className="text-xs font-medium text-slate-400">{title}</span>
      </div>
      <pre className="p-4 overflow-x-auto text-sm leading-relaxed">
        <code className="text-slate-100 whitespace-pre font-mono">{children}</code>
      </pre>
    </div>
  )
}
