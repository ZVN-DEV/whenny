'use client'

import { useMemo } from 'react'
import Link from 'next/link'
import { whenny, relative, smart, duration, calendar, compare } from 'whenny'
import { useRelativeTime, useCountdown } from 'whenny-react'

export default function DemoPage() {
  // Memoize example dates to prevent flickering on re-renders
  const dates = useMemo(() => {
    const now = new Date()
    return {
      now,
      fiveMinutesAgo: new Date(now.getTime() - 5 * 60 * 1000),
      oneHourAgo: new Date(now.getTime() - 60 * 60 * 1000),
      yesterday: new Date(now.getTime() - 24 * 60 * 60 * 1000),
      lastWeek: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000),
      nextWeek: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000),
      nextMonth: new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000),
      nextYear: new Date(now.getFullYear() + 1, 0, 1),
    }
  }, [])

  const { now, fiveMinutesAgo, oneHourAgo, yesterday, lastWeek, nextWeek, nextMonth, nextYear } = dates

  // Auto-updating relative time
  const autoUpdatingTime = useRelativeTime(fiveMinutesAgo)

  // Countdown to next year
  const countdown = useCountdown(nextYear)

  return (
    <main className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 bg-slate-50">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <Link href="/" className="text-sm text-blue-600 hover:underline mb-4 inline-block">
            ← Back to Home
          </Link>
          <h1 className="text-4xl font-bold tracking-tight text-slate-900 mb-2">
            Whenny Demo
          </h1>
          <p className="text-lg text-slate-500">
            Interactive examples of every Whenny feature
          </p>
        </div>

        {/* Demo Sections */}
        <div className="space-y-12">
          {/* Smart Formatting */}
          <Section title="Smart Formatting" description="Context-aware formatting that automatically picks the best representation based on how far away the date is.">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <DemoCard
                label="Just now"
                code="whenny(now).smart()"
                result={whenny(now).smart()}
              />
              <DemoCard
                label="5 minutes ago"
                code="whenny(fiveMinutesAgo).smart()"
                result={whenny(fiveMinutesAgo).smart()}
              />
              <DemoCard
                label="1 hour ago"
                code="whenny(oneHourAgo).smart()"
                result={whenny(oneHourAgo).smart()}
              />
              <DemoCard
                label="Yesterday"
                code="whenny(yesterday).smart()"
                result={whenny(yesterday).smart()}
              />
              <DemoCard
                label="Last week"
                code="whenny(lastWeek).smart()"
                result={whenny(lastWeek).smart()}
              />
              <DemoCard
                label="Next week"
                code="whenny(nextWeek).smart()"
                result={whenny(nextWeek).smart()}
              />
            </div>
          </Section>

          {/* Relative Time */}
          <Section title="Relative Time" description="Human-readable time distances, with an auto-updating React hook.">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <DemoCard
                label="Past (5 min ago)"
                code="whenny(fiveMinutesAgo).relative()"
                result={whenny(fiveMinutesAgo).relative()}
              />
              <DemoCard
                label="Past (yesterday)"
                code="whenny(yesterday).relative()"
                result={whenny(yesterday).relative()}
              />
              <DemoCard
                label="Future (next week)"
                code="whenny(nextWeek).relative()"
                result={whenny(nextWeek).relative()}
              />
              <DemoCard
                label="Future (next month)"
                code="whenny(nextMonth).relative()"
                result={whenny(nextMonth).relative()}
              />
            </div>
            <div className="mt-4 p-4 bg-green-50 rounded-lg border border-green-200">
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2 py-0.5 rounded text-xs bg-green-500/20 text-green-700 font-medium">LIVE</span>
                <span className="text-sm text-green-800 font-medium">useRelativeTime hook</span>
              </div>
              <p className="text-2xl font-semibold text-green-900">{autoUpdatingTime}</p>
              <p className="text-xs text-green-600 mt-2">This value updates automatically based on the interval you configure</p>
            </div>
          </Section>

          {/* Formatting */}
          <Section title="Format Presets" description="Built-in presets for common formatting needs, plus custom templates with tokens.">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <DemoCard
                label="Short"
                code="whenny(now).short()"
                result={whenny(now).short()}
              />
              <DemoCard
                label="Long"
                code="whenny(now).long()"
                result={whenny(now).long()}
              />
              <DemoCard
                label="Time"
                code="whenny(now).time()"
                result={whenny(now).time()}
              />
              <DemoCard
                label="DateTime"
                code="whenny(now).datetime()"
                result={whenny(now).datetime()}
              />
              <DemoCard
                label="ISO"
                code="whenny(now).iso()"
                result={whenny(now).iso()}
              />
            </div>
          </Section>

          {/* Custom Templates */}
          <Section title="Custom Templates" description="Use tokens to build any format you need.">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <DemoCard
                label="Weekday + Full date"
                code="whenny(now).format('{weekday}, {monthFull} {day}')"
                result={whenny(now).format('{weekday}, {monthFull} {day}')}
              />
              <DemoCard
                label="Ordinal day"
                code="whenny(now).format('{monthFull} {dayOrdinal}, {year}')"
                result={whenny(now).format('{monthFull} {dayOrdinal}, {year}')}
              />
              <DemoCard
                label="Numeric"
                code="whenny(now).format('{month}/{day}/{year}')"
                result={whenny(now).format('{month}/{day}/{year}')}
              />
              <DemoCard
                label="24-hour time"
                code="whenny(now).format('{hour24}:{minute}:{second}')"
                result={whenny(now).format('{hour24}:{minute}:{second}')}
              />
            </div>
            <div className="mt-4 p-4 bg-slate-100 rounded-lg">
              <p className="text-sm font-medium text-slate-700 mb-2">Available tokens:</p>
              <code className="text-xs text-slate-600">
                {'{year} {month} {day} {hour} {hour24} {minute} {second} {AMPM} {ampm} {weekday} {weekdayShort} {monthFull} {monthShort} {dayOrdinal}'}
              </code>
            </div>
          </Section>

          {/* Comparison */}
          <Section title="Date Comparison" description="Compare two dates and get human-readable descriptions of the difference.">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <DemoCard
                label="Smart comparison"
                code="compare(yesterday, now).smart()"
                result={compare(yesterday, now).smart()}
              />
              <DemoCard
                label="Days difference"
                code="compare(yesterday, now).days()"
                result={`${compare(yesterday, now).days()} days`}
              />
              <DemoCard
                label="Hours difference"
                code="compare(yesterday, now).hours()"
                result={`${compare(yesterday, now).hours()} hours`}
              />
              <DemoCard
                label="Days between"
                code="compare(lastWeek, nextWeek).days()"
                result={`${compare(lastWeek, nextWeek).days()} days`}
              />
            </div>
          </Section>

          {/* Duration */}
          <Section title="Duration Formatting" description="Format time durations (in seconds) in various styles.">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <DemoCard
                label="Long"
                code="duration(3661).long()"
                result={duration(3661).long()}
              />
              <DemoCard
                label="Compact"
                code="duration(3661).compact()"
                result={duration(3661).compact()}
              />
              <DemoCard
                label="Clock"
                code="duration(3661).clock()"
                result={duration(3661).clock()}
              />
              <DemoCard
                label="Human"
                code="duration(7200).human()"
                result={duration(7200).human()}
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
              <DemoCard
                label="45 seconds"
                code="duration(45).long()"
                result={duration(45).long()}
              />
              <DemoCard
                label="2 hours"
                code="duration(7200).human()"
                result={duration(7200).human()}
              />
              <DemoCard
                label="1 day"
                code="duration(86400).human()"
                result={duration(86400).human()}
              />
            </div>
          </Section>

          {/* Countdown */}
          <Section title="Countdown Timer" description="Live countdown to a future date using the useCountdown hook.">
            <div className="p-8 bg-gradient-to-br from-blue-500 to-blue-700 rounded-xl text-white">
              <p className="text-blue-100 mb-2">Countdown to New Year {nextYear.getFullYear()}</p>
              <div className="flex flex-wrap gap-4 mb-4">
                <CountdownUnit value={countdown.days} label="Days" />
                <CountdownUnit value={countdown.hours} label="Hours" />
                <CountdownUnit value={countdown.minutes} label="Minutes" />
                <CountdownUnit value={countdown.seconds} label="Seconds" />
              </div>
              <code className="text-blue-200 text-sm">
                useCountdown(targetDate) → {`{ days: ${countdown.days}, hours: ${countdown.hours}, minutes: ${countdown.minutes}, seconds: ${countdown.seconds} }`}
              </code>
            </div>
          </Section>

          {/* Calendar Helpers */}
          <Section title="Calendar Helpers" description="Utility functions for common calendar operations.">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <DemoCard
                label="Is today?"
                code="calendar.isToday(now)"
                result={calendar.isToday(now) ? 'true ✓' : 'false'}
                highlight={calendar.isToday(now)}
              />
              <DemoCard
                label="Is weekend?"
                code="calendar.isWeekend(now)"
                result={calendar.isWeekend(now) ? 'true ✓' : 'false'}
                highlight={calendar.isWeekend(now)}
              />
              <DemoCard
                label="Is business day?"
                code="calendar.isBusinessDay(now)"
                result={calendar.isBusinessDay(now) ? 'true ✓' : 'false'}
                highlight={calendar.isBusinessDay(now)}
              />
              <DemoCard
                label="Is past?"
                code="calendar.isPast(yesterday)"
                result={calendar.isPast(yesterday) ? 'true ✓' : 'false'}
                highlight={calendar.isPast(yesterday)}
              />
              <DemoCard
                label="Is future?"
                code="calendar.isFuture(nextWeek)"
                result={calendar.isFuture(nextWeek) ? 'true ✓' : 'false'}
                highlight={calendar.isFuture(nextWeek)}
              />
              <DemoCard
                label="Days until next week"
                code="calendar.daysUntil(nextWeek)"
                result={`${calendar.daysUntil(nextWeek)} days`}
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
              <DemoCard
                label="Start of month"
                code="calendar.startOf(now, 'month')"
                result={whenny(calendar.startOf(now, 'month')).format('{monthFull} {day}, {year}')}
              />
              <DemoCard
                label="End of month"
                code="calendar.endOf(now, 'month')"
                result={whenny(calendar.endOf(now, 'month')).format('{monthFull} {day}, {year}')}
              />
            </div>
          </Section>

          {/* Installation */}
          <Section title="Installation" description="Two ways to add Whenny to your project.">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl border border-slate-200 p-6">
                <h3 className="font-semibold text-slate-900 mb-2">NPM Package</h3>
                <p className="text-sm text-slate-500 mb-4">
                  Traditional installation as a dependency.
                </p>
                <pre className="bg-slate-900 text-slate-100 p-4 rounded-lg text-sm overflow-x-auto">
                  <code>npm install whenny whenny-react</code>
                </pre>
              </div>
              <div className="bg-white rounded-xl border-2 border-blue-200 p-6">
                <h3 className="font-semibold text-slate-900 mb-2">shadcn Style (Recommended)</h3>
                <p className="text-sm text-slate-500 mb-4">
                  Copy code directly into your project for full ownership.
                </p>
                <pre className="bg-slate-900 text-slate-100 p-4 rounded-lg text-sm overflow-x-auto">
                  <code>{`npx whenny init
npx whenny add relative smart calendar`}</code>
                </pre>
              </div>
            </div>
          </Section>
        </div>

        {/* Footer */}
        <div className="mt-16 pt-8 border-t border-slate-200 text-center">
          <p className="text-slate-500 mb-4">Built with Whenny — Own your code. Configure your voice.</p>
          <div className="flex justify-center gap-4">
            <Link href="/" className="text-blue-600 hover:underline">
              Home
            </Link>
            <a href="https://github.com/ZVN-DEV/whenny" className="text-blue-600 hover:underline">
              GitHub
            </a>
          </div>
        </div>
      </div>
    </main>
  )
}

