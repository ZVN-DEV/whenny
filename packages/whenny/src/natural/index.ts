/**
 * Whenny Natural Language Parsing
 *
 * Parse human-friendly date expressions like "next tuesday at 3pm"
 * or "in 2 weeks".
 *
 * Features:
 * - Relative time: "in 5 minutes", "2 hours ago"
 * - Named days: "next tuesday", "last friday"
 * - Semantic: "end of month", "start of year"
 * - Time expressions: "tomorrow at 3pm", "friday morning"
 * - Safe recursion with depth limits
 */

import type { WhennyConfig, Timezone, TimeUnit } from '../types'
import { getConfig } from '../config'
import {
  addTime,
  startOfDay,
  startOfWeek,
  startOfMonth,
  endOfMonth,
  startOfYear,
  endOfYear,
} from '../core/utils'
import {
  WhennyError,
  MAX_INPUT_LENGTH,
  MAX_PARSE_DEPTH,
} from '../errors'

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

export interface ParseOptions {
  /** Timezone for the result (default: local) */
  timezone?: Timezone
  /** Reference date (default: now) */
  from?: Date
  /** Config override */
  config?: WhennyConfig
}

export interface ParseResult {
  /** The parsed date */
  date: Date
  /** Whether the interpretation is unambiguous */
  confident: boolean
  /** The input that was matched */
  matched: string
}

/** Internal options with depth tracking */
interface InternalParseOptions extends ParseOptions {
  /** Current recursion depth (internal use only) */
  _depth?: number
}

// ─────────────────────────────────────────────────────────────────────────────
// Valid time units for type-safe matching
// ─────────────────────────────────────────────────────────────────────────────

const VALID_TIME_UNITS: ReadonlySet<string> = new Set([
  'second', 'minute', 'hour', 'day', 'week', 'month', 'year',
])

const WEEKDAYS: readonly string[] = [
  'sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday',
]

const TIME_OF_DAY_HOURS: Record<string, number> = {
  morning: 9,
  afternoon: 14,
  evening: 18,
  night: 21,
}

// ─────────────────────────────────────────────────────────────────────────────
// Main API
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Parse a natural language date expression.
 *
 * @example
 * ```typescript
 * parse('tomorrow')           // Tomorrow at midnight
 * parse('next tuesday')       // Coming Tuesday
 * parse('in 2 weeks')         // 2 weeks from now
 * parse('tomorrow at 3pm')    // Tomorrow at 3:00 PM
 * parse('end of month')       // Last day of current month
 * ```
 *
 * @returns The parsed Date, or null if the input couldn't be parsed.
 */
export function parse(
  input: string,
  options: ParseOptions = {}
): Date | null {
  const result = parseWithInfo(input, options)
  return result?.date ?? null
}

/**
 * Parse with additional information about the match.
 *
 * @example
 * ```typescript
 * const result = parseWithInfo('next friday')
 * // { date: Date, confident: true, matched: 'next friday' }
 * ```
 */
export function parseWithInfo(
  input: string,
  options: ParseOptions = {}
): ParseResult | null {
  // Validate input
  if (typeof input !== 'string') {
    return null
  }

  const trimmed = input.trim()
  if (trimmed === '') {
    return null
  }

  // Check input length for security
  if (trimmed.length > MAX_INPUT_LENGTH) {
    throw new WhennyError(
      'INPUT_TOO_LONG',
      `Input exceeds maximum length of ${MAX_INPUT_LENGTH} characters`,
      {
        input: `${trimmed.slice(0, 50)}...`,
        received: `${trimmed.length} characters`,
        operation: 'natural.parse',
      }
    )
  }

  // Check recursion depth
  const internalOpts = options as InternalParseOptions
  const depth = internalOpts._depth ?? 0
  if (depth > MAX_PARSE_DEPTH) {
    throw new WhennyError(
      'PARSE_DEPTH_EXCEEDED',
      'Maximum parsing depth exceeded - input may be too complex',
      {
        input: trimmed.slice(0, 100),
        depth,
        maxDepth: MAX_PARSE_DEPTH,
        operation: 'natural.parse',
      }
    )
  }

  const config = options.config ?? getConfig()
  const reference = options.from ?? new Date()
  const normalized = trimmed.toLowerCase()

  // Try each parser in order of specificity
  const parsers: Parser[] = [
    parseRelativeTime,
    parseRelativeDate,
    parseNamedDay,
    parseSemanticDate,
    parseTimeExpression,
  ]

  for (const parser of parsers) {
    const result = parser(normalized, reference, config, depth)
    if (result) {
      return result
    }
  }

  return null
}

