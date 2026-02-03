/**
 * Whenny Comparison
 *
 * Compare two dates and get formatted descriptions like "3 days before"
 * or distance measurements.
 */

import type {
  WhennyConfig,
  DateInput,
  WhennyComparison,
  WhennyDistance,
} from '../types'
import { getConfig } from '../config'
import {
  parseDate,
  differenceInMilliseconds,
  differenceInSeconds,
  differenceInMinutes,
  differenceInHours,
  differenceInDays,
  isSameDay,
} from '../core/utils'
import { relativeDescription } from '../relative'

/**
 * Create a comparison between two dates
 *
 * @example
 * ```typescript
 * const result = compare(eventA, eventB)
 * result.smart()    // "3 days before"
 * result.days()     // -3
 * result.isBefore() // true
 * ```
 */
export function compare(
  dateA: DateInput,
  dateB: DateInput,
  config: WhennyConfig = getConfig()
): WhennyComparison {
  const a = parseDate(dateA)
  const b = parseDate(dateB)
  const diffMs = differenceInMilliseconds(a, b)
  const diffSeconds = differenceInSeconds(a, b)

  return {
    smart(): string {
      if (Math.abs(diffSeconds) < 1) {
        return config.compare.simultaneous
      }

      const description = relativeDescription(diffSeconds, config)
      const template = diffSeconds < 0
        ? config.compare.before
        : config.compare.after

      return template.replace('{time}', description)
    },

    days(): number {
      return differenceInDays(a, b)
    },

    hours(): number {
      return differenceInHours(a, b)
    },

    minutes(): number {
      return differenceInMinutes(a, b)
    },

    seconds(): number {
      return diffSeconds
    },

    milliseconds(): number {
      return diffMs
    },

    isBefore(): boolean {
      return diffMs < 0
    },

    isAfter(): boolean {
      return diffMs > 0
    },

    isSame(unit?: 'day' | 'hour' | 'minute' | 'second'): boolean {
      switch (unit) {
        case 'day':
          return isSameDay(a, b)
        case 'hour':
          // Use milliseconds for accurate comparison (less than 1 hour apart)
          return Math.abs(diffMs) < 3600000 // 1 hour in ms
        case 'minute':
          return Math.abs(diffMs) < 60000 // 1 minute in ms
        case 'second':
          return Math.abs(diffMs) < 1000 // 1 second in ms
        default:
          return diffMs === 0
      }
    },
  }
}

/**
 * Get the distance between two dates
 *
 * @example
 * ```typescript
 * const dist = distance(dateA, dateB)
 * dist.human()  // "3 days"
 * dist.exact()  // "3 days, 4 hours, 30 minutes"
 * ```
 */
export function distance(
  dateA: DateInput,
  dateB: DateInput,
  _config: WhennyConfig = getConfig()
): WhennyDistance {
  const a = parseDate(dateA)
  const b = parseDate(dateB)
  const diffMs = Math.abs(differenceInMilliseconds(a, b))
  const totalSeconds = Math.floor(diffMs / 1000)

  const days = Math.floor(totalSeconds / 86400)
  const hours = Math.floor((totalSeconds % 86400) / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60

  return {
    human(): string {
      // Return the most significant unit
      if (days > 0) {
        return `${days} day${days === 1 ? '' : 's'}`
      }
      if (hours > 0) {
        return `${hours} hour${hours === 1 ? '' : 's'}`
      }
      if (minutes > 0) {
        return `${minutes} minute${minutes === 1 ? '' : 's'}`
      }
      return `${seconds} second${seconds === 1 ? '' : 's'}`
    },

    exact(): string {
      const parts: string[] = []

      if (days > 0) {
        parts.push(`${days} day${days === 1 ? '' : 's'}`)
      }
      if (hours > 0) {
        parts.push(`${hours} hour${hours === 1 ? '' : 's'}`)
      }
      if (minutes > 0) {
        parts.push(`${minutes} minute${minutes === 1 ? '' : 's'}`)
      }
      if (seconds > 0 && parts.length < 2) {
        parts.push(`${seconds} second${seconds === 1 ? '' : 's'}`)
      }

      return parts.length > 0 ? parts.join(', ') : '0 seconds'
    },

    days,
    hours,
    minutes,
    seconds,
    totalSeconds,
  }
}
