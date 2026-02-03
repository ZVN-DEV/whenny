/**
 * Transfer Protocol Tests
 *
 * Tests for server/browser date transfer with timezone context.
 */

import { describe, it, expect } from 'vitest'
import {
  createTransfer,
  fromTransfer,
  localTransfer,
  utcTransfer,
  isTransferPayload,
  parseTransferOrDate,
} from '../src/transfer'

describe('createTransfer', () => {
  it('should create a transfer payload with ISO timestamp', () => {
    const date = new Date('2024-01-15T15:30:00Z')
    const payload = createTransfer(date, { timezone: 'UTC' })

    expect(payload.iso).toBe('2024-01-15T15:30:00.000Z')
    expect(payload.originZone).toBe('UTC')
    expect(typeof payload.originOffset).toBe('number')
  })

  it('should include timezone information', () => {
    const date = new Date('2024-01-15T15:30:00Z')
    const payload = createTransfer(date, { timezone: 'America/New_York' })

    expect(payload.originZone).toBe('America/New_York')
    expect(payload.originOffset).toBeLessThan(0) // EST is UTC-5
  })

  it('should accept Date object', () => {
    const date = new Date()
    const payload = createTransfer(date, { timezone: 'UTC' })

    expect(payload.iso).toBeTruthy()
  })
})

describe('fromTransfer', () => {
  const payload = {
    iso: '2024-01-15T15:30:00.000Z',
    originZone: 'America/New_York',
    originOffset: -300, // EST (UTC-5)
  }

  it('should parse the ISO timestamp', () => {
    const received = fromTransfer(payload)
    expect(received.date.getTime()).toBe(new Date(payload.iso).getTime())
  })

  it('should preserve origin zone', () => {
    const received = fromTransfer(payload)
    expect(received.originZone).toBe('America/New_York')
  })

  it('should preserve origin offset', () => {
    const received = fromTransfer(payload)
    expect(received.originOffset).toBe(-300)
  })

  describe('utc()', () => {
    it('should return UTC date', () => {
      const received = fromTransfer(payload)
      const utc = received.utc()
      expect(utc.toISOString()).toBe(payload.iso)
    })
  })

  describe('inOrigin()', () => {
    it('should return date adjusted for origin timezone', () => {
      const received = fromTransfer(payload)
      const inOrigin = received.inOrigin()
      // Should be 5 hours behind UTC (EST)
      expect(inOrigin.getUTCHours()).toBe(10) // 15:30 UTC - 5 = 10:30 EST
    })
  })

  describe('startOfDayInOrigin()', () => {
    it('should return UTC timestamp for midnight in origin timezone', () => {
      const received = fromTransfer(payload)
      const startOfDay = received.startOfDayInOrigin()

      // Midnight EST = 5:00 UTC
      expect(startOfDay.getUTCHours()).toBe(5)
      expect(startOfDay.getUTCMinutes()).toBe(0)
    })
  })

  describe('endOfDayInOrigin()', () => {
    it('should return UTC timestamp for end of day in origin timezone', () => {
      const received = fromTransfer(payload)
      const endOfDay = received.endOfDayInOrigin()

      // 23:59:59 EST = 04:59:59 UTC (next day)
      expect(endOfDay.getUTCHours()).toBe(4)
      expect(endOfDay.getUTCMinutes()).toBe(59)
    })
  })

  describe('dayBoundsInOrigin()', () => {
    it('should return start and end of day', () => {
      const received = fromTransfer(payload)
      const bounds = received.dayBoundsInOrigin()

      expect(bounds.start).toBeDefined()
      expect(bounds.end).toBeDefined()
      expect(bounds.end.getTime()).toBeGreaterThan(bounds.start.getTime())
    })
  })

  describe('toISO()', () => {
    it('should return ISO string', () => {
      const received = fromTransfer(payload)
      expect(received.toISO()).toBe(payload.iso)
    })
  })

  describe('transfer()', () => {
    it('should create a new transfer payload', () => {
      const received = fromTransfer(payload)
      const newPayload = received.transfer()

      expect(newPayload.iso).toBe(payload.iso)
      expect(newPayload.originZone).toBe(payload.originZone)
      expect(newPayload.originOffset).toBe(payload.originOffset)
    })
  })
})

