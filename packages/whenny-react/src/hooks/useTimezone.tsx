/**
 * useTimezone Hook & TimezoneProvider
 *
 * Provides timezone context throughout the app.
 *
 * @example
 * ```tsx
 * // Wrap your app
 * function App() {
 *   return (
 *     <TimezoneProvider detect>
 *       <MyApp />
 *     </TimezoneProvider>
 *   )
 * }
 *
 * // Use in any component
 * function TimeDisplay({ date }) {
 *   const { timezone, setTimezone } = useTimezone()
 *
 *   return (
 *     <div>
 *       <span>{whenny(date).smart({ for: timezone })}</span>
 *       <select
 *         value={timezone}
 *         onChange={e => setTimezone(e.target.value)}
 *       >
 *         <option value="local">Local</option>
 *         <option value="UTC">UTC</option>
 *         <option value="America/New_York">New York</option>
 *       </select>
 *     </div>
 *   )
 * }
 * ```
 */

import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from 'react'
import { tz } from 'whenny'

export interface TimezoneContextValue {
  /** Current timezone */
  timezone: string
  /** Update the timezone */
  setTimezone: (tz: string) => void
  /** Reset to local timezone */
  resetToLocal: () => void
  /** Check if using local timezone */
  isLocal: boolean
}

const TimezoneContext = createContext<TimezoneContextValue | null>(null)

export interface TimezoneProviderProps {
  children: ReactNode
  /** Auto-detect user's timezone (default: true) */
  detect?: boolean
  /** Initial timezone override */
  initialTimezone?: string
  /** Store preference in localStorage (default: true) */
  persist?: boolean
  /** localStorage key (default: 'whenny-timezone') */
  storageKey?: string
}

export function TimezoneProvider({
  children,
  detect = true,
  initialTimezone,
  persist = true,
  storageKey = 'whenny-timezone',
}: TimezoneProviderProps) {
  const [timezone, setTimezoneState] = useState<string>(() => {
    // Check localStorage first if persisting
    if (persist && typeof window !== 'undefined') {
      const stored = localStorage.getItem(storageKey)
      if (stored) return stored
    }

    // Use initial timezone if provided
    if (initialTimezone) return initialTimezone

    // Auto-detect if enabled
    if (detect) return tz.local()

    // Default to UTC
    return 'UTC'
  })

  const localTimezone = tz.local()

  const setTimezone = (newTz: string) => {
    setTimezoneState(newTz)
    if (persist && typeof window !== 'undefined') {
      localStorage.setItem(storageKey, newTz)
    }
  }

  const resetToLocal = () => {
    setTimezone(localTimezone)
  }

  // Detect timezone changes (e.g., user travels)
  useEffect(() => {
    if (!detect) return

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        const currentLocal = tz.local()
        // Only auto-update if using local timezone
        if (timezone === localTimezone && currentLocal !== localTimezone) {
          setTimezoneState(currentLocal)
        }
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [detect, timezone, localTimezone])

  const value: TimezoneContextValue = {
    timezone,
    setTimezone,
    resetToLocal,
    isLocal: timezone === localTimezone,
  }

  return (
    <TimezoneContext.Provider value={value}>
      {children}
    </TimezoneContext.Provider>
  )
}

export function useTimezone(): TimezoneContextValue {
  const context = useContext(TimezoneContext)

  if (!context) {
    // Return a default context if not wrapped in provider
    const localTz = typeof window !== 'undefined' ? tz.local() : 'UTC'
    return {
      timezone: localTz,
      setTimezone: () => {
        console.warn('[whenny] useTimezone called outside of TimezoneProvider')
      },
      resetToLocal: () => {},
      isLocal: true,
    }
  }

  return context
}
