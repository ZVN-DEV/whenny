// Little Friend analytics (littlefriend.io). The site key is public: it only
// names the project the tracker reports to. The tracker sets no cookies, reads
// no form values or page text, and strips query strings.

export const LITTLE_FRIEND_SITE_KEY = 'lf_om3kqCX76KvI2c9G0Yt5UMoc'

// Production deployments only, so previews and local dev send nothing.
export const LITTLE_FRIEND_ENABLED = process.env.VERCEL_ENV === 'production'

type LittleFriendProps = Record<string, string | number | boolean>

declare global {
  interface Window {
    lf?: (command: string, ...args: unknown[]) => void
  }
}

// A named event. Does nothing until the tracker has loaded, and nothing at
// all outside production, where the tag is not rendered.
export function track(name: string, props?: LittleFriendProps) {
  if (typeof window === 'undefined') return
  window.lf?.('track', name, props)
}

// After a copy: install commands send install.copy with how they install.
// The command text itself is never sent.
export function trackCopy(text: string) {
  const command = text.trim()
  if (command.startsWith('npx create-whenny')) track('install.copy', { method: 'create' })
  else if (command.startsWith('npx whenny')) track('install.copy', { method: 'cli' })
  else if (/^(npm install|npm i|pnpm add|yarn add|bun add) /.test(command)) {
    track('install.copy', { method: 'package' })
  }
}
