/**
 * Whenny Formatter
 *
 * Handles all date formatting with intuitive pattern tokens.
 *
 * Pattern Reference:
 * | Pattern | Example   | Description              |
 * |---------|-----------|--------------------------|
 * | YYYY    | 2026      | 4-digit year             |
 * | YY      | 26        | 2-digit year             |
 * | MMMM    | February  | Full month name          |
 * | MMM     | Feb       | Short month name         |
 * | MM      | 02        | Zero-padded month        |
 * | M       | 2         | Month number             |
 * | dddd    | Tuesday   | Full weekday             |
 * | ddd     | Tue       | Short weekday            |
 * | DD      | 03        | Zero-padded day          |
 * | D       | 3         | Day number               |
 * | Do      | 3rd       | Ordinal day              |
 * | HH      | 15        | 24-hour, zero-padded     |
 * | H       | 15        | 24-hour                  |
 * | hh      | 03        | 12-hour, zero-padded     |
 * | h       | 3         | 12-hour                  |
 * | mm      | 05        | Minutes, zero-padded     |
 * | m       | 5         | Minutes                  |
 * | ss      | 09        | Seconds, zero-padded     |
 * | s       | 9         | Seconds                  |
 * | SSS     | 123       | Milliseconds             |
 * | A       | PM        | AM/PM uppercase          |
 * | a       | pm        | am/pm lowercase          |
 * | Z       | EST       | Timezone abbreviation    |
 * | ZZ      | -05:00    | Timezone offset          |
 *
 * Escape text with square brackets: [at] -> "at"
 */

import type { WhennyConfig, Timezone } from '../types'
import { getConfig } from '../config'
import {
  MONTHS_SHORT,
  MONTHS_FULL,
  WEEKDAYS_SHORT,
  WEEKDAYS_FULL,
  padZero,
  formatOrdinal,
  getTimezoneAbbreviation,
  formatTimezoneOffset,
  getTimezoneOffset,
} from './utils'

/**
 * Date parts extracted in a specific timezone
 */
interface DateParts {
  year: number
  month: number
  day: number
  weekday: number
  hour: number
  minute: number
  second: number
  millisecond: number
}

/**
 * Get date parts in a specific timezone using Intl.DateTimeFormat
 * This ensures we get the correct time components for the target timezone.
 */
function getDatePartsInTimezone(date: Date, timezone?: Timezone): DateParts {
  const tz = timezone ?? Intl.DateTimeFormat().resolvedOptions().timeZone

  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone: tz,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    weekday: 'short',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  })

  const parts = formatter.formatToParts(date)
  const getPart = (type: string): string => {
    const part = parts.find((p) => p.type === type)
    return part ? part.value : ''
  }

  // Map weekday string to number (0-6, Sunday = 0)
  const weekdayMap: Record<string, number> = {
    Sun: 0,
    Mon: 1,
    Tue: 2,
    Wed: 3,
    Thu: 4,
    Fri: 5,
    Sat: 6,
  }
  const weekdayStr = getPart('weekday')
  const weekday = weekdayMap[weekdayStr] ?? 0

  return {
    year: parseInt(getPart('year'), 10),
    month: parseInt(getPart('month'), 10) - 1, // 0-indexed
    day: parseInt(getPart('day'), 10),
    weekday,
    hour: parseInt(getPart('hour'), 10),
    minute: parseInt(getPart('minute'), 10),
    second: parseInt(getPart('second'), 10),
    millisecond: date.getMilliseconds(),
  }
}

/**
 * Pattern handlers map
 */
type PatternHandler = (parts: DateParts, date: Date, timezone?: Timezone) => string

