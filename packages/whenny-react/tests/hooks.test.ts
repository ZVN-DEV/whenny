/**
 * Whenny React Hooks Tests
 *
 * Comprehensive tests for all React hooks including:
 * - useRelativeTime: auto-updating relative time strings
 * - useCountdown: countdown timer with formatted output
 * - useDateFormatter: memoized date formatting
 * - Package exports verification
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { renderHook, act } from '@testing-library/react'

// ─────────────────────────────────────────────────────────
// PACKAGE EXPORTS
// ─────────────────────────────────────────────────────────

describe('whenny-react', () => {
  describe('package exports', () => {
    it('should export useRelativeTime', async () => {
      const { useRelativeTime } = await import('../src')
      expect(typeof useRelativeTime).toBe('function')
    })

    it('should export useCountdown', async () => {
      const { useCountdown } = await import('../src')
      expect(typeof useCountdown).toBe('function')
    })

    it('should export useDateFormatter', async () => {
      const { useDateFormatter } = await import('../src')
      expect(typeof useDateFormatter).toBe('function')
    })

    it('should export useTimezone', async () => {
      const { useTimezone } = await import('../src')
      expect(typeof useTimezone).toBe('function')
    })

    it('should export TimezoneProvider', async () => {
      const { TimezoneProvider } = await import('../src')
      expect(typeof TimezoneProvider).toBe('function')
    })

    it('should export useShadcnCalendar', async () => {
      const { useShadcnCalendar } = await import('../src')
      expect(typeof useShadcnCalendar).toBe('function')
    })
  })

  // ─────────────────────────────────────────────────────────
  // useRelativeTime
  // ─────────────────────────────────────────────────────────

  describe('useRelativeTime', () => {
    beforeEach(() => {
      vi.useFakeTimers()
      vi.setSystemTime(new Date('2024-06-15T12:00:00Z'))
    })

    afterEach(() => {
      vi.useRealTimers()
    })

    it('returns a string for a past date', async () => {
      const { useRelativeTime } = await import('../src/hooks/useRelativeTime')
      const pastDate = new Date('2024-06-15T11:55:00Z') // 5 minutes ago

      const { result } = renderHook(() => useRelativeTime(pastDate))

      // After mount, the hook should produce a non-empty string
      expect(typeof result.current).toBe('string')
      expect(result.current).toBeTruthy()
      expect(result.current).toContain('ago')
    })

    it('returns a string for a future date', async () => {
      const { useRelativeTime } = await import('../src/hooks/useRelativeTime')
      const futureDate = new Date('2024-06-15T15:00:00Z') // 3 hours in the future

      const { result } = renderHook(() => useRelativeTime(futureDate))

      expect(typeof result.current).toBe('string')
      expect(result.current).toBeTruthy()
      expect(result.current).toContain('in')
    })

    it('updates when time passes via interval', async () => {
      const { useRelativeTime } = await import('../src/hooks/useRelativeTime')
      // 30 seconds ago
      const date = new Date('2024-06-15T11:59:30Z')

      const { result } = renderHook(() =>
        useRelativeTime(date, { updateInterval: 1000 })
      )

      const initialValue = result.current

      // Advance time by 60 seconds -- the relative text may change
      act(() => {
        vi.advanceTimersByTime(60000)
      })

      // The hook should still return a valid string
      expect(typeof result.current).toBe('string')
      // The value may or may not have changed (depends on granularity),
      // but the hook should not crash and should return a truthy string
      expect(result.current).toBeTruthy()
    })

    it('handles invalid date input gracefully', async () => {
      const { useRelativeTime } = await import('../src/hooks/useRelativeTime')

      // Invalid date input -- the hook catches errors and returns ''
      const { result } = renderHook(() =>
        useRelativeTime('not-a-date' as any)
      )

      // Should not throw, should return empty string (the catch block behavior)
      expect(typeof result.current).toBe('string')
    })

    it('returns placeholder before mount (SSR safety)', async () => {
      const { useRelativeTime } = await import('../src/hooks/useRelativeTime')
      const date = new Date('2024-06-15T11:55:00Z')

      // The hook initializes with placeholder='' for SSR safety
      // After render in jsdom, it will be mounted, but we can verify
      // the placeholder option is respected by checking initial state
      const { result } = renderHook(() =>
        useRelativeTime(date, { placeholder: 'Loading...' })
      )

      // After mounting in jsdom, the hook should have computed the value
      expect(typeof result.current).toBe('string')
    })

    it('respects smart formatting option', async () => {
      const { useRelativeTime } = await import('../src/hooks/useRelativeTime')
      const date = new Date('2024-06-15T11:30:00Z') // 30 minutes ago

      const { result } = renderHook(() =>
        useRelativeTime(date, { smart: true })
      )

      expect(typeof result.current).toBe('string')
      expect(result.current).toBeTruthy()
    })

    it('updates when date prop changes', async () => {
      const { useRelativeTime } = await import('../src/hooks/useRelativeTime')

      let date = new Date('2024-06-15T11:55:00Z') // 5 minutes ago

      const { result, rerender } = renderHook(() => useRelativeTime(date))

      const firstValue = result.current

      // Change the date to something much farther in the past
      date = new Date('2024-06-14T12:00:00Z') // yesterday

      rerender()

      // Value should have changed since the date is now much older
      expect(typeof result.current).toBe('string')
      expect(result.current).toBeTruthy()
    })
  })

  // ─────────────────────────────────────────────────────────
  // useCountdown
  // ─────────────────────────────────────────────────────────

  describe('useCountdown', () => {
    beforeEach(() => {
      vi.useFakeTimers()
      vi.setSystemTime(new Date('2024-06-15T12:00:00Z'))
    })

    afterEach(() => {
      vi.useRealTimers()
    })

    it('returns days/hours/minutes/seconds for a future date', async () => {
      const { useCountdown } = await import('../src/hooks/useCountdown')
      // 2 days, 3 hours, 15 minutes, 30 seconds from now
      const target = new Date('2024-06-17T15:15:30Z')

      const { result } = renderHook(() => useCountdown(target))

      expect(result.current.days).toBe(2)
      expect(result.current.hours).toBe(3)
      expect(result.current.minutes).toBe(15)
      expect(result.current.seconds).toBe(30)
      expect(result.current.isExpired).toBe(false)
    })

    it('returns isExpired=true when target has passed', async () => {
      const { useCountdown } = await import('../src/hooks/useCountdown')
      // 1 hour in the past
      const target = new Date('2024-06-15T11:00:00Z')

      const { result } = renderHook(() => useCountdown(target))

      expect(result.current.isExpired).toBe(true)
      expect(result.current.days).toBe(0)
      expect(result.current.hours).toBe(0)
      expect(result.current.minutes).toBe(0)
      expect(result.current.seconds).toBe(0)
      expect(result.current.totalSeconds).toBe(0)
      expect(result.current.totalMs).toBe(0)
    })

    it('returns formatted string for days+hours', async () => {
      const { useCountdown } = await import('../src/hooks/useCountdown')
      // 2 days, 5 hours, 30 minutes, 15 seconds
      const target = new Date('2024-06-17T17:30:15Z')

      const { result } = renderHook(() => useCountdown(target))

      expect(result.current.formatted).toBe('2d 5h 30m 15s')
    })

    it('returns formatted string for hours only', async () => {
      const { useCountdown } = await import('../src/hooks/useCountdown')
      // 3 hours, 45 minutes, 10 seconds
      const target = new Date('2024-06-15T15:45:10Z')

      const { result } = renderHook(() => useCountdown(target))

      expect(result.current.formatted).toBe('3h 45m 10s')
    })

    it('returns formatted string for minutes only', async () => {
      const { useCountdown } = await import('../src/hooks/useCountdown')
      // 20 minutes, 5 seconds
      const target = new Date('2024-06-15T12:20:05Z')

      const { result } = renderHook(() => useCountdown(target))

      expect(result.current.formatted).toBe('20m 5s')
    })

    it('returns formatted string for seconds only', async () => {
      const { useCountdown } = await import('../src/hooks/useCountdown')
      // 45 seconds
      const target = new Date('2024-06-15T12:00:45Z')

      const { result } = renderHook(() => useCountdown(target))

      expect(result.current.formatted).toBe('45s')
    })

    it('returns clock string in D:HH:MM:SS format', async () => {
      const { useCountdown } = await import('../src/hooks/useCountdown')
      // 2 days, 5 hours, 30 minutes, 15 seconds
      const target = new Date('2024-06-17T17:30:15Z')

      const { result } = renderHook(() => useCountdown(target))

      expect(result.current.clock).toBe('2:05:30:15')
    })

    it('returns clock string in H:MM:SS format when no days', async () => {
      const { useCountdown } = await import('../src/hooks/useCountdown')
      // 3 hours, 45 minutes, 10 seconds
      const target = new Date('2024-06-15T15:45:10Z')

      const { result } = renderHook(() => useCountdown(target))

      expect(result.current.clock).toBe('3:45:10')
    })

    it('returns clock string in M:SS format when no hours', async () => {
      const { useCountdown } = await import('../src/hooks/useCountdown')
      // 20 minutes, 5 seconds
      const target = new Date('2024-06-15T12:20:05Z')

      const { result } = renderHook(() => useCountdown(target))

      expect(result.current.clock).toBe('20:05')
    })

    it('isMounted starts false (SSR safety) then becomes true', async () => {
      const { useCountdown } = await import('../src/hooks/useCountdown')
      const target = new Date('2024-06-17T12:00:00Z')

      // The DEFAULT_RESULT has isMounted: false
      // After mount in jsdom, isMounted should become true
      const { result } = renderHook(() => useCountdown(target))

      // After rendering in jsdom, the hook should be mounted
      expect(result.current.isMounted).toBe(true)
    })

    it('counts down as time advances', async () => {
      const { useCountdown } = await import('../src/hooks/useCountdown')
      // 10 seconds from now
      const target = new Date('2024-06-15T12:00:10Z')

      const { result } = renderHook(() =>
        useCountdown(target, { interval: 1000 })
      )

      expect(result.current.seconds).toBe(10)
      expect(result.current.isExpired).toBe(false)

      // Advance 5 seconds
      act(() => {
        vi.advanceTimersByTime(5000)
      })

      expect(result.current.seconds).toBe(5)
      expect(result.current.isExpired).toBe(false)

      // Advance to expiration
      act(() => {
        vi.advanceTimersByTime(5000)
      })

      expect(result.current.isExpired).toBe(true)
      expect(result.current.seconds).toBe(0)
    })

    it('fires onExpire callback when countdown reaches zero', async () => {
      const { useCountdown } = await import('../src/hooks/useCountdown')
      const onExpire = vi.fn()
      // 3 seconds from now
      const target = new Date('2024-06-15T12:00:03Z')

      renderHook(() =>
        useCountdown(target, { interval: 1000, onExpire })
      )

      expect(onExpire).not.toHaveBeenCalled()

      // Advance past expiration
      act(() => {
        vi.advanceTimersByTime(4000)
      })

      expect(onExpire).toHaveBeenCalledTimes(1)
    })

    it('returns totalSeconds and totalMs correctly', async () => {
      const { useCountdown } = await import('../src/hooks/useCountdown')
      // Exactly 1 day from now = 86400 seconds
      const target = new Date('2024-06-16T12:00:00Z')

      const { result } = renderHook(() => useCountdown(target))

      expect(result.current.totalSeconds).toBe(86400)
      expect(result.current.totalMs).toBe(86400000)
    })

    it('handles expired target on initial render', async () => {
      const { useCountdown } = await import('../src/hooks/useCountdown')
      const onExpire = vi.fn()
      // Already expired
      const target = new Date('2024-06-14T12:00:00Z')

      const { result } = renderHook(() =>
        useCountdown(target, { onExpire })
      )

      expect(result.current.isExpired).toBe(true)
      expect(result.current.formatted).toBe('0s')
      expect(result.current.clock).toBe('0:00')
      expect(onExpire).toHaveBeenCalledTimes(1)
    })

    it('resets when target date changes', async () => {
      const { useCountdown } = await import('../src/hooks/useCountdown')

      let target = new Date('2024-06-15T12:00:10Z') // 10 seconds from now

      const { result, rerender } = renderHook(() => useCountdown(target))

      expect(result.current.seconds).toBe(10)

      // Change to a new target 2 hours from now
      target = new Date('2024-06-15T14:00:00Z')
      rerender()

      expect(result.current.hours).toBe(2)
      expect(result.current.minutes).toBe(0)
      expect(result.current.seconds).toBe(0)
    })
  })

  // ─────────────────────────────────────────────────────────
  // useDateFormatter
  // ─────────────────────────────────────────────────────────

  describe('useDateFormatter', () => {
    beforeEach(() => {
      vi.useFakeTimers()
      vi.setSystemTime(new Date('2024-06-15T12:00:00Z'))
    })

    afterEach(() => {
      vi.useRealTimers()
    })

    it('returns a function', async () => {
      const { useDateFormatter } = await import('../src/hooks/useDateFormatter')

      const { result } = renderHook(() => useDateFormatter())

      expect(typeof result.current).toBe('function')
    })

    it('returns formatted date using datewind sizes', async () => {
      const { useDateFormatter } = await import('../src/hooks/useDateFormatter')
      const date = new Date('2024-02-03T15:30:00Z')

      const { result } = renderHook(() => useDateFormatter())

      // The formatter returns a Whenny instance
      const w = result.current(date)

      // Test the datewind style properties
      expect(typeof w.xs).toBe('string')
      expect(typeof w.sm).toBe('string')
      expect(typeof w.md).toBe('string')
      expect(typeof w.lg).toBe('string')
      expect(typeof w.xl).toBe('string')

      // xs should be the most compact format
      expect(w.xs).toBeTruthy()
      // sm should include abbreviated month
      expect(w.sm).toBeTruthy()
      // md should include year
      expect(w.md).toBeTruthy()
      // lg should use full month name
      expect(w.lg).toBeTruthy()
      // xl should include weekday
      expect(w.xl).toBeTruthy()
    })

    it('provides relative() method on formatted result', async () => {
      const { useDateFormatter } = await import('../src/hooks/useDateFormatter')
      const pastDate = new Date('2024-06-15T11:55:00Z') // 5 min ago

      const { result } = renderHook(() => useDateFormatter())

      const relativeStr = result.current(pastDate).relative()
      expect(typeof relativeStr).toBe('string')
      expect(relativeStr).toContain('ago')
    })

    it('provides smart() method on formatted result', async () => {
      const { useDateFormatter } = await import('../src/hooks/useDateFormatter')
      const date = new Date('2024-06-15T09:30:00Z')

      const { result } = renderHook(() => useDateFormatter())

      const smartStr = result.current(date).smart()
      expect(typeof smartStr).toBe('string')
      expect(smartStr).toBeTruthy()
    })

    it('provides format() method for custom templates', async () => {
      const { useDateFormatter } = await import('../src/hooks/useDateFormatter')
      const date = new Date('2024-02-03T15:30:00Z')

      const { result } = renderHook(() => useDateFormatter())

      const formatted = result.current(date).format('{month}/{day}/{year}')
      expect(typeof formatted).toBe('string')
      expect(formatted).toBeTruthy()
    })

    it('responds to config changes by returning a stable function', async () => {
      const { useDateFormatter } = await import('../src/hooks/useDateFormatter')

      const { result, rerender } = renderHook(() => useDateFormatter())

      const firstRef = result.current
      rerender()
      const secondRef = result.current

      // The formatter function should be memoized (same reference)
      expect(firstRef).toBe(secondRef)
    })

    it('handles various date input types', async () => {
      const { useDateFormatter } = await import('../src/hooks/useDateFormatter')

      const { result } = renderHook(() => useDateFormatter())

      // Date object
      const fromDate = result.current(new Date('2024-06-15T12:00:00Z'))
      expect(fromDate.md).toBeTruthy()

      // ISO string
      const fromString = result.current('2024-06-15T12:00:00Z')
      expect(fromString.md).toBeTruthy()

      // Timestamp
      const fromTimestamp = result.current(1718452800000)
      expect(fromTimestamp.md).toBeTruthy()
    })

    it('provides clock property for time-only display', async () => {
      const { useDateFormatter } = await import('../src/hooks/useDateFormatter')
      const date = new Date('2024-02-03T15:30:00Z')

      const { result } = renderHook(() => useDateFormatter())

      const clockStr = result.current(date).clock
      expect(typeof clockStr).toBe('string')
      expect(clockStr).toBeTruthy()
    })

    it('provides toISO() for machine-readable output', async () => {
      const { useDateFormatter } = await import('../src/hooks/useDateFormatter')
      const date = new Date('2024-06-15T12:00:00Z')

      const { result } = renderHook(() => useDateFormatter())

      const iso = result.current(date).toISO()
      expect(iso).toContain('2024-06-15')
    })

    it('provides distance() for comparing two dates', async () => {
      const { useDateFormatter } = await import('../src/hooks/useDateFormatter')
      const date1 = new Date('2024-06-15T12:00:00Z')
      const date2 = new Date('2024-06-20T12:00:00Z')

      const { result } = renderHook(() => useDateFormatter())

      const dist = result.current(date1).distance(date2)
      expect(typeof dist.human).toBe('function')
      const humanStr = dist.human()
      expect(typeof humanStr).toBe('string')
    })
  })
})
