/**
 * Whenny Core Utilities
 *
 * Low-level utility functions for date manipulation.
 * These are the building blocks used by all other modules.
 */

import type { DateInput, TimeUnit, Timezone } from '../types'

// ============================================================================
// CONSTANTS
// ============================================================================

export const MILLISECONDS_IN_SECOND = 1000
export const MILLISECONDS_IN_MINUTE = 60 * MILLISECONDS_IN_SECOND
export const MILLISECONDS_IN_HOUR = 60 * MILLISECONDS_IN_MINUTE
export const MILLISECONDS_IN_DAY = 24 * MILLISECONDS_IN_HOUR
export const MILLISECONDS_IN_WEEK = 7 * MILLISECONDS_IN_DAY

export const SECONDS_IN_MINUTE = 60
export const SECONDS_IN_HOUR = 60 * SECONDS_IN_MINUTE
export const SECONDS_IN_DAY = 24 * SECONDS_IN_HOUR
export const SECONDS_IN_WEEK = 7 * SECONDS_IN_DAY
export const SECONDS_IN_MONTH = 30 * SECONDS_IN_DAY // Approximate
export const SECONDS_IN_YEAR = 365 * SECONDS_IN_DAY // Approximate

export const MONTHS_SHORT = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
]

export const MONTHS_FULL = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]

export const WEEKDAYS_SHORT = [
  'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat',
]

export const WEEKDAYS_FULL = [
  'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday',
]

// ============================================================================
// PARSING
// ============================================================================

/**
 * Parse any date input into a Date object
 */
export function parseDate(input: DateInput): Date {
  if (input instanceof Date) {
    return new Date(input.getTime())
  }

  if (typeof input === 'number') {
    return new Date(input)
  }

  if (typeof input === 'string') {
    // Try parsing as ISO string first
    const parsed = new Date(input)
    if (!isNaN(parsed.getTime())) {
      return parsed
    }

    // Try common formats
    // Handle formats like "2024-01-15 10:30"
    const withT = input.replace(' ', 'T')
    const parsedWithT = new Date(withT)
    if (!isNaN(parsedWithT.getTime())) {
      return parsedWithT
    }

    throw new Error(`Invalid date string: ${input}`)
  }

  // Handle Whenny instances
  if (input && typeof input === 'object' && 'toDate' in input) {
    return (input as { toDate(): Date }).toDate()
  }

  throw new Error(`Invalid date input: ${input}`)
}

/**
 * Check if a date is valid
 */
export function isValidDate(date: Date): boolean {
  return date instanceof Date && !isNaN(date.getTime())
}

// ============================================================================
// ARITHMETIC
// ============================================================================

/**
 * Normalize time unit to singular form
 */
export function normalizeUnit(unit: TimeUnit): string {
  return unit.replace(/s$/, '')
}

/**
 * Add time to a date
 */
export function addTime(date: Date, amount: number, unit: TimeUnit): Date {
  const result = new Date(date.getTime())
  const normalizedUnit = normalizeUnit(unit)

  switch (normalizedUnit) {
    case 'millisecond':
      result.setTime(result.getTime() + amount)
      break
    case 'second':
      result.setTime(result.getTime() + amount * MILLISECONDS_IN_SECOND)
      break
    case 'minute':
      result.setTime(result.getTime() + amount * MILLISECONDS_IN_MINUTE)
      break
    case 'hour':
      result.setTime(result.getTime() + amount * MILLISECONDS_IN_HOUR)
      break
    case 'day':
      result.setDate(result.getDate() + amount)
      break
    case 'week':
      result.setDate(result.getDate() + amount * 7)
      break
    case 'month':
      result.setMonth(result.getMonth() + amount)
      break
    case 'year':
      result.setFullYear(result.getFullYear() + amount)
      break
    default:
      throw new Error(`Invalid time unit: ${unit}`)
  }

  return result
}

/**
 * Subtract time from a date
 */
export function subtractTime(date: Date, amount: number, unit: TimeUnit): Date {
  return addTime(date, -amount, unit)
}

// ============================================================================
// DIFFERENCES
// ============================================================================

/**
 * Get difference in milliseconds
 */
export function differenceInMilliseconds(dateA: Date, dateB: Date): number {
  return dateA.getTime() - dateB.getTime()
}

/**
 * Get difference in seconds
 */
export function differenceInSeconds(dateA: Date, dateB: Date): number {
  return Math.floor(differenceInMilliseconds(dateA, dateB) / MILLISECONDS_IN_SECOND)
}

