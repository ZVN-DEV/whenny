/**
 * Whenny Error System
 *
 * Rich, contextual errors that help developers understand what went wrong
 * and how to fix it. Every error includes:
 * - A clear message explaining the problem
 * - Context about what was being attempted
 * - Hints for how to resolve the issue
 * - A unique error code for documentation lookup
 */

export type WhennyErrorCode =
  | 'INVALID_DATE'
  | 'INVALID_DATE_STRING'
  | 'INVALID_TIMESTAMP'
  | 'INVALID_TIMEZONE'
  | 'INVALID_TRANSFER_PAYLOAD'
  | 'INVALID_TIME_UNIT'
  | 'INVALID_CONFIG'
  | 'INVALID_LOCALE'
  | 'PARSE_FAILED'
  | 'PARSE_DEPTH_EXCEEDED'
  | 'INPUT_TOO_LONG'
  | 'MISSING_TIMEZONE_CONTEXT'

export interface WhennyErrorContext {
  /** The input that caused the error */
  input?: unknown
  /** What operation was being attempted */
  operation?: string
  /** Expected format or type */
  expected?: string
  /** What was actually received */
  received?: string
  /** Supported values or formats */
  supported?: string[]
  /** Additional context for debugging */
  [key: string]: unknown
}

/**
 * Custom error class for Whenny with rich context and helpful hints.
 *
 * @example
 * ```typescript
 * throw new WhennyError(
 *   'INVALID_DATE_STRING',
 *   'Unable to parse date string',
 *   {
 *     input: 'not-a-date',
 *     supported: ['ISO 8601', 'YYYY-MM-DD', 'Unix timestamp'],
 *   }
 * )
 * ```
 */
export class WhennyError extends Error {
  /** Unique error code for documentation lookup */
  readonly code: WhennyErrorCode

  /** Rich context about what went wrong */
  readonly context: WhennyErrorContext

  /** Helpful hints for resolving the issue */
  readonly hints: string[]

  /** Documentation URL for this error */
  readonly docsUrl: string

  constructor(
    code: WhennyErrorCode,
    message: string,
    context: WhennyErrorContext = {},
    hints: string[] = []
  ) {
    // Build a helpful message with context
    const fullMessage = buildErrorMessage(code, message, context, hints)
    super(fullMessage)

    this.name = 'WhennyError'
    this.code = code
    this.context = context
    this.hints = hints.length > 0 ? hints : getDefaultHints(code)
    this.docsUrl = `https://whenny.dev/errors/${code.toLowerCase()}`

    // Maintains proper stack trace in V8 engines
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, WhennyError)
    }
  }

  /**
   * Returns a JSON-serializable representation of the error.
   * Useful for logging and error reporting.
   */
  toJSON(): Record<string, unknown> {
    return {
      name: this.name,
      code: this.code,
      message: this.message,
      context: this.context,
      hints: this.hints,
      docsUrl: this.docsUrl,
    }
  }
}

/**
 * Builds a comprehensive error message with all relevant details.
 */
function buildErrorMessage(
  code: WhennyErrorCode,
  message: string,
  context: WhennyErrorContext,
  hints: string[]
): string {
  const parts: string[] = [`[${code}] ${message}`]

  // Add context details
  if (context.input !== undefined) {
    const inputStr = truncateForDisplay(context.input)
    parts.push(`  Input: ${inputStr}`)
  }

  if (context.expected) {
    parts.push(`  Expected: ${context.expected}`)
  }

  if (context.received) {
    parts.push(`  Received: ${context.received}`)
  }

  if (context.supported && context.supported.length > 0) {
    parts.push(`  Supported: ${context.supported.join(', ')}`)
  }

  // Add hints
  const allHints = hints.length > 0 ? hints : getDefaultHints(code)
  if (allHints.length > 0) {
    parts.push('')
    parts.push('Hints:')
    allHints.forEach((hint) => parts.push(`  - ${hint}`))
  }

  return parts.join('\n')
}

/**
 * Truncates a value for safe display in error messages.
 */
function truncateForDisplay(value: unknown, maxLength = 100): string {
  if (value === null) return 'null'
  if (value === undefined) return 'undefined'

  let str: string
  if (typeof value === 'string') {
    str = `"${value}"`
  } else if (typeof value === 'object') {
    try {
      str = JSON.stringify(value)
    } catch {
      str = String(value)
    }
  } else {
    str = String(value)
  }

  if (str.length > maxLength) {
    return str.slice(0, maxLength - 3) + '...'
  }
  return str
}

/**
 * Returns default hints for each error code.
 */
