# create-whenny

CLI for installing Whenny using the shadcn-style approach. Copy code directly into your project for full ownership and customization.

## Usage

### Initialize

Set up Whenny in your project:

```bash
npx whenny init
```

This creates:
- `src/lib/whenny/` directory
- `whenny.config.ts` configuration file
- Core utilities and types

### Add Modules

Add specific modules to your project:

```bash
npx whenny add relative
npx whenny add smart calendar duration
npx whenny add all
```

Available modules:
- `relative` - Relative time formatting ("5 minutes ago")
- `smart` - Context-aware formatting
- `compare` - Date comparison utilities
- `duration` - Duration formatting
- `calendar` - Calendar helpers
- `transfer` - Server/browser timezone transfer
- `natural` - Natural language parsing

### List Modules

See all available modules:

```bash
npx whenny list
```

### Check for Updates

See what's changed between your local code and the latest version:

```bash
npx whenny diff
```

## Why Copy Code?

The shadcn approach has several benefits:

1. **Full Ownership** - The code is yours to modify
2. **AI Friendly** - Your AI assistant can read and edit the code
3. **No Lock-in** - Remove or replace any part freely
4. **Customizable** - Adapt to your exact needs
5. **Visible** - See exactly how dates are formatted

## Project Structure

After running `init` and `add all`:

```
src/
└── lib/
    └── whenny/
        ├── index.ts        # Main exports
        ├── config.ts       # Configuration
        ├── types.ts        # TypeScript types
        ├── core/
        │   ├── utils.ts    # Core utilities
        │   └── formatter.ts
        ├── relative.ts     # Relative time
        ├── smart.ts        # Smart formatting
        ├── compare.ts      # Comparison
        ├── duration.ts     # Duration
        ├── calendar.ts     # Calendar helpers
        ├── transfer.ts     # Transfer protocol
        └── natural.ts      # Natural language
```

## Configuration

The CLI creates a `whenny.config.ts` that you can customize:

```typescript
import { defineConfig } from './src/lib/whenny/config'

export default defineConfig({
  locale: 'en-US',
  relative: {
    justNow: 'just now',
    minutesAgo: (n) => `${n} min ago`,
  },
  // ... more options
})
```

## License

MIT
