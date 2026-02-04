/**
 * MCP Command
 *
 * Start the Whenny MCP server for AI assistant integration.
 * This allows Claude and other AI assistants to use Whenny functions.
 */

import readline from 'readline'

// Import the MCP tools from whenny package
// Note: We dynamically import to avoid bundling issues
async function getMcpModule() {
  try {
    const whenny = await import('whenny')
    return {
      mcpManifest: whenny.mcpManifest,
      getMcpTools: whenny.getMcpTools,
      executeMcpTool: whenny.executeMcpTool,
    }
  } catch {
    // Fallback: Define tools inline if whenny package not available
    return getFallbackMcp()
  }
}

function getFallbackMcp() {
  const { whenny, relative, smart, compare, duration, calendar, createTransfer } = require('whenny')

  const tools = [
    {
      name: 'whenny',
      description: 'Create a Whenny date instance for formatting',
      inputSchema: {
        type: 'object',
        properties: {
          date: { type: 'string', description: 'Date string, ISO format, or timestamp' },
          timezone: { type: 'string', description: 'Optional timezone' },
        },
        required: ['date'],
      },
    },
    {
      name: 'format_smart',
      description: 'Smart format a date based on distance (just now, 5 min ago, Yesterday, etc.)',
      inputSchema: {
        type: 'object',
        properties: {
          date: { type: 'string', description: 'Date to format' },
        },
        required: ['date'],
      },
    },
    {
      name: 'format_relative',
      description: 'Format a date as relative time (5 minutes ago, in 3 days)',
      inputSchema: {
        type: 'object',
        properties: {
          date: { type: 'string', description: 'Date to format' },
        },
        required: ['date'],
      },
    },
    {
      name: 'format_duration',
      description: 'Format a duration in seconds',
      inputSchema: {
        type: 'object',
        properties: {
          seconds: { type: 'number', description: 'Duration in seconds' },
          style: { type: 'string', enum: ['long', 'compact', 'clock', 'human'] },
        },
        required: ['seconds'],
      },
    },
    {
      name: 'compare_dates',
      description: 'Compare two dates',
      inputSchema: {
        type: 'object',
        properties: {
          dateA: { type: 'string' },
          dateB: { type: 'string' },
        },
        required: ['dateA', 'dateB'],
      },
    },
    {
      name: 'calendar_check',
      description: 'Check calendar properties (isToday, isWeekend, etc.)',
      inputSchema: {
        type: 'object',
        properties: {
          date: { type: 'string' },
          check: { type: 'string', enum: ['isToday', 'isYesterday', 'isTomorrow', 'isWeekend', 'isWeekday', 'isPast', 'isFuture'] },
        },
        required: ['date', 'check'],
      },
    },
  ]

  const executeTool = (name: string, args: Record<string, unknown>) => {
    switch (name) {
      case 'whenny':
        return whenny(args.date as string).toISO()
      case 'format_smart':
        return smart(args.date as string)
      case 'format_relative':
        return relative(args.date as string)
      case 'format_duration': {
        const d = duration(args.seconds as number)
        const style = (args.style as string) || 'compact'
        switch (style) {
          case 'long': return d.long()
          case 'compact': return d.compact()
          case 'clock': return d.clock()
          case 'human': return d.human()
          default: return d.compact()
        }
      }
      case 'compare_dates':
        return compare(args.dateA as string, args.dateB as string).smart()
      case 'calendar_check': {
        const check = args.check as string
        switch (check) {
          case 'isToday': return calendar.isToday(args.date as string)
          case 'isYesterday': return calendar.isYesterday(args.date as string)
          case 'isTomorrow': return calendar.isTomorrow(args.date as string)
          case 'isWeekend': return calendar.isWeekend(args.date as string)
          case 'isWeekday': return calendar.isWeekday(args.date as string)
          case 'isPast': return calendar.isPast(args.date as string)
          case 'isFuture': return calendar.isFuture(args.date as string)
          default: return false
        }
      }
      default:
        throw new Error(`Unknown tool: ${name}`)
    }
  }

  return {
    mcpManifest: { name: 'whenny', version: '1.0.0', tools },
    getMcpTools: () => tools,
    executeMcpTool: executeTool,
  }
}