function getDefaultHints(code: WhennyErrorCode): string[] {
  switch (code) {
    case 'INVALID_DATE':
      return [
        'Ensure the date is a valid Date object, ISO string, or Unix timestamp',
        'Use parseDate() to safely parse unknown date formats',
      ]

    case 'INVALID_DATE_STRING':
      return [
        'Use ISO 8601 format: "2024-01-15" or "2024-01-15T10:30:00Z"',
        'Unix timestamps (milliseconds) are also supported',
        'For natural language, use parse("tomorrow at 3pm")',
      ]

    case 'INVALID_TIMESTAMP':
      return [
        'Timestamps should be in milliseconds since Unix epoch',
        'For seconds, multiply by 1000: parseDate(seconds * 1000)',
      ]

    case 'INVALID_TIMEZONE':
      return [
        'Use IANA timezone names: "America/New_York", "Europe/London"',
        'Use "UTC" for Coordinated Universal Time',
        'Common aliases like "EST" are supported via tz.fromAlias()',
      ]

    case 'INVALID_TRANSFER_PAYLOAD':
      return [
        'Transfer payloads require: { iso: string, originZone: string, originOffset: number }',
        'Use toTransfer() to create valid payloads',
      ]

    case 'INVALID_TIME_UNIT':
      return [
        'Valid units: "second", "minute", "hour", "day", "week", "month", "year"',
      ]

    case 'INVALID_CONFIG':
      return [
        'Use defineConfig() to create type-safe configurations',
        'Check that all required properties are present',
      ]

    case 'INVALID_LOCALE':
      return [
        'Use standard locale codes: "en-US", "fr-FR", "ja-JP"',
        'Check available locales with getAvailableLocales()',
      ]

    case 'PARSE_FAILED':
      return [
        'The input could not be recognized as a date',
        'Try more explicit formats: "January 15, 2024" or "2024-01-15"',
        'Use parseDate() for programmatic dates, parse() for natural language',
      ]

    case 'PARSE_DEPTH_EXCEEDED':
      return [
        'The input contains too many nested date expressions',
        'Simplify the input: "tomorrow at 3pm" instead of complex chains',
      ]

    case 'INPUT_TOO_LONG':
      return [
        'Input strings are limited to 500 characters for security',
        'If you need longer inputs, process them in parts',
      ]

    case 'MISSING_TIMEZONE_CONTEXT':
      return [
        'Server-side rendering requires explicit timezone context',
        'Use smart({ for: "America/New_York" }) or smart({ for: userTimezone })',
        'Or disable the warning: configure({ server: { requireTimezone: false } })',
      ]

    default:
      return ['Check the documentation at https://whenny.dev/docs']
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Validation Helpers
// ─────────────────────────────────────────────────────────────────────────────

/** Maximum input string length for security */
export const MAX_INPUT_LENGTH = 500

/** Maximum recursion depth for parsing */
export const MAX_PARSE_DEPTH = 5

/**
 * Validates that a Date object is valid (not Invalid Date).
 */
export function assertValidDate(
  date: Date,
  context: string = 'date operation'
): asserts date is Date {
  if (!(date instanceof Date) || isNaN(date.getTime())) {
    throw new WhennyError('INVALID_DATE', `Invalid Date in ${context}`, {
      operation: context,
      received: date instanceof Date ? 'Invalid Date' : typeof date,
    })
  }
}

/**
 * Validates input string length for security.
 */
export function assertInputLength(
  input: string,
  context: string = 'input'
): void {
  if (input.length > MAX_INPUT_LENGTH) {
    throw new WhennyError(
      'INPUT_TOO_LONG',
      `${context} exceeds maximum length of ${MAX_INPUT_LENGTH} characters`,
      {
        received: `${input.length} characters`,
        expected: `<= ${MAX_INPUT_LENGTH} characters`,
      }
    )
  }
}

/**
 * Validates that a time unit is supported.
 */
export function assertValidTimeUnit(
  unit: string,
  context: string = 'time operation'
): asserts unit is
  | 'second'
  | 'minute'
  | 'hour'
  | 'day'
  | 'week'
  | 'month'
  | 'year' {
  const validUnits = [
    'second',
    'minute',
    'hour',
    'day',
    'week',
    'month',
    'year',
  ]
  if (!validUnits.includes(unit)) {
    throw new WhennyError('INVALID_TIME_UNIT', `Invalid time unit: "${unit}"`, {
      operation: context,
      received: unit,
      supported: validUnits,
    })
  }
}

/**
 * Validates a transfer payload structure.
 */
export function assertValidTransferPayload(
  payload: unknown,
  context: string = 'transfer operation'
): asserts payload is { iso: string; originZone: string; originOffset: number } {
  if (!payload || typeof payload !== 'object') {
    throw new WhennyError(
      'INVALID_TRANSFER_PAYLOAD',
      'Transfer payload must be an object',
      {
        operation: context,
        received: typeof payload,
        expected: '{ iso: string, originZone: string, originOffset: number }',
      }
    )
  }

  const obj = payload as Record<string, unknown>

  if (typeof obj.iso !== 'string') {
    throw new WhennyError(
      'INVALID_TRANSFER_PAYLOAD',
      'Transfer payload missing or invalid "iso" field',
      {
        operation: context,
        received: typeof obj.iso,
        expected: 'ISO 8601 date string',
      }
    )
  }

  if (typeof obj.originZone !== 'string') {
    throw new WhennyError(
      'INVALID_TRANSFER_PAYLOAD',
      'Transfer payload missing or invalid "originZone" field',
      {
        operation: context,
        received: typeof obj.originZone,
        expected: 'IANA timezone string (e.g., "America/New_York")',
      }
    )
  }

  if (typeof obj.originOffset !== 'number') {
    throw new WhennyError(
      'INVALID_TRANSFER_PAYLOAD',
      'Transfer payload missing or invalid "originOffset" field',
      {
        operation: context,
        received: typeof obj.originOffset,
        expected: 'number (UTC offset in minutes)',
      }
    )
  }
}

/**
 * Creates a safe result wrapper for operations that might fail.
 * Useful for non-throwing APIs.
 */
export type Result<T, E = WhennyError> =
  | { ok: true; value: T }
  | { ok: false; error: E }

export function ok<T>(value: T): Result<T, never> {
  return { ok: true, value }
}

export function err<E>(error: E): Result<never, E> {
  return { ok: false, error }
}

/**
 * Wraps a function to return a Result instead of throwing.
 */
export function trySafe<T>(fn: () => T): Result<T, WhennyError> {
  try {
    return ok(fn())
  } catch (e) {
    if (e instanceof WhennyError) {
      return err(e)
    }
    return err(
      new WhennyError('PARSE_FAILED', e instanceof Error ? e.message : String(e))
    )
  }
}
