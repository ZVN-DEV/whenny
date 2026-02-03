/**
 * List Command
 *
 * List available Whenny modules.
 */

import fs from 'fs-extra'
import path from 'path'
import chalk from 'chalk'
import { MODULES } from '../templates/index.js'
import { detectWhennyPath } from '../utils/detect.js'

interface ListOptions {
  installed?: boolean
}

export async function list(options: ListOptions): Promise<void> {
  const cwd = process.cwd()

  // Find installed modules
  const whennyPath = await detectWhennyPath(cwd)
  const installedModules: Set<string> = new Set()

  if (whennyPath) {
    const fullPath = path.join(cwd, whennyPath)
    if (await fs.pathExists(fullPath)) {
      const files = await fs.readdir(fullPath)
      files.forEach(f => {
        if (f.endsWith('.ts') && f !== 'index.ts') {
          installedModules.add(f.replace('.ts', ''))
        }
      })
    }
  }

  console.log()
  console.log(chalk.bold('  Whenny Modules'))
  console.log()

  if (options.installed) {
    if (installedModules.size === 0) {
      console.log(chalk.gray('  No modules installed. Run `npx whenny init` to get started.'))
    } else {
      console.log(chalk.gray('  Installed:'))
      installedModules.forEach(m => {
        const module = MODULES.find(mod => mod.name === m)
        if (module) {
          console.log(`    ${chalk.green('●')} ${chalk.bold(m)} - ${module.description}`)
        } else {
          console.log(`    ${chalk.green('●')} ${chalk.bold(m)}`)
        }
      })
    }
  } else {
    MODULES.forEach(module => {
      const installed = installedModules.has(module.name)
      const status = installed ? chalk.green('●') : chalk.gray('○')
      const name = installed ? chalk.bold(module.name) : module.name
      console.log(`  ${status} ${name}`)
      console.log(chalk.gray(`      ${module.description}`))
    })
  }

  console.log()
  console.log(chalk.gray('  Add modules with: npx whenny add <module>'))
  console.log()
}
