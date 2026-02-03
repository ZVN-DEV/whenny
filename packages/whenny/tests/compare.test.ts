/**
 * Comparison Tests
 *
 * Tests for comparing two dates.
 */

import { describe, it, expect } from 'vitest'
import { compare, distance } from '../src/compare'
import { defaultConfig } from '../src/config/defaults'

describe('compare', () => {
  describe('smart comparison', () => {
    it('should return "X days before" when first date is earlier', () => {
      const dateA = new Date('2024-01-10T12:00:00Z')
      const dateB = new Date('2024-01-15T12:00:00Z')
      const result = compare(dateA, dateB, defaultConfig)
      expect(result.smart()).toBe('5 days before')
    })

    it('should return "X days after" when first date is later', () => {
      const dateA = new Date('2024-01-20T12:00:00Z')
      const dateB = new Date('2024-01-15T12:00:00Z')
      const result = compare(dateA, dateB, defaultConfig)
      expect(result.smart()).toBe('5 days after')
    })

    it('should return "at the same time" for identical dates', () => {
      const dateA = new Date('2024-01-15T12:00:00Z')
      const dateB = new Date('2024-01-15T12:00:00Z')
      const result = compare(dateA, dateB, defaultConfig)
      expect(result.smart()).toBe('at the same time')
    })

    it('should return hours for smaller differences', () => {
      const dateA = new Date('2024-01-15T09:00:00Z')
      const dateB = new Date('2024-01-15T12:00:00Z')
      const result = compare(dateA, dateB, defaultConfig)
      expect(result.smart()).toBe('3 hours before')
    })

    it('should return minutes for tiny differences', () => {
      const dateA = new Date('2024-01-15T11:55:00Z')
      const dateB = new Date('2024-01-15T12:00:00Z')
      const result = compare(dateA, dateB, defaultConfig)
      expect(result.smart()).toBe('5 minutes before')
    })
  })

  describe('numeric differences', () => {
    const dateA = new Date('2024-01-10T12:00:00Z')
    const dateB = new Date('2024-01-15T12:00:00Z')
    const result = compare(dateA, dateB, defaultConfig)

    it('should return days difference', () => {
      expect(result.days()).toBe(-5)
    })

    it('should return hours difference', () => {
      const hours = result.hours()
      expect(hours).toBeLessThan(0)
    })

    it('should return minutes difference', () => {
      const minutes = result.minutes()
      expect(minutes).toBeLessThan(0)
    })

    it('should return seconds difference', () => {
      const seconds = result.seconds()
      expect(seconds).toBeLessThan(0)
    })

    it('should return milliseconds difference', () => {
      const ms = result.milliseconds()
      expect(ms).toBeLessThan(0)
    })
  })

  describe('boolean comparisons', () => {
    it('should correctly identify isBefore', () => {
      const dateA = new Date('2024-01-10T12:00:00Z')
      const dateB = new Date('2024-01-15T12:00:00Z')
      const result = compare(dateA, dateB, defaultConfig)
      expect(result.isBefore()).toBe(true)
      expect(result.isAfter()).toBe(false)
    })

    it('should correctly identify isAfter', () => {
      const dateA = new Date('2024-01-20T12:00:00Z')
      const dateB = new Date('2024-01-15T12:00:00Z')
      const result = compare(dateA, dateB, defaultConfig)
      expect(result.isBefore()).toBe(false)
      expect(result.isAfter()).toBe(true)
    })

    it('should correctly identify isSame', () => {
      const dateA = new Date('2024-01-15T12:00:00Z')
      const dateB = new Date('2024-01-15T12:00:00Z')
      const result = compare(dateA, dateB, defaultConfig)
      expect(result.isSame()).toBe(true)
    })

    it('should correctly identify isSame with day unit', () => {
      const dateA = new Date('2024-01-15T09:00:00Z')
      const dateB = new Date('2024-01-15T18:00:00Z')
      const result = compare(dateA, dateB, defaultConfig)
      expect(result.isSame('day')).toBe(true)
    })

    it('should correctly identify isSame with hour unit', () => {
      const dateA = new Date('2024-01-15T12:15:00Z')
      const dateB = new Date('2024-01-15T12:45:00Z')
      const result = compare(dateA, dateB, defaultConfig)
      expect(result.isSame('hour')).toBe(true)
    })
  })

  describe('input types', () => {
    it('should accept Date objects', () => {
      const result = compare(new Date(), new Date(), defaultConfig)
      expect(result.isSame()).toBe(true)
    })

    it('should accept ISO strings', () => {
      const result = compare(
        '2024-01-10T12:00:00Z',
        '2024-01-15T12:00:00Z',
        defaultConfig
      )
      expect(result.days()).toBe(-5)
    })

    it('should accept timestamps', () => {
      const tsA = new Date('2024-01-10T12:00:00Z').getTime()
      const tsB = new Date('2024-01-15T12:00:00Z').getTime()
      const result = compare(tsA, tsB, defaultConfig)
      expect(result.days()).toBe(-5)
    })

    it('should accept mixed input types', () => {
      const result = compare(
        new Date('2024-01-10T12:00:00Z'),
        '2024-01-15T12:00:00Z',
        defaultConfig
      )
      expect(result.days()).toBe(-5)
    })
  })
})

