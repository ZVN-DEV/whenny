/**
 * Whenny Themes
 *
 * Pre-built configuration themes for common use cases.
 * Import and use directly, or extend with your own overrides.
 *
 * @example
 * ```typescript
 * import { casual } from 'whenny/themes'
 * import { defineConfig } from 'whenny/config'
 *
 * export default defineConfig({
 *   ...casual,
 *   relative: {
 *     ...casual.relative,
 *     justNow: 'right now',
 *   },
 * })
 * ```
 */

import type { WhennyConfig } from '../types'
import { defaultConfig } from '../config/defaults'

// ============================================================================
// CASUAL THEME (Default)
// ============================================================================

/**
 * Casual, friendly formatting
 *
 * Examples:
 * - "just now", "5 minutes ago", "yesterday", "Jan 15"
 */
export const casual: WhennyConfig = { ...defaultConfig }

// ============================================================================
// FORMAL THEME
// ============================================================================

/**
 * Professional, formal formatting
 *
 * Examples:
 * - "a moment ago", "5 minutes ago", "yesterday at 3:45 PM", "January 15, 2024"
 */
export const formal: WhennyConfig = {
  ...defaultConfig,
  relative: {
    ...defaultConfig.relative,
    justNow: 'a moment ago',
    secondsAgo: (n) => `${n} second${n === 1 ? '' : 's'} ago`,
    minutesAgo: (n) => `${n} minute${n === 1 ? '' : 's'} ago`,
    hoursAgo: (n) => `${n} hour${n === 1 ? '' : 's'} ago`,
    yesterday: 'yesterday',
    daysAgo: (n) => `${n} day${n === 1 ? '' : 's'} ago`,
    weeksAgo: (n) => `${n} week${n === 1 ? '' : 's'} ago`,
    monthsAgo: (n) => `${n} month${n === 1 ? '' : 's'} ago`,
    yearsAgo: (n) => `${n} year${n === 1 ? '' : 's'} ago`,
    inSeconds: (n) => `in ${n} second${n === 1 ? '' : 's'}`,
    inMinutes: (n) => `in ${n} minute${n === 1 ? '' : 's'}`,
    inHours: (n) => `in ${n} hour${n === 1 ? '' : 's'}`,
    tomorrow: 'tomorrow',
    inDays: (n) => `in ${n} day${n === 1 ? '' : 's'}`,
    inWeeks: (n) => `in ${n} week${n === 1 ? '' : 's'}`,
    inMonths: (n) => `in ${n} month${n === 1 ? '' : 's'}`,
    inYears: (n) => `in ${n} year${n === 1 ? '' : 's'}`,
  },
  smart: {
    buckets: [
      { within: 'minute', show: '[a moment ago]' },
      { within: 'hour', show: 'relative' },
      { within: 'today', show: '[today at] h:mm A' },
      { within: 'yesterday', show: '[yesterday at] h:mm A' },
      { within: 'week', show: 'dddd [at] h:mm A' },
      { within: 'year', show: 'MMMM Do' },
      { older: true, show: 'MMMM Do, YYYY' },
    ],
  },
  formats: {
    ...defaultConfig.formats,
    presets: {
      short: 'MMM Do',
      long: 'MMMM Do, YYYY',
      iso: 'YYYY-MM-DD[T]HH:mm:ss[Z]',
      time: 'h:mm A',
      datetime: 'MMMM Do [at] h:mm A',
    },
  },
  styles: {
    ...defaultConfig.styles,
    xs: 'D/M',
    sm: 'Do MMM',
    md: 'Do MMM, YYYY',
    lg: 'Do MMMM, YYYY',
    xl: 'dddd, Do MMMM, YYYY',
  },
}

// ============================================================================
// SLACK THEME
// ============================================================================

/**
 * Slack-style formatting
 *
 * Examples:
 * - "just now", "5 min", "yesterday", "Jan 15th at 3:45 PM"
 */
