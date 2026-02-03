/**
 * Whenny Configuration System
 *
 * Provides a type-safe way to configure Whenny behavior.
 * Configuration can be loaded from a whenny.config.ts file or passed directly.
 */

import type { WhennyConfig, WhennyUserConfig } from '../types'
import { defaultConfig } from './defaults'

// Global configuration instance
let globalConfig: WhennyConfig = defaultConfig

/**
 * Deep merge utility for configuration objects
 */
function deepMerge(
  target: WhennyConfig,
  source: WhennyUserConfig
): WhennyConfig {
  const result = { ...target } as unknown as Record<string, unknown>

  for (const key in source) {
    const sourceValue = (source as unknown as Record<string, unknown>)[key]
    const targetValue = (target as unknown as Record<string, unknown>)[key]

    if (
      sourceValue !== null &&
      typeof sourceValue === 'object' &&
      !Array.isArray(sourceValue) &&
      targetValue !== null &&
      typeof targetValue === 'object' &&
      !Array.isArray(targetValue)
    ) {
      result[key] = deepMergeObject(
        targetValue as Record<string, unknown>,
        sourceValue as Record<string, unknown>
      )
    } else if (sourceValue !== undefined) {
      result[key] = sourceValue
    }
  }

  return result as unknown as WhennyConfig
}

/**
 * Deep merge for nested objects
 */
function deepMergeObject(
  target: Record<string, unknown>,
  source: Record<string, unknown>
): Record<string, unknown> {
  const result = { ...target }

  for (const key in source) {
    const sourceValue = source[key]
    const targetValue = target[key]

    if (
      sourceValue !== null &&
      typeof sourceValue === 'object' &&
      !Array.isArray(sourceValue) &&
      targetValue !== null &&
      typeof targetValue === 'object' &&
      !Array.isArray(targetValue)
    ) {
      result[key] = deepMergeObject(
        targetValue as Record<string, unknown>,
        sourceValue as Record<string, unknown>
      )
    } else if (sourceValue !== undefined) {
      result[key] = sourceValue
    }
  }

  return result
}

/**
 * Define a Whenny configuration with type safety
 *
 * @example
 * ```typescript
 * // whenny.config.ts
 * import { defineConfig } from 'whenny/config'
 *
 * export default defineConfig({
 *   relative: {
 *     justNow: 'moments ago',
 *   },
 * })
 * ```
 */
export function defineConfig(config: WhennyUserConfig): WhennyConfig {
  return deepMerge(defaultConfig, config)
}

/**
 * Configure Whenny with custom settings
 *
 * @example
 * ```typescript
 * import { configure } from 'whenny'
 *
 * configure({
 *   locale: 'en-GB',
 *   relative: {
 *     justNow: 'just now',
 *   },
 * })
 * ```
 */
export function configure(config: WhennyUserConfig): void {
  globalConfig = deepMerge(defaultConfig, config)
}

/**
 * Get the current configuration
 */
export function getConfig(): WhennyConfig {
  return globalConfig
}

/**
 * Reset configuration to defaults
 */
export function resetConfig(): void {
  globalConfig = defaultConfig
}

/**
 * Create a scoped configuration that doesn't affect the global config
 *
 * @example
 * ```typescript
 * const scopedWhenny = withConfig({
 *   relative: { justNow: 'right now' },
 * })
 *
 * scopedWhenny(date).relative() // Uses scoped config
 * whenny(date).relative()       // Uses global config
 * ```
 */
export function createConfig(config: WhennyUserConfig): WhennyConfig {
  return deepMerge(defaultConfig, config)
}

// Re-export defaults for reference
export { defaultConfig }
