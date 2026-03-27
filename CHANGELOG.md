# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.1.0] - 2026-03-27

### Added
- 4 new locales: Portuguese, Italian, Korean, Arabic (10 total)
- Temporal API input support (Temporal.Instant, Temporal.ZonedDateTime)
- Intl.DateTimeFormat caching with LRU eviction
- Error boundaries and loading states for docs site
- ESLint configuration with CI enforcement
- Coverage thresholds (70% lines/functions, 60% branches)
- CSP, HSTS, and HTTP security headers
- Blog post navigation (next/prev)
- Skip-to-main-content accessibility link
- Aria labels on all SVG icons
- rehype-sanitize for blog markdown
- SEO-optimized sitemap and robots.txt
- MCP tool parameter validation

### Fixed
- Path traversal vulnerability in CLI init/add commands
- CSP overly permissive (removed unsafe-eval)
- Sitemap included unpublished posts

### Security
- Added Content-Security-Policy with HSTS
- Added path validation in CLI to prevent directory traversal
- Added rehype-sanitize for defense-in-depth on markdown

## [1.0.8] - 2026-03-15

### Added
- Initial stable release
- Core formatting (datewind sizes: xs, sm, md, lg, xl)
- Smart contextual formatting
- Relative time formatting
- Duration formatting (long, compact, clock, timer, human)
- Calendar helpers (isToday, isWeekend, isBusinessDay, etc.)
- Date comparison
- Timezone support with Transfer Protocol
- Natural language parsing
- 6 locales (en, es, fr, de, ja, zh)
- 8 themes (casual, formal, slack, twitter, discord, github, minimal, technical)
- React hooks (useRelativeTime, useCountdown, useDateFormatter, useTimezone, useShadcnCalendar)
- MCP server with 10 tools
- CLI scaffolding tool (create-whenny)
- 374 tests
