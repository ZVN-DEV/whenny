/**
 * Whenny Transfer Protocol
 *
 * Handle date serialization between browser and server with full timezone context.
 * Solves the common problem of losing timezone information when dates cross the wire.
 *
 * Features:
 * - Full timezone context preservation
 * - Day boundary calculations in origin timezone
 * - Validation for all inputs
 * - Type-safe API
 */

import type { TransferPayload, Timezone, DateInput, DayBounds } from '../types'
import {
  parseDate,
  getLocalTimezone,
  getTimezoneOffset,
  startOfDay,
  endOfDay,
  isValidDate,
} from '../core/utils'
import {
  WhennyError,
  assertValidDate,
  assertValidTransferPayload,
} from '../errors'

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

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
 * A partial received transfer (when timezone context is missing)
 */
export interface PartialReceivedTransfer {
  date: Date
  originZone: null
  originOffset: number
  utc(): Date
  inOrigin(): Date
  inZone(timezone: Timezone): Date
  startOfDayInOrigin(): Date
  endOfDayInOrigin(): Date
  dayBoundsInOrigin(): DayBounds
  toISO(): string
  transfer(): TransferPayload
}

// ─────────────────────────────────────────────────────────────────────────────
// Create Transfer
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Create a transfer payload from a date.
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
  assertValidDate(d, 'createTransfer')

  const timezone = options?.timezone ?? getLocalTimezone()

  // Validate timezone by attempting to get offset
  let offset: number
  try {
    offset = getTimezoneOffset(d, timezone)
  } catch (error) {
    throw new WhennyError(
      'INVALID_TIMEZONE',
      `Invalid timezone: "${timezone}"`,
      {
        input: timezone,
        operation: 'createTransfer',
      }
    )
  }

  return {
    iso: d.toISOString(),
    originZone: timezone,
    originOffset: offset,
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// From Transfer
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Parse a transfer payload received from an API call.
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
  // Validate the payload structure
  assertValidTransferPayload(payload, 'fromTransfer')

  // Parse and validate the ISO date
  const date = new Date(payload.iso)
  if (!isValidDate(date)) {
    throw new WhennyError(
      'INVALID_TRANSFER_PAYLOAD',
      'Transfer payload contains invalid ISO date',
      {
        input: payload.iso,
        operation: 'fromTransfer',
        expected: 'Valid ISO 8601 date string',
      }
    )
  }

  const { originZone, originOffset } = payload

  return {
    date,
    originZone,
    originOffset,

    utc(): Date {
      return new Date(date.getTime())
    },

    inOrigin(): Date {
      // Adjust date to show as if it's in the origin timezone
      const offsetMs = originOffset * 60 * 1000
      return new Date(date.getTime() + offsetMs)
    },

    inZone(timezone: Timezone): Date {
      let targetOffset: number
      try {
        targetOffset = getTimezoneOffset(date, timezone)
      } catch {
        throw new WhennyError(
          'INVALID_TIMEZONE',
          `Invalid timezone: "${timezone}"`,
          {
            input: timezone,
            operation: 'ReceivedTransfer.inZone',
          }
        )
      }
      const offsetMs = targetOffset * 60 * 1000
      return new Date(date.getTime() + offsetMs)
    },

    startOfDayInOrigin(): Date {
      // Get the date in origin timezone
      const inOriginDate = this.inOrigin()
      // Get start of day in that timezone
      const startInOrigin = startOfDay(inOriginDate)
      // Convert back to UTC
      const offsetMs = originOffset * 60 * 1000
      return new Date(startInOrigin.getTime() - offsetMs)
    },

    endOfDayInOrigin(): Date {
      // Get the date in origin timezone
      const inOriginDate = this.inOrigin()
      // Get end of day in that timezone
      const endInOrigin = endOfDay(inOriginDate)
      // Convert back to UTC
      const offsetMs = originOffset * 60 * 1000
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
      return { iso: payload.iso, originZone, originOffset }
    },
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Convenience Functions
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Create a local transfer (browser-side convenience).
 *
 * Automatically uses the browser's local timezone.
 *
 * @example
 * ```typescript
 * const payload = localTransfer()
 * // → Uses browser's timezone automatically
 * ```
 */
export function localTransfer(date: DateInput = new Date()): TransferPayload {
  return createTransfer(date)
}

/**
 * Create a UTC transfer (server-side convenience).
 *
 * Uses UTC as the timezone.
 *
 * @example
 * ```typescript
 * const payload = utcTransfer()
 * // → Uses UTC timezone
 * ```
 */
export function utcTransfer(date: DateInput = new Date()): TransferPayload {
  return createTransfer(date, { timezone: 'UTC' })
}

// ─────────────────────────────────────────────────────────────────────────────
// Type Guards
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Check if a value looks like a transfer payload.
 *
 * @example
 * ```typescript
 * if (isTransferPayload(data)) {
 *   const received = fromTransfer(data)
 * }
 * ```
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
 * Validate a transfer payload and throw if invalid.
 *
 * @example
 * ```typescript
 * validateTransferPayload(data) // throws if invalid
 * const received = fromTransfer(data) // safe to use
 * ```
 */
export function validateTransferPayload(value: unknown): asserts value is TransferPayload {
  assertValidTransferPayload(value, 'validateTransferPayload')

  // Also validate the ISO date
  const payload = value as TransferPayload
  const date = new Date(payload.iso)
  if (!isValidDate(date)) {
    throw new WhennyError(
      'INVALID_TRANSFER_PAYLOAD',
      'Transfer payload contains invalid ISO date',
      {
        input: payload.iso,
        operation: 'validateTransferPayload',
      }
    )
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Parse Transfer or Date
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Parse a value that might be a transfer payload, date string, or Date.
 *
 * Handles multiple input formats gracefully.
 *
 * @example
 * ```typescript
 * // Works with transfer payloads
 * const result = parseTransferOrDate(payload)
 * result.originZone // "America/New_York" (from payload)
 *
 * // Works with regular dates
 * const result = parseTransferOrDate("2024-01-15")
 * result.originZone // null (no timezone context)
 * ```
 */
export function parseTransferOrDate(
  value: TransferPayload | DateInput
): ReceivedTransfer | PartialReceivedTransfer {
  if (isTransferPayload(value)) {
    return fromTransfer(value)
  }

  // Fall back to regular date parsing
  const date = parseDate(value)

  // Return a partial received transfer (without timezone context)
  return {
    date,
    originZone: null,
    originOffset: 0,

    utc(): Date {
      return new Date(date.getTime())
    },

    inOrigin(): Date {
      return new Date(date.getTime())
    },

    inZone(timezone: Timezone): Date {
      let targetOffset: number
      try {
        targetOffset = getTimezoneOffset(date, timezone)
      } catch {
        throw new WhennyError(
          'INVALID_TIMEZONE',
          `Invalid timezone: "${timezone}"`,
          {
            input: timezone,
            operation: 'PartialReceivedTransfer.inZone',
          }
        )
      }
      const offsetMs = targetOffset * 60 * 1000
      return new Date(date.getTime() + offsetMs)
    },

    startOfDayInOrigin(): Date {
      return startOfDay(date)
    },

    endOfDayInOrigin(): Date {
      return endOfDay(date)
    },

    dayBoundsInOrigin(): DayBounds {
      return {
        start: startOfDay(date),
        end: endOfDay(date),
      }
    },

    toISO(): string {
      return date.toISOString()
    },

    transfer(): TransferPayload {
      return createTransfer(date, { timezone: 'UTC' })
    },
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Namespace Export
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Transfer protocol namespace.
 *
 * @example
 * ```typescript
 * import { transfer } from 'whenny'
 *
 * const payload = transfer.create(new Date())
 * const received = transfer.from(payload)
 * transfer.is(value) // type guard
 * ```
 */
export const transfer = {
  create: createTransfer,
  from: fromTransfer,
  local: localTransfer,
  utc: utcTransfer,
  is: isTransferPayload,
  validate: validateTransferPayload,
  parse: parseTransferOrDate,
}