export const slack: WhennyConfig = {
  ...defaultConfig,
  relative: {
    ...defaultConfig.relative,
    justNow: 'just now',
    secondsAgo: () => 'just now',
    minutesAgo: (n) => `${n} min`,
    hoursAgo: (n) => `${n} hr`,
    yesterday: 'yesterday',
    daysAgo: (n) => `${n}d`,
    weeksAgo: (n) => `${n}w`,
    monthsAgo: (n) => `${n}mo`,
    yearsAgo: (n) => `${n}y`,
    inSeconds: () => 'soon',
    inMinutes: (n) => `in ${n} min`,
    inHours: (n) => `in ${n} hr`,
    tomorrow: 'tomorrow',
    inDays: (n) => `in ${n}d`,
    inWeeks: (n) => `in ${n}w`,
    inMonths: (n) => `in ${n}mo`,
    inYears: (n) => `in ${n}y`,
  },
  smart: {
    buckets: [
      { within: 'minute', show: '[just now]' },
      { within: 'hour', show: 'relative' },
      { within: 'today', show: 'h:mm A' },
      { within: 'yesterday', show: '[Yesterday at] h:mm A' },
      { within: 'week', show: 'dddd' },
      { within: 'year', show: 'MMM Do [at] h:mm A' },
      { older: true, show: 'MMM Do, YYYY' },
    ],
  },
}

// ============================================================================
// TWITTER THEME
// ============================================================================

/**
 * Twitter/X-style ultra-compact formatting
 *
 * Examples:
 * - "now", "5m", "1h", "Jan 15"
 */
export const twitter: WhennyConfig = {
  ...defaultConfig,
  relative: {
    ...defaultConfig.relative,
    justNow: 'now',
    secondsAgo: () => 'now',
    minutesAgo: (n) => `${n}m`,
    hoursAgo: (n) => `${n}h`,
    yesterday: '1d',
    daysAgo: (n) => `${n}d`,
    weeksAgo: (n) => `${n}w`,
    monthsAgo: (n) => `${n}mo`,
    yearsAgo: (n) => `${n}y`,
    inSeconds: () => 'now',
    inMinutes: (n) => `${n}m`,
    inHours: (n) => `${n}h`,
    tomorrow: '1d',
    inDays: (n) => `${n}d`,
    inWeeks: (n) => `${n}w`,
    inMonths: (n) => `${n}mo`,
    inYears: (n) => `${n}y`,
  },
  smart: {
    buckets: [
      { within: 'minute', show: '[now]' },
      { within: 'hour', show: 'relative' },
      { within: 'today', show: 'relative' },
      { within: 'week', show: 'relative' },
      { within: 'year', show: 'MMM D' },
      { older: true, show: 'MMM D, YYYY' },
    ],
  },
}

// ============================================================================
// MINIMAL THEME
// ============================================================================

/**
 * Minimal, clean formatting
 *
 * Examples:
 * - "now", "5m ago", "1d ago", "Jan 15"
 */
export const minimal: WhennyConfig = {
  ...defaultConfig,
  relative: {
    ...defaultConfig.relative,
    justNow: 'now',
    secondsAgo: (n) => `${n}s ago`,
    minutesAgo: (n) => `${n}m ago`,
    hoursAgo: (n) => `${n}h ago`,
    yesterday: '1d ago',
    daysAgo: (n) => `${n}d ago`,
    weeksAgo: (n) => `${n}w ago`,
    monthsAgo: (n) => `${n}mo ago`,
    yearsAgo: (n) => `${n}y ago`,
    inSeconds: (n) => `in ${n}s`,
    inMinutes: (n) => `in ${n}m`,
    inHours: (n) => `in ${n}h`,
    tomorrow: 'in 1d',
    inDays: (n) => `in ${n}d`,
    inWeeks: (n) => `in ${n}w`,
    inMonths: (n) => `in ${n}mo`,
    inYears: (n) => `in ${n}y`,
  },
  smart: {
    buckets: [
      { within: 'minute', show: '[now]' },
      { within: 'hour', show: 'relative' },
      { within: 'today', show: 'relative' },
      { within: 'week', show: 'relative' },
      { within: 'year', show: 'MMM D' },
      { older: true, show: 'MMM D, YY' },
    ],
  },
}

// ============================================================================
// TECHNICAL THEME
// ============================================================================

/**
 * Technical, precise formatting - always ISO 8601
 *
 * Examples:
 * - "2024-01-15T15:45:00Z"
 */