interface JsonRpcRequest {
  jsonrpc: '2.0'
  id: string | number
  method: string
  params?: Record<string, unknown>
}

interface JsonRpcResponse {
  jsonrpc: '2.0'
  id: string | number | null
  result?: unknown
  error?: {
    code: number
    message: string
    data?: unknown
  }
}

export async function mcp(): Promise<void> {
  const mcpModule = await getMcpModule()

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: false,
  })

  function send(response: JsonRpcResponse) {
    const json = JSON.stringify(response)
    process.stdout.write(`Content-Length: ${Buffer.byteLength(json)}\r\n\r\n${json}`)
  }

  function handleRequest(request: JsonRpcRequest): JsonRpcResponse {
    const { id, method, params } = request

    try {
      switch (method) {
        case 'initialize':
          return {
            jsonrpc: '2.0',
            id,
            result: {
              protocolVersion: '2024-11-05',
              serverInfo: {
                name: 'whenny',
                version: '1.0.7',
              },
              capabilities: {
                tools: {},
              },
            },
          }

        case 'tools/list':
          return {
            jsonrpc: '2.0',
            id,
            result: {
              tools: mcpModule.getMcpTools().map((tool: { name: string; description: string; parameters?: unknown; inputSchema?: unknown }) => ({
                name: tool.name,
                description: tool.description,
                inputSchema: tool.inputSchema || tool.parameters || {
                  type: 'object',
                  properties: {},
                },
              })),
            },
          }

        case 'tools/call': {
          const toolName = (params as { name: string }).name
          const toolArgs = (params as { arguments?: Record<string, unknown> }).arguments || {}

          try {
            const result = mcpModule.executeMcpTool(toolName, toolArgs)
            return {
              jsonrpc: '2.0',
              id,
              result: {
                content: [
                  {
                    type: 'text',
                    text: typeof result === 'string' ? result : JSON.stringify(result),
                  },
                ],
              },
            }
          } catch (err) {
            return {
              jsonrpc: '2.0',
              id,
              result: {
                content: [
                  {
                    type: 'text',
                    text: `Error: ${err instanceof Error ? err.message : String(err)}`,
                  },
                ],
                isError: true,
              },
            }
          }
        }

        case 'notifications/initialized':
          // Client acknowledged initialization, no response needed
          return { jsonrpc: '2.0', id, result: {} }

        default:
          return {
            jsonrpc: '2.0',
            id,
            error: {
              code: -32601,
              message: `Method not found: ${method}`,
            },
          }
      }
    } catch (err) {
      return {
        jsonrpc: '2.0',
        id,
        error: {
          code: -32603,
          message: err instanceof Error ? err.message : 'Internal error',
        },
      }
    }
  }

  let buffer = ''

  rl.on('line', (line) => {
    buffer += line + '\n'

    // Check for complete message (Content-Length header + JSON body)
    const headerMatch = buffer.match(/Content-Length: (\d+)\r?\n\r?\n/)
    if (headerMatch) {
      const contentLength = parseInt(headerMatch[1], 10)
      const headerEnd = buffer.indexOf('\r\n\r\n') + 4
      const actualHeaderEnd = headerEnd >= 4 ? headerEnd : buffer.indexOf('\n\n') + 2
      const body = buffer.slice(actualHeaderEnd)

      if (body.length >= contentLength) {
        try {
          const jsonBody = body.slice(0, contentLength)
          const request = JSON.parse(jsonBody) as JsonRpcRequest
          const response = handleRequest(request)
          send(response)
        } catch (err) {
          send({
            jsonrpc: '2.0',
            id: null,
            error: {
              code: -32700,
              message: 'Parse error',
            },
          })
        }
        buffer = body.slice(contentLength)
      }
    }
  })

  // Keep the process running
  process.stdin.resume()
}
