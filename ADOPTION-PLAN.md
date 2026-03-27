# Whenny Adoption Plan

**Version:** 1.0 | **Created:** 2026-03-27 | **Target:** 500 GitHub stars, 1,000 weekly npm downloads in 90 days

---

## Current State Assessment

- **npm:** whenny@1.0.8, published 2026-02-04, ~0 external downloads
- **GitHub:** github.com/ZVN-DEV/whenny, 0 external stars
- **Docs:** whenny.dev (Next.js on Vercel), has sitemap + robots.txt + JSON-LD
- **Blog:** 4 draft articles exist but have not been published externally
- **Packages:** whenny, whenny-react, create-whenny (all at 1.0.8)
- **Competitors:** date-fns (54M/wk), Day.js (42M/wk), Luxon (24.8M/wk), Tempo (~2.6K stars)
- **Threat:** Temporal API shipping in Chrome 144 and Firefox 139

### Genuine Differentiators (lead with these)

1. **shadcn-style code ownership** -- no other date library does this
2. **Configurable voice** -- one config changes all output strings across your app
3. **Size-based formatting** (.xs/.sm/.md/.lg/.xl) -- intuitive for Tailwind users
4. **8 pre-built themes** (slack, twitter, github, discord) -- instant product-matching
5. **MCP server** -- AI assistants can use date functions directly
6. **Transfer Protocol** -- server/client timezone sync solved automatically

---

## 1. SEO Optimization

### 1.1 Target Keywords (Long-Tail, Achievable)

**Primary (target in page titles + H1s):**
- `typescript date library` (medium competition, direct intent)
- `shadcn date formatting` (low competition, high relevance)
- `date formatting react` (medium competition)
- `moment.js alternative typescript` (long-tail, migration intent)

**Secondary (target in H2s + body copy):**
- `dayjs alternative 2026`
- `date-fns alternative lightweight`
- `relative time react hook`
- `countdown timer react hook`
- `timezone sync server client`
- `smart date formatting javascript`
- `business days calculator typescript`
- `duration formatting javascript`
- `ai friendly date library`
- `mcp server date tools`

**Long-tail (target in comparison/guide pages):**
- `moment.js to typescript migration guide`
- `dayjs vs date-fns vs whenny`
- `best date library for next.js 2026`
- `date formatting like tailwind`
- `shadcn style utility libraries`
- `temporal api polyfill alternative`
- `react userelativetime hook`
- `server client timezone mismatch fix`
- `natural language date parsing typescript`
- `date library with themes`

### 1.2 Meta Tag Improvements for whenny.dev

The existing layout.tsx has good foundations (JSON-LD, Open Graph, Twitter cards). Add these pages and their meta:

**Homepage (update existing):**
```
title: "Whenny - TypeScript Date Library with shadcn-Style Code Ownership"
description: "The date library that lives in your codebase, not node_modules. Size-based formatting like Tailwind, 8 pre-built themes (Slack, GitHub, Discord), React hooks, MCP server for AI. Zero dependencies."
```

**Docs page:**
```
title: "Documentation - Whenny TypeScript Date Library"
description: "Complete API reference for Whenny: size-based formatting (.xs to .xl), smart contextual dates, React hooks, Transfer Protocol, themes, and MCP server integration."
```

### 1.3 Content Pages to Create on whenny.dev

Create these as new routes in `apps/example/app/`:

**Comparison pages (high SEO value, capture migration traffic):**

1. `/compare/dayjs` -- "Whenny vs Day.js: Side-by-Side Comparison"
   - Show equivalent code for 10 common tasks
   - Highlight what Whenny does that Day.js cannot (themes, shadcn install, MCP)
   - Bundle size comparison
   - Include a "migrate in 5 minutes" section

2. `/compare/date-fns` -- "Whenny vs date-fns: Which TypeScript Date Library?"
   - Tree-shaking comparison (both support it)
   - API ergonomics (property access vs function calls)
   - Voice configuration vs manual string assembly

3. `/compare/moment` -- "Migrating from Moment.js to Whenny"
   - Moment is deprecated; capture developers searching for replacements
   - 1:1 API mapping table
   - Bundle size: Moment (300KB) vs Whenny (TBD, measure and publish)

4. `/compare/temporal` -- "Whenny + Temporal API: Better Together"
   - Position Whenny as complementary, not competing
   - Temporal handles computation; Whenny handles display, voice, themes
   - "Temporal gives you the engine, Whenny gives you the dashboard"

**Guide pages:**

5. `/guides/nextjs` -- "Using Whenny with Next.js App Router"
   - Server Component date formatting
   - Client Component relative time with useRelativeTime
   - Transfer Protocol for SSR timezone handling

6. `/guides/react` -- "Whenny React Hooks: useRelativeTime and useCountdown"
   - Live examples, copy-paste code

7. `/guides/themes` -- "Date Formatting Themes: Match Your Product's Voice"
   - Interactive theme switcher showing the same date in all 8 themes
   - This page doubles as a demo and SEO content

### 1.4 Structured Data Additions

Add to `apps/example/app/layout.tsx`, alongside existing SoftwareApplication schema:

```typescript
// Add to existing JSON-LD or create separate script tags

// FAQ Schema (for comparison pages)
const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'What is the best alternative to Moment.js in 2026?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Whenny is a modern TypeScript date library offering shadcn-style code ownership, configurable voice, and Tailwind-like size-based formatting. Unlike Moment.js, it has zero dependencies and is fully tree-shakeable.'
      }
    },
    {
      '@type': 'Question',
      name: 'How does Whenny compare to Day.js and date-fns?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Whenny differentiates with shadcn-style installation (code lives in your project), 8 pre-built themes (Slack, GitHub, Discord), configurable voice output, and an MCP server for AI assistant integration.'
      }
    }
  ]
}

// HowTo Schema (for guide pages)
const howToJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'HowTo',
  name: 'How to add Whenny to your project',
  step: [
    {
      '@type': 'HowToStep',
      name: 'Install with shadcn-style CLI',
      text: 'Run npx create-whenny init to scaffold Whenny into your project'
    },
    {
      '@type': 'HowToStep',
      name: 'Add modules you need',
      text: 'Run npx create-whenny add relative smart calendar to add specific modules'
    },
    {
      '@type': 'HowToStep',
      name: 'Configure your voice',
      text: 'Create whenny.config.ts to customize all output strings'
    }
  ]
}
```

### 1.5 Internal Linking Strategy

