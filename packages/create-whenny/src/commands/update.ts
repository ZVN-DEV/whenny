/**
 * Update Command
 *
 * Update installed Whenny modules to the latest version.
 * Detects customizations and prompts before overwriting.
 */

import fs from 'fs-extra'
import path from 'path'
import chalk from 'chalk'
import ora from 'ora'
import prompts from 'prompts'
import crypto from 'crypto'
import { MODULES, getModuleTemplate } from '../templates/index.js'
import { detectWhennyPath } from '../utils/detect.js'

interface UpdateOptions {
  force?: boolean
}

interface ChecksumRecord {
  [module: string]: string
}

/**
 * Compute SHA-256 hash of a string
 */
function computeHash(content: string): string {
  return crypto.createHash('sha256').update(content).digest('hex')
}

/**
 * Read the checksums file from the whenny directory
 */
async function readChecksums(whennyDir: string): Promise<ChecksumRecord | null> {
  const checksumPath = path.join(whennyDir, '.whenny-checksums.json')
  if (await fs.pathExists(checksumPath)) {
    try {
      return await fs.readJSON(checksumPath)
    } catch {
      return null
    }
  }
  return null
}

/**
 * Write the checksums file to the whenny directory
 */
export async function writeChecksums(whennyDir: string, checksums: ChecksumRecord): Promise<void> {
  const checksumPath = path.join(whennyDir, '.whenny-checksums.json')
  await fs.writeJSON(checksumPath, checksums, { spaces: 2 })
}

/**
 * Detect installed modules by scanning .ts files in the whenny directory
 */
async function detectInstalledModules(whennyDir: string): Promise<string[]> {
  const knownModuleNames = MODULES.map(m => m.name)
  const installed: string[] = []

  for (const moduleName of knownModuleNames) {
    const filePath = path.join(whennyDir, `${moduleName}.ts`)
    if (await fs.pathExists(filePath)) {
      installed.push(moduleName)
    }
  }

  return installed
}

/**
 * Count line differences between two strings
 */
function countDifferences(a: string, b: string): number {
  const aLines = a.split('\n')
  const bLines = b.split('\n')
  let differences = 0

  for (let i = 0; i < Math.max(aLines.length, bLines.length); i++) {
    if (aLines[i] !== bLines[i]) {
      differences++
    }
  }

  return differences
}

/**
 * Show a line-by-line diff between two strings (similar to diff command)
 */
function showDiff(installed: string, latest: string, moduleName: string): void {
  const installedLines = installed.split('\n')
  const latestLines = latest.split('\n')

  console.log()
  console.log(chalk.gray(`  --- ${moduleName}.ts (installed)`))
  console.log(chalk.gray(`  +++ ${moduleName}.ts (latest)`))
  console.log()

  const maxDiffs = 20
  let shown = 0

  for (let i = 0; i < Math.max(installedLines.length, latestLines.length); i++) {
    const installedLine = installedLines[i]
    const latestLine = latestLines[i]

    if (installedLine !== latestLine) {
      shown++
      if (shown > maxDiffs) continue

      console.log(chalk.gray(`  Line ${i + 1}:`))
      if (installedLine !== undefined) {
        console.log(chalk.red(`  - ${installedLine.substring(0, 100)}`))
      }
      if (latestLine !== undefined) {
        console.log(chalk.green(`  + ${latestLine.substring(0, 100)}`))
      }
      console.log()
    }
  }

  if (shown > maxDiffs) {
    console.log(chalk.gray(`  ... and ${shown - maxDiffs} more differences`))
    console.log()
  }
}

