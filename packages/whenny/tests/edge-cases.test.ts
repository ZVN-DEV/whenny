/**
 * Edge Case Tests
 *
 * Tests for boundary conditions, error handling, and unusual inputs.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import {
  parseDate,
  addTime,
  whenny,
  compare,
  duration,
  relative,
  smart,
  calendar,
  WhennyError,
} from '../src'
import { defaultConfig } from '../src/config/defaults'

// ─────────────────────────────────────────────────────────────────────────────
// ERROR HANDLING
// ─────────────────────────────────────────────────────────────────────────────

describe('error handling', () => {
  describe('WhennyError', () => {
    it('should include error code', () => {
      try {
        parseDate('not-a-date')
      } catch (e) {
        expect(e).toBeInstanceOf(WhennyError)
        expect((e as WhennyError).code).toBe('INVALID_DATE_STRING')
      }
    })

    it('should include helpful hints', () => {
      try {
        parseDate('invalid')
      } catch (e) {
        expect((e as WhennyError).hints.length).toBeGreaterThan(0)
      }
    })

    it('should have toJSON method', () => {
      try {
        parseDate('nope')
      } catch (e) {
        const json = (e as WhennyError).toJSON()
        expect(json).toHaveProperty('code')
        expect(json).toHaveProperty('message')
        expect(json).toHaveProperty('hints')
      }
    })
  })

  describe('parseDate errors', () => {
    it('should reject Invalid Date objects', () => {
      expect(() => parseDate(new Date('invalid'))).toThrow(WhennyError)
    })

    it('should reject empty strings', () => {
      expect(() => parseDate('')).toThrow(WhennyError)
    })

    it('should reject whitespace-only strings', () => {
      expect(() => parseDate('   ')).toThrow(WhennyError)
    })

    it('should reject Infinity timestamps', () => {
      expect(() => parseDate(Infinity)).toThrow(WhennyError)
    })

    it('should reject NaN timestamps', () => {
      expect(() => parseDate(NaN)).toThrow(WhennyError)
    })
  })
})

// ─────────────────────────────────────────────────────────────────────────────
// DATE PARSING EDGE CASES
// ─────────────────────────────────────────────────────────────────────────────

describe('date parsing edge cases', () => {
  describe('format support', () => {
    it('should parse ISO 8601 with timezone', () => {
      const date = parseDate('2024-01-15T10:30:00+05:00')
      expect(date).toBeInstanceOf(Date)
      expect(date.getTime()).not.toBeNaN()
    })

    it('should parse ISO 8601 with Z timezone', () => {
      const date = parseDate('2024-01-15T10:30:00Z')
      expect(date.getTime()).not.toBeNaN()
    })

    it('should parse date-only ISO', () => {
      const date = parseDate('2024-01-15')
      expect(date.getFullYear()).toBe(2024)
    })

    it('should parse slash-separated dates (US format)', () => {
      const date = parseDate('01/15/2024')
      expect(date.getMonth()).toBe(0) // January
      expect(date.getDate()).toBe(15)
    })

    it('should parse slash-separated dates (ISO-like)', () => {
      const date = parseDate('2024/01/15')
      expect(date.getFullYear()).toBe(2024)
      expect(date.getMonth()).toBe(0)
    })

    it('should parse European dot format', () => {
      const date = parseDate('15.01.2024')
      expect(date.getDate()).toBe(15)
      expect(date.getMonth()).toBe(0)
    })

    it('should parse space-separated datetime', () => {
      const date = parseDate('2024-01-15 10:30:00')
      expect(date.getHours()).toBeDefined()
    })
  })

  describe('boundary values', () => {
    it('should handle year 1', () => {
      const date = parseDate('0001-01-01')
      expect(date.getFullYear()).toBe(1)
    })

    it('should handle year 9999', () => {
      const date = parseDate('9999-12-31')
      expect(date.getFullYear()).toBe(9999)
    })

    it('should handle very old timestamps', () => {
      const date = parseDate(-62135596800000) // Year 1
      expect(date).toBeInstanceOf(Date)
    })

    it('should handle very future timestamps', () => {
      const date = parseDate(253402300799000) // Dec 31, 9999
      expect(date).toBeInstanceOf(Date)
    })

    it('should handle Unix epoch', () => {
      const date = parseDate(0)
      expect(date.toISOString()).toBe('1970-01-01T00:00:00.000Z')
    })
  })
})

// ─────────────────────────────────────────────────────────────────────────────
// MONTH BOUNDARY TESTS
// ─────────────────────────────────────────────────────────────────────────────

describe('month boundary handling', () => {
  it('should handle Jan 31 + 1 month = Feb 28/29', () => {
    // Non-leap year
    const jan31 = new Date('2023-01-31T12:00:00Z')
    const result = addTime(jan31, 1, 'month')
    expect(result.getMonth()).toBe(1) // February
    expect(result.getDate()).toBe(28) // Last day of Feb in non-leap year
  })

  it('should handle Jan 31 + 1 month in leap year', () => {
    const jan31 = new Date('2024-01-31T12:00:00Z')
    const result = addTime(jan31, 1, 'month')
    expect(result.getMonth()).toBe(1) // February
    expect(result.getDate()).toBe(29) // Leap year has 29 days
  })

  it('should handle Mar 31 - 1 month = Feb 28/29', () => {
    const mar31 = new Date('2024-03-31T12:00:00Z')
    const result = addTime(mar31, -1, 'month')
    expect(result.getMonth()).toBe(1) // February
    expect(result.getDate()).toBe(29) // Leap year
  })

  it('should handle adding multiple months', () => {
    const jan31 = new Date('2024-01-31T12:00:00Z')
    const result = addTime(jan31, 3, 'month')
    expect(result.getMonth()).toBe(3) // April
    expect(result.getDate()).toBe(30) // April has 30 days
  })

  it('should preserve time when adding months', () => {
    const date = new Date('2024-01-15T14:30:45Z')
    const result = addTime(date, 1, 'month')
    expect(result.getHours()).toBe(14)
    expect(result.getMinutes()).toBe(30)
  })
})

// ─────────────────────────────────────────────────────────────────────────────
// YEAR BOUNDARY TESTS
// ─────────────────────────────────────────────────────────────────────────────

describe('year boundary handling', () => {
  it('should handle Feb 29 + 1 year = Feb 28', () => {
    const feb29 = new Date('2024-02-29T12:00:00Z')
    const result = addTime(feb29, 1, 'year')
    expect(result.getFullYear()).toBe(2025)
    expect(result.getMonth()).toBe(1) // February
    expect(result.getDate()).toBe(28) // 2025 is not a leap year
  })

  it('should handle Feb 29 - 1 year = Feb 28', () => {
    const feb29 = new Date('2024-02-29T12:00:00Z')
    const result = addTime(feb29, -1, 'year')
    expect(result.getFullYear()).toBe(2023)
    expect(result.getMonth()).toBe(1)
    expect(result.getDate()).toBe(28)
  })

  it('should handle Dec 31 + 1 day = Jan 1 next year', () => {
    const dec31 = new Date('2024-12-31T12:00:00Z')
    const result = addTime(dec31, 1, 'day')
    expect(result.getFullYear()).toBe(2025)
    expect(result.getMonth()).toBe(0) // January
    expect(result.getDate()).toBe(1)
  })
})

// ─────────────────────────────────────────────────────────────────────────────
// RELATIVE TIME EDGE CASES
// ─────────────────────────────────────────────────────────────────────────────

describe('relative time edge cases', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2024-01-15T12:00:00Z'))
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should handle "just now" boundary', () => {
    // Default threshold is 30 seconds
    const date = new Date('2024-01-15T11:59:35Z') // 25 seconds ago (< 30s threshold)
    const result = relative(date, { config: defaultConfig })
    expect(result).toBe('just now')
  })

  it('should handle transition from seconds to minutes', () => {
    const date = new Date('2024-01-15T11:59:00Z') // 60 seconds ago
    const result = relative(date, { config: defaultConfig })
    expect(result).toBe('1 minute ago')
  })

  it('should handle singular vs plural', () => {
    const oneMinAgo = new Date('2024-01-15T11:59:00Z')
    const twoMinsAgo = new Date('2024-01-15T11:58:00Z')

    expect(relative(oneMinAgo, { config: defaultConfig })).toBe('1 minute ago')
    expect(relative(twoMinsAgo, { config: defaultConfig })).toBe('2 minutes ago')
  })

  it('should handle future dates', () => {
    const inOneHour = new Date('2024-01-15T13:00:00Z')
    const result = relative(inOneHour, { config: defaultConfig })
    expect(result).toBe('in 1 hour')
  })

  it('should handle exact day boundaries', () => {
    const yesterday = new Date('2024-01-14T12:00:00Z')
    const result = relative(yesterday, { config: defaultConfig })
    expect(result).toBe('yesterday')
  })
})

// ─────────────────────────────────────────────────────────────────────────────
// COMPARISON EDGE CASES
// ─────────────────────────────────────────────────────────────────────────────

describe('comparison edge cases', () => {
  it('should handle identical dates', () => {
    const date = new Date('2024-01-15T12:00:00Z')
    const result = compare(date, date, defaultConfig)
    expect(result.isSame()).toBe(true)
    expect(result.days()).toBe(0)
  })

  it('should handle millisecond differences', () => {
    const a = new Date('2024-01-15T12:00:00.000Z')
    const b = new Date('2024-01-15T12:00:00.001Z')
    const result = compare(a, b, defaultConfig)
    expect(result.milliseconds()).toBe(-1)
  })

  it('should handle year-spanning comparisons', () => {
    const a = new Date('2023-01-01T00:00:00Z')
    const b = new Date('2024-12-31T23:59:59Z')
    const result = compare(a, b, defaultConfig)
    expect(result.isBefore()).toBe(true)
  })
})

// ─────────────────────────────────────────────────────────────────────────────
// DURATION EDGE CASES
// ─────────────────────────────────────────────────────────────────────────────

describe('duration edge cases', () => {
  it('should handle zero duration', () => {
    const d = duration(0, defaultConfig)
    expect(d.hours).toBe(0)
    expect(d.minutes).toBe(0)
    expect(d.seconds).toBe(0)
    expect(d.long()).toBe('0 seconds')
  })

  it('should handle negative duration', () => {
    const d = duration(-3600, defaultConfig)
    expect(d.hours).toBe(1) // Absolute value
    expect(d.long()).toBe('1 hour')
  })

  it('should handle very large durations', () => {
    const oneYear = 365 * 24 * 60 * 60
    const d = duration(oneYear, defaultConfig)
    expect(d.totalSeconds).toBe(oneYear)
  })

  it('should handle fractional seconds (truncated)', () => {
    const d = duration(1.5, defaultConfig)
    expect(d.seconds).toBe(1)
  })
})

// ─────────────────────────────────────────────────────────────────────────────
// CALENDAR EDGE CASES
// ─────────────────────────────────────────────────────────────────────────────

describe('calendar edge cases', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2024-01-15T12:00:00Z'))
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should handle isToday at midnight boundaries', () => {
    const startOfToday = new Date('2024-01-15T00:00:00Z')
    const endOfToday = new Date('2024-01-15T23:59:59Z')

    expect(calendar.isToday(startOfToday)).toBe(true)
    expect(calendar.isToday(endOfToday)).toBe(true)
  })

  it('should handle isYesterday correctly', () => {
    const yesterday = new Date('2024-01-14T12:00:00Z')
    const twoDaysAgo = new Date('2024-01-13T12:00:00Z')

    expect(calendar.isYesterday(yesterday)).toBe(true)
    expect(calendar.isYesterday(twoDaysAgo)).toBe(false)
  })

  it('should handle isTomorrow correctly', () => {
    const tomorrow = new Date('2024-01-16T12:00:00Z')
    const twoDaysFromNow = new Date('2024-01-17T12:00:00Z')

    expect(calendar.isTomorrow(tomorrow)).toBe(true)
    expect(calendar.isTomorrow(twoDaysFromNow)).toBe(false)
  })

  it('should handle leap year in isWeekend', () => {
    // Feb 29, 2024 is a Thursday
    const feb29 = new Date('2024-02-29T12:00:00Z')
    expect(calendar.isWeekend(feb29)).toBe(false)
    expect(calendar.isWeekday(feb29)).toBe(true)
  })

  it('should correctly identify business days', () => {
    const monday = new Date('2024-01-15T12:00:00Z') // Monday
    const saturday = new Date('2024-01-20T12:00:00Z') // Saturday

    expect(calendar.isBusinessDay(monday)).toBe(true)
    expect(calendar.isBusinessDay(saturday)).toBe(false)
  })
})

// ─────────────────────────────────────────────────────────────────────────────
// SMART FORMATTING EDGE CASES
// ─────────────────────────────────────────────────────────────────────────────

describe('smart formatting edge cases', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2024-01-15T12:00:00Z'))
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  const testConfig = {
    ...defaultConfig,
    server: {
      ...defaultConfig.server,
      requireTimezone: false,
      warnOnMissingTimezone: false,
    },
  }

  it('should handle exact bucket boundaries', () => {
    // Exactly 1 hour ago falls into "today" bucket (shows time)
    const oneHourAgo = new Date('2024-01-15T11:00:00Z')
    const result = smart(oneHourAgo, { config: testConfig })
    // At exactly 1 hour boundary, falls into "today" bucket showing time
    expect(result).toMatch(/11:00\s*AM/i)
  })

  it('should handle dates in different years', () => {
    const lastYear = new Date('2023-06-15T12:00:00Z')
    const result = smart(lastYear, { config: testConfig })
    expect(result).toContain('2023')
  })

  it('should handle future dates', () => {
    // 7 days in the future falls into "this year" bucket (shows month + day)
    const nextWeek = new Date('2024-01-22T12:00:00Z')
    const result = smart(nextWeek, { config: testConfig })
    expect(result).toBe('Jan 22')
  })
})

// ─────────────────────────────────────────────────────────────────────────────
// INPUT VALIDATION
// ─────────────────────────────────────────────────────────────────────────────

describe('input validation', () => {
  it('should reject very long strings', () => {
    const longString = 'x'.repeat(1000)
    expect(() => parseDate(longString)).toThrow(/too long|exceeds/i)
  })

  it('should handle unicode in date strings gracefully', () => {
    expect(() => parseDate('2024年01月15日')).toThrow()
  })

  it('should handle special characters', () => {
    expect(() => parseDate('<script>alert(1)</script>')).toThrow()
  })

  it('should handle null-like values', () => {
    expect(() => parseDate(null as any)).toThrow()
    expect(() => parseDate(undefined as any)).toThrow()
  })
})