describe('distance', () => {
  describe('human readable', () => {
    it('should return days for large differences', () => {
      const dateA = new Date('2024-01-10T12:00:00Z')
      const dateB = new Date('2024-01-15T12:00:00Z')
      const result = distance(dateA, dateB, defaultConfig)
      expect(result.human()).toBe('5 days')
    })

    it('should return hours for medium differences', () => {
      const dateA = new Date('2024-01-15T09:00:00Z')
      const dateB = new Date('2024-01-15T12:00:00Z')
      const result = distance(dateA, dateB, defaultConfig)
      expect(result.human()).toBe('3 hours')
    })

    it('should return minutes for small differences', () => {
      const dateA = new Date('2024-01-15T11:55:00Z')
      const dateB = new Date('2024-01-15T12:00:00Z')
      const result = distance(dateA, dateB, defaultConfig)
      expect(result.human()).toBe('5 minutes')
    })

    it('should return seconds for tiny differences', () => {
      const dateA = new Date('2024-01-15T11:59:45Z')
      const dateB = new Date('2024-01-15T12:00:00Z')
      const result = distance(dateA, dateB, defaultConfig)
      expect(result.human()).toBe('15 seconds')
    })
  })

  describe('exact format', () => {
    it('should return exact breakdown', () => {
      const dateA = new Date('2024-01-15T09:25:30Z')
      const dateB = new Date('2024-01-15T12:00:00Z')
      const result = distance(dateA, dateB, defaultConfig)
      expect(result.exact()).toBe('2 hours, 34 minutes')
    })

    it('should handle single units correctly', () => {
      const dateA = new Date('2024-01-14T12:00:00Z')
      const dateB = new Date('2024-01-15T12:00:00Z')
      const result = distance(dateA, dateB, defaultConfig)
      expect(result.exact()).toBe('1 day')
    })
  })

  describe('parts', () => {
    it('should return correct parts', () => {
      const dateA = new Date('2024-01-14T09:25:30Z')
      const dateB = new Date('2024-01-15T12:00:00Z')
      const result = distance(dateA, dateB, defaultConfig)

      expect(result.days).toBe(1)
      expect(result.hours).toBe(2)
      expect(result.minutes).toBe(34)
      expect(result.seconds).toBe(30)
    })

    it('should return total seconds', () => {
      const dateA = new Date('2024-01-15T11:59:00Z')
      const dateB = new Date('2024-01-15T12:00:00Z')
      const result = distance(dateA, dateB, defaultConfig)
      expect(result.totalSeconds).toBe(60)
    })
  })

  describe('absolute value', () => {
    it('should return positive distance regardless of order', () => {
      const dateA = new Date('2024-01-20T12:00:00Z')
      const dateB = new Date('2024-01-15T12:00:00Z')
      const result = distance(dateA, dateB, defaultConfig)
      expect(result.days).toBe(5)
      expect(result.human()).toBe('5 days')
    })
  })
})