export const technical: WhennyConfig = {
  ...defaultConfig,
  relative: {
    ...defaultConfig.relative,
    justNow: 'now',
    secondsAgo: (n) => `-${n}s`,
    minutesAgo: (n) => `-${n}m`,
    hoursAgo: (n) => `-${n}h`,
    yesterday: '-1d',
    daysAgo: (n) => `-${n}d`,
    weeksAgo: (n) => `-${n}w`,
    monthsAgo: (n) => `-${n}mo`,
    yearsAgo: (n) => `-${n}y`,
    inSeconds: (n) => `+${n}s`,
    inMinutes: (n) => `+${n}m`,
    inHours: (n) => `+${n}h`,
    tomorrow: '+1d',
    inDays: (n) => `+${n}d`,
    inWeeks: (n) => `+${n}w`,
    inMonths: (n) => `+${n}mo`,
    inYears: (n) => `+${n}y`,
  },
  smart: {
    buckets: [{ older: true, show: 'YYYY-MM-DD[T]HH:mm:ss[Z]' }],
  },
  formats: {
    ...defaultConfig.formats,
    presets: {
      short: 'YYYY-MM-DD',
      long: 'YYYY-MM-DD[T]HH:mm:ss[Z]',
      iso: 'YYYY-MM-DD[T]HH:mm:ss[Z]',
      time: 'HH:mm:ss',
      datetime: 'YYYY-MM-DD HH:mm:ss',
    },
    hour12: false,
  },
  styles: {
    ...defaultConfig.styles,
    xs: 'YYMMDD',
    sm: 'YYYY-MM-DD',
    md: 'YYYY-MM-DD HH:mm',
    lg: 'YYYY-MM-DD HH:mm:ss',
    xl: 'YYYY-MM-DD[T]HH:mm:ss[Z]',
    time: 'HH:mm:ss',
  },
}

// ============================================================================
// DISCORD THEME
// ============================================================================

/**
 * Discord-style formatting
 *
 * Examples:
 * - "Today at 3:45 PM", "Yesterday at 3:45 PM", "01/15/2024 3:45 PM"
 */
export const discord: WhennyConfig = {
  ...defaultConfig,
  relative: {
    ...defaultConfig.relative,
    justNow: 'just now',
    secondsAgo: () => 'just now',
    minutesAgo: (n) => `${n} minute${n === 1 ? '' : 's'} ago`,
    hoursAgo: (n) => `${n} hour${n === 1 ? '' : 's'} ago`,
    yesterday: 'Yesterday',
    daysAgo: (n) => `${n} day${n === 1 ? '' : 's'} ago`,
  },
  smart: {
    buckets: [
      { within: 'minute', show: '[just now]' },
      { within: 'hour', show: 'relative' },
      { within: 'today', show: '[Today at] h:mm A' },
      { within: 'yesterday', show: '[Yesterday at] h:mm A' },
      { older: true, show: 'MM/DD/YYYY h:mm A' },
    ],
  },
}

// ============================================================================
// GITHUB THEME
// ============================================================================

/**
 * GitHub-style formatting
 *
 * Examples:
 * - "now", "2 minutes ago", "3 hours ago", "yesterday", "on Jan 15, 2024"
 */
export const github: WhennyConfig = {
  ...defaultConfig,
  relative: {
    ...defaultConfig.relative,
    justNow: 'now',
    secondsAgo: () => 'now',
    minutesAgo: (n) => (n === 1 ? '1 minute ago' : `${n} minutes ago`),
    hoursAgo: (n) => (n === 1 ? '1 hour ago' : `${n} hours ago`),
    yesterday: 'yesterday',
    daysAgo: (n) => (n === 1 ? 'yesterday' : `${n} days ago`),
    weeksAgo: (n) => `${n} week${n === 1 ? '' : 's'} ago`,
    monthsAgo: (n) => `${n} month${n === 1 ? '' : 's'} ago`,
    yearsAgo: (n) => `${n} year${n === 1 ? '' : 's'} ago`,
  },
  smart: {
    buckets: [
      { within: 'minute', show: '[now]' },
      { within: 'hour', show: 'relative' },
      { within: 'today', show: 'relative' },
      { within: 'month', show: 'relative' },
      { older: true, show: '[on] MMM D, YYYY' },
    ],
  },
}
