/**
 * Whenny Duration
 *
 * Format durations/time spans in various styles.
 * Perfect for video lengths, timers, countdowns.
 */

import type { WhennyConfig, WhennyDuration, DateInput } from '../types'
import { getConfig } from '../config'
import { parseDate, differenceInMilliseconds } from '../core/utils'

/**
 * Create a duration from seconds
 *
 * @example
 * ```typescript
 * duration(3661).long()     // "1 hour, 1 minute, 1 second"
 * duration(3661).compact()  // "1h 1m 1s"
 * duration(3661).clock()    // "1:01:01"
 * duration(3661).brief()    // "1h 1m" (no seconds)
 * duration(3661).timer()    // "01:01:01" (padded)
 * ```
 */
export function duration(
  seconds: number,
  config: WhennyConfig = getConfig()
): WhennyDuration {
  const totalSeconds = Math.abs(Math.floor(seconds))
  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const secs = totalSeconds % 60

  return {
    long(): string {
      const parts: string[] = []
      const style = config.duration.long

      if (hours > 0) {
        parts.push(style.hours(hours))
      }
      if (minutes > 0) {
        parts.push(style.minutes(minutes))
      }
      if (secs > 0 || parts.length === 0) {
        parts.push(style.seconds(secs))
      }

      return parts.join(style.separator)
    },

    compact(): string {
      const parts: string[] = []
      const style = config.duration.compact

      if (hours > 0) {
        parts.push(style.hours(hours))
      }
      if (minutes > 0 || hours > 0) {
        parts.push(style.minutes(minutes))
      }
      if (secs > 0 || parts.length === 0) {
        parts.push(style.seconds(secs))
      }

      return parts.join(style.separator)
    },

    /** Brief format - no seconds unless duration < 1 minute: "1h 30m" */
    brief(): string {
      const parts: string[] = []
      const style = config.duration.compact

      if (hours > 0) {
        parts.push(style.hours(hours))
      }
      if (minutes > 0 || hours > 0) {
        parts.push(style.minutes(minutes))
      }
      // Only show seconds if total duration < 1 minute
      if (parts.length === 0) {
        parts.push(style.seconds(secs))
      }

      return parts.join(style.separator)
    },

    clock(): string {
      if (hours > 0) {
        return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
      }
      return `${minutes}:${secs.toString().padStart(2, '0')}`
    },

    /** Timer format - always padded with hours: "01:30:45" */
    timer(): string {
      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
    },

    /** Minimal format - just the largest unit: "1h" or "30m" or "45s" */
    minimal(): string {
      const style = config.duration.compact
      if (hours > 0) {
        return style.hours(hours)
      }
      if (minutes > 0) {
        return style.minutes(minutes)
      }
      return style.seconds(secs)
    },

    human(): string {
      // Return an approximation
      if (hours > 0) {
        if (minutes >= 30) {
          return `about ${hours + 1} hour${hours + 1 === 1 ? '' : 's'}`
        }
        return `about ${hours} hour${hours === 1 ? '' : 's'}`
      }
      if (minutes > 0) {
        return `${minutes} minute${minutes === 1 ? '' : 's'}`
      }
      return `${secs} second${secs === 1 ? '' : 's'}`
    },

    hours,
    minutes,
    seconds: secs,
    totalSeconds,
    totalMinutes: Math.floor(totalSeconds / 60),
    totalHours: Math.floor(totalSeconds / 3600),
  }
}

/**
 * Create a duration from milliseconds
 */
export function durationMs(
  milliseconds: number,
  config: WhennyConfig = getConfig()
): WhennyDuration {
  return duration(milliseconds / 1000, config)
}

/**
 * Create a duration between two dates
 */
export function durationBetween(
  dateA: DateInput,
  dateB: DateInput,
  config: WhennyConfig = getConfig()
): WhennyDuration {
  const a = parseDate(dateA)
  const b = parseDate(dateB)
  const diffMs = Math.abs(differenceInMilliseconds(a, b))
  return duration(diffMs / 1000, config)
}

/**
 * Create a duration until a future date (countdown)
 */
export function until(
  date: DateInput,
  config: WhennyConfig = getConfig()
): WhennyDuration {
  return durationBetween(new Date(), date, config)
}

/**
 * Create a duration since a past date
 */
export function since(
  date: DateInput,
  config: WhennyConfig = getConfig()
): WhennyDuration {
  return durationBetween(date, new Date(), config)
}

/**
 * Parse a duration string like "1h 30m" or "90m" into seconds
 */
export function parseDuration(input: string): number {
  let totalSeconds = 0

  // Match patterns like "1h", "30m", "45s"
  const patterns = [
    { regex: /(\d+(?:\.\d+)?)\s*h/i, multiplier: 3600 },
    { regex: /(\d+(?:\.\d+)?)\s*m(?:in)?/i, multiplier: 60 },
    { regex: /(\d+(?:\.\d+)?)\s*s(?:ec)?/i, multiplier: 1 },
  ]

  for (const { regex, multiplier } of patterns) {
    const match = input.match(regex)
    if (match) {
      totalSeconds += parseFloat(match[1]) * multiplier
    }
  }

  // If no patterns matched, try parsing as plain seconds
  if (totalSeconds === 0) {
    const num = parseFloat(input)
    if (!isNaN(num)) {
      totalSeconds = num
    }
  }

  return totalSeconds
}

// Export namespace for convenient access
export const dur = {
  from: duration,
  ms: durationMs,
  between: durationBetween,
  until,
  since,
  parse: parseDuration,
}