export async function update(
  modules: string[],
  options: UpdateOptions
): Promise<void> {
  const cwd = process.cwd()

  // Detect whenny path
  const whennyPath = await detectWhennyPath(cwd)
  if (!whennyPath) {
    console.log(chalk.yellow('  Whenny not initialized. Run `npx whenny init` first.'))
    return
  }

  const fullPath = path.resolve(cwd, whennyPath)

  // Handle "all" special case
  if (modules.includes('all')) {
    modules = await detectInstalledModules(fullPath)
  }

  // If no modules specified, detect all installed modules
  if (modules.length === 0) {
    modules = await detectInstalledModules(fullPath)
  }

  if (modules.length === 0) {
    console.log(chalk.yellow('  No installed modules found.'))
    return
  }

  // Validate module names
  const invalidModules = modules.filter(m => !MODULES.find(mod => mod.name === m))
  if (invalidModules.length > 0) {
    console.log(chalk.red(`  Unknown modules: ${invalidModules.join(', ')}`))
    console.log()
    console.log(chalk.gray('  Available modules:'))
    MODULES.forEach(m => {
      console.log(chalk.gray(`    - ${m.name}: ${m.description}`))
    })
    return
  }

  console.log()
  console.log(chalk.cyan(`  Checking ${modules.length} module(s) for updates...`))
  console.log()

  // Read existing checksums
  const checksums = await readChecksums(fullPath) ?? {}
  const newChecksums: ChecksumRecord = { ...checksums }

  let updated = 0
  let skipped = 0
  let upToDate = 0

  for (const moduleName of modules) {
    const filePath = path.join(fullPath, `${moduleName}.ts`)

    // Check if module is installed
    if (!(await fs.pathExists(filePath))) {
      console.log(chalk.gray(`  - ${moduleName}: not installed, skipping`))
      skipped++
      continue
    }

    // Read the local file
    const localContent = await fs.readFile(filePath, 'utf-8')

    // Get the latest template
    const latestContent = getModuleTemplate(moduleName)
    if (!latestContent) {
      console.log(chalk.gray(`  - ${moduleName}: no template found, skipping`))
      skipped++
      continue
    }

    // If identical, skip
    if (localContent === latestContent) {
      console.log(chalk.green(`  ✓ ${moduleName} is up to date`))
      newChecksums[moduleName] = computeHash(latestContent)
      upToDate++
      continue
    }

    // Check if user has customized the file
    const originalChecksum = checksums[moduleName]
    const localHash = computeHash(localContent)
    const isCustomized = !originalChecksum || localHash !== originalChecksum

    const lineChanges = countDifferences(localContent, latestContent)

    if (!isCustomized || options.force) {
      // Not customized (matches original checksum) or force flag — auto-update
      const spinner = ora(`Updating ${moduleName}...`).start()
      await fs.writeFile(filePath, latestContent)
      newChecksums[moduleName] = computeHash(latestContent)
      spinner.succeed(`${moduleName} updated`)
      updated++
    } else {
      // Customized — prompt user
      console.log(chalk.yellow(`  ~ ${moduleName} has been customized (${lineChanges} lines differ)`))

      let decided = false
      while (!decided) {
        const { action } = await prompts({
          type: 'select',
          name: 'action',
          message: `  What would you like to do with ${moduleName}?`,
          choices: [
            { title: 'Update (overwrites your changes)', value: 'update' },
            { title: 'Skip', value: 'skip' },
            { title: 'Show diff', value: 'diff' },
          ],
        })

        if (action === 'update') {
          const spinner = ora(`Updating ${moduleName}...`).start()
          await fs.writeFile(filePath, latestContent)
          newChecksums[moduleName] = computeHash(latestContent)
          spinner.succeed(`${moduleName} updated`)
          updated++
          decided = true
        } else if (action === 'skip' || action === undefined) {
          console.log(chalk.gray(`  Skipped ${moduleName}`))
          skipped++
          decided = true
        } else if (action === 'diff') {
          showDiff(localContent, latestContent, moduleName)
          // Loop back to prompt again
        }
      }
    }
  }

  // Write updated checksums
  await writeChecksums(fullPath, newChecksums)

  // Summary
  console.log()
  if (updated > 0) {
    console.log(chalk.green(`  ✓ ${updated} module(s) updated`))
  }
  if (upToDate > 0) {
    console.log(chalk.green(`  ✓ ${upToDate} module(s) already up to date`))
  }
  if (skipped > 0) {
    console.log(chalk.gray(`  ${skipped} module(s) skipped`))
  }
  console.log()
}
