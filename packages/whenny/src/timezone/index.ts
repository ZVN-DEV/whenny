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

// ─────────────────────────────────────────────────────────────────────────────
// TIMEZONE ALIASES
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Common timezone aliases mapped to IANA timezone names.
 * Supports abbreviations like "EST", "PST", etc.
 */
const TIMEZONE_ALIASES: Record<string, Timezone> = {
  // US Timezones
  EST: 'America/New_York',
  EDT: 'America/New_York',
  CST: 'America/Chicago',
  CDT: 'America/Chicago',
  MST: 'America/Denver',
  MDT: 'America/Denver',
  PST: 'America/Los_Angeles',
  PDT: 'America/Los_Angeles',
  AKST: 'America/Anchorage',
  AKDT: 'America/Anchorage',
  HST: 'Pacific/Honolulu',

  // European Timezones
  GMT: 'Europe/London',
  BST: 'Europe/London',
  WET: 'Europe/Lisbon',
  WEST: 'Europe/Lisbon',
  CET: 'Europe/Paris',
  CEST: 'Europe/Paris',
  EET: 'Europe/Helsinki',
  EEST: 'Europe/Helsinki',
  MSK: 'Europe/Moscow',

  // Asian Timezones
  IST: 'Asia/Kolkata',
  PKT: 'Asia/Karachi',
  JST: 'Asia/Tokyo',
  KST: 'Asia/Seoul',
  CST_CHINA: 'Asia/Shanghai',
  HKT: 'Asia/Hong_Kong',
  SGT: 'Asia/Singapore',
  ICT: 'Asia/Bangkok',
  WIB: 'Asia/Jakarta',

  // Australian Timezones
  AEST: 'Australia/Sydney',
  AEDT: 'Australia/Sydney',
  ACST: 'Australia/Adelaide',
  ACDT: 'Australia/Adelaide',
  AWST: 'Australia/Perth',

  // Other
  NZST: 'Pacific/Auckland',
  NZDT: 'Pacific/Auckland',
  UTC: 'UTC',
  Z: 'UTC',
}

/**
 * Resolve a timezone alias to an IANA timezone name.
 * Returns the original string if not found (might be an IANA name already).
 *
 * @example
 * ```typescript
 * fromAlias('EST')         // 'America/New_York'
 * fromAlias('PST')         // 'America/Los_Angeles'
 * fromAlias('UTC')         // 'UTC'
 * fromAlias('America/New_York')  // 'America/New_York' (unchanged)
 * ```
 */
export function fromAlias(alias: string): Timezone {
  const upper = alias.toUpperCase()
  return TIMEZONE_ALIASES[upper] ?? alias
}

/**
 * Check if a string is a known timezone alias.
 */
export function isAlias(alias: string): boolean {
  return alias.toUpperCase() in TIMEZONE_ALIASES
}

/**
 * Get all known timezone aliases.
 */
export function aliases(): Record<string, Timezone> {
  return { ...TIMEZONE_ALIASES }
}

/**
 * Validate if a string is a valid timezone (IANA name or alias).
 * Returns true if the timezone can be used for date operations.
 */
export function isValidTimezone(tz: string): boolean {
  const resolved = fromAlias(tz)
  try {
    Intl.DateTimeFormat('en-US', { timeZone: resolved })
    return true
  } catch {
    return false
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// DATE RANGES
// ─────────────────────────────────────────────────────────────────────────────

export interface DateRange {
  start: Date
  end: Date
}

/**
 * Create a date range.
 *
 * @example
 * ```typescript
 * const range = createRange('2024-01-01', '2024-01-31')
 * ```
 */
export function createRange(start: DateInput, end: DateInput): DateRange {
  return {
    start: parseDate(start),
    end: parseDate(end),
  }
}

/**
 * Check if a date is within a range (inclusive).
 *
 * @example
 * ```typescript
 * const range = createRange('2024-01-01', '2024-01-31')
 * isInRange('2024-01-15', range)  // true
 * isInRange('2024-02-01', range)  // false
 * ```
 */
export function isInRange(date: DateInput, range: DateRange): boolean {
  const d = parseDate(date)
  return d >= range.start && d <= range.end
}

/**
 * Check if two date ranges overlap.
 *
 * @example
 * ```typescript
 * const rangeA = createRange('2024-01-01', '2024-01-15')
 * const rangeB = createRange('2024-01-10', '2024-01-20')
 * rangesOverlap(rangeA, rangeB)  // true
 * ```
 */
export function rangesOverlap(rangeA: DateRange, rangeB: DateRange): boolean {
  return rangeA.start <= rangeB.end && rangeA.end >= rangeB.start
}

/**
 * Get the intersection of two date ranges.
 * Returns null if ranges don't overlap.
 *
 * @example
 * ```typescript
 * const rangeA = createRange('2024-01-01', '2024-01-15')
 * const rangeB = createRange('2024-01-10', '2024-01-20')
 * rangeIntersection(rangeA, rangeB)  // { start: Jan 10, end: Jan 15 }
 * ```
 */
export function rangeIntersection(rangeA: DateRange, rangeB: DateRange): DateRange | null {
  if (!rangesOverlap(rangeA, rangeB)) {
    return null
  }

  return {
    start: new Date(Math.max(rangeA.start.getTime(), rangeB.start.getTime())),
    end: new Date(Math.min(rangeA.end.getTime(), rangeB.end.getTime())),
  }
}

/**
 * Get all dates between two dates (inclusive).
 *
 * @example
 * ```typescript
 * const dates = getDatesBetween('2024-01-01', '2024-01-05')
 * // [Jan 1, Jan 2, Jan 3, Jan 4, Jan 5]
 * ```
 */
export function getDatesBetween(start: DateInput, end: DateInput): Date[] {
  const startDate = startOfDay(parseDate(start))
  const endDate = startOfDay(parseDate(end))
  const dates: Date[] = []

  // Limit to prevent memory issues
  const MAX_DATES = 366 * 2 // ~2 years
  let current = new Date(startDate)
  let count = 0

  while (current <= endDate && count < MAX_DATES) {
    dates.push(new Date(current))
    current.setDate(current.getDate() + 1)
    count++
  }

  return dates
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
  // Aliases
  fromAlias,
  isAlias,
  aliases,
  isValidTimezone,
  // Ranges
  createRange,
  isInRange,
  rangesOverlap,
  rangeIntersection,
  getDatesBetween,
}