// ─────────────────────────────────────────────────────────────────────────────
// Parser Types
// ─────────────────────────────────────────────────────────────────────────────

type Parser = (
  input: string,
  reference: Date,
  config: WhennyConfig,
  depth: number
) => ParseResult | null

// ─────────────────────────────────────────────────────────────────────────────
// Parsers
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Parse relative time expressions: "in 5 minutes", "2 hours ago"
 */
function parseRelativeTime(
  input: string,
  reference: Date,
  _config: WhennyConfig,
  _depth: number
): ParseResult | null {
  // "in X minutes/hours/days/weeks/months/years"
  const inMatch = input.match(
    /^in\s+(\d+)\s+(second|minute|hour|day|week|month|year)s?$/i
  )
  if (inMatch) {
    const amount = parseInt(inMatch[1], 10)
    const unit = inMatch[2].toLowerCase()

    // Type-safe validation
    if (!isValidTimeUnit(unit)) {
      return null
    }

    const date = addTime(reference, amount, unit)
    return { date, confident: true, matched: input }
  }

  // "X minutes/hours ago"
  const agoMatch = input.match(
    /^(\d+)\s+(second|minute|hour|day|week|month|year)s?\s+ago$/i
  )
  if (agoMatch) {
    const amount = parseInt(agoMatch[1], 10)
    const unit = agoMatch[2].toLowerCase()

    if (!isValidTimeUnit(unit)) {
      return null
    }

    const date = addTime(reference, -amount, unit)
    return { date, confident: true, matched: input }
  }

  // "a few seconds/minutes ago"
  const fewMatch = input.match(
    /^a\s+few\s+(second|minute|hour)s?\s+ago$/i
  )
  if (fewMatch) {
    const unit = fewMatch[1].toLowerCase()
    if (!isValidTimeUnit(unit)) {
      return null
    }
    // "A few" = approximately 3
    const date = addTime(reference, -3, unit)
    return { date, confident: false, matched: input }
  }

  return null
}

/**
 * Parse relative date expressions: "today", "tomorrow", "yesterday"
 */
function parseRelativeDate(
  input: string,
  reference: Date,
  _config: WhennyConfig,
  _depth: number
): ParseResult | null {
  switch (input) {
    case 'now':
      return { date: new Date(reference), confident: true, matched: input }

    case 'today':
      return { date: startOfDay(reference), confident: true, matched: input }

    case 'tomorrow':
      return {
        date: startOfDay(addTime(reference, 1, 'day')),
        confident: true,
        matched: input,
      }

    case 'yesterday':
      return {
        date: startOfDay(addTime(reference, -1, 'day')),
        confident: true,
        matched: input,
      }

    case 'next week':
      return {
        date: startOfWeek(addTime(reference, 7, 'day')),
        confident: true,
        matched: input,
      }

    case 'last week':
      return {
        date: startOfWeek(addTime(reference, -7, 'day')),
        confident: true,
        matched: input,
      }

    case 'next month':
      return {
        date: startOfMonth(addTime(reference, 1, 'month')),
        confident: true,
        matched: input,
      }

    case 'last month':
      return {
        date: startOfMonth(addTime(reference, -1, 'month')),
        confident: true,
        matched: input,
      }

    case 'next year':
      return {
        date: startOfYear(addTime(reference, 1, 'year')),
        confident: true,
        matched: input,
      }

    case 'last year':
      return {
        date: startOfYear(addTime(reference, -1, 'year')),
        confident: true,
        matched: input,
      }

    default:
      return null
  }
}

