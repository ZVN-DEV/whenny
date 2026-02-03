/**
 * Natural Language Parsing Tests
 *
 * Tests for parsing human-friendly date expressions.
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { parse, canParse } from '../src/natural'
import { defaultConfig } from '../src/config/defaults'

describe('natural language parsing', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2024-01-15T12:00:00Z')) // Monday
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  describe('relative date expressions', () => {
    it('should parse "now"', () => {
      const result = parse('now', { config: defaultConfig })
      expect(result?.getTime()).toBeCloseTo(Date.now(), -3)
    })

    it('should parse "today"', () => {
      const result = parse('today', { config: defaultConfig })
      expect(result?.getDate()).toBe(15)
      expect(result?.getHours()).toBe(0)
    })

    it('should parse "tomorrow"', () => {
      const result = parse('tomorrow', { config: defaultConfig })
      expect(result?.getDate()).toBe(16)
      expect(result?.getHours()).toBe(0)
    })

    it('should parse "yesterday"', () => {
      const result = parse('yesterday', { config: defaultConfig })
      expect(result?.getDate()).toBe(14)
      expect(result?.getHours()).toBe(0)
    })

    it('should parse "next week"', () => {
      const result = parse('next week', { config: defaultConfig })
      expect(result).toBeDefined()
      expect(result!.getDate()).toBeGreaterThan(15)
    })

    it('should parse "last week"', () => {
      const result = parse('last week', { config: defaultConfig })
      expect(result).toBeDefined()
      expect(result!.getDate()).toBeLessThan(15)
    })

    it('should parse "next month"', () => {
      const result = parse('next month', { config: defaultConfig })
      expect(result?.getMonth()).toBe(1) // February
      expect(result?.getDate()).toBe(1)
    })

    it('should parse "last month"', () => {
      const result = parse('last month', { config: defaultConfig })
      expect(result?.getMonth()).toBe(11) // December 2023
      expect(result?.getDate()).toBe(1)
    })

    it('should parse "next year"', () => {
      const result = parse('next year', { config: defaultConfig })
      expect(result?.getFullYear()).toBe(2025)
      expect(result?.getMonth()).toBe(0)
      expect(result?.getDate()).toBe(1)
    })

    it('should parse "last year"', () => {
      const result = parse('last year', { config: defaultConfig })
      expect(result?.getFullYear()).toBe(2023)
      expect(result?.getMonth()).toBe(0)
      expect(result?.getDate()).toBe(1)
    })
  })

  describe('relative time expressions', () => {
    it('should parse "in X minutes"', () => {
      const result = parse('in 30 minutes', { config: defaultConfig })
      expect(result?.getMinutes()).toBe(30)
    })

    it('should parse "in X hours"', () => {
      const result = parse('in 2 hours', { config: defaultConfig })
      expect(result?.getHours()).toBe(14)
    })

    it('should parse "in X days"', () => {
      const result = parse('in 5 days', { config: defaultConfig })
      expect(result?.getDate()).toBe(20)
    })

    it('should parse "in X weeks"', () => {
      const result = parse('in 2 weeks', { config: defaultConfig })
      expect(result?.getDate()).toBe(29)
    })

    it('should parse "in X months"', () => {
      const result = parse('in 3 months', { config: defaultConfig })
      expect(result?.getMonth()).toBe(3) // April
    })

    it('should parse "in X years"', () => {
      const result = parse('in 1 year', { config: defaultConfig })
      expect(result?.getFullYear()).toBe(2025)
    })

    it('should parse "X minutes ago"', () => {
      const result = parse('30 minutes ago', { config: defaultConfig })
      expect(result?.getMinutes()).toBe(30)
      expect(result?.getHours()).toBe(11)
    })

    it('should parse "X hours ago"', () => {
      const result = parse('3 hours ago', { config: defaultConfig })
      expect(result?.getHours()).toBe(9)
    })

    it('should parse "X days ago"', () => {
      const result = parse('5 days ago', { config: defaultConfig })
      expect(result?.getDate()).toBe(10)
    })
  })

  describe('named day expressions', () => {
    // Monday Jan 15, 2024 is our reference

    it('should parse "next tuesday"', () => {
      const result = parse('next tuesday', { config: defaultConfig })
      expect(result?.getDay()).toBe(2) // Tuesday
      expect(result?.getDate()).toBe(16)
    })

    it('should parse "next friday"', () => {
      const result = parse('next friday', { config: defaultConfig })
      expect(result?.getDay()).toBe(5) // Friday
      expect(result?.getDate()).toBe(19)
    })

    it('should parse "next sunday"', () => {
      const result = parse('next sunday', { config: defaultConfig })
      expect(result?.getDay()).toBe(0) // Sunday
      expect(result?.getDate()).toBe(21)
    })

    it('should parse "last friday"', () => {
      const result = parse('last friday', { config: defaultConfig })
      expect(result?.getDay()).toBe(5) // Friday
      expect(result?.getDate()).toBe(12)
    })

    it('should parse "last sunday"', () => {
      const result = parse('last sunday', { config: defaultConfig })
      expect(result?.getDay()).toBe(0) // Sunday
      expect(result?.getDate()).toBe(14)
    })

    it('should parse "this wednesday"', () => {
      const result = parse('this wednesday', { config: defaultConfig })
      expect(result?.getDay()).toBe(3) // Wednesday
      expect(result?.getDate()).toBe(17)
    })

    it('should parse standalone day name as "next"', () => {
      const result = parse('wednesday', { config: defaultConfig })
      expect(result?.getDay()).toBe(3) // Wednesday
    })
  })

  describe('semantic date expressions', () => {
    it('should parse "end of month"', () => {
      const result = parse('end of month', { config: defaultConfig })
      expect(result?.getDate()).toBe(31) // January 31
    })

    it('should parse "end of year"', () => {
      const result = parse('end of year', { config: defaultConfig })
      expect(result?.getMonth()).toBe(11) // December
      expect(result?.getDate()).toBe(31)
    })

    it('should parse "start of week"', () => {
      const result = parse('start of week', { config: defaultConfig })
      expect(result?.getDay()).toBe(0) // Sunday
    })

    it('should parse "beginning of week"', () => {
      const result = parse('beginning of week', { config: defaultConfig })
      expect(result?.getDay()).toBe(0) // Sunday
    })

    it('should parse "start of month"', () => {
      const result = parse('start of month', { config: defaultConfig })
      expect(result?.getDate()).toBe(1)
    })

    it('should parse "beginning of month"', () => {
      const result = parse('beginning of month', { config: defaultConfig })
      expect(result?.getDate()).toBe(1)
    })

    it('should parse "start of year"', () => {
      const result = parse('start of year', { config: defaultConfig })
      expect(result?.getMonth()).toBe(0)
      expect(result?.getDate()).toBe(1)
    })

    it('should parse "beginning of next month"', () => {
      const result = parse('beginning of next month', { config: defaultConfig })
      expect(result?.getMonth()).toBe(1) // February
      expect(result?.getDate()).toBe(1)
    })

    it('should parse "end of next month"', () => {
      const result = parse('end of next month', { config: defaultConfig })
      expect(result?.getMonth()).toBe(1) // February
      expect(result?.getDate()).toBe(29) // 2024 is a leap year
    })

    it('should parse "tonight"', () => {
      const result = parse('tonight', { config: defaultConfig })
      expect(result?.getHours()).toBe(defaultConfig.natural.night)
    })
  })

  describe('time expressions', () => {
    it('should parse "tomorrow at 3pm"', () => {
      const result = parse('tomorrow at 3pm', { config: defaultConfig })
      expect(result?.getDate()).toBe(16)
      expect(result?.getHours()).toBe(15)
    })

    it('should parse "tomorrow at 3:30pm"', () => {
      const result = parse('tomorrow at 3:30pm', { config: defaultConfig })
      expect(result?.getDate()).toBe(16)
      expect(result?.getHours()).toBe(15)
      expect(result?.getMinutes()).toBe(30)
    })

    it('should parse "tomorrow at 9am"', () => {
      const result = parse('tomorrow at 9am', { config: defaultConfig })
      expect(result?.getHours()).toBe(9)
    })

    it('should parse "next friday at 10:30"', () => {
      const result = parse('next friday at 10:30', { config: defaultConfig })
      expect(result?.getDay()).toBe(5) // Friday
      // Without am/pm and <= 7, assumes PM; 10 is > 7 so stays 10
      expect(result?.getHours()).toBe(10)
      expect(result?.getMinutes()).toBe(30)
    })

    it('should parse "tomorrow morning"', () => {
      const result = parse('tomorrow morning', { config: defaultConfig })
      expect(result?.getDate()).toBe(16)
      expect(result?.getHours()).toBe(defaultConfig.natural.morning)
    })

    it('should parse "tomorrow afternoon"', () => {
      const result = parse('tomorrow afternoon', { config: defaultConfig })
      expect(result?.getDate()).toBe(16)
      expect(result?.getHours()).toBe(defaultConfig.natural.afternoon)
    })

    it('should parse "tomorrow evening"', () => {
      const result = parse('tomorrow evening', { config: defaultConfig })
      expect(result?.getDate()).toBe(16)
      expect(result?.getHours()).toBe(defaultConfig.natural.evening)
    })

    it('should parse "today at 5pm"', () => {
      const result = parse('today at 5pm', { config: defaultConfig })
      expect(result?.getDate()).toBe(15)
      expect(result?.getHours()).toBe(17)
    })
  })

  describe('with reference date', () => {
    it('should calculate relative to reference', () => {
      const reference = new Date('2024-06-15T12:00:00Z')
      const result = parse('tomorrow', { from: reference, config: defaultConfig })
      expect(result?.getMonth()).toBe(5) // June
      expect(result?.getDate()).toBe(16)
    })

    it('should calculate "in X days" from reference', () => {
      const reference = new Date('2024-06-15T12:00:00Z')
      const result = parse('in 5 days', { from: reference, config: defaultConfig })
      expect(result?.getDate()).toBe(20)
    })
  })

  describe('invalid inputs', () => {
    it('should return null for invalid expressions', () => {
      expect(parse('invalid string', { config: defaultConfig })).toBeNull()
      expect(parse('foo bar baz', { config: defaultConfig })).toBeNull()
      expect(parse('', { config: defaultConfig })).toBeNull()
    })
  })
})

describe('canParse', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2024-01-15T12:00:00Z'))
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should return true for valid expressions', () => {
    expect(canParse('tomorrow')).toBe(true)
    expect(canParse('next week')).toBe(true)
    expect(canParse('in 5 days')).toBe(true)
    expect(canParse('tomorrow at 3pm')).toBe(true)
  })

  it('should return false for invalid expressions', () => {
    expect(canParse('invalid')).toBe(false)
    expect(canParse('foo')).toBe(false)
  })
})