Every page on whenny.dev should link to at least 2 other pages:

- Homepage -> Docs, Demo, each Comparison page
- Docs -> Guides, Themes page, Demo
- Each Comparison page -> other Comparison pages ("See also: Whenny vs date-fns")
- Blog posts -> relevant Comparison pages and Guides
- All pages -> GitHub repo link (with UTM: `?ref=whenny.dev`)

### 1.6 Sitemap Expansion

Update `apps/example/app/sitemap.ts` to include all new pages:

```typescript
export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://whenny.dev'

  return [
    { url: baseUrl, lastModified: new Date(), changeFrequency: 'weekly', priority: 1 },
    { url: `${baseUrl}/docs`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: `${baseUrl}/demo`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: `${baseUrl}/compare/dayjs`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/compare/date-fns`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/compare/moment`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/compare/temporal`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/guides/nextjs`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/guides/react`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/guides/themes`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/blog`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
    { url: `${baseUrl}/server`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
  ]
}
```

---

## 2. Dev.to / Medium / Hashnode Articles

### 2.1 Article Schedule (7 Articles, 2 Per Week)

Publish on **Tuesdays and Thursdays** between 8-10 AM EST. These are peak engagement times for developer content. Space articles 3-4 days apart to avoid audience fatigue.

**Cross-posting strategy:** Publish first on Dev.to (largest audience, free, indexed fast). Wait 24 hours, then cross-post to Hashnode with canonical URL pointing to Dev.to. Wait another 24 hours, then publish on Medium under JavaScript-focused publications. Always set the canonical URL to the first publication.

### 2.2 The Seven Articles

---

**Article 1: "I Built a Date Library That Lives in Your Codebase, Not node_modules"**

*Angle:* The shadcn philosophy applied to dates. Lead with the problem (dependency lock-in, AI can't read node_modules), show the solution.

*Opening paragraph:*
> Every date library I've ever used has the same problem: the code lives behind a wall. When my AI assistant helps me write a component, it can see my React code, my Tailwind classes, my state management -- but it can't read inside node_modules. It doesn't know if I'm using Moment's `format('MMM D')` or date-fns' `format(date, 'MMM d')`. So it guesses. And it guesses wrong half the time. I built Whenny to fix that.

*Tags:*
- Dev.to: `#javascript`, `#typescript`, `#opensource`, `#webdev`
- Hashnode: `JavaScript`, `TypeScript`, `Open Source`
- Medium: Submit to "JavaScript in Plain English" or "Better Programming"

*Structure:*
1. The problem (3 paragraphs, relatable scenario)
2. The shadcn insight (1 paragraph connecting to shadcn/ui success)
3. How it works (code examples of `npx create-whenny add`)
4. What you get (show the generated files in your project)
5. Why this matters for AI-assisted development
6. CTA: GitHub link, npm install command

---

**Article 2: "Tailwind for Dates: Why I Made Date Formatting Use .xs .sm .md .lg .xl"**

*Angle:* The mental model -- developers already think in sizes for responsive design, why not dates?

*Opening paragraph:*
> If I told you a CSS class was `text-sm`, you'd immediately know it's small text. If I told you the date format was `M/D/YY`, would you immediately know how it looks? Probably not without running the code. That's the problem with format strings -- they're a mini-language you have to decode every time. What if dates worked like Tailwind?

*Tags:*
- Dev.to: `#typescript`, `#react`, `#ux`, `#tailwindcss`
- Hashnode: `TypeScript`, `React`, `Web Development`
- Medium: Submit to "UX Collective" or "Bits and Pieces"

*Structure:*
1. Format strings are tribal knowledge (`YYYY` vs `yyyy` vs `YY`)
2. The Tailwind mental model (sizes you already know)
3. Side-by-side: format strings vs `.xs`/`.sm`/`.md`/`.lg`/`.xl`
4. Themes: how `.md` means different things in different themes
5. Interactive demo link

---

**Article 3: "The Markdown File That Teaches AI How to Handle Dates in Your Project"**

*Angle:* AI-assisted development is the future; this is what an AI-first library looks like.

*Note:* You already have `blog/03-ai-agents-dates-guide.md` drafted. Refine and publish.

*Tags:*
- Dev.to: `#ai`, `#typescript`, `#programming`, `#productivity`
- Hashnode: `AI`, `TypeScript`, `Developer Tools`
- Medium: Submit to "Towards AI" or "The Startup"

*Structure:*
1. The format roulette problem (AI gives you Moment, date-fns, dayjs randomly)
2. What if the AI could read your date library's source?
3. The MCP server approach
4. Demo: Claude using Whenny's MCP tools
5. The shadcn connection (code in your project = AI can read it)

---

**Article 4: "Your Calendar Component Shows the Wrong Date. Here's Why."**

*Angle:* The timezone bug every developer has shipped. Emotional hook + technical solution.

*Note:* You already have `blog/04-the-timestamp-trap.md` drafted. Refine and publish.

*Tags:*
- Dev.to: `#javascript`, `#webdev`, `#bugs`, `#react`
- Hashnode: `JavaScript`, `Web Development`, `React`
- Medium: Submit to "JavaScript in Plain English"

*Structure:*
1. The bug scenario (New York user, December 5th becomes December 4th)
2. Why it happens (timezone serialization)
3. Why every "solution" on Stack Overflow is fragile
4. The Transfer Protocol approach
5. Code walkthrough

---

**Article 5: "8 Ways Slack, Discord, Twitter, and GitHub Format Dates (And How to Copy Any of Them in 1 Line)"**

*Angle:* Comparative, visual, shareable. Show screenshots of each platform's actual date formatting alongside Whenny theme output.

*Opening paragraph:*
> Slack shows "Yesterday at 3:45 PM". Twitter shows "5m". Discord shows "Today at 3:45 PM". GitHub shows "2 minutes ago". Every product makes a deliberate choice about how to display time. I catalogued 8 different approaches and built them all as one-line theme imports.

*Tags:*
- Dev.to: `#javascript`, `#ux`, `#design`, `#webdev`
- Hashnode: `JavaScript`, `UX`, `Design`
- Medium: Submit to "UX Collective"

