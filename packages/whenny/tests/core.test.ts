/**
 * Core Module Tests
 *
 * Tests for core utility functions, parsing, and formatting.
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import {
  parseDate,
  isValidDate,
  addTime,
  subtractTime,
  differenceInSeconds,
  differenceInMinutes,
  differenceInHours,
  differenceInDays,
  startOfDay,
  endOfDay,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  startOfYear,
  endOfYear,
  isSameDay,
  isToday,
  isYesterday,
  isTomorrow,
  isWeekend,
  isWeekday,
  padZero,
  formatOrdinal,
  getOrdinalSuffix,
  MONTHS_SHORT,
  MONTHS_FULL,
  WEEKDAYS_SHORT,
  WEEKDAYS_FULL,
} from '../src/core/utils'
import { format, formatPreset, formatISO } from '../src/core/formatter'
import { defaultConfig } from '../src/config/defaults'

// ============================================================================
// PARSING TESTS
// ============================================================================

describe('parseDate', () => {
  it('should parse a Date object', () => {
    const date = new Date('2024-01-15T10:30:00Z')
    const parsed = parseDate(date)
    expect(parsed.getTime()).toBe(date.getTime())
    expect(parsed).not.toBe(date) // Should be a new instance
  })

  it('should parse an ISO string', () => {
    const parsed = parseDate('2024-01-15T10:30:00Z')
    expect(parsed.getFullYear()).toBe(2024)
    expect(parsed.getMonth()).toBe(0) // January
    expect(parsed.getDate()).toBe(15)
  })

  it('should parse a date string without time', () => {
    const parsed = parseDate('2024-01-15')
    expect(parsed.getFullYear()).toBe(2024)
    expect(parsed.getMonth()).toBe(0)
    expect(parsed.getDate()).toBe(15)
  })

  it('should parse a Unix timestamp in milliseconds', () => {
    const timestamp = 1705312200000 // 2024-01-15T10:30:00Z
    const parsed = parseDate(timestamp)
    expect(parsed.getTime()).toBe(timestamp)
  })

  it('should parse a date string with space separator', () => {
    const parsed = parseDate('2024-01-15 10:30:00')
    expect(parsed.getFullYear()).toBe(2024)
  })

  it('should throw for invalid input', () => {
    expect(() => parseDate('invalid')).toThrow()
  })
})

describe('isValidDate', () => {
  it('should return true for valid dates', () => {
    expect(isValidDate(new Date())).toBe(true)
    expect(isValidDate(new Date('2024-01-15'))).toBe(true)
  })

  it('should return false for invalid dates', () => {
    expect(isValidDate(new Date('invalid'))).toBe(false)
  })
})

// ============================================================================
// ARITHMETIC TESTS
// ============================================================================

describe('addTime', () => {
  const baseDate = new Date('2024-01-15T10:30:00Z')

  it('should add milliseconds', () => {
    const result = addTime(baseDate, 500, 'milliseconds')
    expect(result.getTime()).toBe(baseDate.getTime() + 500)
  })

  it('should add seconds', () => {
    const result = addTime(baseDate, 30, 'seconds')
    expect(result.getTime()).toBe(baseDate.getTime() + 30000)
  })

  it('should add minutes', () => {
    const result = addTime(baseDate, 15, 'minutes')
    expect(result.getTime()).toBe(baseDate.getTime() + 15 * 60000)
  })

  it('should add hours', () => {
    const result = addTime(baseDate, 2, 'hours')
    expect(result.getTime()).toBe(baseDate.getTime() + 2 * 3600000)
  })

  it('should add days', () => {
    const result = addTime(baseDate, 5, 'days')
    expect(result.getDate()).toBe(20)
  })

  it('should add weeks', () => {
    const result = addTime(baseDate, 2, 'weeks')
    expect(result.getDate()).toBe(29)
  })

  it('should add months', () => {
    const result = addTime(baseDate, 2, 'months')
    expect(result.getMonth()).toBe(2) // March
  })

  it('should add years', () => {
    const result = addTime(baseDate, 1, 'years')
    expect(result.getFullYear()).toBe(2025)
  })

  it('should handle singular unit names', () => {
    const result = addTime(baseDate, 1, 'day')
    expect(result.getDate()).toBe(16)
  })

  it('should not mutate the original date', () => {
    const original = new Date('2024-01-15T10:30:00Z')
    addTime(original, 5, 'days')
    expect(original.getDate()).toBe(15)
  })
})

describe('subtractTime', () => {
  const baseDate = new Date('2024-01-15T10:30:00Z')

  it('should subtract days', () => {
    const result = subtractTime(baseDate, 5, 'days')
    expect(result.getDate()).toBe(10)
  })

  it('should subtract months across year boundary', () => {
    const result = subtractTime(baseDate, 2, 'months')
    expect(result.getMonth()).toBe(10) // November
    expect(result.getFullYear()).toBe(2023)
  })
})

// ============================================================================
// DIFFERENCE TESTS
// ============================================================================

describe('differenceInSeconds', () => {
  it('should calculate positive difference', () => {
    const a = new Date('2024-01-15T10:30:30Z')
    const b = new Date('2024-01-15T10:30:00Z')
    expect(differenceInSeconds(a, b)).toBe(30)
  })

  it('should calculate negative difference', () => {
    const a = new Date('2024-01-15T10:30:00Z')
    const b = new Date('2024-01-15T10:30:30Z')
    expect(differenceInSeconds(a, b)).toBe(-30)
  })
})

describe('differenceInMinutes', () => {
  it('should calculate difference in minutes', () => {
    const a = new Date('2024-01-15T10:45:00Z')
    const b = new Date('2024-01-15T10:30:00Z')
    expect(differenceInMinutes(a, b)).toBe(15)
  })
})

describe('differenceInHours', () => {
  it('should calculate difference in hours', () => {
    const a = new Date('2024-01-15T14:30:00Z')
    const b = new Date('2024-01-15T10:30:00Z')
    expect(differenceInHours(a, b)).toBe(4)
  })
})

describe('differenceInDays', () => {
  it('should calculate difference in days', () => {
    const a = new Date('2024-01-20T10:30:00Z')
    const b = new Date('2024-01-15T10:30:00Z')
    expect(differenceInDays(a, b)).toBe(5)
  })
})

// ============================================================================
// BOUNDARY TESTS
// ============================================================================

describe('startOfDay', () => {
  it('should return start of day', () => {
    const date = new Date('2024-01-15T15:30:45.123Z')
    const result = startOfDay(date)
    expect(result.getHours()).toBe(0)
    expect(result.getMinutes()).toBe(0)
    expect(result.getSeconds()).toBe(0)
    expect(result.getMilliseconds()).toBe(0)
  })
})

describe('endOfDay', () => {
  it('should return end of day', () => {
    const date = new Date('2024-01-15T15:30:45.123Z')
    const result = endOfDay(date)
    expect(result.getHours()).toBe(23)
    expect(result.getMinutes()).toBe(59)
    expect(result.getSeconds()).toBe(59)
    expect(result.getMilliseconds()).toBe(999)
  })
})

describe('startOfWeek', () => {
  it('should return start of week (Sunday)', () => {
    const date = new Date('2024-01-17T15:30:00Z') // Wednesday
    const result = startOfWeek(date, 0)
    expect(result.getDay()).toBe(0) // Sunday
    expect(result.getDate()).toBe(14)
  })

  it('should return start of week (Monday)', () => {
    const date = new Date('2024-01-17T15:30:00Z') // Wednesday
    const result = startOfWeek(date, 1)
    expect(result.getDay()).toBe(1) // Monday
    expect(result.getDate()).toBe(15)
  })
})

describe('startOfMonth', () => {
  it('should return first day of month', () => {
    const date = new Date('2024-01-15T15:30:00Z')
    const result = startOfMonth(date)
    expect(result.getDate()).toBe(1)
    expect(result.getHours()).toBe(0)
  })
})

describe('endOfMonth', () => {
  it('should return last day of month', () => {
    const date = new Date('2024-01-15T15:30:00Z')
    const result = endOfMonth(date)
    expect(result.getDate()).toBe(31) // January has 31 days
    expect(result.getHours()).toBe(23)
  })

  it('should handle February in leap year', () => {
    const date = new Date('2024-02-15T15:30:00Z') // 2024 is a leap year
    const result = endOfMonth(date)
    expect(result.getDate()).toBe(29)
  })
})

describe('startOfYear', () => {
  it('should return January 1st', () => {
    const date = new Date('2024-06-15T15:30:00Z')
    const result = startOfYear(date)
    expect(result.getMonth()).toBe(0)
    expect(result.getDate()).toBe(1)
  })
})

describe('endOfYear', () => {
  it('should return December 31st', () => {
    const date = new Date('2024-06-15T15:30:00Z')
    const result = endOfYear(date)
    expect(result.getMonth()).toBe(11)
    expect(result.getDate()).toBe(31)
  })
})

// ============================================================================
// COMPARISON TESTS
// ============================================================================

describe('isSameDay', () => {
  it('should return true for same day', () => {
    const a = new Date('2024-01-15T10:00:00Z')
    const b = new Date('2024-01-15T22:00:00Z')
    expect(isSameDay(a, b)).toBe(true)
  })

  it('should return false for different days', () => {
    const a = new Date('2024-01-15T10:00:00Z')
    const b = new Date('2024-01-16T10:00:00Z')
    expect(isSameDay(a, b)).toBe(false)
  })
})

describe('isToday', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2024-01-15T12:00:00Z'))
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should return true for today', () => {
    expect(isToday(new Date('2024-01-15T10:00:00Z'))).toBe(true)
  })

  it('should return false for other days', () => {
    expect(isToday(new Date('2024-01-14T10:00:00Z'))).toBe(false)
  })
})

describe('isYesterday', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2024-01-15T12:00:00Z'))
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should return true for yesterday', () => {
    expect(isYesterday(new Date('2024-01-14T10:00:00Z'))).toBe(true)
  })
})

describe('isTomorrow', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2024-01-15T12:00:00Z'))
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should return true for tomorrow', () => {
    expect(isTomorrow(new Date('2024-01-16T10:00:00Z'))).toBe(true)
  })
})

describe('isWeekend', () => {
  it('should return true for Saturday', () => {
    expect(isWeekend(new Date('2024-01-13T12:00:00Z'))).toBe(true) // Saturday
  })

  it('should return true for Sunday', () => {
    expect(isWeekend(new Date('2024-01-14T12:00:00Z'))).toBe(true) // Sunday
  })

  it('should return false for weekdays', () => {
    expect(isWeekend(new Date('2024-01-15T12:00:00Z'))).toBe(false) // Monday
  })
})

describe('isWeekday', () => {
  it('should return true for Monday', () => {
    expect(isWeekday(new Date('2024-01-15T12:00:00Z'))).toBe(true)
  })

  it('should return false for Saturday', () => {
    expect(isWeekday(new Date('2024-01-13T12:00:00Z'))).toBe(false)
  })
})

// ============================================================================
// FORMATTING HELPER TESTS
// ============================================================================

describe('padZero', () => {
  it('should pad single digit with zero', () => {
    expect(padZero(5)).toBe('05')
  })

  it('should not pad double digits', () => {
    expect(padZero(15)).toBe('15')
  })

  it('should support custom length', () => {
    expect(padZero(5, 3)).toBe('005')
  })
})

describe('formatOrdinal', () => {
  it('should format 1st', () => {
    expect(formatOrdinal(1)).toBe('1st')
  })

  it('should format 2nd', () => {
    expect(formatOrdinal(2)).toBe('2nd')
  })

  it('should format 3rd', () => {
    expect(formatOrdinal(3)).toBe('3rd')
  })

  it('should format 4th', () => {
    expect(formatOrdinal(4)).toBe('4th')
  })

  it('should format 11th (not 11st)', () => {
    expect(formatOrdinal(11)).toBe('11th')
  })

  it('should format 12th (not 12nd)', () => {
    expect(formatOrdinal(12)).toBe('12th')
  })

  it('should format 13th (not 13rd)', () => {
    expect(formatOrdinal(13)).toBe('13th')
  })

  it('should format 21st', () => {
    expect(formatOrdinal(21)).toBe('21st')
  })

  it('should format 22nd', () => {
    expect(formatOrdinal(22)).toBe('22nd')
  })

  it('should format 23rd', () => {
    expect(formatOrdinal(23)).toBe('23rd')
  })
})

describe('constants', () => {
  it('should have correct month names', () => {
    expect(MONTHS_SHORT).toHaveLength(12)
    expect(MONTHS_FULL).toHaveLength(12)
    expect(MONTHS_SHORT[0]).toBe('Jan')
    expect(MONTHS_FULL[0]).toBe('January')
    expect(MONTHS_SHORT[11]).toBe('Dec')
    expect(MONTHS_FULL[11]).toBe('December')
  })

  it('should have correct weekday names', () => {
    expect(WEEKDAYS_SHORT).toHaveLength(7)
    expect(WEEKDAYS_FULL).toHaveLength(7)
    expect(WEEKDAYS_SHORT[0]).toBe('Sun')
    expect(WEEKDAYS_FULL[0]).toBe('Sunday')
    expect(WEEKDAYS_SHORT[6]).toBe('Sat')
    expect(WEEKDAYS_FULL[6]).toBe('Saturday')
  })
})

// ============================================================================
// FORMAT TESTS
// ============================================================================

describe('format', () => {
  const date = new Date('2024-01-15T15:30:45.123Z')

  it('should format year tokens', () => {
    expect(format(date, '{year}', defaultConfig)).toBe('2024')
    expect(format(date, '{yearShort}', defaultConfig)).toBe('24')
  })

  it('should format month tokens', () => {
    expect(format(date, '{month}', defaultConfig)).toBe('01')
    expect(format(date, '{monthShort}', defaultConfig)).toBe('Jan')
    expect(format(date, '{monthFull}', defaultConfig)).toBe('January')
  })

  it('should format day tokens', () => {
    expect(format(date, '{day}', defaultConfig)).toBe('15')
    expect(format(date, '{dayOrdinal}', defaultConfig)).toBe('15th')
    expect(format(date, '{weekday}', defaultConfig)).toBe('Monday')
    expect(format(date, '{weekdayShort}', defaultConfig)).toBe('Mon')
  })

  it('should format time tokens', () => {
    expect(format(date, '{hour24}', defaultConfig)).toBe('15')
    expect(format(date, '{minute}', defaultConfig)).toBe('30')
    expect(format(date, '{second}', defaultConfig)).toBe('45')
  })

  it('should format AM/PM tokens', () => {
    expect(format(date, '{ampm}', defaultConfig)).toBe('pm')
    expect(format(date, '{AMPM}', defaultConfig)).toBe('PM')

    const morning = new Date('2024-01-15T09:30:00Z')
    expect(format(morning, '{ampm}', defaultConfig)).toBe('am')
    expect(format(morning, '{AMPM}', defaultConfig)).toBe('AM')
  })

  it('should format complex templates', () => {
    expect(format(date, '{monthShort} {day}, {year}', defaultConfig)).toBe('Jan 15, 2024')
    expect(format(date, '{weekday}, {monthFull} {dayOrdinal}', defaultConfig)).toBe('Monday, January 15th')
    expect(format(date, '{year}-{month}-{day}', defaultConfig)).toBe('2024-01-15')
  })

  it('should preserve unknown tokens', () => {
    expect(format(date, '{unknown} test', defaultConfig)).toBe('{unknown} test')
  })
})

describe('formatISO', () => {
  it('should format as ISO 8601', () => {
    const date = new Date('2024-01-15T15:30:45.123Z')
    expect(formatISO(date)).toBe('2024-01-15T15:30:45.123Z')
  })
})

describe('formatPreset', () => {
  const date = new Date('2024-01-15T15:30:45.123Z')

  it('should format short preset', () => {
    const result = formatPreset(date, 'short', defaultConfig)
    expect(result).toBe('Jan 15')
  })

  it('should format long preset', () => {
    const result = formatPreset(date, 'long', defaultConfig)
    expect(result).toBe('January 15, 2024')
  })

  it('should throw for unknown preset', () => {
    expect(() => formatPreset(date, 'unknown', defaultConfig)).toThrow()
  })
})
