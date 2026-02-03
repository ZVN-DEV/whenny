/**
 * useRelativeTime Hook
 *
 * Returns an auto-updating relative time string that refreshes periodically.
 * SSR-safe with proper hydration handling.
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
  /** Placeholder text shown during SSR/hydration (default: '') */
  placeholder?: string
}

/**
 * Auto-updating relative time hook.
 *
 * Returns a relative time string like "5 minutes ago" that automatically
 * updates at the specified interval. SSR-safe - shows placeholder during
 * hydration to avoid mismatches.
 *
 * @param date - The date to format
 * @param options - Configuration options
 * @returns Formatted relative time string
 */
export function useRelativeTime(
  date: DateInput,
  options: UseRelativeTimeOptions = {}
): string {
  const {
    updateInterval = 60000,
    smart = false,
    timezone,
    placeholder = '',
  } = options

  // Track if we're mounted (for SSR safety)
  const [isMounted, setIsMounted] = useState(false)

  // Keep date in a ref to avoid stale closures
  const dateRef = useRef(date)
  dateRef.current = date

  // Memoized format function
  const formatDate = useCallback(() => {
    try {
      const w = whenny(dateRef.current)
      if (smart) {
        return timezone ? w.smart({ for: timezone }) : w.smart()
      }
      return w.relative()
    } catch {
      // Return empty string on error to avoid breaking the UI
      return ''
    }
  }, [smart, timezone])

  // State for the formatted text - initialize with empty to match server
  const [text, setText] = useState<string>('')

  // Handle mounting and initial format
  useEffect(() => {
    setIsMounted(true)
    setText(formatDate())
  }, [formatDate])

  // Set up interval for periodic updates
  useEffect(() => {
    if (!isMounted) return

    const timer = setInterval(() => {
      setText(formatDate())
    }, updateInterval)

    return () => clearInterval(timer)
  }, [isMounted, formatDate, updateInterval])

  // Update when date changes (after mount)
  useEffect(() => {
    if (isMounted) {
      setText(formatDate())
    }
  }, [date, formatDate, isMounted])

  // Return placeholder during SSR, formatted text after mount
  return isMounted ? text : placeholder
}

export default useRelativeTime
