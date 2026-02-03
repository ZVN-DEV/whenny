/**
 * useShadcnCalendar Hook
 *
 * Helpers for integrating Whenny with shadcn/ui Calendar component.
 *
 * @example
 * ```tsx
 * import { Calendar } from "@/components/ui/calendar"
 * import { useShadcnCalendar } from "@whenny/react"
 *
 * function DatePicker() {
 *   const [date, setDate] = useState<Date>()
 *   const {
 *     formatSelected,
 *     isDisabled,
 *     modifiers,
 *     modifiersClassNames,
 *   } = useShadcnCalendar({
 *     disablePast: true,
 *     disableWeekends: true,
 *   })
 *
 *   return (
 *     <div>
 *       <p>{date ? formatSelected(date) : "Pick a date"}</p>
 *       <Calendar
 *         mode="single"
 *         selected={date}
 *         onSelect={setDate}
 *         disabled={isDisabled}
 *         modifiers={modifiers}
 *         modifiersClassNames={modifiersClassNames}
 *       />
 *     </div>
 *   )
 * }
 * ```
 */

import { useMemo, useCallback } from 'react'
import {
  whenny,
  calendar,
  type DateInput,
} from 'whenny'

export interface ShadcnCalendarOptions {
  /** Disable dates in the past */
  disablePast?: boolean
  /** Disable dates in the future */
  disableFuture?: boolean
  /** Disable weekends */
  disableWeekends?: boolean
  /** Disable specific dates */
  disabledDates?: Date[]
  /** Minimum selectable date */
  minDate?: DateInput
  /** Maximum selectable date */
  maxDate?: DateInput
  /** Format for displaying selected date */
  selectedFormat?: 'short' | 'long' | 'smart' | string
  /** Timezone for formatting */
  timezone?: string
  /** Highlight today */
  highlightToday?: boolean
  /** Custom date classifier */
  classifyDate?: (date: Date) => string | undefined
}

export interface ShadcnCalendarHelpers {
  /** Format a selected date for display */
  formatSelected: (date: Date | undefined) => string
  /** Format a date range for display */
  formatRange: (from: Date | undefined, to: Date | undefined) => string
  /** Check if a date should be disabled */
  isDisabled: (date: Date) => boolean
  /** Modifiers for react-day-picker */
  modifiers: Record<string, (date: Date) => boolean>
  /** Modifier class names */
  modifiersClassNames: Record<string, string>
  /** Get relative description for a date */
  getRelative: (date: Date) => string
  /** Get smart formatted date */
  getSmart: (date: Date) => string
  /** Check if date is today */
  isToday: (date: Date) => boolean
  /** Check if date is in past */
  isPast: (date: Date) => boolean
  /** Check if date is in future */
  isFuture: (date: Date) => boolean
  /** Get days until a date */
  daysUntil: (date: Date) => number
  /** Get days since a date */
  daysSince: (date: Date) => number
}

export function useShadcnCalendar(
  options: ShadcnCalendarOptions = {}
): ShadcnCalendarHelpers {
  const {
    disablePast = false,
    disableFuture = false,
    disableWeekends = false,
    disabledDates = [],
    minDate,
    maxDate,
    selectedFormat = 'long',
    timezone,
    highlightToday = true,
    classifyDate,
  } = options

  // Memoize disabled dates as a Set for O(1) lookup
  const disabledDateSet = useMemo(() => {
    return new Set(disabledDates.map(d => d.toDateString()))
  }, [disabledDates])

  // Parse min/max dates
  const parsedMinDate = useMemo(
    () => (minDate ? whenny(minDate).toDate() : null),
    [minDate]
  )
  const parsedMaxDate = useMemo(
    () => (maxDate ? whenny(maxDate).toDate() : null),
    [maxDate]
  )

  const isDisabled = useCallback(
    (date: Date): boolean => {
      // Check if date is in disabled set
      if (disabledDateSet.has(date.toDateString())) {
        return true
      }

      // Check past/future
      const now = new Date()
      now.setHours(0, 0, 0, 0)

      if (disablePast && date < now) {
        return true
      }

      if (disableFuture && date > now) {
        return true
      }

      // Check weekends
      if (disableWeekends && calendar.isWeekend(date)) {
        return true
      }

      // Check min/max bounds
      if (parsedMinDate && date < parsedMinDate) {
        return true
      }

      if (parsedMaxDate && date > parsedMaxDate) {
        return true
      }

      return false
    },
    [
      disabledDateSet,
      disablePast,
      disableFuture,
      disableWeekends,
      parsedMinDate,
      parsedMaxDate,
    ]
  )

  const formatSelected = useCallback(
    (date: Date | undefined): string => {
      if (!date) return ''

      const w = whenny(date)

      switch (selectedFormat) {
        case 'short':
          return w.short()
        case 'long':
          return w.long()
        case 'smart':
          return timezone ? w.smart({ for: timezone }) : w.smart()
        default:
          return w.format(selectedFormat)
      }
    },
    [selectedFormat, timezone]
  )

  const formatRange = useCallback(
    (from: Date | undefined, to: Date | undefined): string => {
      if (!from) return ''
      if (!to) return formatSelected(from)

      const fromFormatted = whenny(from).short()
      const toFormatted = whenny(to).short()

      // Same month?
      if (from.getMonth() === to.getMonth() && from.getFullYear() === to.getFullYear()) {
        return `${whenny(from).format('{monthShort} {day}')} - ${whenny(to).format('{day}')}, ${from.getFullYear()}`
      }

      // Same year?
      if (from.getFullYear() === to.getFullYear()) {
        return `${fromFormatted} - ${toFormatted}`
      }

      return `${whenny(from).format('{monthShort} {day}, {year}')} - ${whenny(to).format('{monthShort} {day}, {year}')}`
    },
    [formatSelected]
  )

  const modifiers = useMemo(() => {
    const mods: Record<string, (date: Date) => boolean> = {}

    if (highlightToday) {
      mods.today = (date: Date) => calendar.isToday(date)
    }

    mods.weekend = (date: Date) => calendar.isWeekend(date)
    mods.past = (date: Date) => calendar.isPast(date)
    mods.future = (date: Date) => calendar.isFuture(date)

    if (classifyDate) {
      mods.custom = (date: Date) => !!classifyDate(date)
    }

    return mods
  }, [highlightToday, classifyDate])

  const modifiersClassNames = useMemo(
    () => ({
      today: 'bg-accent text-accent-foreground',
      weekend: 'text-muted-foreground',
      past: 'text-muted-foreground/50',
      custom: 'ring-2 ring-primary',
    }),
    []
  )

  const getRelative = useCallback(
    (date: Date): string => whenny(date).relative(),
    []
  )

  const getSmart = useCallback(
    (date: Date): string =>
      timezone
        ? whenny(date).smart({ for: timezone })
        : whenny(date).smart(),
    [timezone]
  )

  return {
    formatSelected,
    formatRange,
    isDisabled,
    modifiers,
    modifiersClassNames,
    getRelative,
    getSmart,
    isToday: calendar.isToday,
    isPast: calendar.isPast,
    isFuture: calendar.isFuture,
    daysUntil: calendar.daysUntil,
    daysSince: calendar.daysSince,
  }
}
