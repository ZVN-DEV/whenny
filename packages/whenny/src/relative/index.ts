/**
 * Whenny Relative Time
 *
 * Format dates as relative time strings like "5 minutes ago" or "in 3 days".
 * Fully configurable through whenny.config.ts.
 */

import type { WhennyConfig, DateInput } from '../types'
import { getConfig } from '../config'
import { parseDate, differenceInSeconds } from '../core/utils'

/**
 * Format a date as relative time from now or another reference date
 *
 * @example
 * ```typescript
 * relative(new Date(Date.now() - 5 * 60 * 1000))
 * // → "5 minutes ago"
 *
 * relative(new Date(Date.now() + 3 * 24 * 60 * 60 * 1000))
 * // → "in 3 days"
 * ```
 */
export function relative(
  date: DateInput,
  options: { from?: DateInput; config?: WhennyConfig } = {}
): string {
  const config = options.config ?? getConfig()
  const targetDate = parseDate(date)
  const referenceDate = options.from ? parseDate(options.from) : new Date()

  const diffSeconds = differenceInSeconds(targetDate, referenceDate)
  const absDiff = Math.abs(diffSeconds)
  const isFuture = diffSeconds > 0
  const thresholds = config.relative.thresholds

  // Just now
  if (absDiff < thresholds.justNow) {
    return config.relative.justNow
  }

  // Seconds
  if (absDiff < thresholds.seconds) {
    return isFuture
      ? config.relative.inSeconds(absDiff)
      : config.relative.secondsAgo(absDiff)
  }

  // Minutes
  if (absDiff < thresholds.minutes) {
    const minutes = Math.floor(absDiff / 60)
    return isFuture
      ? config.relative.inMinutes(minutes)
      : config.relative.minutesAgo(minutes)
  }

  // Hours
  if (absDiff < thresholds.hours) {
    const hours = Math.floor(absDiff / 3600)
    return isFuture
      ? config.relative.inHours(hours)
      : config.relative.hoursAgo(hours)
  }

  // Days (check for yesterday/tomorrow)
  if (absDiff < thresholds.days) {
    const days = Math.floor(absDiff / 86400)

    if (days === 1 || (days === 0 && absDiff >= 86400 - 3600)) {
      // Check if it's actually yesterday/tomorrow
      const targetDay = targetDate.getDate()
      const refDay = referenceDate.getDate()

      if (targetDay !== refDay) {
        return isFuture ? config.relative.tomorrow : config.relative.yesterday
      }
    }

    return isFuture
      ? config.relative.inDays(days || 1)
      : config.relative.daysAgo(days || 1)
  }

  // Weeks
  if (absDiff < thresholds.weeks) {
    const weeks = Math.floor(absDiff / (7 * 86400))
    return isFuture
      ? config.relative.inWeeks(weeks || 1)
      : config.relative.weeksAgo(weeks || 1)
  }

  // Months
  if (absDiff < thresholds.months) {
    const months = Math.floor(absDiff / (30 * 86400))
    return isFuture
      ? config.relative.inMonths(months || 1)
      : config.relative.monthsAgo(months || 1)
  }

  // Years
  const years = Math.floor(absDiff / (365 * 86400))
  return isFuture
    ? config.relative.inYears(years || 1)
    : config.relative.yearsAgo(years || 1)
}

/**
 * Get relative time from now (alias for relative)
 */
export function fromNow(
  date: DateInput,
  config: WhennyConfig = getConfig()
): string {
  return relative(date, { config })
}

/**
 * Get relative time from another date
 */
export function from(
  date: DateInput,
  referenceDate: DateInput,
  config: WhennyConfig = getConfig()
): string {
  return relative(date, { from: referenceDate, config })
}

/**
 * Get relative time between two dates as a description
 * Used for comparisons like "3 days before"
 */
export function relativeDescription(
  seconds: number,
  config: WhennyConfig = getConfig()
): string {
  const absDiff = Math.abs(seconds)
  const thresholds = config.relative.thresholds

  if (absDiff < thresholds.justNow) {
    return config.relative.justNow
  }

  if (absDiff < thresholds.seconds) {
    return `${absDiff} second${absDiff === 1 ? '' : 's'}`
  }

  if (absDiff < thresholds.minutes) {
    const minutes = Math.floor(absDiff / 60)
    return `${minutes} minute${minutes === 1 ? '' : 's'}`
  }

  if (absDiff < thresholds.hours) {
    const hours = Math.floor(absDiff / 3600)
    return `${hours} hour${hours === 1 ? '' : 's'}`
  }

  if (absDiff < thresholds.days) {
    const days = Math.floor(absDiff / 86400)
    return `${days || 1} day${(days || 1) === 1 ? '' : 's'}`
  }

  if (absDiff < thresholds.weeks) {
    const weeks = Math.floor(absDiff / (7 * 86400))
    return `${weeks || 1} week${(weeks || 1) === 1 ? '' : 's'}`
  }

  if (absDiff < thresholds.months) {
    const months = Math.floor(absDiff / (30 * 86400))
    return `${months || 1} month${(months || 1) === 1 ? '' : 's'}`
  }

  const years = Math.floor(absDiff / (365 * 86400))
  return `${years || 1} year${(years || 1) === 1 ? '' : 's'}`
}
