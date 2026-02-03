/**
 * Calendar Tests
 *
 * Tests for calendar utility functions.
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import {
  isToday,
  isYesterday,
  isTomorrow,
  isThisWeek,
  isThisMonth,
  isThisYear,
  isWeekend,
  isWeekday,
  isBusinessDay,
  isPast,
  isFuture,
  isSameDay,
  isSameWeek,
  isSameMonth,
  isSameYear,
  isBefore,
  isAfter,
  isBetween,
  startOf,
  endOf,
  add,
  subtract,
  daysUntil,
  daysSince,
  businessDaysBetween,
  nextBusinessDay,
  previousBusinessDay,
} from '../src/calendar'
import { defaultConfig } from '../src/config/defaults'

describe('date queries', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2024-01-15T12:00:00Z')) // Monday
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  describe('isToday', () => {
    it('should return true for today', () => {
      expect(isToday('2024-01-15T09:00:00Z')).toBe(true)
      expect(isToday('2024-01-15T23:59:59Z')).toBe(true)
    })

    it('should return false for other days', () => {
      expect(isToday('2024-01-14T12:00:00Z')).toBe(false)
      expect(isToday('2024-01-16T12:00:00Z')).toBe(false)
    })
  })

  describe('isYesterday', () => {
    it('should return true for yesterday', () => {
      expect(isYesterday('2024-01-14T12:00:00Z')).toBe(true)
    })

    it('should return false for other days', () => {
      expect(isYesterday('2024-01-15T12:00:00Z')).toBe(false)
      expect(isYesterday('2024-01-13T12:00:00Z')).toBe(false)
    })
  })

  describe('isTomorrow', () => {
    it('should return true for tomorrow', () => {
      expect(isTomorrow('2024-01-16T12:00:00Z')).toBe(true)
    })

    it('should return false for other days', () => {
      expect(isTomorrow('2024-01-15T12:00:00Z')).toBe(false)
      expect(isTomorrow('2024-01-17T12:00:00Z')).toBe(false)
    })
  })

  describe('isThisWeek', () => {
    it('should return true for dates in the same week', () => {
      expect(isThisWeek('2024-01-14T12:00:00Z', defaultConfig)).toBe(true) // Sunday
      expect(isThisWeek('2024-01-17T12:00:00Z', defaultConfig)).toBe(true) // Wednesday
      expect(isThisWeek('2024-01-20T12:00:00Z', defaultConfig)).toBe(true) // Saturday
    })

    it('should return false for dates in other weeks', () => {
      expect(isThisWeek('2024-01-08T12:00:00Z', defaultConfig)).toBe(false) // Previous week
      expect(isThisWeek('2024-01-22T12:00:00Z', defaultConfig)).toBe(false) // Next week
    })
  })

  describe('isThisMonth', () => {
    it('should return true for dates in January 2024', () => {
      expect(isThisMonth('2024-01-01T12:00:00Z')).toBe(true)
      expect(isThisMonth('2024-01-31T12:00:00Z')).toBe(true)
    })

    it('should return false for other months', () => {
      expect(isThisMonth('2024-02-01T12:00:00Z')).toBe(false)
      expect(isThisMonth('2023-12-31T12:00:00Z')).toBe(false)
    })
  })

  describe('isThisYear', () => {
    it('should return true for dates in 2024', () => {
      expect(isThisYear('2024-06-15T12:00:00Z')).toBe(true)
      expect(isThisYear('2024-12-31T12:00:00Z')).toBe(true)
    })

    it('should return false for other years', () => {
      expect(isThisYear('2023-12-31T12:00:00Z')).toBe(false)
      expect(isThisYear('2025-01-01T12:00:00Z')).toBe(false)
    })
  })

  describe('isWeekend', () => {
    it('should return true for Saturday', () => {
      expect(isWeekend('2024-01-13T12:00:00Z')).toBe(true)
    })

    it('should return true for Sunday', () => {
      expect(isWeekend('2024-01-14T12:00:00Z')).toBe(true)
    })

    it('should return false for weekdays', () => {
      expect(isWeekend('2024-01-15T12:00:00Z')).toBe(false) // Monday
      expect(isWeekend('2024-01-17T12:00:00Z')).toBe(false) // Wednesday
    })
  })

  describe('isWeekday', () => {
    it('should return true for Monday through Friday', () => {
      expect(isWeekday('2024-01-15T12:00:00Z')).toBe(true) // Monday
      expect(isWeekday('2024-01-19T12:00:00Z')).toBe(true) // Friday
    })

    it('should return false for weekend', () => {
      expect(isWeekday('2024-01-13T12:00:00Z')).toBe(false) // Saturday
      expect(isWeekday('2024-01-14T12:00:00Z')).toBe(false) // Sunday
    })
  })

  describe('isBusinessDay', () => {
    it('should return true for configured business days', () => {
      expect(isBusinessDay('2024-01-15T12:00:00Z', defaultConfig)).toBe(true) // Monday
      expect(isBusinessDay('2024-01-19T12:00:00Z', defaultConfig)).toBe(true) // Friday
    })

    it('should return false for non-business days', () => {
      expect(isBusinessDay('2024-01-13T12:00:00Z', defaultConfig)).toBe(false) // Saturday
      expect(isBusinessDay('2024-01-14T12:00:00Z', defaultConfig)).toBe(false) // Sunday
    })
  })

  describe('isPast', () => {
    it('should return true for past dates', () => {
      expect(isPast('2024-01-14T12:00:00Z')).toBe(true)
      expect(isPast('2024-01-15T11:59:59Z')).toBe(true)
    })

    it('should return false for future dates', () => {
      expect(isPast('2024-01-15T12:00:01Z')).toBe(false)
      expect(isPast('2024-01-16T12:00:00Z')).toBe(false)
    })
  })

  describe('isFuture', () => {
    it('should return true for future dates', () => {
      expect(isFuture('2024-01-15T12:00:01Z')).toBe(true)
      expect(isFuture('2024-01-16T12:00:00Z')).toBe(true)
    })

    it('should return false for past dates', () => {
      expect(isFuture('2024-01-14T12:00:00Z')).toBe(false)
      expect(isFuture('2024-01-15T11:59:59Z')).toBe(false)
    })
  })
})

describe('comparisons', () => {
  describe('isSameDay', () => {
    it('should return true for same day', () => {
      expect(isSameDay(
        '2024-01-15T09:00:00Z',
        '2024-01-15T18:00:00Z'
      )).toBe(true)
    })

    it('should return false for different days', () => {
      expect(isSameDay(
        '2024-01-15T12:00:00Z',
        '2024-01-16T12:00:00Z'
      )).toBe(false)
    })
  })

  describe('isSameWeek', () => {
    it('should return true for same week', () => {
      expect(isSameWeek(
        '2024-01-15T12:00:00Z', // Monday
        '2024-01-19T12:00:00Z', // Friday
        defaultConfig
      )).toBe(true)
    })

    it('should return false for different weeks', () => {
      expect(isSameWeek(
        '2024-01-15T12:00:00Z',
        '2024-01-22T12:00:00Z',
        defaultConfig
      )).toBe(false)
    })
  })

  describe('isSameMonth', () => {
    it('should return true for same month', () => {
      expect(isSameMonth(
        '2024-01-01T12:00:00Z',
        '2024-01-31T12:00:00Z'
      )).toBe(true)
    })

    it('should return false for different months', () => {
      expect(isSameMonth(
        '2024-01-15T12:00:00Z',
        '2024-02-15T12:00:00Z'
      )).toBe(false)
    })
  })

  describe('isSameYear', () => {
    it('should return true for same year', () => {
      expect(isSameYear(
        '2024-01-01T12:00:00Z',
        '2024-12-31T12:00:00Z'
      )).toBe(true)
    })

    it('should return false for different years', () => {
      expect(isSameYear(
        '2024-01-15T12:00:00Z',
        '2025-01-15T12:00:00Z'
      )).toBe(false)
    })
  })

  describe('isBefore', () => {
    it('should return true when first date is before', () => {
      expect(isBefore(
        '2024-01-10T12:00:00Z',
        '2024-01-15T12:00:00Z'
      )).toBe(true)
    })

    it('should return false when first date is after', () => {
      expect(isBefore(
        '2024-01-20T12:00:00Z',
        '2024-01-15T12:00:00Z'
      )).toBe(false)
    })
  })

  describe('isAfter', () => {
    it('should return true when first date is after', () => {
      expect(isAfter(
        '2024-01-20T12:00:00Z',
        '2024-01-15T12:00:00Z'
      )).toBe(true)
    })

    it('should return false when first date is before', () => {
      expect(isAfter(
        '2024-01-10T12:00:00Z',
        '2024-01-15T12:00:00Z'
      )).toBe(false)
    })
  })

  describe('isBetween', () => {
    it('should return true when date is between', () => {
      expect(isBetween(
        '2024-01-15T12:00:00Z',
        '2024-01-10T12:00:00Z',
        '2024-01-20T12:00:00Z'
      )).toBe(true)
    })

    it('should return true for boundary dates (inclusive)', () => {
      expect(isBetween(
        '2024-01-10T12:00:00Z',
        '2024-01-10T12:00:00Z',
        '2024-01-20T12:00:00Z'
      )).toBe(true)
    })

    it('should return false when date is outside', () => {
      expect(isBetween(
        '2024-01-25T12:00:00Z',
        '2024-01-10T12:00:00Z',
        '2024-01-20T12:00:00Z'
      )).toBe(false)
    })
  })
})

describe('boundaries', () => {
  describe('startOf', () => {
    it('should get start of day', () => {
      const result = startOf('2024-01-15T15:30:45Z', 'day')
      expect(result.getHours()).toBe(0)
      expect(result.getMinutes()).toBe(0)
      expect(result.getSeconds()).toBe(0)
    })

    it('should get start of week', () => {
      const result = startOf('2024-01-17T15:30:45Z', 'week', defaultConfig) // Wednesday
      expect(result.getDay()).toBe(0) // Sunday
    })

    it('should get start of month', () => {
      const result = startOf('2024-01-15T15:30:45Z', 'month')
      expect(result.getDate()).toBe(1)
    })

    it('should get start of year', () => {
      const result = startOf('2024-06-15T15:30:45Z', 'year')
      expect(result.getMonth()).toBe(0)
      expect(result.getDate()).toBe(1)
    })
  })

  describe('endOf', () => {
    it('should get end of day', () => {
      const result = endOf('2024-01-15T15:30:45Z', 'day')
      expect(result.getHours()).toBe(23)
      expect(result.getMinutes()).toBe(59)
      expect(result.getSeconds()).toBe(59)
    })

    it('should get end of month', () => {
      const result = endOf('2024-01-15T15:30:45Z', 'month')
      expect(result.getDate()).toBe(31)
    })

    it('should get end of year', () => {
      const result = endOf('2024-06-15T15:30:45Z', 'year')
      expect(result.getMonth()).toBe(11)
      expect(result.getDate()).toBe(31)
    })
  })
})

describe('arithmetic', () => {
  describe('add', () => {
    it('should add days', () => {
      const result = add('2024-01-15T12:00:00Z', 5, 'days')
      expect(result.getDate()).toBe(20)
    })

    it('should add months', () => {
      const result = add('2024-01-15T12:00:00Z', 2, 'months')
      expect(result.getMonth()).toBe(2) // March
    })

    it('should add years', () => {
      const result = add('2024-01-15T12:00:00Z', 1, 'year')
      expect(result.getFullYear()).toBe(2025)
    })
  })

  describe('subtract', () => {
    it('should subtract days', () => {
      const result = subtract('2024-01-15T12:00:00Z', 5, 'days')
      expect(result.getDate()).toBe(10)
    })

    it('should subtract months', () => {
      const result = subtract('2024-01-15T12:00:00Z', 2, 'months')
      expect(result.getMonth()).toBe(10) // November 2023
    })
  })
})

describe('distances', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2024-01-15T12:00:00Z'))
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  describe('daysUntil', () => {
    it('should return days until future date', () => {
      expect(daysUntil('2024-01-20T12:00:00Z')).toBe(5)
    })

    it('should return 0 for past dates', () => {
      expect(daysUntil('2024-01-10T12:00:00Z')).toBe(0)
    })
  })

  describe('daysSince', () => {
    it('should return days since past date', () => {
      expect(daysSince('2024-01-10T12:00:00Z')).toBe(5)
    })

    it('should return 0 for future dates', () => {
      expect(daysSince('2024-01-20T12:00:00Z')).toBe(0)
    })
  })

  describe('businessDaysBetween', () => {
    it('should count business days', () => {
      // Monday Jan 15 to Friday Jan 19 = 5 business days
      const count = businessDaysBetween(
        '2024-01-15T12:00:00Z',
        '2024-01-19T12:00:00Z',
        defaultConfig
      )
      expect(count).toBe(5)
    })

    it('should exclude weekends', () => {
      // Friday Jan 12 to Monday Jan 15 = 2 business days (Fri, Mon)
      const count = businessDaysBetween(
        '2024-01-12T12:00:00Z',
        '2024-01-15T12:00:00Z',
        defaultConfig
      )
      expect(count).toBe(2)
    })
  })

  describe('nextBusinessDay', () => {
    it('should return next business day from Monday', () => {
      const result = nextBusinessDay('2024-01-15T12:00:00Z', defaultConfig) // Monday
      expect(result.getDate()).toBe(16) // Tuesday
    })

    it('should skip weekend from Friday', () => {
      const result = nextBusinessDay('2024-01-19T12:00:00Z', defaultConfig) // Friday
      expect(result.getDate()).toBe(22) // Monday
    })
  })

  describe('previousBusinessDay', () => {
    it('should return previous business day from Tuesday', () => {
      const result = previousBusinessDay('2024-01-16T12:00:00Z', defaultConfig) // Tuesday
      expect(result.getDate()).toBe(15) // Monday
    })

    it('should skip weekend from Monday', () => {
      const result = previousBusinessDay('2024-01-15T12:00:00Z', defaultConfig) // Monday
      expect(result.getDate()).toBe(12) // Friday
    })
  })
})