const patternHandlers: Record<string, PatternHandler> = {
  // Year
  YYYY: (parts) => parts.year.toString(),
  YY: (parts) => parts.year.toString().slice(-2),

  // Month
  MMMM: (parts) => MONTHS_FULL[parts.month],
  MMM: (parts) => MONTHS_SHORT[parts.month],
  MM: (parts) => padZero(parts.month + 1),
  M: (parts) => (parts.month + 1).toString(),

  // Weekday
  dddd: (parts) => WEEKDAYS_FULL[parts.weekday],
  ddd: (parts) => WEEKDAYS_SHORT[parts.weekday],

  // Day
  Do: (parts) => formatOrdinal(parts.day),
  DD: (parts) => padZero(parts.day),
  D: (parts) => parts.day.toString(),

  // Hour 24h
  HH: (parts) => padZero(parts.hour),
  H: (parts) => parts.hour.toString(),

  // Hour 12h
  hh: (parts) => padZero(parts.hour % 12 || 12),
  h: (parts) => (parts.hour % 12 || 12).toString(),

  // Minutes
  mm: (parts) => padZero(parts.minute),
  m: (parts) => parts.minute.toString(),

  // Seconds
  ss: (parts) => padZero(parts.second),
  s: (parts) => parts.second.toString(),

  // Milliseconds
  SSS: (parts) => padZero(parts.millisecond, 3),

  // AM/PM
  A: (parts) => (parts.hour < 12 ? 'AM' : 'PM'),
  a: (parts) => (parts.hour < 12 ? 'am' : 'pm'),

  // Timezone
  ZZ: (_parts, date, timezone) => {
    const tz = timezone ?? Intl.DateTimeFormat().resolvedOptions().timeZone
    return formatTimezoneOffset(getTimezoneOffset(date, tz))
  },
  Z: (_parts, date, timezone) => {
    const tz = timezone ?? Intl.DateTimeFormat().resolvedOptions().timeZone
    return getTimezoneAbbreviation(date, tz)
  },
}

// Build regex that matches all patterns, longest first
const patternRegex = new RegExp(
  '(' +
    [
      'YYYY',
      'MMMM',
      'dddd',
      'SSS',
      'MMM',
      'ddd',
      'YY',
      'MM',
      'DD',
      'Do',
      'HH',
      'hh',
      'mm',
      'ss',
      'ZZ',
      'M',
      'D',
      'H',
      'h',
      'm',
      's',
      'A',
      'a',
      'Z',
    ].join('|') +
    ')',
  'g'
)

/**
 * Format a date using intuitive pattern tokens
 *
 * @example
 * ```typescript
 * format(date, 'dddd, MMMM D')      // "Tuesday, February 3"
 * format(date, 'MMMM Do, YYYY')     // "February 3rd, 2026"
 * format(date, 'MM/DD/YYYY')        // "02/03/2026"
 * format(date, 'h:mm A')            // "3:30 PM"
 * format(date, 'HH:mm:ss')          // "15:30:45"
 * format(date, 'MMM D [at] h:mm A') // "Feb 3 at 3:30 PM"
 * ```
 */
export function format(
  date: Date,
  template: string,
  config: WhennyConfig = getConfig(),
  timezone?: Timezone
): string {
  // Get date parts once for efficiency
  const parts = getDatePartsInTimezone(date, timezone)

  // Escape sequences: [text] and {token} -> placeholders
  const escapes: string[] = []
  let result = template

  // Escape [text] sequences
  result = result.replace(/\[([^\]]*)\]/g, (_, text) => {
    escapes.push(text)
    return `\x00${escapes.length - 1}\x00`
  })

  // Escape {token} sequences (legacy syntax) to process after patterns
  const legacyTokens: Array<{ token: string; index: number }> = []
  result = result.replace(/\{(\w+)\}/g, (_, token) => {
    legacyTokens.push({ token, index: escapes.length })
    escapes.push(`\x01LEGACY:${token}\x01`)
    return `\x00${escapes.length - 1}\x00`
  })

  // Replace all patterns in one pass using regex
  result = result.replace(patternRegex, (match) => {
    const handler = patternHandlers[match]
    return handler ? handler(parts, date, timezone) : match
  })

  // Restore escaped text and process legacy tokens
  result = result.replace(/\x00(\d+)\x00/g, (_, indexStr) => {
    const index = parseInt(indexStr, 10)
    const escaped = escapes[index]

    // Check if this is a legacy token
    if (escaped.startsWith('\x01LEGACY:') && escaped.endsWith('\x01')) {
      const token = escaped.slice(8, -1)
      const legacyHandler = legacyTokenHandlers[token]
      if (legacyHandler) {
        return legacyHandler(parts, date, config, timezone)
      }
      return `{${token}}` // Return original if unknown
    }

    return escaped
  })

  return result
}

/**
 * Legacy token handlers for backward compatibility with {token} syntax
 */
