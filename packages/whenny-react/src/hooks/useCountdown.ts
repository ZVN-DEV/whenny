/**
 * useCountdown Hook
 *
 * Returns countdown values that update every second.
 * SSR-safe with proper hydration handling.
 *
 * @example
 * ```tsx
 * function SaleTimer({ endsAt }) {
 *   const { days, hours, minutes, seconds, isExpired } = useCountdown(endsAt)
 *
 *   if (isExpired) {
 *     return <span>Sale ended</span>
 *   }
 *
 *   return (
 *     <div className="flex gap-2">
 *       <span>{days}d</span>
 *       <span>{hours}h</span>
 *       <span>{minutes}m</span>
 *       <span>{seconds}s</span>
 *     </div>
 *   )
 * }
 *
 * // Using formatted string
 * function Timer({ deadline }) {
 *   const countdown = useCountdown(deadline)
 *   return <span>{countdown.formatted}</span> // "2d 5h 30m 15s"
 * }
 * ```
 */

import { useState, useEffect, useCallback, useRef, useMemo } from 'react'
import { whenny, type DateInput } from 'whenny'

export interface CountdownResult {
  /** Days remaining */
  days: number
  /** Hours remaining (0-23) */
  hours: number
  /** Minutes remaining (0-59) */
  minutes: number
  /** Seconds remaining (0-59) */
  seconds: number
  /** Total seconds remaining */
  totalSeconds: number
  /** Total milliseconds remaining */
  totalMs: number
  /** Whether the countdown has expired */
  isExpired: boolean
  /** Pre-formatted string: "2d 5h 30m 15s" */
  formatted: string
  /** Compact format: "2:05:30:15" or "5:30:15" */
  clock: string
  /** Whether the hook is mounted (for SSR) */
  isMounted: boolean
}

export interface UseCountdownOptions {
  /** Update interval in milliseconds (default: 1000) */
  interval?: number
  /** Callback when countdown expires */
  onExpire?: () => void
}

/** Default result for SSR */
const DEFAULT_RESULT: CountdownResult = {
  days: 0,
  hours: 0,
  minutes: 0,
  seconds: 0,
  totalSeconds: 0,
  totalMs: 0,
  isExpired: false,
  formatted: '0s',
  clock: '0:00',
  isMounted: false,
}

/**
 * Countdown timer hook.
 *
 * Returns an object with countdown values (days, hours, minutes, seconds)
 * that update every second. Includes pre-formatted strings and expiration
 * callback support.
 *
 * @param targetDate - The date to count down to
 * @param options - Configuration options
 * @returns Countdown result object
 */
export function useCountdown(
  targetDate: DateInput,
  options: UseCountdownOptions = {}
): CountdownResult {
  const { interval = 1000, onExpire } = options

  // Track mounted state for SSR
  const [isMounted, setIsMounted] = useState(false)

  // Keep refs to avoid stale closures
  const targetRef = useRef(targetDate)
  targetRef.current = targetDate

  const onExpireRef = useRef(onExpire)
  onExpireRef.current = onExpire

  const hasExpiredRef = useRef(false)

  // Memoized calculate function
  const calculate = useCallback((): Omit<CountdownResult, 'isMounted'> => {
    try {
      const target = whenny(targetRef.current).toDate()
      const now = Date.now()
      const diff = Math.max(0, target.getTime() - now)

      const totalSeconds = Math.floor(diff / 1000)
      const days = Math.floor(totalSeconds / 86400)
      const hours = Math.floor((totalSeconds % 86400) / 3600)
      const minutes = Math.floor((totalSeconds % 3600) / 60)
      const seconds = totalSeconds % 60

      const isExpired = diff <= 0

      // Formatted strings
      let formatted: string
      if (days > 0) {
        formatted = `${days}d ${hours}h ${minutes}m ${seconds}s`
      } else if (hours > 0) {
        formatted = `${hours}h ${minutes}m ${seconds}s`
      } else if (minutes > 0) {
        formatted = `${minutes}m ${seconds}s`
      } else {
        formatted = `${seconds}s`
      }

      let clock: string
      const pad = (n: number) => n.toString().padStart(2, '0')
      if (days > 0) {
        clock = `${days}:${pad(hours)}:${pad(minutes)}:${pad(seconds)}`
      } else if (hours > 0) {
        clock = `${hours}:${pad(minutes)}:${pad(seconds)}`
      } else {
        clock = `${minutes}:${pad(seconds)}`
      }

      return {
        days,
        hours,
        minutes,
        seconds,
        totalSeconds,
        totalMs: diff,
        isExpired,
        formatted,
        clock,
      }
    } catch {
      return {
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
        totalSeconds: 0,
        totalMs: 0,
        isExpired: true,
        formatted: '0s',
        clock: '0:00',
      }
    }
  }, [])

  // State for the result
  const [result, setResult] = useState<Omit<CountdownResult, 'isMounted'>>(() => ({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    totalSeconds: 0,
    totalMs: 0,
    isExpired: false,
    formatted: '0s',
    clock: '0:00',
  }))

  // Handle mounting
  useEffect(() => {
    setIsMounted(true)
    const newResult = calculate()
    setResult(newResult)

    // Check for expiration
    if (newResult.isExpired && !hasExpiredRef.current) {
      hasExpiredRef.current = true
      onExpireRef.current?.()
    }
  }, [calculate])

  // Set up interval for updates
  useEffect(() => {
    if (!isMounted) return

    // Don't set up interval if already expired
    if (result.isExpired) {
      return
    }

    const timer = setInterval(() => {
      const updated = calculate()
      setResult(updated)

      if (updated.isExpired && !hasExpiredRef.current) {
        hasExpiredRef.current = true
        onExpireRef.current?.()
        clearInterval(timer)
      }
    }, interval)

    return () => clearInterval(timer)
  }, [isMounted, result.isExpired, calculate, interval])

  // Reset expired flag when target changes
  useEffect(() => {
    hasExpiredRef.current = false
    if (isMounted) {
      setResult(calculate())
    }
  }, [targetDate, isMounted, calculate])

  // Return combined result with mounted state
  return useMemo(
    () => ({
      ...result,
      isMounted,
    }),
    [result, isMounted]
  )
}

export default useCountdown
