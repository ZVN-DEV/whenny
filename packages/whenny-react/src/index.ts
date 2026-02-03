/**
 * @whenny/react
 *
 * React hooks and utilities for Whenny, with shadcn/ui calendar integration.
 *
 * @example
 * ```tsx
 * import { useRelativeTime, useCountdown, useDateFormatter } from '@whenny/react'
 *
 * function Comment({ date }) {
 *   const timeAgo = useRelativeTime(date)
 *   return <span>{timeAgo}</span> // Auto-updates!
 * }
 *
 * function Timer({ deadline }) {
 *   const { days, hours, minutes, seconds, isExpired } = useCountdown(deadline)
 *   return isExpired ? <span>Expired!</span> : <span>{hours}:{minutes}:{seconds}</span>
 * }
 * ```
 */

export { useRelativeTime } from './hooks/useRelativeTime.js'
export { useCountdown } from './hooks/useCountdown.js'
export { useDateFormatter } from './hooks/useDateFormatter.js'
export { useTimezone, TimezoneProvider } from './hooks/useTimezone.js'
export { useShadcnCalendar } from './hooks/useShadcnCalendar.js'

// Types
export type { UseRelativeTimeOptions } from './hooks/useRelativeTime.js'
export type { CountdownResult } from './hooks/useCountdown.js'
export type { TimezoneContextValue } from './hooks/useTimezone.js'
export type { ShadcnCalendarHelpers } from './hooks/useShadcnCalendar.js'
