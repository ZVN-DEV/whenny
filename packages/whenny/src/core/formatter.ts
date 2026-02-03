/**
 * Whenny Formatter
 *
 * Handles all date formatting with support for custom templates and tokens.
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
}

/**
 * Get date parts in a specific timezone using Intl.DateTimeFormat
 * This is the key function that ensures we get the correct time components
 * for the target timezone, not the server's local timezone.
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
  const getPart = (type: string): number | string => {
    const part = parts.find((p) => p.type === type)
    return part ? part.value : ''
  }

  // Map weekday string to number (0-6, Sunday = 0)
  const weekdayMap: Record<string, number> = {
    'Sun': 0, 'Mon': 1, 'Tue': 2, 'Wed': 3, 'Thu': 4, 'Fri': 5, 'Sat': 6
  }
  const weekdayStr = getPart('weekday') as string
  const weekday = weekdayMap[weekdayStr] ?? 0

  return {
    year: parseInt(getPart('year') as string, 10),
    month: parseInt(getPart('month') as string, 10) - 1, // 0-indexed like Date.getMonth()
    day: parseInt(getPart('day') as string, 10),
    weekday,
    hour: parseInt(getPart('hour') as string, 10),
    minute: parseInt(getPart('minute') as string, 10),
    second: parseInt(getPart('second') as string, 10),
  }
}

/**
 * Token definitions for format strings
 */
interface TokenHandlers {
  [key: string]: (date: Date, config: WhennyConfig, timezone?: Timezone) => string
}

const tokenHandlers: TokenHandlers = {
  // Year
  year: (date, _config, timezone) => {
    const parts = getDatePartsInTimezone(date, timezone)
    return parts.year.toString()
  },
  yearShort: (date, _config, timezone) => {
    const parts = getDatePartsInTimezone(date, timezone)
    return parts.year.toString().slice(-2)
  },

  // Month
  month: (date, _config, timezone) => {
    const parts = getDatePartsInTimezone(date, timezone)
    return padZero(parts.month + 1)
  },
  monthShort: (date, _config, timezone) => {
    const parts = getDatePartsInTimezone(date, timezone)
    return MONTHS_SHORT[parts.month]
  },
  monthFull: (date, _config, timezone) => {
    const parts = getDatePartsInTimezone(date, timezone)
    return MONTHS_FULL[parts.month]
  },

  // Day
  day: (date, _config, timezone) => {
    const parts = getDatePartsInTimezone(date, timezone)
    return padZero(parts.day)
  },
  dayOrdinal: (date, _config, timezone) => {
    const parts = getDatePartsInTimezone(date, timezone)
    return formatOrdinal(parts.day)
  },
  weekday: (date, _config, timezone) => {
    const parts = getDatePartsInTimezone(date, timezone)
    return WEEKDAYS_FULL[parts.weekday]
  },
  weekdayShort: (date, _config, timezone) => {
    const parts = getDatePartsInTimezone(date, timezone)
    return WEEKDAYS_SHORT[parts.weekday]
  },

  // Time (respects hour12 config)
  hour: (date, config, timezone) => {
    const parts = getDatePartsInTimezone(date, timezone)
    if (config.formats.hour12) {
      const hour12 = parts.hour % 12 || 12
      return hour12.toString()
    }
    return padZero(parts.hour)
  },
  hour24: (date, _config, timezone) => {
    const parts = getDatePartsInTimezone(date, timezone)
    return padZero(parts.hour)
  },
  hour12: (date, _config, timezone) => {
    const parts = getDatePartsInTimezone(date, timezone)
    const hour12 = parts.hour % 12 || 12
    return hour12.toString()
  },
  minute: (date, _config, timezone) => {
    const parts = getDatePartsInTimezone(date, timezone)
    return padZero(parts.minute)
  },
  second: (date, _config, timezone) => {
    const parts = getDatePartsInTimezone(date, timezone)
    return padZero(parts.second)
  },
  millisecond: (date) => padZero(date.getMilliseconds(), 3),

  // AM/PM
  ampm: (date, _config, timezone) => {
    const parts = getDatePartsInTimezone(date, timezone)
    return parts.hour < 12 ? 'am' : 'pm'
  },
  AMPM: (date, _config, timezone) => {
    const parts = getDatePartsInTimezone(date, timezone)
    return parts.hour < 12 ? 'AM' : 'PM'
  },

  // Timezone
  timezone: (date, _config, timezone) => {
    const tz = timezone ?? Intl.DateTimeFormat().resolvedOptions().timeZone
    return getTimezoneAbbreviation(date, tz)
  },
  offset: (date, _config, timezone) => {
    const tz = timezone ?? Intl.DateTimeFormat().resolvedOptions().timeZone
    const offset = getTimezoneOffset(date, tz)
    return formatTimezoneOffset(offset)
  },
  offsetShort: (date, _config, timezone) => {
    const tz = timezone ?? Intl.DateTimeFormat().resolvedOptions().timeZone
    const offset = getTimezoneOffset(date, tz)
    const hours = Math.floor(Math.abs(offset) / 60)
    return offset >= 0 ? `+${hours}` : `-${hours}`
  },

  // Special: time preset
  time: (date, config, timezone) => {
    const parts = getDatePartsInTimezone(date, timezone)
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
 * Format a date using a template string with tokens
 *
 * @example
 * ```typescript
 * format(date, '{monthShort} {day}, {year}')
 * // → "Jan 15, 2024"
 *
 * format(date, '{weekday}, {monthFull} {dayOrdinal}')
 * // → "Monday, January 15th"
 * ```
 */
export function format(
  date: Date,
  template: string,
  config: WhennyConfig = getConfig(),
  timezone?: Timezone
): string {
  // Replace tokens in the template
  return template.replace(/\{(\w+)\}/g, (match, token) => {
    const handler = tokenHandlers[token]
    if (handler) {
      return handler(date, config, timezone)
    }
    // Return the original match if token is unknown
    return match
  })
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
  // Create a formatter for the target timezone
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

  // Get the parts and reconstruct a date in local time that represents the target timezone
  const parts = formatter.formatToParts(date)
  const getPart = (type: string): number => {
    const part = parts.find((p) => p.type === type)
    return part ? parseInt(part.value, 10) : 0
  }

  // Create a new date with the timezone-adjusted values
  // Note: This date object's internal time is wrong, but when we format it
  // using our tokens (which use getHours, getMinutes, etc.), we get the right display
  const adjustedDate = new Date(
    getPart('year'),
    getPart('month') - 1,
    getPart('day'),
    getPart('hour'),
    getPart('minute'),
    getPart('second')
  )

  return format(adjustedDate, template, config, timezone)
}
