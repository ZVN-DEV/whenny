/**
 * useRelativeTime Hook
 *
 * Returns an auto-updating relative time string that refreshes periodically.
 *
 * @example
 * ```tsx
 * function Comment({ createdAt }) {
 *   const timeAgo = useRelativeTime(createdAt)
 *   return <span className="text-gray-500">{timeAgo}</span>
 * }
 *
 * // With options
 * const timeAgo = useRelativeTime(date, {
 *   updateInterval: 30000,  // Update every 30s
 *   smart: true,            // Use smart formatting
 * })
 * ```
 */

import { useState, useEffect, useCallback, useRef } from 'react'
import { whenny, type DateInput } from 'whenny'

export interface UseRelativeTimeOptions {
  /** Update interval in milliseconds (default: 60000 = 1 minute) */
  updateInterval?: number
  /** Use smart formatting instead of relative (default: false) */
  smart?: boolean
  /** Timezone for smart formatting */
  timezone?: string
}

export function useRelativeTime(
  date: DateInput,
  options: UseRelativeTimeOptions = {}
): string {
  const {
    updateInterval = 60000,
    smart = false,
    timezone,
  } = options

  const dateRef = useRef(date)
  dateRef.current = date

  const formatDate = useCallback(() => {
    const w = whenny(dateRef.current)
    if (smart) {
      return timezone ? w.smart({ for: timezone }) : w.smart()
    }
    return w.relative()
  }, [smart, timezone])

  const [text, setText] = useState(formatDate)

  useEffect(() => {
    // Update immediately when date changes
    setText(formatDate())

    // Set up interval for periodic updates
    const timer = setInterval(() => {
      setText(formatDate())
    }, updateInterval)

    return () => clearInterval(timer)
  }, [formatDate, updateInterval])

  return text
}
