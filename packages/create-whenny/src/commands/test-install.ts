/**
 * Test Install Command
 *
 * The "traveling test fair" - spins up a fresh project,
 * installs whenny, generates test files for every function,
 * runs them, and shows results.
 */

import fs from 'fs-extra'
import path from 'path'
import chalk from 'chalk'
import ora from 'ora'
import prompts from 'prompts'
import { execSync, spawn } from 'child_process'
import { MODULES } from '../templates/index.js'

interface TestResult {
  name: string
  module: string
  passed: boolean
  error?: string
  duration: number
  code?: string
}

interface TestSuiteResult {
  total: number
  passed: number
  failed: number
  duration: number
  results: TestResult[]
  timestamp: string
}

// Map of test name -> test source code
type TestCodeMap = Record<string, string>

export async function testInstall(options: {
  keep?: boolean
  verbose?: boolean
  output?: string
}): Promise<void> {
  const now = new Date()
  const utcTime = now.toISOString().replace('T', ' ').slice(0, 19) + ' UTC'
  const localTime = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })
  const localZone = Intl.DateTimeFormat().resolvedOptions().timeZone

  console.log()
  console.log(chalk.bold.cyan('  ⏱️  Entering the Whenny Zone'))
  console.log(chalk.gray(`  When are we? ${chalk.white(utcTime)} | ${chalk.yellow(localTime)} ${chalk.gray(localZone)}`))
  console.log()

  // Use a valid npm package name format (no dots at start, lowercase, hyphens)
  const timestamp = now.getTime().toString()
  const testDir = path.join(process.cwd(), `whenny-test-${timestamp}`)
  const resultsFile = options.output ?? path.join(process.cwd(), `whenny-test-results-${timestamp}.html`)

  const spinner = ora('Setting up test environment...').start()

  try {
    // Step 1: Create test directory
    spinner.text = 'Creating test project...'
    await fs.ensureDir(testDir)

    // Step 2: Initialize npm project
    spinner.text = 'Initializing npm project...'
    execSync('npm init -y', { cwd: testDir, stdio: 'pipe' })

    // Step 3: Create package.json with proper config
    const packageJson = {
      name: 'whenny-integration-test',
      version: '1.0.0',
      type: 'module',
      scripts: {
        test: 'node --experimental-vm-modules node_modules/jest/bin/jest.js --testEnvironment=node',
      },
      devDependencies: {
        jest: '^29.0.0',
        '@types/jest': '^29.0.0',
      },
    }
    await fs.writeJson(path.join(testDir, 'package.json'), packageJson, { spaces: 2 })

    // Step 4: Install whenny
    spinner.text = 'Installing whenny from npm...'
    execSync('npm install whenny whenny-react --save', { cwd: testDir, stdio: 'pipe' })
    execSync('npm install jest @types/jest --save-dev', { cwd: testDir, stdio: 'pipe' })

    // Step 5: Generate test files
    spinner.text = 'Generating test files...'
    const { files: testFiles, codeMap } = generateTestFiles()

    const testsDir = path.join(testDir, '__tests__')
    await fs.ensureDir(testsDir)

    for (const [filename, content] of Object.entries(testFiles)) {
      await fs.writeFile(path.join(testsDir, filename), content)
    }

    // Step 6: Create jest config
    const jestConfig = `
export default {
  testEnvironment: 'node',
  transform: {},
  moduleFileExtensions: ['js', 'mjs'],
  testMatch: ['**/__tests__/**/*.test.js'],
};
`
    await fs.writeFile(path.join(testDir, 'jest.config.js'), jestConfig)

    // Step 7: Run tests and collect results
    spinner.text = 'Running integration tests...'

    const startTime = Date.now()
    let testOutput = ''

    try {
      testOutput = execSync('npm test -- --json --outputFile=test-results.json 2>&1', {
        cwd: testDir,
        encoding: 'utf8',
        stdio: 'pipe',
      })
    } catch (e: any) {
      testOutput = e.stdout || e.message
    }

    const duration = Date.now() - startTime

    // Step 8: Parse results
    spinner.text = 'Parsing test results...'

    let results: TestSuiteResult

    try {
      const jsonResults = await fs.readJson(path.join(testDir, 'test-results.json'))
      results = parseJestResults(jsonResults, duration, codeMap)
    } catch {
      // Fallback: parse from output
      results = parseTestOutput(testOutput, duration, codeMap)
    }

    // Step 9: Generate HTML report
    spinner.text = 'Generating results page...'
    const html = generateResultsHtml(results)
    await fs.writeFile(resultsFile, html)

    spinner.stop()

    // Print summary
    console.log()
    console.log(chalk.bold('  Test Results'))
    console.log()

    if (results.failed === 0) {
      console.log(chalk.green(`  ✓ All ${results.passed} tests passed!`))
    } else {
      console.log(chalk.red(`  ✗ ${results.failed} of ${results.total} tests failed`))
      console.log()

      for (const result of results.results.filter(r => !r.passed)) {
        console.log(chalk.red(`    ✗ ${result.module}/${result.name}`))
        if (result.error) {
          console.log(chalk.gray(`      ${result.error.split('\n')[0]}`))
        }
      }
    }

    console.log()
    console.log(chalk.gray(`  Duration: ${results.duration}ms`))
    console.log(chalk.gray(`  Report: ${resultsFile}`))
    console.log(chalk.gray(`  Test dir: ${testDir}`))

    console.log()
    console.log(chalk.cyan('  ⏱️  Whenny knows when. Now you do too.'))
    console.log()

    // Cleanup prompt (unless --keep flag explicitly set)
    if (!options.keep) {
      const { cleanup } = await prompts({
        type: 'confirm',
        name: 'cleanup',
        message: 'Clean up test directory?',
        initial: false
      })

      if (cleanup) {
        await fs.remove(testDir)
        console.log(chalk.gray('  Test directory removed.'))
        console.log()
      }
    }

    // Exit with error code if tests failed
    if (results.failed > 0) {
      process.exit(1)
    }

  } catch (error: any) {
    spinner.fail('Test installation failed')
    console.error(chalk.red(error.message))

    if (!options.keep) {
      await fs.remove(testDir).catch(() => {})
    }

    process.exit(1)
  }
}