/**
 * Parse named day expressions: "next tuesday", "this friday"
 */
function parseNamedDay(
  input: string,
  reference: Date,
  _config: WhennyConfig,
  _depth: number
): ParseResult | null {
  // "next <day>"
  const nextMatch = input.match(
    /^next\s+(sunday|monday|tuesday|wednesday|thursday|friday|saturday)$/i
  )
  if (nextMatch) {
    const targetDay = WEEKDAYS.indexOf(nextMatch[1].toLowerCase())
    if (targetDay === -1) return null

    const currentDay = reference.getDay()
    let daysUntil = targetDay - currentDay
    if (daysUntil <= 0) daysUntil += 7

    const date = startOfDay(addTime(reference, daysUntil, 'day'))
    return { date, confident: true, matched: input }
  }

  // "last <day>"
  const lastMatch = input.match(
    /^last\s+(sunday|monday|tuesday|wednesday|thursday|friday|saturday)$/i
  )
  if (lastMatch) {
    const targetDay = WEEKDAYS.indexOf(lastMatch[1].toLowerCase())
    if (targetDay === -1) return null

    const currentDay = reference.getDay()
    let daysSince = currentDay - targetDay
    if (daysSince <= 0) daysSince += 7

    const date = startOfDay(addTime(reference, -daysSince, 'day'))
    return { date, confident: true, matched: input }
  }

  // "this <day>"
  const thisMatch = input.match(
    /^this\s+(sunday|monday|tuesday|wednesday|thursday|friday|saturday)$/i
  )
  if (thisMatch) {
    const targetDay = WEEKDAYS.indexOf(thisMatch[1].toLowerCase())
    if (targetDay === -1) return null

    const currentDay = reference.getDay()
    const daysUntil = targetDay - currentDay
    // "this tuesday" when it's wednesday means this week (could be past)
    const date = startOfDay(addTime(reference, daysUntil, 'day'))
    return { date, confident: true, matched: input }
  }

  // Just the day name (interpret as "next")
  const dayOnly = WEEKDAYS.indexOf(input)
  if (dayOnly !== -1) {
    const currentDay = reference.getDay()
    let daysUntil = dayOnly - currentDay
    if (daysUntil <= 0) daysUntil += 7

    const date = startOfDay(addTime(reference, daysUntil, 'day'))
    return { date, confident: false, matched: input }
  }

  return null
}

/**
 * Parse semantic date expressions: "end of month", "start of year"
 */
function parseSemanticDate(
  input: string,
  reference: Date,
  config: WhennyConfig,
  _depth: number
): ParseResult | null {
  switch (input) {
    case 'end of day':
    case 'tonight': {
      const tonight = new Date(reference)
      // Safely get night hour with fallback
      const nightHour = getTimeOfDayHour('night', config)
      tonight.setHours(nightHour, 0, 0, 0)
      return { date: tonight, confident: true, matched: input }
    }

    case 'end of week': {
      const endWeek = addTime(startOfWeek(reference), 6, 'day')
      return { date: endWeek, confident: true, matched: input }
    }

    case 'end of month':
      return { date: endOfMonth(reference), confident: true, matched: input }

    case 'end of year':
      return { date: endOfYear(reference), confident: true, matched: input }

    case 'start of week':
    case 'beginning of week':
      return { date: startOfWeek(reference), confident: true, matched: input }

    case 'start of month':
    case 'beginning of month':
      return { date: startOfMonth(reference), confident: true, matched: input }

    case 'start of year':
    case 'beginning of year':
      return { date: startOfYear(reference), confident: true, matched: input }

    case 'beginning of next month':
    case 'start of next month':
      return {
        date: startOfMonth(addTime(reference, 1, 'month')),
        confident: true,
        matched: input,
      }

    case 'end of next month':
      return {
        date: endOfMonth(addTime(reference, 1, 'month')),
        confident: true,
        matched: input,
      }

    default:
      return null
  }
}

