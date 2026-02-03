/**
 * Whenny
 *
 * A modern date library for the AI era.
 * Own your code. Configure your voice. Never think about timezones again.
 *
 * @example
 * ```typescript
 * import { whenny, configure } from 'whenny'
 *
 * // Basic usage
 * whenny(new Date()).smart()        // "just now"
 * whenny(new Date()).relative()     // "just now"
 * whenny(new Date()).format('{monthShort} {day}')  // "Jan 15"
 *
 * // With configuration
 * configure({
 *   relative: {
 *     justNow: 'moments ago',
 *   },
 * })
 *
 * whenny(new Date()).relative()     // "moments ago"
 * ```
 *
 * @packageDocumentation
 */

import type {
  DateInput,
  Timezone,
  Whenny as WhennyInterface,
  TransferPayload,
} from './types'

import { createWhenny, now, utcNow, localNow, inZone } from './core/whenny'
import { configure, getConfig, resetConfig, createConfig, defineConfig } from './config'
import { relative, fromNow, from as relativeFrom } from './relative'
import { smart, smartFor, smartFrom } from './smart'
import { compare, distance } from './compare'
import { duration, durationMs, durationBetween, until, since, parseDuration, dur } from './duration'
import { tz, local as tzLocal, inZone as tzInZone, dayBounds, todayBounds } from './timezone'
import { transfer, createTransfer, fromTransfer, localTransfer, utcTransfer } from './transfer'
import { calendar } from './calendar'
import { parseDate, isValidDate, getLocalTimezone } from './core/utils'

// ============================================================================
// MAIN WHENNY FUNCTION
// ============================================================================

/**
 * The main whenny function - create a Whenny instance from any date input
 *
 * @example
 * ```typescript
 * whenny(new Date())           // From Date
 * whenny('2024-01-15')         // From string
 * whenny(1705312200000)        // From timestamp
 *
 * whenny.now()                 // Current time
 * whenny.utc()                 // Current UTC time
 * whenny.local()               // Current local time
 * whenny.inZone('America/New_York')  // Current time in timezone
 * ```
 */
interface WhennyFunction {
  (input: DateInput): WhennyInterface

  /** Get current time as Whenny instance */
  now: () => WhennyInterface

  /** Get current UTC time */
  utc: (dateString?: string) => WhennyInterface

  /** Get current local time */
  local: (dateString?: string) => WhennyInterface

  /** Create date in specific timezone */
  inZone: (timezone: Timezone, dateString?: string) => WhennyInterface

  /** Parse from transfer payload */
  fromTransfer: (payload: TransferPayload) => WhennyInterface

  /** Day bounds for a timezone */
  dayBounds: (options: { date?: DateInput; for: Timezone }) => { start: Date; end: Date }
}

const whennyFn = ((input: DateInput) => createWhenny(input)) as WhennyFunction

// Attach static methods
whennyFn.now = () => now()
whennyFn.utc = (dateString?: string) => dateString ? inZone('UTC', dateString) : utcNow()
whennyFn.local = (dateString?: string) => dateString ? inZone(getLocalTimezone(), dateString) : localNow()
whennyFn.inZone = (timezone: Timezone, dateString?: string) => inZone(timezone, dateString)
whennyFn.fromTransfer = (payload: TransferPayload) => {
  const received = fromTransfer(payload)
  return createWhenny(received.date, { timezone: payload.originZone })
}
whennyFn.dayBounds = dayBounds

/**
 * The main whenny function
 */
export const whenny = whennyFn

// ============================================================================
// RE-EXPORTS
// ============================================================================

// Types
export type {
  DateInput,
  Timezone,
  TimeUnit,
  DayOfWeek,
  FormatToken,
  WhennyConfig,
  WhennyUserConfig,
  Whenny,
  WhennyComparison,
  WhennyDistance,
  WhennyDuration,
  TransferPayload,
  SmartOptions,
  RelativeOptions,
  SmartBucket,
  DayBounds,
  CalendarOptions,
} from './types'

// Configuration
export { configure, getConfig, resetConfig, createConfig, defineConfig }
export { defaultConfig } from './config/defaults'

// Relative time
export { relative, fromNow, relativeFrom }

// Smart formatting
export { smart, smartFor, smartFrom }

// Comparison
export { compare, distance }

// Duration
export { duration, durationMs, durationBetween, until, since, parseDuration, dur }

// Timezone
export { tz, tzLocal, tzInZone, dayBounds, todayBounds }
export {
  local,
  list,
  offset,
  offsetString,
  abbreviation,
  convertTo,
  isTodayIn,
  nowIn,
  // Timezone aliases
  fromAlias,
  isAlias,
  aliases,
  isValidTimezone,
  // Date ranges
  createRange,
  isInRange,
  rangesOverlap,
  rangeIntersection,
  getDatesBetween,
  type DateRange,
} from './timezone'

// Transfer
export { transfer, createTransfer, fromTransfer, localTransfer, utcTransfer }

// Calendar
export { calendar }
export {
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
} from './calendar'

// Core utilities
export { parseDate, isValidDate, getLocalTimezone }
export { format, formatPreset, formatISO, formatInTimezone } from './core/formatter'
export {
  MONTHS_SHORT,
  MONTHS_FULL,
  WEEKDAYS_SHORT,
  WEEKDAYS_FULL,
  padZero,
  formatOrdinal,
  getOrdinalSuffix,
  addTime,
  subtractTime,
} from './core/utils'

// Errors
export {
  WhennyError,
  type WhennyErrorCode,
  type WhennyErrorContext,
  type Result,
  ok,
  err,
  trySafe,
  assertValidDate,
  assertInputLength,
  assertValidTimeUnit,
  assertValidTransferPayload,
  MAX_INPUT_LENGTH,
  MAX_PARSE_DEPTH,
} from './errors'

// Default export
export default whenny
