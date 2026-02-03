/**
 * Whenny Smart Formatting
 *
 * Context-aware date formatting that automatically chooses the best
 * representation based on how far the date is from now.
 */

import type { WhennyConfig, DateInput, SmartBucket, Timezone } from '../types'
import { getConfig } from '../config'
import {
  parseDate,
  differenceInSeconds,
  isToday,
  isYesterday,
  isTomorrow,
  isThisWeek,
  isThisYear,
  isFuture,
  isBrowser,
  getLocalTimezone,
  SECONDS_IN_MINUTE,
  SECONDS_IN_HOUR,
  SECONDS_IN_DAY,
  SECONDS_IN_WEEK,
  SECONDS_IN_MONTH,
  SECONDS_IN_YEAR,
} from '../core/utils'
import { format, formatInTimezone } from '../core/formatter'
import { relative } from '../relative'

export interface SmartOptions {
  /** Timezone to format for (required on server) */
  for?: Timezone
  /** Reference date (instead of now) */
  from?: DateInput
  /** Override config */
  config?: WhennyConfig
}

/**
 * Determine which bucket a date falls into
 */
function findBucket(
  date: Date,
  reference: Date,
  buckets: SmartBucket[],
  timezone?: Timezone
): SmartBucket | undefined {
  const diffSeconds = Math.abs(differenceInSeconds(date, reference))

  for (const bucket of buckets) {
    if (bucket.older) {
      return bucket
    }

    switch (bucket.within) {
      case 'minute':
        if (diffSeconds < SECONDS_IN_MINUTE) return bucket
        break

      case 'hour':
        if (diffSeconds < SECONDS_IN_HOUR) return bucket
        break

      case 'today':
        if (isToday(date)) return bucket
        break

      case 'yesterday':
        // For past dates
        if (isYesterday(date)) return bucket
        // For future dates, this bucket means "tomorrow"
        if (isTomorrow(date)) return bucket
        break

      case 'week':
        if (diffSeconds < SECONDS_IN_WEEK) return bucket
        break

      case 'month':
        if (diffSeconds < SECONDS_IN_MONTH) return bucket
        break

      case 'year':
        if (isThisYear(date)) return bucket
        break
    }
  }

  // Return the last bucket (should be "older: true")
  return buckets[buckets.length - 1]
}

/**
 * Format a date using smart, context-aware formatting
 *
 * Automatically chooses the best representation:
 * - Within a minute: "just now"
 * - Within an hour: "5 minutes ago"
 * - Today: "3:45 PM"
 * - Yesterday: "Yesterday at 3:45 PM"
 * - This week: "Tuesday at 3:45 PM"
 * - This year: "Jan 15"
 * - Older: "Jan 15, 2023"
 *
 * @example
 * ```typescript
 * smart(new Date()) // "just now"
 * smart(fiveMinutesAgo) // "5 minutes ago"
 * smart(yesterday) // "Yesterday at 3:30 PM"
 * ```
 */
export function smart(date: DateInput, options: SmartOptions = {}): string {
  const config = options.config ?? getConfig()
  const targetDate = parseDate(date)
  const referenceDate = options.from ? parseDate(options.from) : new Date()
  const timezone = options.for

  // Server-side timezone check
  if (!timezone && !isBrowser() && config.server.requireTimezone) {
    if (config.server.warnOnMissingTimezone) {
      console.warn(
        '[whenny] smart() called on server without timezone context. ' +
        'Use smart({ for: timezone }) or configure server.requireTimezone = false'
      )
    }

    // Return fallback format
    switch (config.server.fallbackFormat) {
      case 'iso':
        return targetDate.toISOString()
      case 'utc':
        return format(targetDate, '{monthShort} {day}, {year} {time} UTC', config)
      case 'long':
        return format(targetDate, config.formats.presets.long, config)
    }
  }

  // Choose bucket list based on past/future
  const isDateInFuture = isFuture(targetDate)
  const buckets = isDateInFuture && config.smart.futureBuckets
    ? config.smart.futureBuckets
    : config.smart.buckets

  const bucket = findBucket(targetDate, referenceDate, buckets, timezone)

  if (!bucket) {
    // Fallback to ISO
    return targetDate.toISOString()
  }

  // Handle "relative" special value
  if (bucket.show === 'relative') {
    return relative(targetDate, { from: referenceDate, config })
  }

  // Format using the bucket's template
  if (timezone) {
    return formatInTimezone(targetDate, timezone, bucket.show, config)
  }

  return format(targetDate, bucket.show, config)
}

/**
 * Smart format with explicit timezone (convenience function)
 */
export function smartFor(
  date: DateInput,
  timezone: Timezone,
  options: Omit<SmartOptions, 'for'> = {}
): string {
  return smart(date, { ...options, for: timezone })
}

/**
 * Smart format relative to a specific date (not now)
 */
export function smartFrom(
  date: DateInput,
  reference: DateInput,
  options: Omit<SmartOptions, 'from'> = {}
): string {
  return smart(date, { ...options, from: reference })
}
