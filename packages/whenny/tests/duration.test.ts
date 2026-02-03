/**
 * Duration Tests
 *
 * Tests for duration formatting.
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import {
  duration,
  durationMs,
  durationBetween,
  until,
  since,
  parseDuration,
} from '../src/duration'
import { defaultConfig } from '../src/config/defaults'

describe('duration', () => {
  describe('long format', () => {
    it('should format hours, minutes, and seconds', () => {
      const d = duration(3661, defaultConfig) // 1h 1m 1s
      expect(d.long()).toBe('1 hour, 1 minute, 1 second')
    })

    it('should format plural correctly', () => {
      const d = duration(7322, defaultConfig) // 2h 2m 2s
      expect(d.long()).toBe('2 hours, 2 minutes, 2 seconds')
    })

    it('should handle hours only', () => {
      const d = duration(7200, defaultConfig) // 2h
      expect(d.long()).toBe('2 hours')
    })

    it('should handle minutes only', () => {
      const d = duration(300, defaultConfig) // 5m
      expect(d.long()).toBe('5 minutes')
    })

    it('should handle seconds only', () => {
      const d = duration(45, defaultConfig)
      expect(d.long()).toBe('45 seconds')
    })

    it('should handle zero', () => {
      const d = duration(0, defaultConfig)
      expect(d.long()).toBe('0 seconds')
    })
  })

  describe('compact format', () => {
    it('should format hours, minutes, and seconds', () => {
      const d = duration(3661, defaultConfig)
      expect(d.compact()).toBe('1h 1m 1s')
    })

    it('should format hours and minutes without seconds when > 0', () => {
      const d = duration(7320, defaultConfig) // 2h 2m
      expect(d.compact()).toBe('2h 2m')
    })

    it('should handle hours only', () => {
      const d = duration(7200, defaultConfig)
      expect(d.compact()).toBe('2h 0m')
    })

    it('should handle minutes only', () => {
      const d = duration(300, defaultConfig)
      expect(d.compact()).toBe('5m')
    })

    it('should handle seconds only', () => {
      const d = duration(45, defaultConfig)
      expect(d.compact()).toBe('45s')
    })

    it('should handle zero', () => {
      const d = duration(0, defaultConfig)
      expect(d.compact()).toBe('0s')
    })
  })

  describe('clock format', () => {
    it('should format as H:MM:SS for hours', () => {
      const d = duration(3661, defaultConfig)
      expect(d.clock()).toBe('1:01:01')
    })

    it('should format as M:SS for minutes only', () => {
      const d = duration(125, defaultConfig)
      expect(d.clock()).toBe('2:05')
    })

    it('should format as 0:SS for seconds only', () => {
      const d = duration(45, defaultConfig)
      expect(d.clock()).toBe('0:45')
    })

    it('should pad minutes and seconds', () => {
      const d = duration(3723, defaultConfig) // 1:02:03
      expect(d.clock()).toBe('1:02:03')
    })
  })

  describe('human format', () => {
    it('should return hours approximation', () => {
      const d = duration(7200, defaultConfig)
      expect(d.human()).toBe('about 2 hours')
    })

    it('should round up for half hour+', () => {
      const d = duration(5400, defaultConfig) // 1.5 hours
      expect(d.human()).toBe('about 2 hours')
    })

    it('should not round up for less than half hour', () => {
      const d = duration(4500, defaultConfig) // 1.25 hours
      expect(d.human()).toBe('about 1 hour')
    })

    it('should return minutes for small durations', () => {
      const d = duration(300, defaultConfig)
      expect(d.human()).toBe('5 minutes')
    })

    it('should return seconds for tiny durations', () => {
      const d = duration(30, defaultConfig)
      expect(d.human()).toBe('30 seconds')
    })
  })

  describe('parts', () => {
    it('should return correct parts', () => {
      const d = duration(3661, defaultConfig)
      expect(d.hours).toBe(1)
      expect(d.minutes).toBe(1)
      expect(d.seconds).toBe(1)
      expect(d.totalSeconds).toBe(3661)
      expect(d.totalMinutes).toBe(61)
      expect(d.totalHours).toBe(1)
    })

    it('should handle large values', () => {
      const d = duration(90061, defaultConfig) // 25h 1m 1s
      expect(d.hours).toBe(25)
      expect(d.minutes).toBe(1)
      expect(d.seconds).toBe(1)
    })
  })

  describe('negative values', () => {
    it('should take absolute value', () => {
      const d = duration(-3600, defaultConfig)
      expect(d.hours).toBe(1)
      expect(d.long()).toBe('1 hour')
    })
  })
})

describe('durationMs', () => {
  it('should convert milliseconds to duration', () => {
    const d = durationMs(3661000, defaultConfig)
    expect(d.hours).toBe(1)
    expect(d.minutes).toBe(1)
    expect(d.seconds).toBe(1)
  })
})

describe('durationBetween', () => {
  it('should calculate duration between two dates', () => {
    const dateA = new Date('2024-01-15T12:00:00Z')
    const dateB = new Date('2024-01-15T13:30:45Z')
    const d = durationBetween(dateA, dateB, defaultConfig)
    expect(d.hours).toBe(1)
    expect(d.minutes).toBe(30)
    expect(d.seconds).toBe(45)
  })

  it('should handle reverse order', () => {
    const dateA = new Date('2024-01-15T13:30:45Z')
    const dateB = new Date('2024-01-15T12:00:00Z')
    const d = durationBetween(dateA, dateB, defaultConfig)
    expect(d.hours).toBe(1)
    expect(d.minutes).toBe(30)
    expect(d.seconds).toBe(45)
  })

  it('should accept string inputs', () => {
    const d = durationBetween(
      '2024-01-15T12:00:00Z',
      '2024-01-15T13:00:00Z',
      defaultConfig
    )
    expect(d.hours).toBe(1)
  })
})

describe('until', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2024-01-15T12:00:00Z'))
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should calculate duration until future date', () => {
    const future = new Date('2024-01-15T14:30:00Z')
    const d = until(future, defaultConfig)
    expect(d.hours).toBe(2)
    expect(d.minutes).toBe(30)
  })
})

describe('since', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2024-01-15T12:00:00Z'))
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should calculate duration since past date', () => {
    const past = new Date('2024-01-15T09:30:00Z')
    const d = since(past, defaultConfig)
    expect(d.hours).toBe(2)
    expect(d.minutes).toBe(30)
  })
})

describe('parseDuration', () => {
  it('should parse hours', () => {
    expect(parseDuration('2h')).toBe(7200)
    expect(parseDuration('2 h')).toBe(7200)
    expect(parseDuration('2H')).toBe(7200)
  })

  it('should parse minutes', () => {
    expect(parseDuration('30m')).toBe(1800)
    expect(parseDuration('30 min')).toBe(1800)
    expect(parseDuration('30M')).toBe(1800)
  })

  it('should parse seconds', () => {
    expect(parseDuration('45s')).toBe(45)
    expect(parseDuration('45 sec')).toBe(45)
    expect(parseDuration('45S')).toBe(45)
  })

  it('should parse combined durations', () => {
    expect(parseDuration('1h 30m')).toBe(5400)
    expect(parseDuration('1h30m')).toBe(5400)
    expect(parseDuration('2h 15m 30s')).toBe(8130)
  })

  it('should parse decimal values', () => {
    expect(parseDuration('1.5h')).toBe(5400)
    expect(parseDuration('2.5m')).toBe(150)
  })

  it('should parse plain number as seconds', () => {
    expect(parseDuration('60')).toBe(60)
  })

  it('should return 0 for invalid input', () => {
    expect(parseDuration('invalid')).toBe(0)
  })
})