describe('localTransfer', () => {
  it('should create transfer with local timezone', () => {
    const payload = localTransfer()
    expect(payload.originZone).toBeTruthy()
    expect(payload.iso).toBeTruthy()
  })

  it('should accept a date', () => {
    const date = new Date('2024-01-15T12:00:00Z')
    const payload = localTransfer(date)
    expect(payload.iso).toBe(date.toISOString())
  })
})

describe('utcTransfer', () => {
  it('should create transfer with UTC timezone', () => {
    const payload = utcTransfer()
    expect(payload.originZone).toBe('UTC')
  })

  it('should accept a date', () => {
    const date = new Date('2024-01-15T12:00:00Z')
    const payload = utcTransfer(date)
    expect(payload.iso).toBe(date.toISOString())
    expect(payload.originZone).toBe('UTC')
  })
})

describe('isTransferPayload', () => {
  it('should return true for valid payloads', () => {
    const payload = {
      iso: '2024-01-15T15:30:00.000Z',
      originZone: 'UTC',
      originOffset: 0,
    }
    expect(isTransferPayload(payload)).toBe(true)
  })

  it('should return false for missing fields', () => {
    expect(isTransferPayload({ iso: '2024-01-15T15:30:00.000Z' })).toBe(false)
    expect(isTransferPayload({ originZone: 'UTC' })).toBe(false)
    expect(isTransferPayload({})).toBe(false)
  })

  it('should return false for non-objects', () => {
    expect(isTransferPayload(null)).toBe(false)
    expect(isTransferPayload(undefined)).toBe(false)
    expect(isTransferPayload('string')).toBe(false)
    expect(isTransferPayload(123)).toBe(false)
  })

  it('should return false for wrong field types', () => {
    expect(isTransferPayload({
      iso: 123,
      originZone: 'UTC',
      originOffset: 0,
    })).toBe(false)

    expect(isTransferPayload({
      iso: '2024-01-15T15:30:00.000Z',
      originZone: 'UTC',
      originOffset: 'zero',
    })).toBe(false)
  })
})

describe('parseTransferOrDate', () => {
  it('should parse transfer payload', () => {
    const payload = {
      iso: '2024-01-15T15:30:00.000Z',
      originZone: 'America/New_York',
      originOffset: -300,
    }
    const result = parseTransferOrDate(payload)
    expect(result.originZone).toBe('America/New_York')
  })

  it('should parse Date object', () => {
    const date = new Date('2024-01-15T15:30:00Z')
    const result = parseTransferOrDate(date)
    expect(result.date.getTime()).toBe(date.getTime())
  })

  it('should parse ISO string', () => {
    const result = parseTransferOrDate('2024-01-15T15:30:00Z')
    expect(result.date).toBeDefined()
  })

  it('should parse timestamp', () => {
    const timestamp = new Date('2024-01-15T15:30:00Z').getTime()
    const result = parseTransferOrDate(timestamp)
    expect(result.date.getTime()).toBe(timestamp)
  })
})

describe('use case: browser to server round trip', () => {
  it('should preserve timezone context through the round trip', () => {
    // Browser side: user selects a date
    const userDate = new Date('2024-01-15T10:30:00-05:00') // 10:30 AM EST
    const payload = createTransfer(userDate, { timezone: 'America/New_York' })

    // Server side: receive and process
    const received = fromTransfer(payload)

    // The date should be preserved in UTC
    expect(received.date.toISOString()).toBe(userDate.toISOString())

    // We should know the user's timezone
    expect(received.originZone).toBe('America/New_York')

    // We can get "today" in the user's timezone for queries
    const bounds = received.dayBoundsInOrigin()
    expect(bounds.start).toBeDefined()
    expect(bounds.end).toBeDefined()
  })
})
