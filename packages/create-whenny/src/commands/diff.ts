/**
 * Diff Command
 *
 * Show changes between installed and latest version of a module.
 */

import fs from 'fs-extra'
import path from 'path'
import chalk from 'chalk'
import { getModuleTemplate } from '../templates/index.js'
import { detectWhennyPath } from '../utils/detect.js'

export async function diff(moduleName: string): Promise<void> {
  const cwd = process.cwd()

  // Detect whenny path
  const whennyPath = await detectWhennyPath(cwd)
  if (!whennyPath) {
    console.log(chalk.yellow('  Whenny not initialized. Run `npx whenny init` first.'))
    return
  }

  // Check if module is installed
  const filePath = path.join(cwd, whennyPath, `${moduleName}.ts`)
  if (!(await fs.pathExists(filePath))) {
    console.log(chalk.yellow(`  Module "${moduleName}" is not installed.`))
    return
  }

  // Get installed content
  const installed = await fs.readFile(filePath, 'utf-8')

  // Get latest template
  const latest = getModuleTemplate(moduleName)
  if (!latest) {
    console.log(chalk.red(`  Unknown module: ${moduleName}`))
    return
  }

  // Compare
  if (installed === latest) {
    console.log()
    console.log(chalk.green(`  ✓ ${moduleName} is up to date`))
    console.log()
    return
  }

  console.log()
  console.log(chalk.yellow(`  ${moduleName} has changes`))
  console.log()

  // Simple line-by-line diff
  const installedLines = installed.split('\n')
  const latestLines = latest.split('\n')

  // Show first few differences
  let differences = 0
  const maxDiffs = 10

  for (let i = 0; i < Math.max(installedLines.length, latestLines.length); i++) {
    const installedLine = installedLines[i]
    const latestLine = latestLines[i]

    if (installedLine !== latestLine) {
      differences++

      if (differences <= maxDiffs) {
        console.log(chalk.gray(`  Line ${i + 1}:`))
        if (installedLine !== undefined) {
          console.log(chalk.red(`  - ${installedLine.substring(0, 80)}`))
        }
        if (latestLine !== undefined) {
          console.log(chalk.green(`  + ${latestLine.substring(0, 80)}`))
        }
        console.log()
      }
    }
  }

  if (differences > maxDiffs) {
    console.log(chalk.gray(`  ... and ${differences - maxDiffs} more differences`))
    console.log()
  }

  console.log(chalk.gray('  Run `npx whenny update ' + moduleName + '` to update'))
  console.log()
}
