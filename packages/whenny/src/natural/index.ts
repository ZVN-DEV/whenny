/**
 * Whenny Natural Language Parsing
 *
 * Parse human-friendly date expressions like "next tuesday at 3pm"
 * or "in 2 weeks".
 */

import type { WhennyConfig, Timezone } from '../types'
import { getConfig } from '../config'
import {
  addTime,
  startOfDay,
  startOfWeek,
  startOfMonth,
  endOfMonth,
  startOfYear,
  endOfYear,
  getTimezoneOffset,
} from '../core/utils'

interface ParseOptions {
  /** Timezone for the result (default: local) */
  timezone?: Timezone
  /** Reference date (default: now) */
  from?: Date
  /** Config override */
  config?: WhennyConfig
}

interface ParseResult {
  date: Date
  confident: boolean
  matched: string
}

/**
 * Parse a natural language date expression
 *
 * @example
 * ```typescript
 * parse('tomorrow')           // Tomorrow at midnight
 * parse('next tuesday')       // Coming Tuesday
 * parse('in 2 weeks')         // 2 weeks from now
 * parse('tomorrow at 3pm')    // Tomorrow at 3:00 PM
 * parse('end of month')       // Last day of current month
 * ```
 */
export function parse(
  input: string,
  options: ParseOptions = {}
): Date | null {
  const result = parseWithInfo(input, options)
  return result?.date ?? null
}

/**
 * Parse with additional information about the match
 */
export function parseWithInfo(
  input: string,
  options: ParseOptions = {}
): ParseResult | null {
  const config = options.config ?? getConfig()
  const reference = options.from ?? new Date()
  const normalized = input.toLowerCase().trim()

  // Try each parser in order
  const parsers = [
    parseRelativeTime,
    parseRelativeDate,
    parseNamedDay,
    parseSemanticDate,
    parseTimeExpression,
  ]

  for (const parser of parsers) {
    const result = parser(normalized, reference, config)
    if (result) {
      return result
    }
  }

  return null
}

// ============================================================================
// PARSERS
// ============================================================================

/**
 * Parse relative time expressions: "in 5 minutes", "in 2 hours"
 */
function parseRelativeTime(
  input: string,
  reference: Date,
  config: WhennyConfig
): ParseResult | null {
  // "in X minutes/hours/days/weeks/months/years"
  const inMatch = input.match(/^in\s+(\d+)\s+(second|minute|hour|day|week|month|year)s?$/i)
  if (inMatch) {
    const amount = parseInt(inMatch[1], 10)
    const unit = inMatch[2].toLowerCase()
    const date = addTime(reference, amount, unit as any)
    return { date, confident: true, matched: input }
  }

  // "X minutes/hours ago"
  const agoMatch = input.match(/^(\d+)\s+(second|minute|hour|day|week|month|year)s?\s+ago$/i)
  if (agoMatch) {
    const amount = parseInt(agoMatch[1], 10)
    const unit = agoMatch[2].toLowerCase()
    const date = addTime(reference, -amount, unit as any)
    return { date, confident: true, matched: input }
  }

  return null
}

/**
 * Parse relative date expressions: "today", "tomorrow", "yesterday"
 */
function parseRelativeDate(
  input: string,
  reference: Date,
  config: WhennyConfig
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
  }

  return null
}

/**
 * Parse named day expressions: "next tuesday", "this friday"
 */
