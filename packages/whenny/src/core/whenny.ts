/**
 * Whenny Core Class
 *
 * The main Whenny instance that wraps a Date and provides all formatting,
 * comparison, and manipulation methods.
 */

import type {
  DateInput,
  TimeUnit,
  Timezone,
  Whenny as WhennyInterface,
  WhennyComparison,
  WhennyDistance,
  WhennyConfig,
  TransferPayload,
  SmartOptions,
  RelativeOptions,
} from '../types'
import { getConfig } from '../config'
import {
  parseDate,
  isValidDate,
  addTime,
  subtractTime,
  startOfDay,
  endOfDay,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  startOfYear,
  endOfYear,
  getLocalTimezone,
  getTimezoneOffset,
  formatTimezoneOffset,
} from './utils'
import { format, formatPreset, formatISO } from './formatter'
import { relative, from as relativeFrom } from '../relative'
import { smart } from '../smart'
import { compare, distance } from '../compare'
import { createTransfer } from '../transfer'

/**
 * The Whenny class implementation
 */
class WhennyImpl implements WhennyInterface {
  private readonly _date: Date
  private readonly _timezone: Timezone
  private readonly _config: WhennyConfig
  private readonly _originZone?: Timezone

  constructor(
    input: DateInput,
    options: { timezone?: Timezone; config?: WhennyConfig; originZone?: Timezone } = {}
  ) {
    this._date = parseDate(input)
    this._timezone = options.timezone ?? getLocalTimezone()
    this._config = options.config ?? getConfig()
    this._originZone = options.originZone ?? this._timezone
  }

  // ─────────────────────────────────────────────────────────
  // CORE METHODS
  // ─────────────────────────────────────────────────────────

  toDate(): Date {
    return new Date(this._date.getTime())
  }

  valueOf(): number {
    return this._date.getTime()
  }

  unix(): number {
    return Math.floor(this._date.getTime() / 1000)
  }

  toISO(): string {
    return formatISO(this._date)
  }

  isValid(): boolean {
    return isValidDate(this._date)
  }

  // ─────────────────────────────────────────────────────────
  // STYLE PROPERTIES (primary API - like Tailwind tokens)
  // ─────────────────────────────────────────────────────────

  /** Extra small: "2/3" - minimal numeric */
  get xs(): string {
    return format(this._date, this._config.styles.xs, this._config, this._timezone)
  }

  /** Small: "Feb 3" - abbreviated */
  get sm(): string {
    return format(this._date, this._config.styles.sm, this._config, this._timezone)
  }

  /** Medium: "Feb 3, 2026" - default readable */
  get md(): string {
    return format(this._date, this._config.styles.md, this._config, this._timezone)
  }

  /** Large: "February 3rd, 2026" - full names */
  get lg(): string {
    return format(this._date, this._config.styles.lg, this._config, this._timezone)
  }

  /** Extra large: "Tuesday, February 3rd, 2026" - includes weekday */
  get xl(): string {
    return format(this._date, this._config.styles.xl, this._config, this._timezone)
  }

  /** Time only: "3:30 PM" */
  get clock(): string {
    return format(this._date, this._config.styles.time, this._config, this._timezone)
  }

  /** Sortable: "2026-02-03" - machine-sortable */
  get sortable(): string {
    return format(this._date, this._config.styles.sortable, this._config, this._timezone)
  }

  /** Log format: "2026-02-03 15:30:45" - for logs */
  get log(): string {
    return format(this._date, this._config.styles.log, this._config, this._timezone)
  }

  // ─────────────────────────────────────────────────────────
  // FORMATTING (methods - for backward compat & custom)
  // ─────────────────────────────────────────────────────────

  format(template: string): string {
    return format(this._date, template, this._config, this._timezone)
  }

  short(): string {
    return formatPreset(this._date, 'short', this._config, this._timezone)
  }

  long(): string {
    return formatPreset(this._date, 'long', this._config, this._timezone)
  }

  iso(): string {
    return formatISO(this._date)
  }

  time(): string {
    return formatPreset(this._date, 'time', this._config, this._timezone)
  }

  datetime(): string {
    return formatPreset(this._date, 'datetime', this._config, this._timezone)
  }

  // ─────────────────────────────────────────────────────────
  // RELATIVE TIME
  // ─────────────────────────────────────────────────────────

  relative(options?: RelativeOptions): string {
    return relative(this._date, { from: options?.from, config: this._config })
  }

  fromNow(): string {
    return this.relative()
  }

  from(date: DateInput): string {
    return relativeFrom(this._date, date, this._config)
  }

  since(date: DateInput): string {
    return this.from(date)
  }

  // ─────────────────────────────────────────────────────────
  // SMART FORMATTING
  // ─────────────────────────────────────────────────────────

  smart(options?: SmartOptions): string {
    return smart(this._date, {
      for: options?.for ?? this._timezone,
      from: options?.from,
      config: this._config,
    })
  }

  // ─────────────────────────────────────────────────────────
  // COMPARISON
  // ─────────────────────────────────────────────────────────

  to(date: DateInput): WhennyComparison {
    return compare(this._date, date, this._config)
  }

  distance(date: DateInput): WhennyDistance {
    return distance(this._date, date, this._config)
  }

  // ─────────────────────────────────────────────────────────
  // TIMEZONE
  // ─────────────────────────────────────────────────────────

