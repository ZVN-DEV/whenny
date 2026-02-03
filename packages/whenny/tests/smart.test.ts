/**
 * Smart Formatting Tests
 *
 * Tests for context-aware date formatting.
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { smart, smartFor } from '../src/smart'
import { defaultConfig } from '../src/config/defaults'
import type { WhennyConfig } from '../src/types'

// Create a test config with server timezone requirement disabled
const testConfig: WhennyConfig = {
  ...defaultConfig,
  server: {
    ...defaultConfig.server,
    requireTimezone: false,
    warnOnMissingTimezone: false,
  },
}

describe('smart', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2024-01-15T12:00:00Z'))
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  // ─────────────────────────────────────────────────────────
  // PAST BUCKETS
  // ─────────────────────────────────────────────────────────

  describe('past dates', () => {
    it('should return "just now" for within a minute', () => {
      const date = new Date('2024-01-15T11:59:45Z')
      expect(smart(date, { config: testConfig })).toBe('just now')
    })

    it('should return relative time for within an hour', () => {
      const date = new Date('2024-01-15T11:30:00Z')
      expect(smart(date, { config: testConfig })).toBe('30 minutes ago')
    })

    it('should return time only for today', () => {
      const date = new Date('2024-01-15T09:30:00Z')
      const result = smart(date, { config: testConfig })
      expect(result).toMatch(/9:30\s*AM/i)
    })

    it('should return "Yesterday at {time}" for yesterday', () => {
      const date = new Date('2024-01-14T15:30:00Z')
      const result = smart(date, { config: testConfig })
      expect(result).toMatch(/Yesterday at/i)
    })

    it('should return weekday for within a week', () => {
      const date = new Date('2024-01-10T15:30:00Z') // Wednesday
      const result = smart(date, { config: testConfig })
      expect(result).toMatch(/Wednesday/i)
    })

    it('should return month and day for this year', () => {
      const date = new Date('2024-01-01T12:00:00Z')
      const result = smart(date, { config: testConfig })
      // Day may be padded (01) or unpadded (1) depending on format config
      expect(result).toMatch(/Jan 0?1/)
    })

    it('should return month, day, and year for older dates', () => {
      const date = new Date('2023-06-15T12:00:00Z')
      const result = smart(date, { config: testConfig })
      expect(result).toBe('Jun 15, 2023')
    })
  })

  // ─────────────────────────────────────────────────────────
  // FUTURE BUCKETS
  // ─────────────────────────────────────────────────────────

  describe('future dates', () => {
    it('should return "now" for immediate future', () => {
      const date = new Date('2024-01-15T12:00:30Z')
      expect(smart(date, { config: testConfig })).toBe('now')
    })

    it('should return relative time for within an hour', () => {
      const date = new Date('2024-01-15T12:30:00Z')
      expect(smart(date, { config: testConfig })).toBe('in 30 minutes')
    })

    it('should return "today at {time}" for later today', () => {
      const date = new Date('2024-01-15T18:00:00Z')
      const result = smart(date, { config: testConfig })
      expect(result).toMatch(/today at/i)
    })

    it('should return "tomorrow at {time}" for tomorrow', () => {
      const date = new Date('2024-01-16T15:30:00Z')
      const result = smart(date, { config: testConfig })
      expect(result).toMatch(/tomorrow at/i)
    })

    it('should return weekday for within a week', () => {
      const date = new Date('2024-01-19T15:30:00Z') // Friday
      const result = smart(date, { config: testConfig })
      expect(result).toMatch(/Friday/i)
    })

    it('should return month and day for this year', () => {
      const date = new Date('2024-06-15T12:00:00Z')
      const result = smart(date, { config: testConfig })
      expect(result).toBe('Jun 15')
    })

    it('should return month, day, and year for next year', () => {
      const date = new Date('2025-06-15T12:00:00Z')
      const result = smart(date, { config: testConfig })
      expect(result).toBe('Jun 15, 2025')
    })
  })

  // ─────────────────────────────────────────────────────────
  // WITH OPTIONS
  // ─────────────────────────────────────────────────────────

  describe('with options', () => {
    it('should accept timezone option', () => {
      const date = new Date('2024-01-15T09:30:00Z')
      const result = smart(date, { for: 'America/New_York', config: testConfig })
      // Should format in that timezone
      expect(typeof result).toBe('string')
    })

    it('should accept from option', () => {
      const date = new Date('2024-01-15T10:00:00Z')
      const from = new Date('2024-01-15T10:05:00Z')
      const result = smart(date, { from, config: testConfig })
      expect(result).toBe('5 minutes ago')
    })
  })

  // ─────────────────────────────────────────────────────────
  // INPUT TYPES
  // ─────────────────────────────────────────────────────────

  describe('input types', () => {
    it('should accept Date object', () => {
      const date = new Date('2024-01-15T11:55:00Z')
      expect(typeof smart(date, { config: testConfig })).toBe('string')
    })

    it('should accept ISO string', () => {
      expect(typeof smart('2024-01-15T11:55:00Z', { config: testConfig })).toBe('string')
    })

    it('should accept timestamp', () => {
      const timestamp = new Date('2024-01-15T11:55:00Z').getTime()
      expect(typeof smart(timestamp, { config: testConfig })).toBe('string')
    })
  })
})

describe('smartFor', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2024-01-15T12:00:00Z'))
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should format for specific timezone', () => {
    const date = new Date('2024-01-15T12:00:00Z')
    const result = smartFor(date, 'America/New_York', { config: testConfig })
    expect(typeof result).toBe('string')
  })
})
