import { whenny, createTransfer, calendar } from 'whenny'
import Link from 'next/link'

// This page demonstrates server-side rendering with Whenny
// All date operations happen on the server

async function getServerData() {
  // Simulate fetching data from a database
  const now = new Date()
  const events = [
    {
      id: 1,
      name: 'Team Meeting',
      date: new Date(now.getTime() + 2 * 60 * 60 * 1000), // 2 hours from now
      timezone: 'America/New_York',
    },
    {
      id: 2,
      name: 'Product Launch',
      date: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000), // 1 week from now
      timezone: 'America/Los_Angeles',
    },
    {
      id: 3,
      name: 'Conference Call',
      date: new Date(now.getTime() - 2 * 60 * 60 * 1000), // 2 hours ago
      timezone: 'Europe/London',
    },
    {
      id: 4,
      name: 'Deadline',
      date: new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
      timezone: 'Asia/Tokyo',
    },
  ]

  // Convert dates to transfer format (preserves timezone context)
  return events.map(event => ({
    ...event,
    dateTransfer: createTransfer(event.date, { timezone: event.timezone }),
    formatted: {
      smart: whenny(event.date).smart(),
      relative: whenny(event.date).relative(),
      long: whenny(event.date).long(),
      time: whenny(event.date).time(),
    },
    meta: {
      isPast: calendar.isPast(event.date),
      isFuture: calendar.isFuture(event.date),
      isToday: calendar.isToday(event.date),
      isThisWeek: calendar.isThisWeek(event.date),
      isBusinessDay: calendar.isBusinessDay(event.date),
    }
  }))
}