type LegacyHandler = (
  parts: DateParts,
  date: Date,
  config: WhennyConfig,
  timezone?: Timezone
) => string

const legacyTokenHandlers: Record<string, LegacyHandler> = {
  year: (parts) => parts.year.toString(),
  yearShort: (parts) => parts.year.toString().slice(-2),
  month: (parts) => padZero(parts.month + 1),
  monthShort: (parts) => MONTHS_SHORT[parts.month],
  monthFull: (parts) => MONTHS_FULL[parts.month],
  day: (parts) => padZero(parts.day),
  dayOrdinal: (parts) => formatOrdinal(parts.day),
  weekday: (parts) => WEEKDAYS_FULL[parts.weekday],
  weekdayShort: (parts) => WEEKDAYS_SHORT[parts.weekday],
  hour: (parts, _date, config) => {
    if (config.formats.hour12) {
      return (parts.hour % 12 || 12).toString()
    }
    return padZero(parts.hour)
  },
  hour24: (parts) => padZero(parts.hour),
  hour12: (parts) => (parts.hour % 12 || 12).toString(),
  minute: (parts) => padZero(parts.minute),
  second: (parts) => padZero(parts.second),
  millisecond: (parts) => padZero(parts.millisecond, 3),
  ampm: (parts) => (parts.hour < 12 ? 'am' : 'pm'),
  AMPM: (parts) => (parts.hour < 12 ? 'AM' : 'PM'),
  timezone: (_parts, date, _config, timezone) => {
    const tz = timezone ?? Intl.DateTimeFormat().resolvedOptions().timeZone
    return getTimezoneAbbreviation(date, tz)
  },
  offset: (_parts, date, _config, timezone) => {
    const tz = timezone ?? Intl.DateTimeFormat().resolvedOptions().timeZone
    return formatTimezoneOffset(getTimezoneOffset(date, tz))
  },
  offsetShort: (_parts, date, _config, timezone) => {
    const tz = timezone ?? Intl.DateTimeFormat().resolvedOptions().timeZone
    const offset = getTimezoneOffset(date, tz)
    const hours = Math.floor(Math.abs(offset) / 60)
    return offset >= 0 ? `+${hours}` : `-${hours}`
  },
  time: (parts, _date, config) => {
    const minute = padZero(parts.minute)
    if (config.formats.hour12) {
      const hour12 = parts.hour % 12 || 12
      const ampm = parts.hour < 12 ? 'AM' : 'PM'
      return `${hour12}:${minute} ${ampm}`
    }
    return `${padZero(parts.hour)}:${minute}`
  },
}

/**
 * Format using a preset name
 */
export function formatPreset(
  date: Date,
  presetName: string,
  config: WhennyConfig = getConfig(),
  timezone?: Timezone
): string {
  const template = config.formats.presets[presetName]
  if (!template) {
    throw new Error(`Unknown format preset: ${presetName}`)
  }
  return format(date, template, config, timezone)
}

/**
 * Format as ISO 8601
 */
export function formatISO(date: Date): string {
  return date.toISOString()
}

/**
 * Format as short date: "Jan 15"
 */
export function formatShort(
  date: Date,
  config: WhennyConfig = getConfig(),
  timezone?: Timezone
): string {
  return formatPreset(date, 'short', config, timezone)
}

/**
 * Format as long date: "January 15, 2024"
 */
export function formatLong(
  date: Date,
  config: WhennyConfig = getConfig(),
  timezone?: Timezone
): string {
  return formatPreset(date, 'long', config, timezone)
}

/**
 * Format as time only: "3:30 PM"
 */
export function formatTime(
  date: Date,
  config: WhennyConfig = getConfig(),
  timezone?: Timezone
): string {
  return formatPreset(date, 'time', config, timezone)
}

/**
 * Format as date and time: "Jan 15, 3:30 PM"
 */
export function formatDateTime(
  date: Date,
  config: WhennyConfig = getConfig(),
  timezone?: Timezone
): string {
  return formatPreset(date, 'datetime', config, timezone)
}

/**
 * Convert a date to a specific timezone for display
 */
export function formatInTimezone(
  date: Date,
  timezone: Timezone,
  template: string,
  config: WhennyConfig = getConfig()
): string {
  return format(date, template, config, timezone)
}
