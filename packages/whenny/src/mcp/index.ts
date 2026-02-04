/**
 * Whenny MCP Server
 *
 * Model Context Protocol server that exposes Whenny functions
 * to AI assistants like Claude, GPT, and others.
 *
 * Usage:
 *   npx whenny mcp
 *
 * Or add to your MCP config:
 *   {
 *     "mcpServers": {
 *       "whenny": {
 *         "command": "npx",
 *         "args": ["whenny", "mcp"]
 *       }
 *     }
 *   }
 */

import { createWhenny } from '../core/whenny'
import { relative } from '../relative'
import { smart } from '../smart'
import { compare } from '../compare'
import { duration } from '../duration'
import { calendar } from '../calendar'
import { createTransfer } from '../transfer'
import { parse as parseNatural } from '../natural'

/**
 * MCP Tool definitions for AI assistants
 */
export const mcpTools = {
  // Core formatting
  whenny: {
    name: 'whenny',
    description: 'Create a Whenny date instance for formatting and manipulation',
    parameters: {
      type: 'object',
      properties: {
        date: { type: 'string', description: 'Date string, ISO format, or timestamp' },
        timezone: { type: 'string', description: 'Optional timezone (e.g., "America/New_York")' },
      },
      required: ['date'],
    },
    examples: [
      { input: { date: '2024-01-15' }, output: 'Whenny instance' },
      { input: { date: '2024-01-15', timezone: 'America/New_York' }, output: 'Whenny instance in timezone' },
    ],
  },

  // Datewind styles
  format_datewind: {
    name: 'format_datewind',
    description: 'Format a date using Datewind style properties (xs, sm, md, lg, xl, clock, sortable, log)',
    parameters: {
      type: 'object',
      properties: {
        date: { type: 'string', description: 'Date to format' },
        style: {
          type: 'string',
          enum: ['xs', 'sm', 'md', 'lg', 'xl', 'clock', 'sortable', 'log'],
          description: 'Datewind style size',
        },
      },
      required: ['date', 'style'],
    },
    examples: [
      { input: { date: '2024-01-15', style: 'sm' }, output: 'Jan 15' },
      { input: { date: '2024-01-15', style: 'lg' }, output: 'January 15th, 2024' },
    ],
  },

  // Smart formatting
  format_smart: {
    name: 'format_smart',
    description: 'Smart format a date based on how far away it is (e.g., "just now", "5 minutes ago", "Yesterday at 3pm")',
    parameters: {
      type: 'object',
      properties: {
        date: { type: 'string', description: 'Date to format' },
        timezone: { type: 'string', description: 'Optional timezone for the viewer' },
      },
      required: ['date'],
    },
    examples: [
      { input: { date: 'now' }, output: 'just now' },
      { input: { date: '5 minutes ago' }, output: '5 minutes ago' },
    ],
  },

  // Relative time
  format_relative: {
    name: 'format_relative',
    description: 'Format a date as relative time (e.g., "5 minutes ago", "in 3 days")',
    parameters: {
      type: 'object',
      properties: {
        date: { type: 'string', description: 'Date to format' },
        from: { type: 'string', description: 'Optional reference date (defaults to now)' },
      },
      required: ['date'],
    },
    examples: [
      { input: { date: '2024-01-15T10:00:00Z' }, output: '5 minutes ago' },
    ],
  },

  // Duration
  format_duration: {
    name: 'format_duration',
    description: 'Format a duration in various styles (long, compact, brief, timer, clock, minimal, human)',
    parameters: {
      type: 'object',
      properties: {
        seconds: { type: 'number', description: 'Duration in seconds' },
        style: {
          type: 'string',
          enum: ['long', 'compact', 'brief', 'timer', 'clock', 'minimal', 'human'],
          description: 'Output style',
        },
      },
      required: ['seconds'],
    },
    examples: [
      { input: { seconds: 3661, style: 'compact' }, output: '1h 1m 1s' },
      { input: { seconds: 3661, style: 'timer' }, output: '01:01:01' },
    ],
  },

  // Compare dates
  compare_dates: {
    name: 'compare_dates',
    description: 'Compare two dates and get the difference',
    parameters: {
      type: 'object',
      properties: {
        dateA: { type: 'string', description: 'First date' },
        dateB: { type: 'string', description: 'Second date' },
        unit: {
          type: 'string',
          enum: ['smart', 'days', 'hours', 'minutes', 'seconds'],
          description: 'Unit for comparison result',
        },
      },
      required: ['dateA', 'dateB'],
    },
    examples: [
      { input: { dateA: '2024-01-15', dateB: '2024-01-10', unit: 'days' }, output: 5 },
    ],
  },

  // Calendar helpers
  calendar_check: {
    name: 'calendar_check',
    description: 'Check calendar properties of a date (isToday, isWeekend, isBusinessDay, etc.)',
    parameters: {
      type: 'object',
      properties: {
        date: { type: 'string', description: 'Date to check' },
        check: {
          type: 'string',
          enum: ['isToday', 'isYesterday', 'isTomorrow', 'isWeekend', 'isWeekday', 'isBusinessDay', 'isPast', 'isFuture'],
          description: 'Check to perform',
        },
      },
      required: ['date', 'check'],
    },
    examples: [
      { input: { date: '2024-01-15', check: 'isWeekend' }, output: false },
    ],
  },

  // Business days
  add_business_days: {
    name: 'add_business_days',
    description: 'Add or subtract business days from a date (skips weekends)',
    parameters: {
      type: 'object',
      properties: {
        date: { type: 'string', description: 'Starting date' },
        days: { type: 'number', description: 'Number of business days to add (negative to subtract)' },
      },
      required: ['date', 'days'],
    },
    examples: [
      { input: { date: '2024-01-15', days: 5 }, output: '2024-01-22' },
    ],
  },

  // Parse natural language
  parse_natural: {
    name: 'parse_natural',
    description: 'Parse natural language date expressions (e.g., "tomorrow at 3pm", "next friday", "in 2 hours")',
    parameters: {
      type: 'object',
      properties: {
        expression: { type: 'string', description: 'Natural language date expression' },
        from: { type: 'string', description: 'Optional reference date' },
      },
      required: ['expression'],
    },
    examples: [
      { input: { expression: 'tomorrow at 3pm' }, output: '2024-01-16T15:00:00' },
      { input: { expression: 'next friday' }, output: '2024-01-19' },
    ],
  },

  // Transfer protocol
  create_transfer: {
    name: 'create_transfer',
    description: 'Create a transfer payload for sending dates between server and client with timezone context',
    parameters: {
      type: 'object',
      properties: {
        date: { type: 'string', description: 'Date to transfer' },
        timezone: { type: 'string', description: 'Origin timezone' },
      },
      required: ['date', 'timezone'],
    },
    examples: [
      {
        input: { date: '2024-01-15T15:00:00', timezone: 'America/New_York' },
        output: { iso: '2024-01-15T20:00:00.000Z', originZone: 'America/New_York', originOffset: -300 },
      },
    ],
  },
}

