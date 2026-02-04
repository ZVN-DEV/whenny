/**
 * Whenny Calendar Utilities
 *
 * Calendar helpers for common date operations like checking weekends,
 * finding day boundaries, business day calculations, etc.
 */

import type { WhennyConfig, DateInput, TimeUnit, DayOfWeek } from '../types'
import { getConfig } from '../config'
import {
  parseDate,
  addTime,
  subtractTime,
  startOfDay as utilStartOfDay,
  endOfDay as utilEndOfDay,
  startOfWeek as utilStartOfWeek,
  endOfWeek as utilEndOfWeek,
  startOfMonth as utilStartOfMonth,
  endOfMonth as utilEndOfMonth,
  startOfYear as utilStartOfYear,
  endOfYear as utilEndOfYear,
  isToday as utilIsToday,
  isYesterday as utilIsYesterday,
  isTomorrow as utilIsTomorrow,
  isThisWeek as utilIsThisWeek,
  isThisMonth as utilIsThisMonth,
  isThisYear as utilIsThisYear,
  isWeekend as utilIsWeekend,
  isWeekday as utilIsWeekday,
  isSameDay as utilIsSameDay,
  isSameMonth as utilIsSameMonth,
  isSameYear as utilIsSameYear,
  isPast as utilIsPast,
  isFuture as utilIsFuture,
  differenceInDays,
} from '../core/utils'

const DAY_MAP: Record<DayOfWeek, number> = {
  sunday: 0,
  monday: 1,
  tuesday: 2,
  wednesday: 3,
  thursday: 4,
  friday: 5,
  saturday: 6,
}

function getWeekStartNumber(config: WhennyConfig): number {
  return DAY_MAP[config.calendar.weekStartsOn]
}

// ============================================================================
// QUERIES
// ============================================================================

/**
 * Check if a date is today
 */
export function isToday(date: DateInput): boolean {
  return utilIsToday(parseDate(date))
}

/**
 * Check if a date is yesterday
 */
export function isYesterday(date: DateInput): boolean {
  return utilIsYesterday(parseDate(date))
}

/**
 * Check if a date is tomorrow
 */
export function isTomorrow(date: DateInput): boolean {
  return utilIsTomorrow(parseDate(date))
}

/**
 * Check if a date is within this week
 */
export function isThisWeek(
  date: DateInput,
  config: WhennyConfig = getConfig()
): boolean {
  return utilIsThisWeek(parseDate(date), getWeekStartNumber(config))
}

/**
 * Check if a date is within this month
 */
export function isThisMonth(date: DateInput): boolean {
  return utilIsThisMonth(parseDate(date))
}

/**
 * Check if a date is within this year
 */
export function isThisYear(date: DateInput): boolean {
  return utilIsThisYear(parseDate(date))
}

/**
 * Check if a date is a weekend (Saturday or Sunday)
 */
export function isWeekend(date: DateInput): boolean {
  return utilIsWeekend(parseDate(date))
}

/**
 * Check if a date is a weekday (Monday-Friday)
 */
export function isWeekday(date: DateInput): boolean {
  return utilIsWeekday(parseDate(date))
}

/**
 * Check if a date is a business day
 */
export function isBusinessDay(
  date: DateInput,
  config: WhennyConfig = getConfig()
): boolean {
  const d = parseDate(date)
  const dayNum = d.getDay()
  const dayNames: DayOfWeek[] = [
    'sunday', 'monday', 'tuesday', 'wednesday',
    'thursday', 'friday', 'saturday',
  ]
  return config.calendar.businessDays.includes(dayNames[dayNum])
}

/**
 * Check if a date is in the past
 */
export function isPast(date: DateInput): boolean {
  return utilIsPast(parseDate(date))
}

/**
 * Check if a date is in the future
 */
export function isFuture(date: DateInput): boolean {
  return utilIsFuture(parseDate(date))
}

// ============================================================================
// COMPARISONS
// ============================================================================

/**
 * Check if two dates are the same day
 */
export function isSameDay(dateA: DateInput, dateB: DateInput): boolean {
  return utilIsSameDay(parseDate(dateA), parseDate(dateB))
}

/**
 * Check if two dates are in the same week
 */
export function isSameWeek(
  dateA: DateInput,
  dateB: DateInput,
  config: WhennyConfig = getConfig()
): boolean {
  const a = parseDate(dateA)
  const b = parseDate(dateB)
  const weekStart = getWeekStartNumber(config)
  return (
    utilStartOfWeek(a, weekStart).getTime() ===
    utilStartOfWeek(b, weekStart).getTime()
  )
}

/**
 * Check if two dates are in the same month
 */
export function isSameMonth(dateA: DateInput, dateB: DateInput): boolean {
  return utilIsSameMonth(parseDate(dateA), parseDate(dateB))
}

/**
 * Check if two dates are in the same year
 */
export function isSameYear(dateA: DateInput, dateB: DateInput): boolean {
  return utilIsSameYear(parseDate(dateA), parseDate(dateB))
}

/**
 * Check if dateA is before dateB
 */
export function isBefore(dateA: DateInput, dateB: DateInput): boolean {
  return parseDate(dateA).getTime() < parseDate(dateB).getTime()
}

