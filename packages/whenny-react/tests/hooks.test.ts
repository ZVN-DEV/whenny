/**
 * Whenny React Hooks Tests
 *
 * Basic tests for React hooks.
 */

import { describe, it, expect } from 'vitest'

describe('whenny-react', () => {
  describe('package exports', () => {
    it('should export useRelativeTime', async () => {
      const { useRelativeTime } = await import('../src')
      expect(typeof useRelativeTime).toBe('function')
    })

    it('should export useCountdown', async () => {
      const { useCountdown } = await import('../src')
      expect(typeof useCountdown).toBe('function')
    })

    it('should export useDateFormatter', async () => {
      const { useDateFormatter } = await import('../src')
      expect(typeof useDateFormatter).toBe('function')
    })

    it('should export useTimezone', async () => {
      const { useTimezone } = await import('../src')
      expect(typeof useTimezone).toBe('function')
    })

    it('should export TimezoneProvider', async () => {
      const { TimezoneProvider } = await import('../src')
      expect(typeof TimezoneProvider).toBe('function')
    })

    it('should export useShadcnCalendar', async () => {
      const { useShadcnCalendar } = await import('../src')
      expect(typeof useShadcnCalendar).toBe('function')
    })
  })
})