function Section({
  title,
  description,
  children,
}: {
  title: string
  description: string
  children: React.ReactNode
}) {
  return (
    <section className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
      <h2 className="text-xl font-semibold text-slate-900 mb-1">{title}</h2>
      <p className="text-slate-500 mb-6 text-sm">{description}</p>
      {children}
    </section>
  )
}

function DemoCard({
  label,
  code,
  result,
  highlight,
}: {
  label: string
  code: string
  result: string
  highlight?: boolean
}) {
  return (
    <div className={`p-4 rounded-lg border ${highlight ? 'bg-green-50 border-green-200' : 'bg-slate-50 border-slate-200'}`}>
      <p className="text-sm font-medium text-slate-700 mb-1">{label}</p>
      <code className="text-xs text-slate-500 block mb-2 truncate" title={code}>{code}</code>
      <p className={`text-lg font-semibold ${highlight ? 'text-green-700' : 'text-slate-900'}`}>{result}</p>
    </div>
  )
}

function CountdownUnit({ value, label }: { value: number; label: string }) {
  return (
    <div className="bg-white/10 backdrop-blur px-6 py-3 rounded-lg text-center min-w-[80px]">
      <p className="text-4xl font-bold">{value}</p>
      <p className="text-blue-200 text-sm">{label}</p>
    </div>
  )
}
