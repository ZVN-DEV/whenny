/**
 * Whenny Timezone Utilities
 *
 * Handle timezone conversions, offsets, and timezone-aware operations.
 */

import type { DateInput, Timezone, DayBounds } from '../types'
import {
  parseDate,
  getLocalTimezone,
  getTimezoneOffset,
  formatTimezoneOffset,
  getTimezoneAbbreviation,
  startOfDay,
  endOfDay,
} from '../core/utils'

/**
 * Get the local timezone
 */
export function local(): Timezone {
  return getLocalTimezone()
}

/**
 * Get a list of common timezones
 */
export function list(): Timezone[] {
  return [
    // Americas
    'America/New_York',
    'America/Chicago',
    'America/Denver',
    'America/Los_Angeles',
    'America/Anchorage',
    'America/Phoenix',
    'America/Toronto',
    'America/Vancouver',
    'America/Mexico_City',
    'America/Sao_Paulo',
    'America/Buenos_Aires',

    // Europe
    'Europe/London',
    'Europe/Paris',
    'Europe/Berlin',
    'Europe/Madrid',
    'Europe/Rome',
    'Europe/Amsterdam',
    'Europe/Brussels',
    'Europe/Stockholm',
    'Europe/Moscow',

    // Asia
    'Asia/Tokyo',
    'Asia/Shanghai',
    'Asia/Hong_Kong',
    'Asia/Singapore',
    'Asia/Seoul',
    'Asia/Taipei',
    'Asia/Bangkok',
    'Asia/Jakarta',
    'Asia/Mumbai',
    'Asia/Dubai',
    'Asia/Tel_Aviv',

    // Oceania
    'Australia/Sydney',
    'Australia/Melbourne',
    'Australia/Brisbane',
    'Australia/Perth',
    'Pacific/Auckland',
    'Pacific/Honolulu',

    // Africa
    'Africa/Cairo',
    'Africa/Johannesburg',
    'Africa/Lagos',
    'Africa/Nairobi',

    // UTC
    'UTC',
  ]
}

/**
 * Get the offset for a timezone at a specific date (in minutes)
 */
export function offset(timezone: Timezone, date: DateInput = new Date()): number {
  const d = parseDate(date)
  return getTimezoneOffset(d, timezone)
}

/**
 * Get the offset as a formatted string (e.g., "-05:00")
 */
export function offsetString(timezone: Timezone, date: DateInput = new Date()): string {
  const offsetMinutes = offset(timezone, date)
  return formatTimezoneOffset(offsetMinutes)
}

/**
 * Get the timezone abbreviation (e.g., "EST", "PST")
 */
export function abbreviation(timezone: Timezone, date: DateInput = new Date()): string {
  const d = parseDate(date)
  return getTimezoneAbbreviation(d, timezone)
}

/**
 * Convert a date to a specific timezone
 * Returns a new Date object that, when formatted, shows the time in that timezone
 */
export function convertTo(date: DateInput, timezone: Timezone): Date {
  const d = parseDate(date)

  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone: timezone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    fractionalSecondDigits: 3,
    hour12: false,
  })

  const parts = formatter.formatToParts(d)
  const getPart = (type: string): number => {
    const part = parts.find((p) => p.type === type)
    return part ? parseInt(part.value, 10) : 0
  }

  return new Date(
    getPart('year'),
    getPart('month') - 1,
    getPart('day'),
    getPart('hour'),
    getPart('minute'),
    getPart('second')
  )
}

/**
 * Get the day bounds (start and end) for a specific timezone
 * Returns UTC timestamps that represent midnight and end of day in that timezone
 */
export function dayBounds(options: {
  date?: DateInput
  for: Timezone
}): DayBounds {
  const date = options.date ? parseDate(options.date) : new Date()
  const timezone = options.for

  // Convert the date to the target timezone
  const inTz = convertTo(date, timezone)

  // Get start and end of day in the target timezone
  const startInTz = startOfDay(inTz)
  const endInTz = endOfDay(inTz)

  // Convert back to UTC
  // Calculate the offset at start of day
  const offsetMs = getTimezoneOffset(date, timezone) * 60 * 1000

  return {
    start: new Date(startInTz.getTime() - offsetMs),
    end: new Date(endInTz.getTime() - offsetMs),
  }
}

/**
 * Get today's bounds for a specific timezone
 */
export function todayBounds(timezone: Timezone): DayBounds {
  return dayBounds({ for: timezone })
}

/**
 * Check if a date is "today" in a specific timezone
 */
export function isTodayIn(date: DateInput, timezone: Timezone): boolean {
  const d = parseDate(date)
  const bounds = todayBounds(timezone)
  return d >= bounds.start && d <= bounds.end
}

/**
 * Get the current time in a specific timezone
 */
export function nowIn(timezone: Timezone): Date {
  return convertTo(new Date(), timezone)
}

/**
 * Create a date in a specific timezone
 *
 * @example
 * ```typescript
 * // Create 3pm in New York time
 * inZone('America/New_York', '2024-01-15 15:00')
 * ```
 */
export function inZone(timezone: Timezone, dateString?: string): Date {
  if (!dateString) {
    return nowIn(timezone)
  }

  // Parse the date string as if it's in the target timezone
  // This is tricky - we need to interpret the string in that timezone

  // First, parse as local to get the components
  const localParsed = new Date(dateString.replace(' ', 'T'))

  if (isNaN(localParsed.getTime())) {
    throw new Error(`Invalid date string: ${dateString}`)
  }

  // Get the target timezone's offset at this time
  const targetOffset = getTimezoneOffset(localParsed, timezone)
  const localOffset = -localParsed.getTimezoneOffset()

  // Adjust to get UTC time that represents this time in the target timezone
  const offsetDiff = (localOffset - targetOffset) * 60 * 1000
  return new Date(localParsed.getTime() + offsetDiff)
}

/**
 * Timezone utilities namespace
 */
export const tz = {
  local,
  list,
  offset,
  offsetString,
  abbreviation,
  convertTo,
  dayBounds,
  todayBounds,
  isTodayIn,
  nowIn,
  inZone,
}
