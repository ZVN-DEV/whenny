/**
 * Detection Utilities
 *
 * Detect Whenny installation in a project.
 */

import fs from 'fs-extra'
import path from 'path'

/**
 * Detect the whenny installation path in a project
 */
export async function detectWhennyPath(cwd: string): Promise<string | null> {
  // Check for whenny.config.ts first
  const configPath = path.join(cwd, 'whenny.config.ts')
  const configExists = await fs.pathExists(configPath)

  if (!configExists) {
    return null
  }

  // Common paths to check
  const paths = [
    'src/lib/whenny',
    'lib/whenny',
    'src/utils/whenny',
    'utils/whenny',
    'src/whenny',
    'whenny',
  ]

  for (const p of paths) {
    const fullPath = path.join(cwd, p)
    if (await fs.pathExists(fullPath)) {
      const indexPath = path.join(fullPath, 'index.ts')
      const corePath = path.join(fullPath, 'core.ts')
      if ((await fs.pathExists(indexPath)) || (await fs.pathExists(corePath))) {
        return p
      }
    }
  }

  // Fallback to default
  return 'src/lib/whenny'
}

/**
 * Detect if project uses TypeScript
 */
export async function detectTypeScript(cwd: string): Promise<boolean> {
  const tsConfigPath = path.join(cwd, 'tsconfig.json')
  return fs.pathExists(tsConfigPath)
}

/**
 * Detect project framework
 */
export async function detectFramework(cwd: string): Promise<'next' | 'remix' | 'vite' | 'unknown'> {
  const packageJsonPath = path.join(cwd, 'package.json')

  if (!(await fs.pathExists(packageJsonPath))) {
    return 'unknown'
  }

  try {
    const packageJson = await fs.readJSON(packageJsonPath)
    const deps = {
      ...packageJson.dependencies,
      ...packageJson.devDependencies,
    }

    if (deps.next) return 'next'
    if (deps['@remix-run/react']) return 'remix'
    if (deps.vite) return 'vite'

    return 'unknown'
  } catch {
    return 'unknown'
  }
}
