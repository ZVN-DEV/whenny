/**
 * Add Command
 *
 * Add Whenny modules to an existing project.
 */

import fs from 'fs-extra'
import path from 'path'
import chalk from 'chalk'
import ora from 'ora'
import prompts from 'prompts'
import { MODULES, getModuleTemplate } from '../templates/index.js'
import { detectWhennyPath } from '../utils/detect.js'

interface AddOptions {
  path?: string
  overwrite?: boolean
}

export async function add(
  modules: string[],
  options: AddOptions
): Promise<void> {
  const cwd = process.cwd()

  // Handle "all" special case
  if (modules.includes('all')) {
    modules = MODULES.map(m => m.name)
  }

  // If no modules specified, prompt for selection
  if (modules.length === 0) {
    const response = await prompts({
      type: 'multiselect',
      name: 'modules',
      message: 'Which modules would you like to add?',
      choices: MODULES.map(m => ({
        title: `${m.name} - ${m.description}`,
        value: m.name,
      })),
      hint: '- Space to select. Return to submit',
    })

    if (!response.modules || response.modules.length === 0) {
      console.log(chalk.gray('  No modules selected.'))
      return
    }

    modules = response.modules
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

  // Detect whenny path
  let targetPath: string | undefined = options.path
  if (!targetPath) {
    targetPath = await detectWhennyPath(cwd) ?? undefined
  }

  if (!targetPath) {
    console.log(chalk.yellow('  Whenny not initialized. Run `npx whenny init` first.'))
    return
  }

  const fullPath = path.join(cwd, targetPath)
  const spinner = ora('Adding modules...').start()

  try {
    // Ensure directory exists
    await fs.ensureDir(fullPath)

    // Check for existing files
    const existing: string[] = []
    for (const moduleName of modules) {
      const filePath = path.join(fullPath, `${moduleName}.ts`)
      if (await fs.pathExists(filePath)) {
        existing.push(moduleName)
      }
    }

    // Prompt for overwrite if files exist
    if (existing.length > 0 && !options.overwrite) {
      spinner.stop()
      const { confirm } = await prompts({
        type: 'confirm',
        name: 'confirm',
        message: `Overwrite existing files? (${existing.join(', ')})`,
        initial: false,
      })

      if (!confirm) {
        console.log(chalk.gray('  Cancelled.'))
        return
      }
      spinner.start()
    }

    // Write modules
    for (const moduleName of modules) {
      spinner.text = `Adding ${moduleName}...`
      const template = getModuleTemplate(moduleName)
      if (!template) {
        spinner.warn(`Skipping unknown module: ${moduleName}`)
        continue
      }

      await fs.writeFile(path.join(fullPath, `${moduleName}.ts`), template)
    }

    // Update index file
    spinner.text = 'Updating index.ts...'
    await updateIndexFile(fullPath, modules)

    spinner.succeed(`Added ${modules.length} module(s)`)

    console.log()
    console.log(chalk.green('  Added:'))
    modules.forEach(m => {
      console.log(chalk.gray(`    - ${targetPath}/${m}.ts`))
    })
    console.log()
  } catch (error) {
    spinner.fail('Failed to add modules')
    console.error(error)
    process.exit(1)
  }
}

async function updateIndexFile(targetPath: string, newModules: string[]): Promise<void> {
  const indexPath = path.join(targetPath, 'index.ts')

  // Read existing index or create new
  let existingExports: string[] = []
  if (await fs.pathExists(indexPath)) {
    const content = await fs.readFile(indexPath, 'utf-8')
    const exportMatches = content.match(/export \* from '\.\/(\w+)\.js'/g)
    if (exportMatches) {
      existingExports = exportMatches.map(e => {
        const match = e.match(/from '\.\/(\w+)\.js'/)
        return match ? match[1] : ''
      }).filter(Boolean)
    }
  }

  // Merge with new modules
  const allModules = [...new Set([...existingExports, ...newModules])]
    .sort((a, b) => {
      // Core always first
      if (a === 'core') return -1
      if (b === 'core') return 1
      return a.localeCompare(b)
    })

  const imports = allModules
    .map(m => `export * from './${m}.js'`)
    .join('\n')

  const content = `/**
 * Whenny
 *
 * A modern date library for the AI era.
 * Own your code. Configure your voice. Never think about timezones again.
 *
 * @see https://whenny.dev
 */

${imports}

// Re-export the main whenny function as default
export { whenny as default } from './core.js'
`

  await fs.writeFile(indexPath, content)
}