function parseNamedDay(
  input: string,
  reference: Date,
  config: WhennyConfig
): ParseResult | null {
  const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']

  // "next <day>"
  const nextMatch = input.match(/^next\s+(sunday|monday|tuesday|wednesday|thursday|friday|saturday)$/i)
  if (nextMatch) {
    const targetDay = days.indexOf(nextMatch[1].toLowerCase())
    const currentDay = reference.getDay()
    let daysUntil = targetDay - currentDay
    if (daysUntil <= 0) daysUntil += 7
    const date = startOfDay(addTime(reference, daysUntil, 'day'))
    return { date, confident: true, matched: input }
  }

  // "last <day>"
  const lastMatch = input.match(/^last\s+(sunday|monday|tuesday|wednesday|thursday|friday|saturday)$/i)
  if (lastMatch) {
    const targetDay = days.indexOf(lastMatch[1].toLowerCase())
    const currentDay = reference.getDay()
    let daysSince = currentDay - targetDay
    if (daysSince <= 0) daysSince += 7
    const date = startOfDay(addTime(reference, -daysSince, 'day'))
    return { date, confident: true, matched: input }
  }

  // "this <day>"
  const thisMatch = input.match(/^this\s+(sunday|monday|tuesday|wednesday|thursday|friday|saturday)$/i)
  if (thisMatch) {
    const targetDay = days.indexOf(thisMatch[1].toLowerCase())
    const currentDay = reference.getDay()
    let daysUntil = targetDay - currentDay
    // "this tuesday" when it's wednesday means go back
    const date = startOfDay(addTime(reference, daysUntil, 'day'))
    return { date, confident: true, matched: input }
  }

  // Just the day name (interpret as "next")
  const dayOnly = days.indexOf(input)
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
  config: WhennyConfig
): ParseResult | null {
  switch (input) {
    case 'end of day':
    case 'tonight':
      const tonight = new Date(reference)
      tonight.setHours(config.natural.night, 0, 0, 0)
      return { date: tonight, confident: true, matched: input }

    case 'end of week':
      const endWeek = addTime(startOfWeek(reference), 6, 'day')
      return { date: endWeek, confident: true, matched: input }

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
  }

  return null
}

/**
 * Parse time expressions: "tomorrow at 3pm", "next friday at 10:30"
 */
function parseTimeExpression(
  input: string,
  reference: Date,
  config: WhennyConfig
): ParseResult | null {
  // Match "X at Y" patterns
  const atMatch = input.match(/^(.+?)\s+at\s+(\d{1,2})(?::(\d{2}))?\s*(am|pm)?$/i)
  if (atMatch) {
    const datePartResult = parseWithInfo(atMatch[1], { from: reference, config })
    if (!datePartResult) return null

    let hours = parseInt(atMatch[2], 10)
    const minutes = atMatch[3] ? parseInt(atMatch[3], 10) : 0
    const ampm = atMatch[4]?.toLowerCase()

    // Handle 12-hour format
    if (ampm === 'pm' && hours !== 12) hours += 12
    if (ampm === 'am' && hours === 12) hours = 0

    // If no AM/PM specified and hour is <= 7, assume PM
    if (!ampm && hours >= 1 && hours <= 7) {
      hours += 12
    }

    const date = new Date(datePartResult.date)
    date.setHours(hours, minutes, 0, 0)

    return { date, confident: true, matched: input }
  }

  // "tomorrow morning", "tomorrow afternoon", etc.
  const timeOfDayMatch = input.match(/^(.+?)\s+(morning|afternoon|evening|night)$/i)
  if (timeOfDayMatch) {
    const datePartResult = parseWithInfo(timeOfDayMatch[1], { from: reference, config })
    if (!datePartResult) return null

    const timeOfDay = timeOfDayMatch[2].toLowerCase() as keyof typeof config.natural
    const hour = config.natural[timeOfDay]

    const date = new Date(datePartResult.date)
    date.setHours(hour, 0, 0, 0)

    return { date, confident: true, matched: input }
  }

  return null
}

/**
 * Check if a string can be parsed as a natural language date
 */
export function canParse(input: string): boolean {
  return parse(input) !== null
}

/**
 * Get all possible interpretations of an ambiguous expression
 */
export function suggest(input: string, options: ParseOptions = {}): Date[] {
  const result = parse(input, options)
  if (!result) return []

  // For now, just return the single interpretation
  // Could be extended to return multiple possibilities
  return [result]
}

// Export namespace for convenient access
export const natural = {
  parse,
  parseWithInfo,
  canParse,
  suggest,
}