function generateTestFiles(): Record<string, string> {
  const files: Record<string, string> = {}

  // Core module tests
  files['core.test.js'] = `
import {
  whenny,
  parseDate,
  format,
  addTime,
  startOfDay,
  endOfDay,
  isToday,
  isYesterday,
  isTomorrow,
  differenceInSeconds,
  padZero,
  formatOrdinal,
} from 'whenny'

describe('Core Module', () => {
  describe('whenny()', () => {
    test('creates instance from Date', () => {
      const date = new Date('2024-01-15T10:30:00Z')
      const w = whenny(date)
      expect(w.toDate()).toBeInstanceOf(Date)
    })

    test('creates instance from string', () => {
      const w = whenny('2024-01-15')
      expect(w.year).toBe(2024)
      expect(w.month).toBe(1)
      expect(w.day).toBe(15)
    })

    test('creates instance from timestamp', () => {
      const ts = Date.now()
      const w = whenny(ts)
      expect(w.valueOf()).toBe(ts)
    })

    test('.short() formats correctly', () => {
      const w = whenny('2024-01-15')
      expect(w.short()).toMatch(/Jan\\s*15/)
    })

    test('.long() formats correctly', () => {
      const w = whenny('2024-01-15')
      expect(w.long()).toMatch(/January\\s*15,?\\s*2024/)
    })

    test('.iso() returns ISO string', () => {
      const w = whenny('2024-01-15T10:30:00Z')
      expect(w.iso()).toContain('2024-01-15')
    })

    test('.time() formats time', () => {
      const w = whenny('2024-01-15T15:30:00')
      const time = w.time()
      expect(time).toMatch(/3:30\\s*PM|15:30/)
    })

    test('.relative() returns relative time', () => {
      const recent = whenny(new Date(Date.now() - 60000))
      expect(recent.relative()).toMatch(/minute|just now/i)
    })

    test('.add() adds time', () => {
      const w = whenny('2024-01-15')
      const added = w.add(1, 'day')
      expect(added.day).toBe(16)
    })

    test('.subtract() subtracts time', () => {
      const w = whenny('2024-01-15')
      const subtracted = w.subtract(1, 'day')
      expect(subtracted.day).toBe(14)
    })

    test('whenny.now() returns current time', () => {
      const now = whenny.now()
      expect(Math.abs(now.valueOf() - Date.now())).toBeLessThan(1000)
    })
  })

  describe('parseDate()', () => {
    test('parses Date object', () => {
      const date = new Date()
      expect(parseDate(date)).toBeInstanceOf(Date)
    })

    test('parses ISO string', () => {
      const result = parseDate('2024-01-15T10:30:00Z')
      expect(result.getFullYear()).toBe(2024)
    })

    test('parses timestamp', () => {
      const ts = Date.now()
      expect(parseDate(ts).getTime()).toBe(ts)
    })
  })

  describe('format()', () => {
    test('formats with tokens', () => {
      const date = new Date('2024-01-15')
      const result = format(date, '{year}-{month}-{day}')
      expect(result).toBe('2024-01-15')
    })

    test('formats weekday', () => {
      const date = new Date('2024-01-15') // Monday
      const result = format(date, '{weekday}')
      expect(result).toBe('Monday')
    })

    test('formats ordinal day', () => {
      const date = new Date('2024-01-15')
      const result = format(date, '{dayOrdinal}')
      expect(result).toBe('15th')
    })
  })

  describe('addTime()', () => {
    test('adds days', () => {
      const date = new Date('2024-01-15')
      const result = addTime(date, 5, 'days')
      expect(result.getDate()).toBe(20)
    })

    test('adds months', () => {
      const date = new Date('2024-01-15')
      const result = addTime(date, 1, 'month')
      expect(result.getMonth()).toBe(1) // February
    })

    test('adds negative amounts', () => {
      const date = new Date('2024-01-15')
      const result = addTime(date, -5, 'days')
      expect(result.getDate()).toBe(10)
    })
  })

  describe('Day utilities', () => {
    test('startOfDay() sets to midnight', () => {
      const date = new Date('2024-01-15T15:30:45')
      const result = startOfDay(date)
      expect(result.getHours()).toBe(0)
      expect(result.getMinutes()).toBe(0)
    })

    test('endOfDay() sets to 23:59:59', () => {
      const date = new Date('2024-01-15T10:00:00')
      const result = endOfDay(date)
      expect(result.getHours()).toBe(23)
      expect(result.getMinutes()).toBe(59)
    })

    test('isToday() returns true for today', () => {
      expect(isToday(new Date())).toBe(true)
    })

    test('isToday() returns false for yesterday', () => {
      const yesterday = new Date(Date.now() - 86400000)
      expect(isToday(yesterday)).toBe(false)
    })
  })

  describe('Formatting utilities', () => {
    test('padZero() pads single digits', () => {
      expect(padZero(5)).toBe('05')
      expect(padZero(15)).toBe('15')
    })

    test('formatOrdinal() adds suffix', () => {
      expect(formatOrdinal(1)).toBe('1st')
      expect(formatOrdinal(2)).toBe('2nd')
      expect(formatOrdinal(3)).toBe('3rd')
      expect(formatOrdinal(4)).toBe('4th')
      expect(formatOrdinal(11)).toBe('11th')
      expect(formatOrdinal(21)).toBe('21st')
    })
  })
})
`

  // Datewind styles tests
  files['datewind.test.js'] = `
import { whenny, createWhenny } from 'whenny'

describe('Datewind Styles', () => {
  const testDate = new Date('2024-06-15T15:30:45')

  test('xs style formats minimal', () => {
    const w = createWhenny(testDate)
    expect(typeof w.xs).toBe('string')
    expect(w.xs.length).toBeLessThan(10)
  })

  test('sm style includes month', () => {
    const w = createWhenny(testDate)
    expect(typeof w.sm).toBe('string')
    expect(w.sm).toMatch(/Jun|6/)
  })

  test('md style includes year', () => {
    const w = createWhenny(testDate)
    expect(typeof w.md).toBe('string')
    expect(w.md).toMatch(/2024/)
  })

  test('lg style is verbose', () => {
    const w = createWhenny(testDate)
    expect(typeof w.lg).toBe('string')
    expect(w.lg.length).toBeGreaterThan(10)
  })

  test('xl style includes weekday', () => {
    const w = createWhenny(testDate)
    expect(typeof w.xl).toBe('string')
    expect(w.xl).toMatch(/Saturday/)
  })

  test('clock style shows time', () => {
    const w = createWhenny(testDate)
    expect(typeof w.clock).toBe('string')
    expect(w.clock).toMatch(/3:30|15:30/)
  })

  test('sortable style is ISO-like', () => {
    const w = createWhenny(testDate)
    expect(typeof w.sortable).toBe('string')
    expect(w.sortable).toMatch(/2024-06-15/)
  })

  test('log style includes time', () => {
    const w = createWhenny(testDate)
    expect(typeof w.log).toBe('string')
    expect(w.log).toMatch(/2024-06-15/)
    expect(w.log).toMatch(/15:30/)
  })
})
`

  // Duration tests
  files['duration.test.js'] = `
import { duration, durationBetween, until, since } from 'whenny'

describe('Duration Module', () => {
  describe('duration()', () => {
    test('long format', () => {
      const d = duration(3661)
      expect(d.long()).toMatch(/1 hour.*1 minute.*1 second/)
    })

    test('compact format', () => {
      const d = duration(3661)
      expect(d.compact()).toMatch(/1h.*1m.*1s/)
    })

    test('clock format', () => {
      const d = duration(3661)
      expect(d.clock()).toBe('1:01:01')
    })

    test('clock format without hours', () => {
      const d = duration(125)
      expect(d.clock()).toBe('2:05')
    })

    test('human format for hours', () => {
      const d = duration(7200)
      expect(d.human()).toMatch(/2 hours/)
    })

    test('human format for minutes', () => {
      const d = duration(300)
      expect(d.human()).toMatch(/5 minutes/)
    })

    test('exposes component values', () => {
      const d = duration(3661)
      expect(d.hours).toBe(1)
      expect(d.minutes).toBe(1)
      expect(d.seconds).toBe(1)
      expect(d.totalSeconds).toBe(3661)
    })
  })

  describe('durationBetween()', () => {
    test('calculates duration between dates', () => {
      const a = new Date('2024-01-15T10:00:00')
      const b = new Date('2024-01-15T11:00:00')
      const d = durationBetween(a, b)
      expect(d.hours).toBe(1)
    })
  })
})
`

  // Compare tests
  files['compare.test.js'] = `
import { compare, distance } from 'whenny'

describe('Compare Module', () => {
  const dateA = new Date('2024-01-15T10:00:00')
  const dateB = new Date('2024-01-17T10:00:00')

  describe('compare()', () => {
    test('smart() describes relationship', () => {
      const result = compare(dateA, dateB).smart()
      expect(result).toMatch(/2 days before/)
    })

    test('days() returns day difference', () => {
      expect(compare(dateA, dateB).days()).toBe(-2)
    })

    test('hours() returns hour difference', () => {
      expect(compare(dateA, dateB).hours()).toBe(-48)
    })

    test('isBefore() returns true when earlier', () => {
      expect(compare(dateA, dateB).isBefore()).toBe(true)
    })

    test('isAfter() returns true when later', () => {
      expect(compare(dateB, dateA).isAfter()).toBe(true)
    })

    test('isSame() checks equality', () => {
      expect(compare(dateA, dateA).isSame()).toBe(true)
    })

    test('isSame("day") checks same day', () => {
      const sameDay = new Date('2024-01-15T15:00:00')
      expect(compare(dateA, sameDay).isSame('day')).toBe(true)
    })
  })

  describe('distance()', () => {
    test('human() returns human-readable', () => {
      const d = distance(dateA, dateB)
      expect(d.human()).toMatch(/2 days/)
    })

    test('exact() returns detailed breakdown', () => {
      const d = distance(dateA, dateB)
      expect(d.exact()).toMatch(/2 days/)
    })

    test('exposes component values', () => {
      const d = distance(dateA, dateB)
      expect(d.days).toBe(2)
      expect(d.hours).toBe(0)
    })
  })
})
`

  // Calendar tests
  files['calendar.test.js'] = `
import { calendar } from 'whenny'

describe('Calendar Module', () => {
  test('isToday() returns true for today', () => {
    expect(calendar.isToday(new Date())).toBe(true)
  })

  test('isYesterday() works correctly', () => {
    const yesterday = new Date(Date.now() - 86400000)
    expect(calendar.isYesterday(yesterday)).toBe(true)
  })

  test('isTomorrow() works correctly', () => {
    const tomorrow = new Date(Date.now() + 86400000)
    expect(calendar.isTomorrow(tomorrow)).toBe(true)
  })

  test('isWeekend() detects Saturday/Sunday', () => {
    // Use local dates (month is 0-indexed) to avoid UTC timezone shifts
    const saturday = new Date(2024, 0, 13, 12, 0, 0) // Saturday Jan 13, 2024 at noon local
    const monday = new Date(2024, 0, 15, 12, 0, 0) // Monday Jan 15, 2024 at noon local
    expect(calendar.isWeekend(saturday)).toBe(true)
    expect(calendar.isWeekend(monday)).toBe(false)
  })

  test('isWeekday() detects weekdays', () => {
    const monday = new Date(2024, 0, 15, 12, 0, 0) // Monday at noon local
    expect(calendar.isWeekday(monday)).toBe(true)
  })

  test('isBusinessDay() uses config', () => {
    const monday = new Date(2024, 0, 15, 12, 0, 0) // Monday at noon local
    const saturday = new Date(2024, 0, 13, 12, 0, 0) // Saturday at noon local
    expect(calendar.isBusinessDay(monday)).toBe(true)
    expect(calendar.isBusinessDay(saturday)).toBe(false)
  })

  test('isPast() detects past dates', () => {
    const past = new Date('2020-01-01')
    expect(calendar.isPast(past)).toBe(true)
  })

  test('isFuture() detects future dates', () => {
    const future = new Date('2030-01-01')
    expect(calendar.isFuture(future)).toBe(true)
  })

  test('isBetween() checks range', () => {
    const date = new Date('2024-01-15')
    const start = new Date('2024-01-01')
    const end = new Date('2024-01-31')
    expect(calendar.isBetween(date, start, end)).toBe(true)
  })

  test('startOf("day") returns midnight', () => {
    const date = new Date('2024-01-15T15:30:00')
    const start = calendar.startOf(date, 'day')
    expect(start.getHours()).toBe(0)
  })

  test('endOf("day") returns end of day', () => {
    const date = new Date('2024-01-15T10:00:00')
    const end = calendar.endOf(date, 'day')
    expect(end.getHours()).toBe(23)
  })

  test('add() adds time', () => {
    const date = new Date(2024, 0, 15, 12, 0, 0) // Jan 15 at noon local
    const result = calendar.add(date, 5, 'days')
    expect(result.getDate()).toBe(20)
  })

  test('daysUntil() counts days', () => {
    const future = new Date(Date.now() + 5 * 86400000)
    expect(calendar.daysUntil(future)).toBeGreaterThanOrEqual(4)
  })
})
`

  // Transfer tests
  files['transfer.test.js'] = `
import { createTransfer, fromTransfer, transfer } from 'whenny'

describe('Transfer Module', () => {
  describe('createTransfer()', () => {
    test('creates transfer payload', () => {
      const date = new Date()
      const payload = createTransfer(date)

      expect(payload).toHaveProperty('iso')
      expect(payload).toHaveProperty('originZone')
      expect(payload).toHaveProperty('originOffset')
    })

    test('includes timezone when specified', () => {
      const date = new Date()
      const payload = createTransfer(date, { timezone: 'America/New_York' })

      expect(payload.originZone).toBe('America/New_York')
    })
  })

  describe('fromTransfer()', () => {
    test('parses transfer payload', () => {
      const original = new Date()
      const payload = createTransfer(original, { timezone: 'UTC' })
      const result = fromTransfer(payload)

      expect(result.date).toBeInstanceOf(Date)
      expect(result.originZone).toBe('UTC')
    })

    test('provides utility methods', () => {
      const payload = createTransfer(new Date(), { timezone: 'UTC' })
      const result = fromTransfer(payload)

      expect(typeof result.utc).toBe('function')
      expect(typeof result.toISO).toBe('function')
      expect(typeof result.dayBoundsInOrigin).toBe('function')
    })
  })

  describe('transfer shorthand', () => {
    test('transfer.create() works', () => {
      const payload = transfer.create(new Date())
      expect(payload).toHaveProperty('iso')
    })

    test('transfer.from() works', () => {
      const payload = transfer.create(new Date())
      const result = transfer.from(payload)
      expect(result.date).toBeInstanceOf(Date)
    })
  })
})
`

  // Natural language tests
  files['natural.test.js'] = `
import { parse, canParse, natural } from 'whenny/natural'

describe('Natural Language Module', () => {
  describe('parse()', () => {
    test('parses "now"', () => {
      const result = parse('now')
      expect(result).toBeInstanceOf(Date)
      expect(Math.abs(result.getTime() - Date.now())).toBeLessThan(1000)
    })

    test('parses "today"', () => {
      const result = parse('today')
      expect(result).toBeInstanceOf(Date)
      expect(result.getHours()).toBe(0)
    })

    test('parses "tomorrow"', () => {
      const result = parse('tomorrow')
      const tomorrow = new Date()
      tomorrow.setDate(tomorrow.getDate() + 1)
      expect(result.getDate()).toBe(tomorrow.getDate())
    })

    test('parses "yesterday"', () => {
      const result = parse('yesterday')
      const yesterday = new Date()
      yesterday.setDate(yesterday.getDate() - 1)
      expect(result.getDate()).toBe(yesterday.getDate())
    })

    test('parses "in X days"', () => {
      const result = parse('in 5 days')
      const expected = new Date()
      expected.setDate(expected.getDate() + 5)
      expect(result.getDate()).toBe(expected.getDate())
    })

    test('parses "X days ago"', () => {
      const result = parse('3 days ago')
      const expected = new Date()
      expected.setDate(expected.getDate() - 3)
      expect(result.getDate()).toBe(expected.getDate())
    })

    test('parses "next friday"', () => {
      const result = parse('next friday')
      expect(result).toBeInstanceOf(Date)
      expect(result.getDay()).toBe(5) // Friday
    })

    test('parses "tomorrow at 3pm"', () => {
      const result = parse('tomorrow at 3pm')
      expect(result).toBeInstanceOf(Date)
      expect(result.getHours()).toBe(15)
    })

    test('returns null for unparseable', () => {
      const result = parse('gibberish xyz 123')
      expect(result).toBeNull()
    })
  })

  describe('canParse()', () => {
    test('returns true for valid expressions', () => {
      expect(canParse('tomorrow')).toBe(true)
      expect(canParse('in 5 days')).toBe(true)
    })

    test('returns false for invalid expressions', () => {
      expect(canParse('not a date')).toBe(false)
    })
  })

  describe('natural shorthand', () => {
    test('natural.parse() works', () => {
      expect(natural.parse('today')).toBeInstanceOf(Date)
    })

    test('natural.canParse() works', () => {
      expect(natural.canParse('tomorrow')).toBe(true)
    })
  })
})
`

  // Timezone tests
  files['timezone.test.js'] = `
import { tz, local, offset, dayBounds } from 'whenny'

describe('Timezone Module', () => {
  describe('local()', () => {
    test('returns a timezone string', () => {
      const timezone = local()
      expect(typeof timezone).toBe('string')
      expect(timezone.length).toBeGreaterThan(0)
    })
  })

  describe('offset()', () => {
    test('returns UTC offset as 0', () => {
      const result = offset('UTC')
      expect(result).toBe(0)
    })

    test('returns offset in minutes', () => {
      const result = offset('America/New_York')
      expect(typeof result).toBe('number')
      // EST is -5 hours = -300 minutes, EDT is -4 hours = -240 minutes
      expect(result).toBeLessThanOrEqual(0)
    })
  })

  describe('dayBounds()', () => {
    test('returns start and end of day', () => {
      const bounds = dayBounds({ for: 'UTC' })
      expect(bounds).toHaveProperty('start')
      expect(bounds).toHaveProperty('end')
      expect(bounds.start).toBeInstanceOf(Date)
      expect(bounds.end).toBeInstanceOf(Date)
    })
  })

  describe('tz shorthand', () => {
    test('tz.local() works', () => {
      expect(typeof tz.local()).toBe('string')
    })

    test('tz.offset() works', () => {
      expect(typeof tz.offset('UTC')).toBe('number')
    })
  })
})
`

  // i18n tests
  files['i18n.test.js'] = `
import { getLocale, registerLocale, locales, en, es, fr, de, ja, zh } from 'whenny'

describe('Internationalization Module', () => {
  describe('Built-in locales', () => {
    test('en locale exists', () => {
      expect(en).toBeDefined()
      expect(en.justNow).toBeDefined()
    })

    test('es locale exists', () => {
      expect(es).toBeDefined()
      expect(es.justNow).toBeDefined()
    })

    test('fr locale exists', () => {
      expect(fr).toBeDefined()
      expect(fr.justNow).toBeDefined()
    })

    test('de locale exists', () => {
      expect(de).toBeDefined()
      expect(de.justNow).toBeDefined()
    })

    test('ja locale exists', () => {
      expect(ja).toBeDefined()
      expect(ja.justNow).toBeDefined()
    })

    test('zh locale exists', () => {
      expect(zh).toBeDefined()
      expect(zh.justNow).toBeDefined()
    })
  })

  describe('getLocale()', () => {
    test('retrieves English locale', () => {
      const locale = getLocale('en')
      expect(locale).toBeDefined()
      expect(locale.justNow).toBe('just now')
    })

    test('retrieves Spanish locale', () => {
      const locale = getLocale('es')
      expect(locale).toBeDefined()
      expect(locale.justNow).toBe('ahora mismo')
    })
  })

  describe('registerLocale()', () => {
    test('registers custom locale', () => {
      registerLocale('test', {
        justNow: 'test now',
        secondsAgo: (n) => \`\${n} test seconds\`,
        minutesAgo: (n) => \`\${n} test minutes\`,
        hoursAgo: (n) => \`\${n} test hours\`,
        yesterday: 'test yesterday',
        daysAgo: (n) => \`\${n} test days\`,
      })

      const locale = getLocale('test')
      expect(locale.justNow).toBe('test now')
    })
  })

  describe('locales', () => {
    test('locales object contains all built-ins', () => {
      expect(locales.en).toBeDefined()
      expect(locales.es).toBeDefined()
      expect(locales.fr).toBeDefined()
      expect(locales.de).toBeDefined()
      expect(locales.ja).toBeDefined()
      expect(locales.zh).toBeDefined()
    })
  })
})
`

  // MCP tests
  files['mcp.test.js'] = `
import { mcpTools, mcpManifest, getMcpTools, executeMcpTool } from 'whenny'

describe('MCP Server Module', () => {
  describe('mcpTools', () => {
    test('contains tool definitions', () => {
      expect(mcpTools).toBeDefined()
      expect(Object.keys(mcpTools).length).toBeGreaterThan(0)
    })

    test('format_datewind tool exists', () => {
      expect(mcpTools.format_datewind).toBeDefined()
      expect(mcpTools.format_datewind.name).toBe('format_datewind')
    })

    test('format_relative tool exists', () => {
      expect(mcpTools.format_relative).toBeDefined()
    })

    test('compare_dates tool exists', () => {
      expect(mcpTools.compare_dates).toBeDefined()
    })
  })

  describe('getMcpTools()', () => {
    test('returns array of tools', () => {
      const tools = getMcpTools()
      expect(Array.isArray(tools)).toBe(true)
      expect(tools.length).toBeGreaterThan(0)
    })
  })

  describe('mcpManifest', () => {
    test('has server info', () => {
      expect(mcpManifest).toBeDefined()
      expect(mcpManifest.name).toBe('whenny')
    })
  })

  describe('executeMcpTool()', () => {
    test('executes format_datewind', () => {
      const result = executeMcpTool('format_datewind', {
        date: '2024-01-15',
        style: 'md'
      })
      expect(typeof result).toBe('string')
      expect(result).toMatch(/Jan.*15.*2024|2024/)
    })

    test('executes format_relative', () => {
      const result = executeMcpTool('format_relative', {
        date: new Date(Date.now() - 60000).toISOString()
      })
      expect(typeof result).toBe('string')
      expect(result).toMatch(/minute|just now/i)
    })

    test('executes calendar_check', () => {
      const result = executeMcpTool('calendar_check', {
        date: new Date().toISOString(),
        check: 'isToday'
      })
      expect(result).toBe(true)
    })
  })
})
`

  // Config tests
  files['config.test.js'] = `
import { configure, getConfig, themes, defineConfig } from 'whenny'

describe('Configuration Module', () => {
  describe('getConfig()', () => {
    test('returns current config', () => {
      const config = getConfig()
      expect(config).toBeDefined()
      expect(config.locale).toBeDefined()
    })
  })

  describe('themes', () => {
    test('casual theme exists', () => {
      expect(themes.casual).toBeDefined()
    })

    test('slack theme exists', () => {
      expect(themes.slack).toBeDefined()
    })

    test('github theme exists', () => {
      expect(themes.github).toBeDefined()
    })

    test('minimal theme exists', () => {
      expect(themes.minimal).toBeDefined()
    })
  })

  describe('defineConfig()', () => {
    test('creates valid config object', () => {
      const config = defineConfig({
        locale: 'en-US',
        relative: {
          justNow: 'right now'
        }
      })
      expect(config.locale).toBe('en-US')
      expect(config.relative.justNow).toBe('right now')
    })
  })
})
`

  // Extract individual test code snippets for the code map
  const codeMap: TestCodeMap = {}
  for (const [filename, content] of Object.entries(files)) {
    const module = filename.replace('.test.js', '')
    // Extract each test() block
    const testRegex = /test\(['"`]([^'"`]+)['"`],\s*(?:\(\)|async\s*\(\))\s*=>\s*\{([\s\S]*?)\n  \}\)/g
    let match
    while ((match = testRegex.exec(content)) !== null) {
      const testName = match[1]
      const testBody = match[2].trim()
      const key = `${module}/${testName}`
      codeMap[key] = `test('${testName}', () => {\n${testBody}\n})`
    }
  }

  return { files, codeMap }
}

function parseJestResults(json: any, totalDuration: number, codeMap: TestCodeMap): TestSuiteResult {
  const results: TestResult[] = []
  let passed = 0
  let failed = 0

  for (const testResult of json.testResults || []) {
    for (const assertion of testResult.assertionResults || []) {
      const module = testResult.name.split('/').pop()?.replace('.test.js', '') || 'unknown'
      const codeKey = `${module}/${assertion.title}`

      const result: TestResult = {
        name: assertion.title,
        module,
        passed: assertion.status === 'passed',
        duration: assertion.duration || 0,
        code: codeMap[codeKey] || undefined,
      }

      if (!result.passed && assertion.failureMessages?.length) {
        result.error = assertion.failureMessages[0]
      }

      results.push(result)
      result.passed ? passed++ : failed++
    }
  }

  return {
    total: passed + failed,
    passed,
    failed,
    duration: totalDuration,
    results,
    timestamp: new Date().toISOString(),
  }
}

function parseTestOutput(output: string, duration: number, _codeMap: TestCodeMap): TestSuiteResult {
  // Fallback parser for when JSON output isn't available
  const passMatch = output.match(/(\d+) passed/)
  const failMatch = output.match(/(\d+) failed/)

  const passed = passMatch ? parseInt(passMatch[1]) : 0
  const failed = failMatch ? parseInt(failMatch[1]) : 0

  return {
    total: passed + failed,
    passed,
    failed,
    duration,
    results: [],
    timestamp: new Date().toISOString(),
  }
}

function generateResultsHtml(results: TestSuiteResult): string {
  const passRate = results.total > 0 ? Math.round((results.passed / results.total) * 100) : 0
  const statusColor = results.failed === 0 ? '#10b981' : '#ef4444'
  const statusEmoji = results.failed === 0 ? '✅' : '❌'

  // Group results by module
  const byModule: Record<string, TestResult[]> = {}
  for (const result of results.results) {
    if (!byModule[result.module]) {
      byModule[result.module] = []
    }
    byModule[result.module].push(result)
  }

  const moduleHtml = Object.entries(byModule).map(([module, tests]) => {
    const modulePassCount = tests.filter(t => t.passed).length
    const moduleStatus = modulePassCount === tests.length ? '✅' : '⚠️'

    const testsHtml = tests.map((test, i) => {
      const testId = `test-${module}-${i}`
      return `
      <div class="test ${test.passed ? 'passed' : 'failed'}">
        <span class="status">${test.passed ? '✓' : '✗'}</span>
        <span class="name">${escapeHtml(test.name)}</span>
        ${test.code ? `<button class="code-btn" onclick="showCode('${testId}')">View Code</button>` : ''}
        <span class="duration">${test.duration}ms</span>
        ${test.error ? `<div class="error">${escapeHtml(test.error.split('\n')[0])}</div>` : ''}
        ${test.code ? `<pre class="code-block" id="${testId}" style="display:none;">${escapeHtml(test.code)}</pre>` : ''}
      </div>
    `}).join('')

    return `
      <div class="module">
        <h3>${moduleStatus} ${escapeHtml(module)} <span class="count">(${modulePassCount}/${tests.length})</span></h3>
        <div class="tests">${testsHtml}</div>
      </div>
    `
  }).join('')

  const utcNow = new Date().toISOString().replace('T', ' ').slice(0, 19) + ' UTC'

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Whenny Zone | Integration Test Results</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: #0f172a;
      color: #e2e8f0;
      padding: 2rem;
      line-height: 1.6;
    }
    .container { max-width: 900px; margin: 0 auto; }
    header {
      text-align: center;
      padding: 2rem 0;
      border-bottom: 1px solid #334155;
      margin-bottom: 2rem;
    }
    h1 { font-size: 2rem; margin-bottom: 0.5rem; }
    .subtitle { color: #94a3b8; font-size: 1rem; }

    .summary {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
      gap: 1rem;
      margin-bottom: 2rem;
    }
    .stat {
      background: #1e293b;
      padding: 1.5rem;
      border-radius: 0.5rem;
      text-align: center;
    }
    .stat-value {
      font-size: 2rem;
      font-weight: bold;
    }
    .stat-label { color: #94a3b8; font-size: 0.875rem; }
    .stat-passed .stat-value { color: #10b981; }
    .stat-failed .stat-value { color: #ef4444; }

    .progress-bar {
      height: 8px;
      background: #334155;
      border-radius: 4px;
      overflow: hidden;
      margin-bottom: 2rem;
    }
    .progress-fill {
      height: 100%;
      background: linear-gradient(90deg, #10b981, #34d399);
      transition: width 0.3s ease;
    }

    .module {
      background: #1e293b;
      border-radius: 0.5rem;
      margin-bottom: 1rem;
      overflow: hidden;
    }
    .module h3 {
      padding: 1rem 1.5rem;
      background: #334155;
      font-size: 1rem;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
    .module h3 .count { color: #94a3b8; font-weight: normal; margin-left: auto; }

    .tests { padding: 0.5rem 0; }
    .test {
      padding: 0.75rem 1.5rem;
      display: flex;
      align-items: center;
      gap: 0.75rem;
      border-bottom: 1px solid #334155;
    }
    .test:last-child { border-bottom: none; }
    .test .status { width: 1.5rem; text-align: center; }
    .test.passed .status { color: #10b981; }
    .test.failed .status { color: #ef4444; }
    .test .name { flex: 1; }
    .test .duration { color: #64748b; font-size: 0.875rem; }
    .test .error {
      width: 100%;
      margin-top: 0.5rem;
      padding: 0.75rem;
      background: #7f1d1d;
      border-radius: 0.25rem;
      font-family: monospace;
      font-size: 0.75rem;
      color: #fecaca;
      overflow-x: auto;
    }
    .test .code-btn {
      background: #334155;
      border: none;
      color: #94a3b8;
      padding: 0.25rem 0.5rem;
      border-radius: 0.25rem;
      font-size: 0.75rem;
      cursor: pointer;
      transition: all 0.2s;
    }
    .test .code-btn:hover {
      background: #475569;
      color: #e2e8f0;
    }
    .test .code-block {
      width: 100%;
      margin-top: 0.5rem;
      padding: 1rem;
      background: #0f172a;
      border: 1px solid #334155;
      border-radius: 0.25rem;
      font-family: 'SF Mono', Monaco, 'Cascadia Code', monospace;
      font-size: 0.8rem;
      color: #a5f3fc;
      overflow-x: auto;
      white-space: pre;
      line-height: 1.5;
    }

    footer {
      text-align: center;
      padding: 2rem 0;
      color: #64748b;
      font-size: 0.875rem;
    }
    footer a { color: #818cf8; }

    .badge {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.5rem 1rem;
      background: ${statusColor};
      color: white;
      border-radius: 2rem;
      font-weight: bold;
      margin: 1rem 0;
    }
  </style>
</head>
<body>
  <div class="container">
    <header>
      <h1>⏱️ Whenny Zone</h1>
      <p class="subtitle">When are we? ${utcNow}</p>
      <p class="subtitle" style="margin-top: 0.25rem; font-size: 0.875rem;">Integration test run: ${new Date(results.timestamp).toLocaleString()}</p>
      <div class="badge">${statusEmoji} ${results.failed === 0 ? 'All Tests Passed' : `${results.failed} Tests Failed`}</div>
    </header>

    <div class="summary">
      <div class="stat">
        <div class="stat-value">${results.total}</div>
        <div class="stat-label">Total Tests</div>
      </div>
      <div class="stat stat-passed">
        <div class="stat-value">${results.passed}</div>
        <div class="stat-label">Passed</div>
      </div>
      <div class="stat stat-failed">
        <div class="stat-value">${results.failed}</div>
        <div class="stat-label">Failed</div>
      </div>
      <div class="stat">
        <div class="stat-value">${passRate}%</div>
        <div class="stat-label">Pass Rate</div>
      </div>
      <div class="stat">
        <div class="stat-value">${Math.round(results.duration / 1000)}s</div>
        <div class="stat-label">Duration</div>
      </div>
    </div>

    <div class="progress-bar">
      <div class="progress-fill" style="width: ${passRate}%"></div>
    </div>

    <div class="modules">
      ${moduleHtml || '<p style="text-align: center; color: #94a3b8;">Detailed test results not available</p>'}
    </div>

    <footer>
      <p>Generated by <a href="https://whenny.dev">Whenny</a></p>
      <p>${results.failed === 0 ? 'Whenny knows when. Now you do too. ⏱️' : 'Some dates need attention. Fix and re-run. 🔧'}</p>
    </footer>
  </div>
  <script>
    function showCode(id) {
      const el = document.getElementById(id);
      if (el) {
        el.style.display = el.style.display === 'none' ? 'block' : 'none';
      }
    }
  </script>
</body>
</html>`
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}
