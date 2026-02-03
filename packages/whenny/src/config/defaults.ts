/**
 * Whenny Default Configuration
 *
 * These defaults are used when no user configuration is provided.
 * They represent the "casual" theme - friendly, readable, familiar.
 */

import type { WhennyConfig } from '../types'

export const defaultConfig: WhennyConfig = {
  // ─────────────────────────────────────────────────────────
  // LOCALE & DEFAULTS
  // ─────────────────────────────────────────────────────────

  locale: 'en-US',
  defaultTimezone: 'UTC',

  // ─────────────────────────────────────────────────────────
  // RELATIVE TIME
  // ─────────────────────────────────────────────────────────

  relative: {
    // Past
    justNow: 'just now',
    secondsAgo: (n) => `${n} second${n === 1 ? '' : 's'} ago`,
    minutesAgo: (n) => `${n} minute${n === 1 ? '' : 's'} ago`,
    hoursAgo: (n) => `${n} hour${n === 1 ? '' : 's'} ago`,
    yesterday: 'yesterday',
    daysAgo: (n) => `${n} day${n === 1 ? '' : 's'} ago`,
    weeksAgo: (n) => `${n} week${n === 1 ? '' : 's'} ago`,
    monthsAgo: (n) => `${n} month${n === 1 ? '' : 's'} ago`,
    yearsAgo: (n) => `${n} year${n === 1 ? '' : 's'} ago`,

    // Future
    inSeconds: (n) => `in ${n} second${n === 1 ? '' : 's'}`,
    inMinutes: (n) => `in ${n} minute${n === 1 ? '' : 's'}`,
    inHours: (n) => `in ${n} hour${n === 1 ? '' : 's'}`,
    tomorrow: 'tomorrow',
    inDays: (n) => `in ${n} day${n === 1 ? '' : 's'}`,
    inWeeks: (n) => `in ${n} week${n === 1 ? '' : 's'}`,
    inMonths: (n) => `in ${n} month${n === 1 ? '' : 's'}`,
    inYears: (n) => `in ${n} year${n === 1 ? '' : 's'}`,

    // Thresholds (in seconds)
    thresholds: {
      justNow: 30,        // < 30s = "just now"
      seconds: 60,        // < 60s = "X seconds ago"
      minutes: 3600,      // < 1hr = "X minutes ago"
      hours: 86400,       // < 24hr = "X hours ago"
      days: 604800,       // < 7 days = "X days ago"
      weeks: 2592000,     // < 30 days = "X weeks ago"
      months: 31536000,   // < 365 days = "X months ago"
    },
  },

  // ─────────────────────────────────────────────────────────
  // SMART FORMATTING
  // ─────────────────────────────────────────────────────────

  smart: {
    buckets: [
      { within: 'minute', show: '[just now]' },
      { within: 'hour', show: 'relative' },
      { within: 'today', show: 'h:mm A' },
      { within: 'yesterday', show: '[Yesterday at] h:mm A' },
      { within: 'week', show: 'dddd [at] h:mm A' },
      { within: 'year', show: 'MMM D' },
      { older: true, show: 'MMM D, YYYY' },
    ],
    futureBuckets: [
      { within: 'minute', show: '[now]' },
      { within: 'hour', show: 'relative' },
      { within: 'today', show: '[today at] h:mm A' },
      { within: 'yesterday', show: '[tomorrow at] h:mm A' }, // "yesterday" bucket used for "tomorrow" in future
      { within: 'week', show: 'dddd [at] h:mm A' },
      { within: 'year', show: 'MMM D' },
      { older: true, show: 'MMM D, YYYY' },
    ],
  },

  // ─────────────────────────────────────────────────────────
  // COMPARISON
  // ─────────────────────────────────────────────────────────

  compare: {
    before: '{time} before',
    after: '{time} after',
    apart: '{time} apart',
    simultaneous: 'at the same time',
  },

  // ─────────────────────────────────────────────────────────
  // DURATION
  // ─────────────────────────────────────────────────────────

  duration: {
    long: {
      hours: (n) => `${n} hour${n === 1 ? '' : 's'}`,
      minutes: (n) => `${n} minute${n === 1 ? '' : 's'}`,
      seconds: (n) => `${n} second${n === 1 ? '' : 's'}`,
      separator: ', ',
    },
    compact: {
      hours: (n) => `${n}h`,
      minutes: (n) => `${n}m`,
      seconds: (n) => `${n}s`,
      separator: ' ',
    },
    defaultStyle: 'long',
  },

  // ─────────────────────────────────────────────────────────
  // FORMAT PRESETS
  // ─────────────────────────────────────────────────────────

  formats: {
    presets: {
      short: 'MMM D',
      long: 'MMMM D, YYYY',
      iso: 'YYYY-MM-DD[T]HH:mm:ss[Z]',
      time: 'h:mm A',
      datetime: 'MMM D, h:mm A',
    },
    hour12: true,
  },

  // ─────────────────────────────────────────────────────────
  // CALENDAR
  // ─────────────────────────────────────────────────────────

  calendar: {
    weekStartsOn: 'sunday',
    businessDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
  },

  // ─────────────────────────────────────────────────────────
  // NATURAL LANGUAGE
  // ─────────────────────────────────────────────────────────

  natural: {
    morning: 9,
    afternoon: 14,
    evening: 18,
    night: 21,
  },

  // ─────────────────────────────────────────────────────────
  // SERVER
  // ─────────────────────────────────────────────────────────

  server: {
    requireTimezone: true,
    fallbackFormat: 'iso',
    warnOnMissingTimezone: true,
  },

  // ─────────────────────────────────────────────────────────
  // PERSONALITY
  // ─────────────────────────────────────────────────────────

  personality: {
    enabled: false,
    messages: {},
  },
}
