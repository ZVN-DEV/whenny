/**
 * Relative Time Tests
 *
 * Tests for relative time formatting like "5 minutes ago" or "in 3 days".
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { relative, fromNow, from } from '../src/relative'
import { defaultConfig } from '../src/config/defaults'

describe('relative', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2024-01-15T12:00:00Z'))
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  // ─────────────────────────────────────────────────────────
  // PAST TIMES
  // ─────────────────────────────────────────────────────────

  describe('past times', () => {
    it('should return "just now" for times within threshold', () => {
      const date = new Date('2024-01-15T11:59:45Z') // 15 seconds ago
      expect(relative(date, { config: defaultConfig })).toBe('just now')
    })

    it('should return seconds ago', () => {
      const date = new Date('2024-01-15T11:59:15Z') // 45 seconds ago
      expect(relative(date, { config: defaultConfig })).toBe('45 seconds ago')
    })

    it('should return minutes ago', () => {
      const date = new Date('2024-01-15T11:55:00Z') // 5 minutes ago
      expect(relative(date, { config: defaultConfig })).toBe('5 minutes ago')
    })

    it('should return "1 minute ago" for singular', () => {
      const date = new Date('2024-01-15T11:59:00Z') // 1 minute ago
      expect(relative(date, { config: defaultConfig })).toBe('1 minute ago')
    })

    it('should return hours ago', () => {
      const date = new Date('2024-01-15T09:00:00Z') // 3 hours ago
      expect(relative(date, { config: defaultConfig })).toBe('3 hours ago')
    })

    it('should return "1 hour ago" for singular', () => {
      const date = new Date('2024-01-15T11:00:00Z') // 1 hour ago
      expect(relative(date, { config: defaultConfig })).toBe('1 hour ago')
    })

    it('should return "yesterday"', () => {
      const date = new Date('2024-01-14T12:00:00Z') // 1 day ago
      expect(relative(date, { config: defaultConfig })).toBe('yesterday')
    })

    it('should return days ago', () => {
      const date = new Date('2024-01-12T12:00:00Z') // 3 days ago
      expect(relative(date, { config: defaultConfig })).toBe('3 days ago')
    })

    it('should return weeks ago', () => {
      const date = new Date('2024-01-01T12:00:00Z') // 14 days ago
      expect(relative(date, { config: defaultConfig })).toBe('2 weeks ago')
    })

    it('should return months ago', () => {
      const date = new Date('2023-11-15T12:00:00Z') // ~2 months ago
      expect(relative(date, { config: defaultConfig })).toBe('2 months ago')
    })

    it('should return years ago', () => {
      const date = new Date('2022-01-15T12:00:00Z') // 2 years ago
      expect(relative(date, { config: defaultConfig })).toBe('2 years ago')
    })
  })

  // ─────────────────────────────────────────────────────────
  // FUTURE TIMES
  // ─────────────────────────────────────────────────────────

  describe('future times', () => {
    it('should return "in X seconds"', () => {
      const date = new Date('2024-01-15T12:00:45Z') // 45 seconds from now
      expect(relative(date, { config: defaultConfig })).toBe('in 45 seconds')
    })

    it('should return "in X minutes"', () => {
      const date = new Date('2024-01-15T12:05:00Z') // 5 minutes from now
      expect(relative(date, { config: defaultConfig })).toBe('in 5 minutes')
    })

    it('should return "in 1 minute" for singular', () => {
      const date = new Date('2024-01-15T12:01:00Z') // 1 minute from now
      expect(relative(date, { config: defaultConfig })).toBe('in 1 minute')
    })

    it('should return "in X hours"', () => {
      const date = new Date('2024-01-15T15:00:00Z') // 3 hours from now
      expect(relative(date, { config: defaultConfig })).toBe('in 3 hours')
    })

    it('should return "tomorrow"', () => {
      const date = new Date('2024-01-16T12:00:00Z') // 1 day from now
      expect(relative(date, { config: defaultConfig })).toBe('tomorrow')
    })

    it('should return "in X days"', () => {
      const date = new Date('2024-01-18T12:00:00Z') // 3 days from now
      expect(relative(date, { config: defaultConfig })).toBe('in 3 days')
    })

    it('should return "in X weeks"', () => {
      const date = new Date('2024-01-29T12:00:00Z') // 14 days from now
      expect(relative(date, { config: defaultConfig })).toBe('in 2 weeks')
    })

    it('should return "in X months"', () => {
      const date = new Date('2024-03-15T12:00:00Z') // ~2 months from now
      expect(relative(date, { config: defaultConfig })).toBe('in 2 months')
    })

    it('should return "in X years"', () => {
      const date = new Date('2026-01-15T12:00:00Z') // 2 years from now
      expect(relative(date, { config: defaultConfig })).toBe('in 2 years')
    })
  })

  // ─────────────────────────────────────────────────────────
  // WITH REFERENCE DATE
  // ─────────────────────────────────────────────────────────

  describe('with reference date', () => {
    it('should calculate relative to reference date', () => {
      const date = new Date('2024-01-15T12:00:00Z')
      const reference = new Date('2024-01-15T12:05:00Z')
      expect(relative(date, { from: reference, config: defaultConfig })).toBe('5 minutes ago')
    })

    it('should work with future reference', () => {
      const date = new Date('2024-01-15T12:10:00Z')
      const reference = new Date('2024-01-15T12:05:00Z')
      expect(relative(date, { from: reference, config: defaultConfig })).toBe('in 5 minutes')
    })
  })
})

describe('fromNow', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2024-01-15T12:00:00Z'))
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should be an alias for relative', () => {
    const date = new Date('2024-01-15T11:55:00Z')
    expect(fromNow(date, defaultConfig)).toBe(relative(date, { config: defaultConfig }))
  })
})

describe('from', () => {
  it('should calculate relative to specific date', () => {
    const date = new Date('2024-01-15T12:00:00Z')
    const reference = new Date('2024-01-15T12:30:00Z')
    expect(from(date, reference, defaultConfig)).toBe('30 minutes ago')
  })
})

// ─────────────────────────────────────────────────────────
// EDGE CASES
// ─────────────────────────────────────────────────────────

describe('edge cases', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2024-01-15T12:00:00Z'))
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should handle exact same time', () => {
    const date = new Date('2024-01-15T12:00:00Z')
    expect(relative(date, { config: defaultConfig })).toBe('just now')
  })

  it('should handle boundary between units', () => {
    // Right at 60 seconds
    const date = new Date('2024-01-15T11:59:00Z') // 60 seconds ago
    expect(relative(date, { config: defaultConfig })).toBe('1 minute ago')
  })

  it('should handle year boundary', () => {
    const date = new Date('2023-12-31T23:59:00Z') // End of previous year (about 2 weeks ago)
    expect(relative(date, { config: defaultConfig })).toMatch(/week|day/)
  })

  it('should accept string input', () => {
    const result = relative('2024-01-15T11:55:00Z', { config: defaultConfig })
    expect(result).toBe('5 minutes ago')
  })

  it('should accept timestamp input', () => {
    const timestamp = new Date('2024-01-15T11:55:00Z').getTime()
    const result = relative(timestamp, { config: defaultConfig })
    expect(result).toBe('5 minutes ago')
  })
})
