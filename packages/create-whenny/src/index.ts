#!/usr/bin/env node

/**
 * Whenny CLI
 *
 * Add Whenny date utilities to your project in the shadcn style.
 * Code is copied directly into your project for full ownership.
 */

import { Command } from 'commander'
import chalk from 'chalk'
import { init } from './commands/init.js'
import { add } from './commands/add.js'
import { list } from './commands/list.js'
import { diff } from './commands/diff.js'
import { testInstall } from './commands/test-install.js'
import { mcp } from './commands/mcp.js'

const program = new Command()

program
  .name('whenny')
  .description('Add Whenny date utilities to your project')
  .version('1.0.0')

program
  .command('init')
  .description('Initialize Whenny in your project')
  .option('-y, --yes', 'Skip prompts and use defaults')
  .option('--minimal', 'Add only core utilities')
  .option('--full', 'Add all utilities')
  .option('--path <path>', 'Path to add files (default: src/lib/whenny)')
  .action(init)

program
  .command('add')
  .description('Add a Whenny module to your project')
  .argument('[modules...]', 'Modules to add (e.g., relative smart timezone)')
  .option('--path <path>', 'Path to add files')
  .option('--overwrite', 'Overwrite existing files')
  .action(add)

program
  .command('list')
  .alias('ls')
  .description('List available modules')
  .option('--installed', 'Show only installed modules')
  .action(list)

program
  .command('diff')
  .description('Show changes between installed and latest version')
  .argument('<module>', 'Module to diff')
  .action(diff)

program
  .command('update')
  .description('Update installed modules')
  .argument('[modules...]', 'Modules to update (or "all")')
  .option('--force', 'Overwrite without prompting')
  .action(async (modules, options) => {
    console.log(chalk.yellow('Update command coming soon'))
  })

program
  .command('remove')
  .alias('rm')
  .description('Remove a Whenny module')
  .argument('<module>', 'Module to remove')
  .action(async (module) => {
    console.log(chalk.yellow('Remove command coming soon'))
  })

program
  .command('test-install')
  .alias('test')
  .description('Run the test fair - integration tests in a fresh project')
  .option('--keep', 'Keep the test directory after running')
  .option('--verbose', 'Show detailed output')
  .option('--output <path>', 'Custom path for results HTML')
  .action(testInstall)

program
  .command('mcp')
  .description('Start the MCP server for AI assistant integration')
  .action(mcp)

program.parse()