/**
 * Check if dateA is after dateB
 */
export function isAfter(dateA: DateInput, dateB: DateInput): boolean {
  return parseDate(dateA).getTime() > parseDate(dateB).getTime()
}

/**
 * Check if a date is between two other dates (inclusive)
 */
export function isBetween(
  date: DateInput,
  start: DateInput,
  end: DateInput
): boolean {
  const d = parseDate(date).getTime()
  const s = parseDate(start).getTime()
  const e = parseDate(end).getTime()
  return d >= s && d <= e
}

// ============================================================================
// BOUNDARIES
// ============================================================================

/**
 * Get start of a time unit
 */
export function startOf(
  date: DateInput,
  unit: 'day' | 'week' | 'month' | 'year',
  config: WhennyConfig = getConfig()
): Date {
  const d = parseDate(date)

  switch (unit) {
    case 'day':
      return utilStartOfDay(d)
    case 'week':
      return utilStartOfWeek(d, getWeekStartNumber(config))
    case 'month':
      return utilStartOfMonth(d)
    case 'year':
      return utilStartOfYear(d)
  }
}

/**
 * Get end of a time unit
 */
export function endOf(
  date: DateInput,
  unit: 'day' | 'week' | 'month' | 'year',
  config: WhennyConfig = getConfig()
): Date {
  const d = parseDate(date)

  switch (unit) {
    case 'day':
      return utilEndOfDay(d)
    case 'week':
      return utilEndOfWeek(d, getWeekStartNumber(config))
    case 'month':
      return utilEndOfMonth(d)
    case 'year':
      return utilEndOfYear(d)
  }
}

// ============================================================================
// ARITHMETIC
// ============================================================================

/**
 * Add time to a date
 */
export function add(date: DateInput, amount: number, unit: TimeUnit): Date {
  return addTime(parseDate(date), amount, unit)
}

/**
 * Subtract time from a date
 */
export function subtract(date: DateInput, amount: number, unit: TimeUnit): Date {
  return subtractTime(parseDate(date), amount, unit)
}

// ============================================================================
// DISTANCES
// ============================================================================

/**
 * Get number of days until a future date
 */
export function daysUntil(date: DateInput): number {
  const d = parseDate(date)
  const diff = differenceInDays(d, new Date())
  return diff > 0 ? diff : 0
}

/**
 * Get number of days since a past date
 */
export function daysSince(date: DateInput): number {
  const d = parseDate(date)
  const diff = differenceInDays(new Date(), d)
  return diff > 0 ? diff : 0
}

/**
 * Get number of business days between two dates
 */
export function businessDaysBetween(
  dateA: DateInput,
  dateB: DateInput,
  config: WhennyConfig = getConfig()
): number {
  let a = parseDate(dateA)
  let b = parseDate(dateB)

  // Ensure a is before b
  if (a > b) {
    [a, b] = [b, a]
  }

  let count = 0
  const current = new Date(a)

  while (current <= b) {
    if (isBusinessDay(current, config)) {
      count++
    }
    current.setDate(current.getDate() + 1)
  }

  return count
}

/**
 * Get the next business day
 */
export function nextBusinessDay(
  date: DateInput = new Date(),
  config: WhennyConfig = getConfig()
): Date {
  let current = add(parseDate(date), 1, 'day')

  while (!isBusinessDay(current, config)) {
    current = add(current, 1, 'day')
  }

  return current
}

/**
 * Get the previous business day
 */
export function previousBusinessDay(
  date: DateInput = new Date(),
  config: WhennyConfig = getConfig()
): Date {
  let current = subtract(parseDate(date), 1, 'day')

  while (!isBusinessDay(current, config)) {
    current = subtract(current, 1, 'day')
  }

  return current
}

/**
 * Add business days to a date
 *
 * @example
 * ```typescript
 * addBusinessDays(new Date('2026-02-06'), 5)  // Skip weekends
 * addBusinessDays(new Date('2026-02-06'), -3) // Go backwards
 * ```
 */
export function addBusinessDays(
  date: DateInput,
  days: number,
  config: WhennyConfig = getConfig()
): Date {
  let current = parseDate(date)
  let remaining = Math.abs(days)
  const direction = days >= 0 ? 1 : -1

  while (remaining > 0) {
    current = add(current, direction, 'day')
    if (isBusinessDay(current, config)) {
      remaining--
    }
  }

  return current
}

/**
 * Subtract business days from a date
 */
export function subtractBusinessDays(
  date: DateInput,
  days: number,
  config: WhennyConfig = getConfig()
): Date {
  return addBusinessDays(date, -days, config)
}

// ============================================================================
// EXPORT NAMESPACE
// ============================================================================

export const calendar = {
  // Queries
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

  // Comparisons
  isSameDay,
  isSameWeek,
  isSameMonth,
  isSameYear,
  isBefore,
  isAfter,
  isBetween,

  // Boundaries
  startOf,
  endOf,

  // Arithmetic
  add,
  subtract,
  addBusinessDays,
  subtractBusinessDays,

  // Distances
  daysUntil,
  daysSince,
  businessDaysBetween,
  nextBusinessDay,
  previousBusinessDay,
}