/**
 * Parse time expressions: "tomorrow at 3pm", "next friday at 10:30"
 */
function parseTimeExpression(
  input: string,
  reference: Date,
  config: WhennyConfig,
  depth: number
): ParseResult | null {
  // Match "X at Y" patterns (with recursion depth tracking)
  const atMatch = input.match(
    /^(.+?)\s+at\s+(\d{1,2})(?::(\d{2}))?\s*(am|pm)?$/i
  )
  if (atMatch) {
    // Recursively parse the date part with depth tracking
    const datePartResult = parseWithInfo(atMatch[1], {
      from: reference,
      config,
      _depth: depth + 1,
    } as InternalParseOptions)

    if (!datePartResult) return null

    let hours = parseInt(atMatch[2], 10)
    const minutes = atMatch[3] ? parseInt(atMatch[3], 10) : 0
    const ampm = atMatch[4]?.toLowerCase()

    // Validate hours and minutes
    if (hours < 0 || hours > 23 || minutes < 0 || minutes > 59) {
      return null
    }

    // Handle 12-hour format
    if (ampm === 'pm' && hours !== 12) hours += 12
    if (ampm === 'am' && hours === 12) hours = 0

    // If no AM/PM specified and hour is 1-7, assume PM (common convention)
    if (!ampm && hours >= 1 && hours <= 7) {
      hours += 12
    }

    const date = new Date(datePartResult.date)
    date.setHours(hours, minutes, 0, 0)

    return { date, confident: true, matched: input }
  }

  // "tomorrow morning", "tomorrow afternoon", etc.
  const timeOfDayMatch = input.match(
    /^(.+?)\s+(morning|afternoon|evening|night)$/i
  )
  if (timeOfDayMatch) {
    const datePartResult = parseWithInfo(timeOfDayMatch[1], {
      from: reference,
      config,
      _depth: depth + 1,
    } as InternalParseOptions)

    if (!datePartResult) return null

    const timeOfDay = timeOfDayMatch[2].toLowerCase()
    const hour = getTimeOfDayHour(timeOfDay, config)

    const date = new Date(datePartResult.date)
    date.setHours(hour, 0, 0, 0)

    return { date, confident: true, matched: input }
  }

  return null
}

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Type guard for valid time units.
 */
function isValidTimeUnit(unit: string): unit is TimeUnit {
  return VALID_TIME_UNITS.has(unit)
}

/**
 * Safely get hour for time of day with fallback.
 */
function getTimeOfDayHour(timeOfDay: string, config: WhennyConfig): number {
  // Check config first
  const configNatural = config.natural as unknown as Record<string, unknown> | undefined
  if (configNatural && typeof configNatural[timeOfDay] === 'number') {
    return configNatural[timeOfDay] as number
  }

  // Fallback to defaults
  return TIME_OF_DAY_HOURS[timeOfDay] ?? 12
}

// ─────────────────────────────────────────────────────────────────────────────
// Utility Functions
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Check if a string can be parsed as a natural language date.
 *
 * @example
 * ```typescript
 * canParse('tomorrow')      // true
 * canParse('asdfghjkl')     // false
 * ```
 */
export function canParse(input: string): boolean {
  try {
    return parse(input) !== null
  } catch {
    return false
  }
}

/**
 * Get all possible interpretations of an ambiguous expression.
 *
 * @example
 * ```typescript
 * suggest('friday')  // [Date] - returns next Friday
 * ```
 */
export function suggest(input: string, options: ParseOptions = {}): Date[] {
  try {
    const result = parse(input, options)
    if (!result) return []
    // Could be extended to return multiple possibilities for ambiguous inputs
    return [result]
  } catch {
    return []
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Namespace Export
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Natural language parsing namespace.
 *
 * @example
 * ```typescript
 * import { natural } from 'whenny/natural'
 *
 * natural.parse('tomorrow')
 * natural.canParse('next friday')
 * ```
 */
export const natural = {
  parse,
  parseWithInfo,
  canParse,
  suggest,
}