export default async function ServerPage() {
  const events = await getServerData()
  const serverTime = new Date()

  return (
    <main className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 bg-slate-50">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <Link href="/" className="text-sm text-blue-600 hover:underline mb-4 inline-block">
            ← Back to Home
          </Link>
          <h1 className="text-4xl font-bold tracking-tight text-slate-900 mb-2">
            Server-Side Rendering
          </h1>
          <p className="text-lg text-slate-500">
            All date formatting happens on the server with full timezone support
          </p>
        </div>

        {/* Server Info */}
        <div className="bg-gradient-to-br from-purple-500 to-purple-700 rounded-xl p-6 text-white mb-8">
          <h2 className="text-xl font-semibold mb-4">Server Information</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <p className="text-purple-200 text-sm">Server Time (UTC)</p>
              <p className="font-mono text-lg">{serverTime.toISOString()}</p>
            </div>
            <div>
              <p className="text-purple-200 text-sm">Formatted</p>
              <p className="font-mono text-lg">{whenny(serverTime).long()}</p>
            </div>
            <div>
              <p className="text-purple-200 text-sm">Rendered At</p>
              <p className="font-mono text-lg">{whenny(serverTime).time()}</p>
            </div>
          </div>
        </div>

        {/* Transfer Protocol Explanation */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 mb-8">
          <h2 className="text-xl font-semibold text-slate-900 mb-4">Transfer Protocol</h2>
          <p className="text-slate-600 mb-4">
            The Transfer Protocol preserves timezone context when sending dates from server to client.
            This is crucial for multi-timezone applications where you need to display times in their original timezone.
          </p>
          <div className="bg-slate-900 rounded-lg p-4 overflow-x-auto">
            <pre className="text-sm">
              <code className="text-slate-100">{`// Server: serialize with timezone context
const transferData = transfer.toJSON(event.date, 'America/New_York')
// → { iso: "2024-01-15T15:30:00.000Z", originZone: "America/New_York", originOffset: -300 }

// Client: deserialize and display
const { date, originZone } = transfer.fromJSON(transferData)
whenny(date).format('{time} {timezone}')
// → "10:30 AM EST" (original timezone preserved!)`}</code>
            </pre>
          </div>
        </div>

        {/* Events List */}
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <div className="p-6 border-b border-slate-100">
            <h2 className="text-xl font-semibold text-slate-900">Events (Server Rendered)</h2>
            <p className="text-slate-500 text-sm">Each event preserves its original timezone via Transfer Protocol</p>
          </div>
          <div className="divide-y divide-slate-100">
            {events.map(event => (
              <div key={event.id} className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-semibold text-slate-900">{event.name}</h3>
                    <p className="text-sm text-slate-500">Original timezone: {event.timezone}</p>
                  </div>
                  <div className="flex gap-2">
                    {event.meta.isPast && (
                      <span className="px-2 py-1 rounded text-xs bg-slate-100 text-slate-600">Past</span>
                    )}
                    {event.meta.isToday && (
                      <span className="px-2 py-1 rounded text-xs bg-blue-100 text-blue-700">Today</span>
                    )}
                    {event.meta.isFuture && !event.meta.isToday && (
                      <span className="px-2 py-1 rounded text-xs bg-green-100 text-green-700">Upcoming</span>
                    )}
                    {event.meta.isThisWeek && !event.meta.isToday && (
                      <span className="px-2 py-1 rounded text-xs bg-purple-100 text-purple-700">This Week</span>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
                  <div className="bg-slate-50 rounded-lg p-3">
                    <p className="text-xs text-slate-500 mb-1">Smart</p>
                    <p className="font-medium text-slate-900">{event.formatted.smart}</p>
                  </div>
                  <div className="bg-slate-50 rounded-lg p-3">
                    <p className="text-xs text-slate-500 mb-1">Relative</p>
                    <p className="font-medium text-slate-900">{event.formatted.relative}</p>
                  </div>
                  <div className="bg-slate-50 rounded-lg p-3">
                    <p className="text-xs text-slate-500 mb-1">Long</p>
                    <p className="font-medium text-slate-900">{event.formatted.long}</p>
                  </div>
                  <div className="bg-slate-50 rounded-lg p-3">
                    <p className="text-xs text-slate-500 mb-1">Time</p>
                    <p className="font-medium text-slate-900">{event.formatted.time}</p>
                  </div>
                </div>

                <details className="text-sm">
                  <summary className="cursor-pointer text-slate-500 hover:text-slate-700">
                    View Transfer Data
                  </summary>
                  <pre className="mt-2 p-3 bg-slate-900 text-slate-100 rounded-lg overflow-x-auto text-xs">
                    {JSON.stringify(event.dateTransfer, null, 2)}
                  </pre>
                </details>
              </div>
            ))}
          </div>
        </div>

        {/* Business Day Info */}
        <div className="mt-8 bg-white rounded-xl border border-slate-200 p-6">
          <h2 className="text-xl font-semibold text-slate-900 mb-4">Calendar Helpers (Server-Side)</h2>
          <p className="text-slate-600 mb-4">
            These calculations are performed on the server and included in the initial HTML.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-slate-50 rounded-lg p-4 text-center">
              <p className="text-3xl font-bold text-slate-900">
                {calendar.daysUntil(calendar.endOf(new Date(), 'month'))}
              </p>
              <p className="text-sm text-slate-500">Days until end of month</p>
            </div>
            <div className="bg-slate-50 rounded-lg p-4 text-center">
              <p className="text-3xl font-bold text-slate-900">
                {calendar.isBusinessDay(new Date()) ? 'Yes' : 'No'}
              </p>
              <p className="text-sm text-slate-500">Is today a business day?</p>
            </div>
            <div className="bg-slate-50 rounded-lg p-4 text-center">
              <p className="text-3xl font-bold text-slate-900">
                {calendar.isWeekend(new Date()) ? 'Yes' : 'No'}
              </p>
              <p className="text-sm text-slate-500">Is today a weekend?</p>
            </div>
            <div className="bg-slate-50 rounded-lg p-4 text-center">
              <p className="text-3xl font-bold text-slate-900">
                {whenny(calendar.nextBusinessDay()).format('{weekdayShort}')}
              </p>
              <p className="text-sm text-slate-500">Next business day</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 pt-8 border-t border-slate-200 text-center">
          <p className="text-slate-500 mb-4">
            This page is server-rendered. All date formatting happened before the HTML was sent to your browser.
          </p>
          <div className="flex justify-center gap-4">
            <Link href="/" className="text-blue-600 hover:underline">
              Home
            </Link>
            <Link href="/demo" className="text-blue-600 hover:underline">
              Interactive Demo
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}
