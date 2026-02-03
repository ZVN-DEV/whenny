/**
 * useDateFormatter Hook
 *
 * Returns a memoized date formatter function.
 *
 * @example
 * ```tsx
 * function EventCard({ event }) {
 *   const format = useDateFormatter()
 *
 *   return (
 *     <div>
 *       <h3>{event.title}</h3>
 *       <time>{format(event.startTime).smart()}</time>
 *       <p>Duration: {format(event.startTime).distance(event.endTime).human()}</p>
 *     </div>
 *   )
 * }
 * ```
 */

import { useCallback } from 'react'
import { whenny, type DateInput, type Whenny } from 'whenny'

export interface DateFormatter {
  (date: DateInput): Whenny
}

export function useDateFormatter(): DateFormatter {
  return useCallback((date: DateInput) => whenny(date), [])
}