/**
 * Execute an MCP tool
 */
export function executeMcpTool(toolName: string, params: Record<string, unknown>): unknown {
  switch (toolName) {
    case 'whenny': {
      const w = createWhenny(params.date as string)
      if (params.timezone) {
        return w.inZone(params.timezone as string)
      }
      return w
    }

    case 'format_datewind': {
      const w = createWhenny(params.date as string)
      const style = params.style as string
      switch (style) {
        case 'xs': return w.xs
        case 'sm': return w.sm
        case 'md': return w.md
        case 'lg': return w.lg
        case 'xl': return w.xl
        case 'clock': return w.clock
        case 'sortable': return w.sortable
        case 'log': return w.log
        default: return w.md
      }
    }

    case 'format_smart':
      return smart(params.date as string, params.timezone ? { for: params.timezone as string } : undefined)

    case 'format_relative':
      return relative(params.date as string, params.from ? { from: params.from as string } : undefined)

    case 'format_duration': {
      const d = duration(params.seconds as number)
      const style = (params.style as string) || 'compact'
      switch (style) {
        case 'long': return d.long()
        case 'compact': return d.compact()
        case 'brief': return d.brief()
        case 'timer': return d.timer()
        case 'clock': return d.clock()
        case 'minimal': return d.minimal()
        case 'human': return d.human()
        default: return d.compact()
      }
    }

    case 'compare_dates': {
      const result = compare(params.dateA as string, params.dateB as string)
      const unit = (params.unit as string) || 'smart'
      switch (unit) {
        case 'smart': return result.smart()
        case 'days': return result.days()
        case 'hours': return result.hours()
        case 'minutes': return result.minutes()
        case 'seconds': return result.seconds()
        default: return result.smart()
      }
    }

    case 'calendar_check': {
      const check = params.check as string
      const date = params.date as string
      switch (check) {
        case 'isToday': return calendar.isToday(date)
        case 'isYesterday': return calendar.isYesterday(date)
        case 'isTomorrow': return calendar.isTomorrow(date)
        case 'isWeekend': return calendar.isWeekend(date)
        case 'isWeekday': return calendar.isWeekday(date)
        case 'isBusinessDay': return calendar.isBusinessDay(date)
        case 'isPast': return calendar.isPast(date)
        case 'isFuture': return calendar.isFuture(date)
        default: return false
      }
    }

    case 'add_business_days':
      return calendar.addBusinessDays(params.date as string, params.days as number).toISOString()

    case 'parse_natural':
      return parseNatural(params.expression as string, params.from ? { from: new Date(params.from as string) } : undefined)?.toISOString()

    case 'create_transfer':
      return createTransfer(params.date as string, { timezone: params.timezone as string })

    default:
      throw new Error(`Unknown tool: ${toolName}`)
  }
}

/**
 * Get all available MCP tools
 */
export function getMcpTools() {
  return Object.values(mcpTools)
}

/**
 * MCP Server manifest
 */
export const mcpManifest = {
  name: 'whenny',
  version: '0.0.1',
  description: 'Date formatting and manipulation library optimized for AI',
  tools: getMcpTools(),
}
