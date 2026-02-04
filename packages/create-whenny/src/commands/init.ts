/**
 * Init Command
 *
 * Initialize Whenny in a project by creating the config file
 * and adding core modules.
 */

import fs from 'fs-extra'
import path from 'path'
import chalk from 'chalk'
import ora from 'ora'
import prompts from 'prompts'
import { MODULES, getModuleTemplate, getConfigTemplate } from '../templates/index.js'

interface InitOptions {
  yes?: boolean
  minimal?: boolean
  full?: boolean
  path?: string
}

export async function init(options: InitOptions): Promise<void> {
  console.log()
  console.log(chalk.bold('  Whenny - Date utilities for the AI era'))
  console.log()

  const cwd = process.cwd()
  const defaultPath = 'src/lib/whenny'

  // Check if already initialized
  const configPath = path.join(cwd, 'whenny.config.ts')
  if (await fs.pathExists(configPath)) {
    const { overwrite } = await prompts({
      type: 'confirm',
      name: 'overwrite',
      message: 'Whenny is already initialized. Reinitialize?',
      initial: false,
    })

    if (!overwrite) {
      console.log(chalk.gray('  Cancelled.'))
      return
    }
  }

  // Get configuration
  let targetPath = options.path ?? defaultPath
  let selectedModules: string[] = ['core']

  if (!options.yes && !options.minimal && !options.full) {
    const response = await prompts([
      {
        type: 'text',
        name: 'path',
        message: 'Where should Whenny files be installed?',
        initial: defaultPath,
      },
      {
        type: 'multiselect',
        name: 'modules',
        message: 'Which modules would you like to add?',
        choices: MODULES.filter(m => m.name !== 'core').map(m => ({
          title: `${m.name} - ${m.description}`,
          value: m.name,
          selected: ['relative', 'smart'].includes(m.name),
        })),
        hint: '- Space to select. Return to submit',
      },
    ])

    if (!response.path) {
      console.log(chalk.gray('  Cancelled.'))
      return
    }

    targetPath = response.path
    selectedModules = ['core', ...(response.modules || [])]
  } else if (options.full) {
    selectedModules = MODULES.map(m => m.name)
  } else if (options.minimal) {
    selectedModules = ['core']
  }

  const spinner = ora('Initializing Whenny...').start()

  try {
    // Create directory
    const fullPath = path.join(cwd, targetPath)
    await fs.ensureDir(fullPath)

    // Write config file
    spinner.text = 'Creating whenny.config.ts...'
    await fs.writeFile(configPath, getConfigTemplate())

    // Write core module (always included)
    spinner.text = 'Adding core module...'
    await writeModule('core', fullPath)

    // Write selected modules
    for (const moduleName of selectedModules) {
      if (moduleName === 'core') continue
      spinner.text = `Adding ${moduleName} module...`
      await writeModule(moduleName, fullPath)
    }

    // Write index file
    spinner.text = 'Creating index.ts...'
    await writeIndexFile(selectedModules, fullPath)

    spinner.succeed('Whenny initialized successfully!')

    console.log()
    console.log(chalk.green('  Created:'))
    console.log(chalk.gray(`    - whenny.config.ts`))
    console.log(chalk.gray(`    - ${targetPath}/`))
    for (const moduleName of selectedModules) {
      console.log(chalk.gray(`      - ${moduleName}.ts`))
    }
    console.log(chalk.gray(`      - index.ts`))

    console.log()
    console.log(chalk.bold('  Usage:'))
    console.log()
    console.log(chalk.cyan(`    import { whenny } from '${targetPath.replace('src/', '@/')}'`))
    console.log()
    console.log(chalk.cyan(`    whenny(date).smart()     // "5 minutes ago"`))
    console.log(chalk.cyan(`    whenny(date).relative()  // "5 minutes ago"`))
    console.log()
    console.log(chalk.gray('  Add more modules:'))
    console.log(chalk.cyan('    npx create-whenny add timezone duration'))
    console.log()
  } catch (error) {
    spinner.fail('Failed to initialize Whenny')
    console.error(error)
    process.exit(1)
  }
}

async function writeModule(name: string, targetPath: string): Promise<void> {
  const template = getModuleTemplate(name)
  if (!template) {
    throw new Error(`Unknown module: ${name}`)
  }

  await fs.writeFile(path.join(targetPath, `${name}.ts`), template)
}

async function writeIndexFile(modules: string[], targetPath: string): Promise<void> {
  const imports = modules
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

  await fs.writeFile(path.join(targetPath, 'index.ts'), content)
}