*Structure:*
1. Screenshots of each platform's date formatting
2. The design decisions behind each (Slack optimizes for chat flow, Twitter for scannability)
3. One-line theme application for each
4. How to customize a theme (extend, don't replace)
5. Visual comparison table

---

**Article 6: "date-fns Has 54 Million Weekly Downloads. Here's What It Can't Do."**

*Angle:* Respectful comparison, not attack. Genuine gaps that Whenny fills.

*Opening paragraph:*
> date-fns is an excellent library. I've used it for years. It's tree-shakeable, TypeScript-native, and has a massive ecosystem. But after years of using it, there are three things I kept building myself on top of it: consistent voice across my app, platform-specific formatting themes, and a way for AI assistants to understand my date conventions. So I built a library that handles those out of the box.

*Tags:*
- Dev.to: `#javascript`, `#typescript`, `#react`, `#opensource`
- Hashnode: `JavaScript`, `TypeScript`, `Open Source`
- Medium: Submit to "Better Programming"

*Structure:*
1. What date-fns does brilliantly (genuine praise)
2. Gap 1: No configurable voice (you build it yourself every project)
3. Gap 2: No themes (you copy-paste format strings between projects)
4. Gap 3: No AI integration (MCP, code ownership)
5. "Use both" -- Whenny for display, date-fns for computation if you want

---

**Article 7: "Temporal API Is Coming. Here's Why You Still Need a Date Display Library."**

*Angle:* Address the existential threat head-on. Position Whenny as complementary.

*Opening paragraph:*
> Temporal API is shipping in Chrome 144 and Firefox 139. It's a massive improvement over the Date object. It handles timezones correctly, supports duration arithmetic, and has an immutable API. If you're only using a date library for computation -- parsing, adding days, comparing -- then yes, Temporal replaces it. But if you're using a date library for *display* -- "5 minutes ago", "Yesterday at 3:45 PM", platform-specific themes, configurable voice -- Temporal doesn't help you at all. That's where Whenny fits.

*Tags:*
- Dev.to: `#javascript`, `#typescript`, `#webdev`, `#browsers`
- Hashnode: `JavaScript`, `TypeScript`, `Web Development`
- Medium: Submit to "JavaScript in Plain English"

*Structure:*
1. What Temporal does (computation, parsing, timezone-aware arithmetic)
2. What Temporal does NOT do (relative time, smart formatting, themes, voice)
3. The new stack: Temporal + Whenny
4. Code examples using both together
5. Why this is actually good news for Whenny

---

### 2.3 Article Engagement Tactics

- **End every article** with a question: "How does your team handle date consistency?" to drive comments
- **Respond to every comment** within 4 hours for the first 48 hours
- **Include a "TL;DR" section** at the top with 3 bullet points
- **Use code screenshots** (via ray.so or carbon.now.sh) for social sharing -- they get 2-3x more engagement than text links
- **Never start with "I built a thing"** on its own -- always lead with the problem

---

## 3. Twitter/X Strategy

### 3.1 Launch Tweet Thread

Post this as a thread on a **Tuesday between 10 AM - 12 PM EST**. Pin it to your profile.

---

**Tweet 1 (Hook):**
```
Every date library stores your code in node_modules where AI can't read it.

I built one that lives in YOUR codebase instead.

Introducing Whenny -- a TypeScript date library with shadcn-style code ownership.

Thread on why this matters:
```

**Tweet 2 (The Problem):**
```
The problem:

Ask Claude to format a date in your project.

It'll guess Moment, date-fns, or dayjs randomly.

Because it can't read node_modules.

Whenny copies code into src/lib/whenny/ -- your AI assistant can read it, modify it, understand your conventions.
```

**Tweet 3 (Size-Based Formatting):**
```
Instead of memorizing format strings:

  format(date, 'MMM d, yyyy')  // date-fns
  dayjs(date).format('MMM D, YYYY')  // dayjs

Whenny uses sizes you already know:

  whenny(date).xs  // "2/3"
  whenny(date).sm  // "Feb 3"
  whenny(date).md  // "Feb 3, 2026"
  whenny(date).lg  // "February 3rd, 2026"
  whenny(date).xl  // "Tuesday, February 3rd, 2026"
```

**Tweet 4 (Themes):**
```
Every product formats dates differently:

  Slack: "Yesterday at 3:45 PM"
  Twitter: "5m"
  Discord: "Today at 3:45 PM"
  GitHub: "2 minutes ago"

Whenny ships 8 pre-built themes. One line:

  configure(themes.slack)

Your entire app now formats dates like Slack.
```

**Tweet 5 (Configurable Voice):**
```
"5 minutes ago" vs "5m ago" vs "5 min" vs "5m"

In most libraries, you'd find and replace across your entire codebase.

In Whenny, one config file controls every string:

  relative: {
    minutesAgo: (n) => `${n}m ago`
  }

Change it once. Updates everywhere.
```

**Tweet 6 (Numbers):**
```
What you get:

- Zero production dependencies
- 374 tests passing
- shadcn-style CLI: npx create-whenny add smart relative
- React hooks: useRelativeTime, useCountdown
- MCP server for AI assistants
- Transfer Protocol for timezone sync
- 6 built-in locales
- MIT license

npm install whenny
```

**Tweet 7 (CTA):**
```
Try it:

  npm install whenny
  npx create-whenny init

Or just look at the code:

  github.com/ZVN-DEV/whenny
  whenny.dev

If you've ever been frustrated by date formatting inconsistency, I'd love your feedback.

Star it if you think this approach makes sense.
```

---

### 3.2 Ongoing Content Cadence

**Post 3-4 times per week:**

- **Monday:** Quick tip / code snippet (single tweet with code screenshot)
  - Example: "TIL you can make any app format dates like Slack in one line: `configure(themes.slack)`"
- **Wednesday:** Problem/solution thread (3-4 tweets)
  - Example: "The timezone bug you've probably shipped (and how to fix it)"
- **Friday:** Community / meta post
  - Example: "This week's Whenny updates: [changelog]" or responding to someone's date-related frustration

### 3.3 Accounts to Engage With

**Tag in launch thread (sparingly, only if genuinely relevant):**
- @shadcn -- the shadcn philosophy connection is genuine
- @maaboroshi (Day.js maintainer)
- Do NOT tag large accounts unprompted. Instead, reply to their date-related tweets with genuine solutions.

**Engage with regularly (reply, quote-tweet):**
- @jaredpalmer (Turborepo, Formik -- uses dates)
- @leaborato (FormKit/Tempo -- direct competitor but friendly)
- @raaborman (date-fns discussions)
- @dan_abramov, @rickhanlonii (React core -- when they discuss component patterns)
- @t3dotgg (Theo -- covers new TypeScript tools)
- @joshwcomeau (writes about DX -- might appreciate the Tailwind-for-dates angle)
- @kentcdodds (testing, React patterns)

**Monitor these hashtags and reply helpfully when relevant:**
- #typescript, #javascript, #reactjs, #webdev, #opensource

### 3.4 Visual Assets to Create

1. **Code comparison cards** (use ray.so or carbon.now.sh):
   - "date-fns vs Whenny" side-by-side
   - "Day.js vs Whenny" side-by-side
   - Size-based formatting showcase
2. **Theme comparison GIF**: Animated GIF showing the same date cycling through all 8 themes
3. **Architecture diagram**: shadcn-style install flow (npx command -> files in your project -> AI can read them)
4. **Bundle size bar chart**: Moment vs date-fns vs Day.js vs Whenny

---

## 4. Reddit Strategy

### 4.1 Pre-Launch Preparation (Critical)

Reddit will ban you for self-promotion if you don't have an established account with genuine participation. Before posting about Whenny:

- **Spend 2 weeks** commenting helpfully on date-related questions in r/javascript, r/typescript, r/reactjs
- Answer questions about timezone bugs, date formatting, Moment migration
- Do NOT mention Whenny in these comments
- Build up at least 15-20 helpful comments
- Follow each subreddit's self-promotion rules (typically 10:1 ratio of helpful content to promotion)

### 4.2 Target Subreddits

| Subreddit | Subscribers | Post Format | Best Time |
|-----------|-------------|-------------|-----------|
| r/javascript | 2.5M+ | Show-and-tell, discussion | Tuesday/Wednesday 10-12 EST |
| r/typescript | 200K+ | Technical deep-dive | Tuesday/Wednesday 10-12 EST |
| r/reactjs | 400K+ | Tool announcement, hooks showcase | Monday/Wednesday 10 AM EST |
| r/webdev | 2M+ | Discussion-style, not promotional | Wednesday/Thursday 10 AM EST |
| r/node | 200K+ | Technical, use-case focused | Tuesday 10 AM EST |
| r/programming | 6M+ | Only if it gets traction elsewhere first | Friday 10 AM EST |

### 4.3 Draft Posts

---

**Post 1: r/javascript (Primary Launch Post)**

*Title:* `I built a date library where the code lives in your project, not node_modules (shadcn-style)`

*Body:*
```
Hey r/javascript,

I've been working on a TypeScript date library called Whenny that does something different from date-fns, Day.js, or Luxon: instead of installing a package, it copies the source code directly into your project (like shadcn/ui does for components).

Why? Three reasons I kept running into:

1. **AI assistants can't read node_modules.** When Claude or Copilot helps me write a component, it doesn't know my date formatting conventions. With Whenny, the code is at `src/lib/whenny/` -- the AI reads it.

2. **Every project reinvents date formatting voice.** "5 minutes ago" vs "5m ago" vs "5 min" -- I'd change this per-project by hunting down format strings. Whenny has one config file that controls all output strings.

3. **Format strings are tribal knowledge.** Is it `YYYY` or `yyyy`? Depends on the library. Whenny uses sizes instead: `.xs`, `.sm`, `.md`, `.lg`, `.xl` -- like Tailwind.

It also ships with 8 pre-built themes (slack, twitter, github, discord, etc.), React hooks (useRelativeTime, useCountdown), and an MCP server for AI integration.

npm: https://npmjs.com/package/whenny
GitHub: https://github.com/ZVN-DEV/whenny
Docs: https://whenny.dev

374 tests, zero production dependencies, MIT license.

I know the date library space is crowded. I'm genuinely curious: does the "code ownership" angle resonate with anyone? Or is npm install + node_modules fine for most use cases?
```

**Why this works:**
- Opens with "what's different," not "look what I built"
- Lists genuine problems before the solution
- Ends with a genuine question that invites discussion
- Does not oversell

---

**Post 2: r/reactjs**

*Title:* `useRelativeTime() -- a React hook that auto-updates "5 minutes ago" timestamps`

*Body:*
```
Built a React hook for live-updating relative timestamps. It handles the interval management, cleanup, and smart update frequency (updates every second for "just now", every minute for "X minutes ago", less frequently for older dates).

```tsx
import { useRelativeTime } from 'whenny-react'

function Comment({ createdAt }) {
  const time = useRelativeTime(createdAt)
  return <span>{time}</span>  // "just now" -> "2 min ago" -> "1 hour ago"
}
```

Also has `useCountdown` for countdown timers:

```tsx
const { days, hours, minutes, seconds } = useCountdown(saleEndsAt)
```

Part of Whenny (a date library with shadcn-style installation). But the hooks are genuinely useful on their own.

npm: `npm install whenny-react`
Source: https://github.com/ZVN-DEV/whenny/tree/main/packages/whenny-react

Anyone using something similar? I looked at existing solutions and most don't handle the smart interval frequency (no point re-rendering every second when the timestamp says "3 hours ago").
```

**Why this works:**
- Leads with a specific, useful thing (not the whole library)
- Shows the code immediately
- Asks a genuine question
- r/reactjs loves hooks

---

**Post 3: r/typescript**

*Title:* `I made date formatting work like Tailwind sizing classes (.xs, .sm, .md, .lg, .xl)`

*Body:*
```
One thing that always bugged me about date libraries: format strings are a mini-language you have to re-learn for each library.

- Moment: `format('MMM D, YYYY')`
- date-fns: `format(date, 'MMM d, yyyy')` (note the lowercase 'd' and 'y')
- Day.js: `format('MMM D, YYYY')` (same as Moment, different from date-fns)

In Whenny, I replaced format strings with size-based properties:

```typescript
whenny(date).xs  // "2/3"
whenny(date).sm  // "Feb 3"
whenny(date).md  // "Feb 3, 2026"
whenny(date).lg  // "February 3rd, 2026"
whenny(date).xl  // "Tuesday, February 3rd, 2026"
```

Each "size" is configurable via a config file, and there are 8 built-in themes that redefine what each size means (e.g., the `technical` theme makes `.md` return `"2026-02-03 15:45"`).

It's fully typed -- TypeScript autocomplete shows you all available properties and what they return.

GitHub: https://github.com/ZVN-DEV/whenny

Curious what the TypeScript community thinks of this API design. Too clever? Or does the size metaphor actually help?
```

---

### 4.4 Reddit Engagement Rules

1. **Never post to more than 2 subreddits in the same day** -- space them out by at least 3 days
2. **Reply to every comment** on your posts, even negative ones, with genuine engagement
3. **Never be defensive** about criticism. "That's a fair point" goes further than "well actually"
4. **Upvote competing libraries** when people mention them. Don't trash-talk
5. **If someone says "just use date-fns"**, respond with: "date-fns is great for X. Whenny specifically targets Y. If Y isn't a problem you have, date-fns is the right choice."
6. **Follow up** a week later with a comment update if you've addressed feedback

---

## 5. AI Search Optimization

### 5.1 Getting into AI Training Data

AI models learn from:
1. **GitHub** -- README, source code, issue discussions
2. **npm** -- package description, README
3. **Stack Overflow** -- questions and answers
4. **Dev.to / Medium / Hashnode** -- articles
5. **Documentation sites** -- crawlable content

**Actions:**

**GitHub README optimization:**
- The current README is strong. Add a "Quick Comparison" table at the top:
```markdown
## Quick Comparison

| Feature | Whenny | date-fns | Day.js | Luxon |
|---------|--------|----------|--------|-------|
| shadcn-style install | Yes | No | No | No |
| Configurable voice | Yes | No | No | No |
| Size-based formatting | Yes | No | No | No |
| Pre-built themes | 8 | 0 | 0 | 0 |
| MCP server | Yes | No | No | No |
| React hooks | Yes | No | No | No |
| Zero dependencies | Yes | No | Yes | Yes |
| Tree-shakeable | Yes | Yes | Plugin | Yes |
```

**GitHub topics (already partially set, verify these are all added):**
Add via GitHub repo settings -> Topics:
```
typescript, date, datetime, timezone, formatting, shadcn, react-hooks,
moment-alternative, dayjs-alternative, date-fns-alternative, mcp,
ai-friendly, zero-dependency, tree-shakeable, relative-time,
duration, calendar, i18n, themes
```

**GitHub description (one-liner that AI models will index):**
```
TypeScript date library with shadcn-style code ownership, Tailwind-like sizing (.xs to .xl), 8 platform themes, configurable voice, React hooks, and MCP server. Zero dependencies.
```

### 5.2 npm README Optimization

The npm README is pulled from the package README. It's already good. Ensure these sections exist prominently because AI models scan npm READMEs to recommend packages:

1. **First line should be the value prop**, not badges:
   ```
   # Whenny
   A modern TypeScript date library with shadcn-style code ownership, size-based formatting, and configurable voice.
   ```

2. **Include "Why Whenny over X?"** section that AI models can reference when users ask "what date library should I use?"

3. **Include common use cases** as headers that match how developers search:
   - "Relative Time (time ago)"
   - "Countdown Timer"
   - "Date Formatting"
   - "Timezone Handling"
   - "Business Days"

### 5.3 Stack Overflow Presence

**Do NOT spam Stack Overflow with Whenny answers.** Instead:

1. **Monitor these tags daily:**
   - `javascript-date`, `momentjs`, `dayjs`, `date-fns`, `timezone`, `react-hooks`
   - Set up email alerts at https://stackexchange.com/filters

2. **Answer genuinely, mention Whenny only when relevant:**
   - Question: "How to show relative time in React?"
   - Answer: Explain the vanilla JS approach first, then mention: "If you want a hook that handles this with auto-updating intervals, `whenny-react` has `useRelativeTime` that manages the timer lifecycle."

3. **Target these specific question types:**
   - "How to format dates consistently across my React app"
   - "Server-side rendering timezone mismatch"
   - "Moment.js is deprecated, what should I use?"
   - "How to show 'X minutes ago' in React"

4. **Create one canonical Q&A:**
   - Ask (from your account): "What are the modern alternatives to Moment.js in 2026?"
   - Answer with a comprehensive comparison that includes Whenny alongside date-fns, Day.js, Luxon, and Temporal

### 5.4 Getting Mentioned in "Best Date Libraries 2026" Articles

1. **Identify existing articles** by searching:
   - "best javascript date library 2025"
   - "best typescript date library"
   - "moment.js alternatives"

2. **Contact authors** of these articles (find them on Twitter/LinkedIn):
   - "Hi, I saw your article on JS date libraries. I've released one with a different approach (shadcn-style code ownership + themes). Would you consider adding it to your comparison? Here's the GitHub: [link]"

3. **Write your own comparison** on Dev.to that will rank for "best date library 2026"
   - Title: "The 6 Best JavaScript Date Libraries in 2026 (Honest Comparison)"
   - Include date-fns, Day.js, Luxon, Tempo, Whenny, and Temporal API
   - Be genuinely fair -- rank date-fns and Day.js above Whenny for maturity, but highlight Whenny's unique features

---

## 6. Community Building

### 6.1 GitHub Discussions

**Set up immediately.** Go to GitHub repo Settings -> Features -> Enable Discussions.

Create these default categories:
- **Announcements** (maintainers only) -- release notes, roadmap updates
- **Show & Tell** -- users sharing how they use Whenny
- **Q&A** -- support questions
- **Ideas** -- feature requests
- **Themes** -- share custom themes (this could become a killer feature)

**Seed with 3-4 posts:**
1. "Welcome to Whenny Discussions! Introduce yourself and tell us what you're building"
2. "Share your custom Whenny theme" (include 2-3 example custom themes)
3. "Roadmap: What's coming in Whenny 1.1" (transparent, builds trust)
4. "RFC: How should Whenny work with the Temporal API?"

### 6.2 Discord/Slack Community

**Not yet.** At 0 users, a Discord server will feel empty and signal low adoption. Instead:

- Use GitHub Discussions for community (it's where developers already are)
- Add a Discord when you hit **100 GitHub stars** (enough people to sustain conversation)
- When you do create Discord, structure it as:
  - `#general`
  - `#help`
  - `#show-your-config` (share custom themes/voice configs)
  - `#contributing`
  - `#releases`

### 6.3 Contributing Guide

Create `CONTRIBUTING.md` at the repo root:

```markdown
# Contributing to Whenny

Thanks for your interest in contributing! Here's how to get started.

## Quick Start

1. Fork the repo
2. Clone your fork: `git clone https://github.com/YOUR_NAME/whenny.git`
3. Install dependencies: `npm install`
4. Run tests: `npm test`
5. Make your changes
6. Run tests again: `npm test`
7. Submit a PR

## Project Structure

This is a Turborepo monorepo with three packages:

- `packages/whenny/` -- Core date library (zero dependencies)
- `packages/whenny-react/` -- React hooks and components
- `packages/create-whenny/` -- CLI for shadcn-style installation
- `apps/example/` -- Documentation site (whenny.dev)

## What We Need Help With

- **New themes** -- Create a theme for your favorite product (Linear, Notion, Figma, etc.)
- **New locales** -- Add your language (we have en, es, fr, de, ja, zh)
- **Documentation** -- Fix typos, improve examples, add guides
- **Bug reports** -- Found something broken? Open an issue
- **Testing** -- More edge cases, more coverage

## Code Style

- TypeScript strict mode
- No production dependencies in the core package
- Every public API must have JSDoc comments
- Every new feature must have tests

## Theme Contributions

Creating a new theme is the easiest way to contribute:

1. Look at `packages/whenny/src/themes/index.ts` for examples
2. Copy an existing theme
3. Modify the `relative`, `smart`, `formats`, and `styles` sections
4. Add tests
5. Submit a PR

## Commit Messages

Use conventional commits: `feat:`, `fix:`, `docs:`, `test:`, `chore:`
```

### 6.4 "Good First Issue" Strategy

Label 8-12 issues as `good first issue` with clear descriptions:

1. **"Add Linear theme"** -- "Create a theme that matches Linear's date formatting (e.g., '2 hours ago', 'Yesterday'). Look at `packages/whenny/src/themes/index.ts` for examples."

2. **"Add Notion theme"** -- Same pattern, Notion's formatting.

3. **"Add Portuguese (pt-BR) locale"** -- "Add Brazilian Portuguese translations to `packages/whenny/src/i18n/index.ts`. See existing locales for the structure."

4. **"Add Korean (ko) locale"** -- Same pattern.

5. **"Add Italian (it) locale"** -- Same pattern.

6. **"Improve error messages for invalid date input"** -- "When `whenny(invalidDate)` is called, the error message should be more helpful. See `packages/whenny/src/errors.ts`."

7. **"Add `.nano` size format (ISO timestamp with nanoseconds)"** -- Small, well-scoped feature.

8. **"Add JSDoc examples to calendar module"** -- Documentation-only, very approachable.

9. **"Create a Storybook story for useRelativeTime hook"** -- Good for React-focused contributors.

10. **"Add format string cheat sheet to docs"** -- Content contribution.

Each issue should include:
- **What:** Clear description
- **Where:** Exact file paths
- **How:** Step-by-step instructions
- **Tests:** What tests to add
- **Estimated time:** "30 minutes" to "2 hours"

---

## 7. Developer Relations

### 7.1 shadcn Registry Listing

shadcn/ui has a registry system for third-party components. Whenny's calendar integration makes it a natural fit.

**Steps:**
1. Check https://ui.shadcn.com/docs/registry for current third-party submission process
2. Ensure Whenny's date picker integration with react-day-picker is documented
3. Submit a registry entry for "whenny-calendar" that extends shadcn's calendar component with Whenny formatting
4. File a PR or issue on the shadcn/ui repo: "Add Whenny date formatting integration to Calendar component docs"
5. Tag @shadcn on Twitter with a demo of the integration

### 7.2 Framework Integration Guides

Create these as pages on whenny.dev AND as standalone articles:

**Next.js App Router Guide** (`/guides/nextjs`):
```markdown
# Using Whenny with Next.js App Router

## Server Components
Whenny works in Server Components for static date formatting:

```tsx
// app/posts/[slug]/page.tsx (Server Component)
import { whenny } from 'whenny'

export default function PostPage({ params }) {
  const post = await getPost(params.slug)
  return (
    <article>
      <time>{whenny(post.publishedAt).lg}</time>
      <p>{post.content}</p>
    </article>
  )
}
```

## Client Components (Live Updates)
Use React hooks for relative time that auto-updates:

```tsx
'use client'
import { useRelativeTime } from 'whenny-react'

export function TimeAgo({ date }) {
  const time = useRelativeTime(date)
  return <time dateTime={date.toISOString()}>{time}</time>
}
```

## Transfer Protocol (SSR Timezone Sync)
// ... show server/client handoff
```

**Astro Guide:**
```markdown
# Using Whenny with Astro

## Static Site Generation
Whenny works perfectly in Astro's .astro files for build-time date formatting:

```astro
---
import { whenny } from 'whenny'
const publishDate = new Date('2026-01-15')
---
<time>{whenny(publishDate).lg}</time>
```

## React Islands
For live-updating timestamps, use Whenny React hooks in client-side islands:

```tsx
// src/components/TimeAgo.tsx
import { useRelativeTime } from 'whenny-react'

export function TimeAgo({ date }) {
  const time = useRelativeTime(date)
  return <time>{time}</time>
}
```

```astro
<TimeAgo client:load date={post.publishedAt} />
```
```

**Remix and SvelteKit guides:** Follow the same pattern -- show server-side formatting + client-side live updates.

### 7.3 Conference Talk Pitches

Target local meetups and mid-tier conferences first. Major conferences (React Summit, JSConf) require prior speaking history.

---

**Talk 1: "Own Your Code: The shadcn Philosophy Beyond UI Components"**

*Length:* 20 minutes (meetup format)

*Abstract:*
> shadcn/ui proved that UI components don't need to be npm packages -- they can live in your codebase where you (and your AI assistant) can read and modify them. But why stop at UI? This talk explores applying the same philosophy to date formatting. I'll show how a "code ownership" approach to utility libraries improves AI-assisted development, enables per-project voice configuration, and eliminates the format string tribal knowledge that plagues every team. Live demo of building a date-display layer in under 5 minutes using Whenny's shadcn-style CLI.

*Target events:*
- Local JavaScript/TypeScript meetups (Meetup.com)
- React meetups in your city
- TypeScript Congress (online)
- JS Nation (online track)

---

**Talk 2: "Why Every Date Library Gets Timezones Wrong (And What Transfer Protocol Fixes)"**

*Length:* 30 minutes (conference format)

*Abstract:*
> You've shipped the "December 5th becomes December 4th" bug. So have I. So has every developer who's serialized a date between server and browser. This talk dissects exactly why it happens, why every Stack Overflow answer is fragile, and introduces the Transfer Protocol pattern -- a structured way to carry timezone context across the wire so dates always display correctly, regardless of where the server and client are located. No library required; the pattern works everywhere. But I'll show how Whenny implements it.

*Target events:*
- Node.js conferences (NodeConf, Node Congress)
- Full-stack meetups
- CityJS conferences

---

**Talk 3: "Building AI-Friendly Libraries: Lessons from an MCP-Native Date Library"**

*Length:* 20 minutes

*Abstract:*
> MCP (Model Context Protocol) is changing how AI assistants interact with developer tools. But most libraries aren't designed for AI consumption -- their code lives in node_modules, their APIs require format string memorization, and their output is inconsistent across a codebase. This talk covers practical lessons from building an MCP-native library: what makes an API "AI-friendly," how code ownership improves AI assistance, and why configurable voice matters when AI writes your code. Applicable to any library author thinking about the AI era.

*Target events:*
- AI + developer tooling meetups
- Anthropic community events
- Vercel meetups (if they run them)

---

### 7.4 Podcast Appearances

**Target these podcasts** (all cover JS tooling and accept guest pitches):

| Podcast | How to Pitch | Angle |
|---------|-------------|-------|
| **Syntax.fm** (Wes Bos & Scott Tolinski) | syntax.fm/contact or @syntaxfm on Twitter | "The shadcn approach to date formatting" |
| **JS Party** (Changelog) | changelog.com/request | "AI-friendly library design" |
| **PodRocket** (LogRocket) | podrocket@logrocket.com | "Why every date library gets timezones wrong" |
| **devtools.fm** | Twitter DM @devtoolsfm | "Building developer tools for the AI era" |
| **Front End Happy Hour** | frontendhappyhour.com | "Date formatting DX" |
| **The Changelog** | changelog.com/request | "Code ownership vs npm dependencies" |
| **Compressed.fm** (James Quick & Amy Dutton) | Twitter DM | "Tailwind for dates" |

**Pitch template:**
```
Subject: Guest pitch: The shadcn approach to date formatting

Hi [Name],

I built a TypeScript date library (Whenny) that takes a different approach
from date-fns, Day.js, and Luxon: instead of installing a package, it copies
source code into your project like shadcn/ui does for components.

I think your audience would find the "why" interesting:
- AI assistants can't read node_modules, so they guess your date conventions
- Every project reinvents date formatting voice ("5m ago" vs "5 minutes ago")
- Format strings are tribal knowledge (YYYY vs yyyy)

With Temporal API shipping in browsers, there's also a timely conversation
about what date libraries are actually for in 2026.

Happy to chat about any of these angles. Here's the library: whenny.dev

[Your name]
```

---

## 8. Launch Sequence

### 8.1 Week 1: Foundation (Pre-Launch)

**Monday-Tuesday:**
- [ ] Measure and document Whenny's actual bundle size (minified + gzipped) -- you need this number for every comparison
- [ ] Add the Quick Comparison table to the GitHub README
- [ ] Set GitHub description and topics (Section 5.1)
- [ ] Enable GitHub Discussions and seed with 3-4 posts (Section 6.1)
- [ ] Create CONTRIBUTING.md (Section 6.3)
- [ ] Create 8-10 "good first issue" labels (Section 6.4)

**Wednesday-Thursday:**
- [ ] Build comparison pages on whenny.dev: `/compare/dayjs`, `/compare/date-fns`, `/compare/moment`, `/compare/temporal` (Section 1.3)
- [ ] Build Next.js guide page: `/guides/nextjs` (Section 7.2)
- [ ] Update sitemap.ts with all new pages (Section 1.6)
- [ ] Add FAQ and HowTo structured data (Section 1.4)
- [ ] Create code screenshot images using ray.so (Section 3.4)

**Friday:**
- [ ] Start engaging on Reddit: answer 3-5 date-related questions in r/javascript and r/typescript (do NOT mention Whenny yet)
- [ ] Follow relevant Twitter accounts and engage with 5-10 tweets about date formatting

### 8.2 Week 2: Content Launch

**Monday:**
- [ ] Publish Article 1 on Dev.to: "I Built a Date Library That Lives in Your Codebase, Not node_modules"
- [ ] Continue Reddit engagement (helpful comments, no Whenny mentions)

**Tuesday:**
- [ ] Cross-post Article 1 to Hashnode (set canonical URL to Dev.to)
- [ ] Post the launch tweet thread (Section 3.1)
- [ ] Pin the tweet thread to your profile

**Wednesday:**
- [ ] Cross-post Article 1 to Medium
- [ ] Answer 2-3 more date-related questions on Stack Overflow

**Thursday:**
- [ ] Publish Article 2 on Dev.to: "Tailwind for Dates"
- [ ] Post on r/javascript with the primary launch post (Section 4.3, Post 1)

**Friday:**
- [ ] Cross-post Article 2 to Hashnode
- [ ] Respond to ALL comments on Reddit and Dev.to posts
- [ ] Post a code screenshot tweet (Whenny vs date-fns comparison)

### 8.3 Week 3: Expand Reach

**Monday:**
- [ ] Publish Article 3 on Dev.to: "The Markdown File That Teaches AI How to Handle Dates"
- [ ] Post on r/reactjs with the hooks-focused post (Section 4.3, Post 2)

**Tuesday:**
- [ ] Cross-post Article 3 to Hashnode + Medium
- [ ] Tweet a problem/solution thread about timezone bugs

**Wednesday:**
- [ ] Publish Article 4 on Dev.to: "Your Calendar Component Shows the Wrong Date"
- [ ] Post on r/typescript with the size-based formatting post (Section 4.3, Post 3)

**Thursday:**
- [ ] Cross-post Article 4
- [ ] Send first podcast pitch emails (Syntax.fm, JS Party, PodRocket)

**Friday:**
- [ ] Publish Article 5: "8 Ways Slack, Discord, Twitter, and GitHub Format Dates"
- [ ] Tweet the theme comparison GIF
- [ ] Submit talk proposal to 2 local meetups

### 8.4 Week 4: Sustain and Iterate

**Monday:**
- [ ] Publish Article 6: "date-fns Has 54 Million Weekly Downloads. Here's What It Can't Do."
- [ ] Review all analytics: which content drove the most GitHub stars and npm downloads?

**Tuesday:**
- [ ] Cross-post Article 6
- [ ] Follow up on any podcast pitch responses

**Wednesday:**
- [ ] Publish Article 7: "Temporal API Is Coming. Here's Why You Still Need a Date Display Library."
- [ ] Write and submit the "Best JavaScript Date Libraries in 2026" comparison article

**Thursday:**
- [ ] Contact 3-5 authors of existing "best date library" articles (Section 5.4)
- [ ] Post a "1 month retrospective" tweet with honest numbers

**Friday:**
- [ ] Review what worked, what didn't
- [ ] Plan Month 2 content based on data

---

### 8.5 Metrics to Track

**Set up tracking on Day 1:**

| Metric | Tool | Check Frequency |
|--------|------|-----------------|
| npm weekly downloads | npmjs.com/package/whenny | Weekly |
| GitHub stars | GitHub repo page | Daily for first month |
| GitHub forks | GitHub repo page | Weekly |
| GitHub issues opened | GitHub notifications | Daily |
| whenny.dev page views | Vercel Analytics | Weekly |
| whenny.dev unique visitors | Vercel Analytics | Weekly |
| Dev.to article views | Dev.to dashboard | After each publish |
| Dev.to article reactions | Dev.to dashboard | After each publish |
| Reddit post upvotes | Reddit | 24h and 72h after posting |
| Twitter impressions | Twitter Analytics | Weekly |
| Search Console impressions for target keywords | Google Search Console | Weekly (after Week 2) |
| Referring domains | Google Search Console | Monthly |

### 8.6 Success Criteria

**30 Days:**
- 50+ GitHub stars
- 100+ weekly npm downloads
- 3+ external contributors (PRs or issues from non-maintainers)
- 5,000+ cumulative Dev.to article views
- whenny.dev appearing in Google for "shadcn date library"

**60 Days:**
- 200+ GitHub stars
- 500+ weekly npm downloads
- 1+ theme contributed by external developer
- 1+ podcast appearance confirmed
- 10+ Stack Overflow answers mentioning Whenny
- At least 1 "best date libraries" article includes Whenny

**90 Days:**
- 500+ GitHub stars
- 1,000+ weekly npm downloads
- 10+ external contributors
- Whenny mentioned by at least 1 dev influencer (>10K followers)
- 3+ framework integration guides live on whenny.dev
- AI assistants (Claude, ChatGPT) recommend Whenny when asked about date libraries with themes or shadcn-style install

---

## 9. What NOT to Do

1. **Do not pay for stars or downloads.** It's detectable and destroys credibility.
2. **Do not spam subreddits.** One post per subreddit, maximum. Follow up in comments.
3. **Do not trash-talk competitors.** date-fns and Day.js are excellent. You complement them.
4. **Do not oversell maturity.** Say "7 weeks old, 374 tests, looking for early adopters" -- honesty builds trust faster than polished marketing copy.
5. **Do not ignore the Temporal positioning.** Every article and pitch should acknowledge Temporal and explain why Whenny is complementary, not competing.
6. **Do not create a Discord too early.** An empty Discord signals a dead project. GitHub Discussions first.
7. **Do not launch on Hacker News yet.** Wait until you have 100+ stars and at least 3 external contributors. HN is one-shot -- you need social proof first.

---

## 10. The Temporal Playbook

The Temporal API is the single biggest threat and the single biggest opportunity.

**Threat:** Developers will say "just use Temporal" for everything.

**Opportunity:** Temporal does NOT handle:
- Relative time ("5 minutes ago")
- Smart contextual formatting ("just now" -> "yesterday" -> "Jan 15")
- Platform-specific themes
- Configurable voice
- React hooks for live-updating timestamps
- MCP server integration

**Messaging framework (use in every piece of content):**

> Temporal is the best thing to happen to JavaScript dates. It handles computation -- parsing, arithmetic, timezone-aware math -- better than any library ever has. But computation is only half the story. The other half is *display*: how your app talks about time to users. "5 minutes ago" vs "5m" vs "Just now". Slack vs GitHub vs Discord formatting. One config that controls your app's voice. That's what Whenny does. Use Temporal for the engine. Use Whenny for the dashboard.

**Action:** Article 7 should be the most thorough, well-researched piece. It's the one that will have the longest shelf life.

---

## Appendix A: Content Calendar (First 4 Weeks)

| Day | Dev.to | Twitter | Reddit | Other |
|-----|--------|---------|--------|-------|
| W1 Mon | -- | -- | -- | Foundation work |
| W1 Tue | -- | -- | -- | Foundation work |
| W1 Wed | -- | -- | -- | Build comparison pages |
| W1 Thu | -- | -- | -- | Build comparison pages |
| W1 Fri | -- | Engage | Comment helpfully | Stack Overflow |
| W2 Mon | Article 1 | -- | -- | -- |
| W2 Tue | -- | Launch thread | -- | Cross-post Hashnode |
| W2 Wed | -- | -- | -- | Cross-post Medium |
| W2 Thu | Article 2 | -- | r/javascript post | -- |
| W2 Fri | -- | Code screenshot | -- | Respond to comments |
| W3 Mon | Article 3 | -- | r/reactjs post | -- |
| W3 Tue | -- | Timezone thread | -- | Cross-posts |
| W3 Wed | Article 4 | -- | r/typescript post | -- |
| W3 Thu | -- | -- | -- | Podcast pitches |
| W3 Fri | Article 5 | Theme GIF | -- | Meetup proposals |
| W4 Mon | Article 6 | -- | -- | Review analytics |
| W4 Tue | -- | -- | -- | Cross-posts |
| W4 Wed | Article 7 | -- | -- | "Best libraries" article |
| W4 Thu | -- | Retrospective | -- | Contact article authors |
| W4 Fri | -- | -- | -- | Plan Month 2 |

## Appendix B: Accounts and Profiles Needed

- [ ] Dev.to account (dev.to) -- use personal or create @whenny
- [ ] Hashnode blog (hashnode.com) -- whenny.hashnode.dev
- [ ] Medium account -- join "JavaScript in Plain English" publication
- [ ] Twitter/X account -- @whennydev or personal account
- [ ] Stack Overflow account -- use personal, add Whenny to "About" section
- [ ] Google Search Console -- verify whenny.dev
- [ ] Vercel Analytics -- should already be active

## Appendix C: Tools

- **Code screenshots:** ray.so (free, beautiful)
- **GIF creation:** Kap (macOS screen recorder) or LICEcap
- **Social scheduling:** Buffer (free tier) or TweetDeck
- **Reddit monitoring:** Set up keyword alerts for "date library", "moment alternative", "dayjs vs"
- **SEO tracking:** Google Search Console (free) + Ahrefs (free tier for basic keyword tracking)
- **npm download tracking:** npm-stat.com/charts.html?package=whenny