  inZone(timezone: Timezone): WhennyInterface {
    return new WhennyImpl(this._date, {
      timezone,
      config: this._config,
      originZone: this._originZone,
    })
  }

  local(): WhennyInterface {
    return this.inZone(getLocalTimezone())
  }

  utc(): WhennyInterface {
    return this.inZone('UTC')
  }

  get zone(): Timezone {
    return this._timezone
  }

  get offset(): number {
    return getTimezoneOffset(this._date, this._timezone)
  }

  get offsetString(): string {
    return formatTimezoneOffset(this.offset)
  }

  // ─────────────────────────────────────────────────────────
  // TRANSFER PROTOCOL
  // ─────────────────────────────────────────────────────────

  transfer(): TransferPayload {
    return createTransfer(this._date, { timezone: this._originZone })
  }

  startOfDayInOrigin(): Date {
    const offsetMs = getTimezoneOffset(this._date, this._originZone ?? this._timezone) * 60 * 1000
    const inOrigin = new Date(this._date.getTime() + offsetMs)
    const startInOrigin = startOfDay(inOrigin)
    return new Date(startInOrigin.getTime() - offsetMs)
  }

  endOfDayInOrigin(): Date {
    const offsetMs = getTimezoneOffset(this._date, this._originZone ?? this._timezone) * 60 * 1000
    const inOrigin = new Date(this._date.getTime() + offsetMs)
    const endInOrigin = endOfDay(inOrigin)
    return new Date(endInOrigin.getTime() - offsetMs)
  }

  dayBoundsInOrigin(): { start: Date; end: Date } {
    return {
      start: this.startOfDayInOrigin(),
      end: this.endOfDayInOrigin(),
    }
  }

  // ─────────────────────────────────────────────────────────
  // PARTS
  // ─────────────────────────────────────────────────────────

  get year(): number {
    return this._date.getFullYear()
  }

  get month(): number {
    return this._date.getMonth() + 1
  }

  get day(): number {
    return this._date.getDate()
  }

  get weekday(): number {
    return this._date.getDay()
  }

  get hour(): number {
    return this._date.getHours()
  }

  get minute(): number {
    return this._date.getMinutes()
  }

  get second(): number {
    return this._date.getSeconds()
  }

  get millisecond(): number {
    return this._date.getMilliseconds()
  }

  // ─────────────────────────────────────────────────────────
  // CALENDAR OPERATIONS
  // ─────────────────────────────────────────────────────────

  startOf(
    unit: 'day' | 'week' | 'month' | 'year',
    options?: { in?: Timezone }
  ): WhennyInterface {
    let result: Date

    switch (unit) {
      case 'day':
        result = startOfDay(this._date)
        break
      case 'week':
        result = startOfWeek(this._date)
        break
      case 'month':
        result = startOfMonth(this._date)
        break
      case 'year':
        result = startOfYear(this._date)
        break
    }

    return new WhennyImpl(result, {
      timezone: options?.in ?? this._timezone,
      config: this._config,
      originZone: this._originZone,
    })
  }

  endOf(
    unit: 'day' | 'week' | 'month' | 'year',
    options?: { in?: Timezone }
  ): WhennyInterface {
    let result: Date

    switch (unit) {
      case 'day':
        result = endOfDay(this._date)
        break
      case 'week':
        result = endOfWeek(this._date)
        break
      case 'month':
        result = endOfMonth(this._date)
        break
      case 'year':
        result = endOfYear(this._date)
        break
    }

    return new WhennyImpl(result, {
      timezone: options?.in ?? this._timezone,
      config: this._config,
      originZone: this._originZone,
    })
  }

  add(amount: number, unit: TimeUnit): WhennyInterface {
    const result = addTime(this._date, amount, unit)
    return new WhennyImpl(result, {
      timezone: this._timezone,
      config: this._config,
      originZone: this._originZone,
    })
  }

  subtract(amount: number, unit: TimeUnit): WhennyInterface {
    const result = subtractTime(this._date, amount, unit)
    return new WhennyImpl(result, {
      timezone: this._timezone,
      config: this._config,
      originZone: this._originZone,
    })
  }
}

/**
 * Create a new Whenny instance
 */
export function createWhenny(
  input: DateInput,
  options?: { timezone?: Timezone; config?: WhennyConfig }
): WhennyInterface {
  return new WhennyImpl(input, options)
}

/**
 * Create a Whenny instance for the current time
 */
export function now(options?: { timezone?: Timezone; config?: WhennyConfig }): WhennyInterface {
  return new WhennyImpl(new Date(), options)
}

/**
 * Create a Whenny instance for the current time in UTC
 */
export function utcNow(config?: WhennyConfig): WhennyInterface {
  return new WhennyImpl(new Date(), { timezone: 'UTC', config })
}

/**
 * Create a Whenny instance for the current local time
 */
export function localNow(config?: WhennyConfig): WhennyInterface {
  return new WhennyImpl(new Date(), { timezone: getLocalTimezone(), config })
}

/**
 * Create a Whenny instance in a specific timezone
 */
export function inZone(
  timezone: Timezone,
  dateString?: string,
  config?: WhennyConfig
): WhennyInterface {
  if (!dateString) {
    return new WhennyImpl(new Date(), { timezone, config })
  }

  // Parse date string and create in the specified timezone
  const date = parseDate(dateString)
  return new WhennyImpl(date, { timezone, config, originZone: timezone })
}
