/**
 * Whenny Transfer Protocol
 *
 * Handle date serialization between browser and server with full timezone context.
 * Solves the common problem of losing timezone information when dates cross the wire.
 */

import type { TransferPayload, Timezone, DateInput, DayBounds } from '../types'
import {
  parseDate,
  getLocalTimezone,
  getTimezoneOffset,
  startOfDay,
  endOfDay,
} from '../core/utils'

/**
 * Create a transfer payload from a date
 *
 * The payload includes:
 * - ISO timestamp in UTC
 * - Original timezone
 * - Original offset from UTC
 *
 * @example
 * ```typescript
 * // Browser side
 * const payload = createTransfer(new Date())
 * // → { iso: "2024-01-15T15:30:00.000Z", originZone: "America/New_York", originOffset: -300 }
 *
 * // Send to server
 * fetch('/api/events', { body: JSON.stringify({ date: payload }) })
 * ```
 */
export function createTransfer(
  date: DateInput,
  options?: { timezone?: Timezone }
): TransferPayload {
  const d = parseDate(date)
  const timezone = options?.timezone ?? getLocalTimezone()
  const offset = getTimezoneOffset(d, timezone)

  return {
    iso: d.toISOString(),
    originZone: timezone,
    originOffset: offset,
  }
}

/**
 * Received transfer data (parsed from JSON)
 */
export interface ReceivedTransfer {
  /** The date in UTC */
  date: Date

  /** Original timezone */
  originZone: Timezone

  /** Original offset in minutes */
  originOffset: number

  /** Convert to UTC */
  utc(): Date

  /** Get the date in the original timezone */
  inOrigin(): Date

  /** Convert to a specific timezone */
  inZone(timezone: Timezone): Date

  /** Get start of day in origin timezone (as UTC) */
  startOfDayInOrigin(): Date

  /** Get end of day in origin timezone (as UTC) */
  endOfDayInOrigin(): Date

  /** Get day bounds in origin timezone (as UTC) */
  dayBoundsInOrigin(): DayBounds

  /** Get the ISO string */
  toISO(): string

  /** Create a new transfer payload */
  transfer(): TransferPayload
}

/**
 * Parse a transfer payload received from an API call
 *
 * @example
 * ```typescript
 * // Server side
 * const received = fromTransfer(req.body.date)
 *
 * // Store in UTC
 * const utcDate = received.utc()
 *
 * // Query for "today" in user's timezone
 * const { start, end } = received.dayBoundsInOrigin()
 * db.query('SELECT * FROM events WHERE date BETWEEN ? AND ?', [start, end])
 * ```
 */
export function fromTransfer(payload: TransferPayload): ReceivedTransfer {
  const date = new Date(payload.iso)

  return {
    date,
    originZone: payload.originZone,
    originOffset: payload.originOffset,

    utc(): Date {
      return new Date(date.getTime())
    },

    inOrigin(): Date {
      // Adjust date to show as if it's in the origin timezone
      const offsetMs = payload.originOffset * 60 * 1000
      return new Date(date.getTime() + offsetMs)
    },

    inZone(timezone: Timezone): Date {
      const targetOffset = getTimezoneOffset(date, timezone)
      const offsetMs = targetOffset * 60 * 1000
      return new Date(date.getTime() + offsetMs)
    },

    startOfDayInOrigin(): Date {
      // Get the date in origin timezone
      const inOrigin = this.inOrigin()
      // Get start of day in that timezone
      const startInOrigin = startOfDay(inOrigin)
      // Convert back to UTC
      const offsetMs = payload.originOffset * 60 * 1000
      return new Date(startInOrigin.getTime() - offsetMs)
    },

    endOfDayInOrigin(): Date {
      // Get the date in origin timezone
      const inOrigin = this.inOrigin()
      // Get end of day in that timezone
      const endInOrigin = endOfDay(inOrigin)
      // Convert back to UTC
      const offsetMs = payload.originOffset * 60 * 1000
      return new Date(endInOrigin.getTime() - offsetMs)
    },

    dayBoundsInOrigin(): DayBounds {
      return {
        start: this.startOfDayInOrigin(),
        end: this.endOfDayInOrigin(),
      }
    },

    toISO(): string {
      return date.toISOString()
    },

    transfer(): TransferPayload {
      return { ...payload }
    },
  }
}

/**
 * Create a local transfer (browser-side convenience)
 *
 * Automatically uses the browser's local timezone.
 */
export function localTransfer(date: DateInput = new Date()): TransferPayload {
  return createTransfer(date)
}

/**
 * Create a UTC transfer (server-side convenience)
 *
 * Uses UTC as the timezone.
 */
export function utcTransfer(date: DateInput = new Date()): TransferPayload {
  return createTransfer(date, { timezone: 'UTC' })
}

/**
 * Check if a value looks like a transfer payload
 */
export function isTransferPayload(value: unknown): value is TransferPayload {
  if (!value || typeof value !== 'object') {
    return false
  }

  const obj = value as Record<string, unknown>
  return (
    typeof obj.iso === 'string' &&
    typeof obj.originZone === 'string' &&
    typeof obj.originOffset === 'number'
  )
}

/**
 * Parse a value that might be a transfer payload, date string, or Date
 *
 * Handles multiple input formats gracefully.
 */
export function parseTransferOrDate(
  value: TransferPayload | DateInput
): ReceivedTransfer | { date: Date; originZone: null } {
  if (isTransferPayload(value)) {
    return fromTransfer(value)
  }

  // Fall back to regular date parsing
  const date = parseDate(value)
  return {
    date,
    originZone: null as unknown as Timezone,
    originOffset: 0,
    utc: () => date,
    inOrigin: () => date,
    inZone: () => date,
    startOfDayInOrigin: () => startOfDay(date),
    endOfDayInOrigin: () => endOfDay(date),
    dayBoundsInOrigin: () => ({
      start: startOfDay(date),
      end: endOfDay(date),
    }),
    toISO: () => date.toISOString(),
    transfer: () => createTransfer(date, { timezone: 'UTC' }),
  }
}

// Export namespace for convenient access
export const transfer = {
  create: createTransfer,
  from: fromTransfer,
  local: localTransfer,
  utc: utcTransfer,
  is: isTransferPayload,
  parse: parseTransferOrDate,
}