/**
 * Get difference in minutes
 */
export function differenceInMinutes(dateA: Date, dateB: Date): number {
  return Math.floor(differenceInMilliseconds(dateA, dateB) / MILLISECONDS_IN_MINUTE)
}

/**
 * Get difference in hours
 */
export function differenceInHours(dateA: Date, dateB: Date): number {
  return Math.floor(differenceInMilliseconds(dateA, dateB) / MILLISECONDS_IN_HOUR)
}

/**
 * Get difference in days
 */
export function differenceInDays(dateA: Date, dateB: Date): number {
  return Math.floor(differenceInMilliseconds(dateA, dateB) / MILLISECONDS_IN_DAY)
}

/**
 * Get difference in weeks
 */
export function differenceInWeeks(dateA: Date, dateB: Date): number {
  return Math.floor(differenceInMilliseconds(dateA, dateB) / MILLISECONDS_IN_WEEK)
}

/**
 * Get difference in months (approximate)
 */
export function differenceInMonths(dateA: Date, dateB: Date): number {
  const yearDiff = dateA.getFullYear() - dateB.getFullYear()
  const monthDiff = dateA.getMonth() - dateB.getMonth()
  return yearDiff * 12 + monthDiff
}

/**
 * Get difference in years
 */
export function differenceInYears(dateA: Date, dateB: Date): number {
  return dateA.getFullYear() - dateB.getFullYear()
}

// ============================================================================
// BOUNDARIES
// ============================================================================

/**
 * Get start of day
 */
export function startOfDay(date: Date): Date {
  const result = new Date(date.getTime())
  result.setHours(0, 0, 0, 0)
  return result
}

/**
 * Get end of day
 */
export function endOfDay(date: Date): Date {
  const result = new Date(date.getTime())
  result.setHours(23, 59, 59, 999)
  return result
}

/**
 * Get start of week
 */
export function startOfWeek(date: Date, weekStartsOn: number = 0): Date {
  const result = new Date(date.getTime())
  const day = result.getDay()
  const diff = (day < weekStartsOn ? 7 : 0) + day - weekStartsOn
  result.setDate(result.getDate() - diff)
  result.setHours(0, 0, 0, 0)
  return result
}

/**
 * Get end of week
 */
export function endOfWeek(date: Date, weekStartsOn: number = 0): Date {
  const result = startOfWeek(date, weekStartsOn)
  result.setDate(result.getDate() + 6)
  result.setHours(23, 59, 59, 999)
  return result
}

/**
 * Get start of month
 */
export function startOfMonth(date: Date): Date {
  const result = new Date(date.getTime())
  result.setDate(1)
  result.setHours(0, 0, 0, 0)
  return result
}

/**
 * Get end of month
 */
export function endOfMonth(date: Date): Date {
  const result = new Date(date.getTime())
  result.setMonth(result.getMonth() + 1, 0)
  result.setHours(23, 59, 59, 999)
  return result
}

/**
 * Get start of year
 */
export function startOfYear(date: Date): Date {
  const result = new Date(date.getTime())
  result.setMonth(0, 1)
  result.setHours(0, 0, 0, 0)
  return result
}

/**
 * Get end of year
 */
export function endOfYear(date: Date): Date {
  const result = new Date(date.getTime())
  result.setMonth(11, 31)
  result.setHours(23, 59, 59, 999)
  return result
}

// ============================================================================
// COMPARISONS
// ============================================================================

/**
 * Check if two dates are the same day
 */
export function isSameDay(dateA: Date, dateB: Date): boolean {
  return (
    dateA.getFullYear() === dateB.getFullYear() &&
    dateA.getMonth() === dateB.getMonth() &&
    dateA.getDate() === dateB.getDate()
  )
}

/**
 * Check if two dates are the same month
 */
export function isSameMonth(dateA: Date, dateB: Date): boolean {
  return (
    dateA.getFullYear() === dateB.getFullYear() &&
    dateA.getMonth() === dateB.getMonth()
  )
}

/**
 * Check if two dates are the same year
 */
export function isSameYear(dateA: Date, dateB: Date): boolean {
  return dateA.getFullYear() === dateB.getFullYear()
}

/**
 * Check if a date is today
 */
export function isToday(date: Date): boolean {
  return isSameDay(date, new Date())
}

/**
 * Check if a date is yesterday
 */
export function isYesterday(date: Date): boolean {
  const yesterday = subtractTime(new Date(), 1, 'day')
  return isSameDay(date, yesterday)
}

