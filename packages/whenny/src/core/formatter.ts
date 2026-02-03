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
 * Token definitions for format strings
 */
interface TokenHandlers {
  [key: string]: (date: Date, config: WhennyConfig, timezone?: Timezone) => string
}

const tokenHandlers: TokenHandlers = {
  // Year
  year: (date) => date.getFullYear().toString(),
  yearShort: (date) => date.getFullYear().toString().slice(-2),

  // Month
  month: (date) => padZero(date.getMonth() + 1),
  monthShort: (date) => MONTHS_SHORT[date.getMonth()],
  monthFull: (date) => MONTHS_FULL[date.getMonth()],

  // Day
  day: (date) => padZero(date.getDate()),
  dayOrdinal: (date) => formatOrdinal(date.getDate()),
  weekday: (date) => WEEKDAYS_FULL[date.getDay()],
  weekdayShort: (date) => WEEKDAYS_SHORT[date.getDay()],

  // Time (respects hour12 config)
  hour: (date, config) => {
    const hour = date.getHours()
    if (config.formats.hour12) {
      const hour12 = hour % 12 || 12
      return hour12.toString()
    }
    return padZero(hour)
  },
  hour24: (date) => padZero(date.getHours()),
  hour12: (date) => {
    const hour = date.getHours() % 12 || 12
    return hour.toString()
  },
  minute: (date) => padZero(date.getMinutes()),
  second: (date) => padZero(date.getSeconds()),
  millisecond: (date) => padZero(date.getMilliseconds(), 3),

  // AM/PM
  ampm: (date) => (date.getHours() < 12 ? 'am' : 'pm'),
  AMPM: (date) => (date.getHours() < 12 ? 'AM' : 'PM'),

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
  time: (date, config) => {
    const hour = date.getHours()
    const minute = padZero(date.getMinutes())

    if (config.formats.hour12) {
      const hour12 = hour % 12 || 12
      const ampm = hour < 12 ? 'AM' : 'PM'
      return `${hour12}:${minute} ${ampm}`
    }

    return `${padZero(hour)}:${minute}`
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