/**
 * Check if a date is tomorrow
 */
export function isTomorrow(date: Date): boolean {
  const tomorrow = addTime(new Date(), 1, 'day')
  return isSameDay(date, tomorrow)
}

/**
 * Check if a date is in the past
 */
export function isPast(date: Date): boolean {
  return date.getTime() < Date.now()
}

/**
 * Check if a date is in the future
 */
export function isFuture(date: Date): boolean {
  return date.getTime() > Date.now()
}

/**
 * Check if a date is within this week
 */
export function isThisWeek(date: Date, weekStartsOn: number = 0): boolean {
  const now = new Date()
  const start = startOfWeek(now, weekStartsOn)
  const end = endOfWeek(now, weekStartsOn)
  return date >= start && date <= end
}

/**
 * Check if a date is within this month
 */
export function isThisMonth(date: Date): boolean {
  return isSameMonth(date, new Date())
}

/**
 * Check if a date is within this year
 */
export function isThisYear(date: Date): boolean {
  return isSameYear(date, new Date())
}

/**
 * Check if a date is a weekend (Saturday or Sunday)
 */
export function isWeekend(date: Date): boolean {
  const day = date.getDay()
  return day === 0 || day === 6
}

/**
 * Check if a date is a weekday (Monday-Friday)
 */
export function isWeekday(date: Date): boolean {
  return !isWeekend(date)
}

// ============================================================================
// TIMEZONE UTILITIES
// ============================================================================

/**
 * Get the local timezone
 */
export function getLocalTimezone(): Timezone {
  return Intl.DateTimeFormat().resolvedOptions().timeZone
}

/**
 * Check if running in a browser environment
 */
export function isBrowser(): boolean {
  return typeof window !== 'undefined' && typeof window.document !== 'undefined'
}

/**
 * Check if running in a server environment
 */
export function isServer(): boolean {
  return !isBrowser()
}

/**
 * Get timezone offset in minutes for a specific timezone at a specific date
 */
export function getTimezoneOffset(date: Date, timezone: Timezone): number {
  // Create formatters for UTC and target timezone
  const utcFormatter = new Intl.DateTimeFormat('en-US', {
    timeZone: 'UTC',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  })

  const tzFormatter = new Intl.DateTimeFormat('en-US', {
    timeZone: timezone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  })

  const utcParts = utcFormatter.formatToParts(date)
  const tzParts = tzFormatter.formatToParts(date)

  const getPart = (parts: Intl.DateTimeFormatPart[], type: string): number => {
    const part = parts.find((p) => p.type === type)
    return part ? parseInt(part.value, 10) : 0
  }

  const utcMinutes =
    getPart(utcParts, 'hour') * 60 +
    getPart(utcParts, 'minute') +
    getPart(utcParts, 'day') * 24 * 60

  const tzMinutes =
    getPart(tzParts, 'hour') * 60 +
    getPart(tzParts, 'minute') +
    getPart(tzParts, 'day') * 24 * 60

  return tzMinutes - utcMinutes
}

/**
 * Format timezone offset as string (e.g., "-05:00")
 */
export function formatTimezoneOffset(offsetMinutes: number): string {
  const sign = offsetMinutes >= 0 ? '+' : '-'
  const absOffset = Math.abs(offsetMinutes)
  const hours = Math.floor(absOffset / 60)
  const minutes = absOffset % 60
  return `${sign}${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`
}

/**
 * Get timezone abbreviation (e.g., "EST", "PST")
 */
export function getTimezoneAbbreviation(date: Date, timezone: Timezone): string {
  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone: timezone,
    timeZoneName: 'short',
  })

  const parts = formatter.formatToParts(date)
  const tzPart = parts.find((p) => p.type === 'timeZoneName')
  return tzPart?.value ?? timezone
}

// ============================================================================
// FORMATTING HELPERS
// ============================================================================

/**
 * Pad a number with leading zeros
 */
export function padZero(num: number, length: number = 2): string {
  return num.toString().padStart(length, '0')
}

/**
 * Get ordinal suffix for a number (1st, 2nd, 3rd, etc.)
 */
export function getOrdinalSuffix(num: number): string {
  const j = num % 10
  const k = num % 100

  if (j === 1 && k !== 11) return 'st'
  if (j === 2 && k !== 12) return 'nd'
  if (j === 3 && k !== 13) return 'rd'
  return 'th'
}

/**
 * Format a number with ordinal suffix
 */
export function formatOrdinal(num: number): string {
  return `${num}${getOrdinalSuffix(num)}`
}
