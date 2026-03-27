# Security Policy

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 1.0.x   | :white_check_mark: |
| < 1.0   | :x:                |

## Reporting a Vulnerability

If you discover a security vulnerability in Whenny, please report it responsibly:

1. **GitHub Issue** - Open an issue with the `security` label at [github.com/ZVN-DEV/whenny](https://github.com/ZVN-DEV/whenny/issues)
2. **Email** - Contact the maintainers at 78920650+zvndev@users.noreply.github.com

### What to include

- Description of the vulnerability
- Steps to reproduce
- Affected version(s)
- Any potential fix you've identified

### What to expect

This is a small, MIT-licensed utility library maintained by a small team. We'll do our best to:

- Acknowledge your report within **7 days**
- Provide an initial assessment within **14 days**
- Release a fix for confirmed vulnerabilities as soon as practical

We appreciate responsible disclosure and will credit reporters in the changelog (unless you prefer anonymity).

## Scope

Whenny is a date formatting/parsing library. Its attack surface is limited, but we take seriously:

- Input validation issues (malformed date strings, natural language parsing)
- Path traversal in the CLI tool (`create-whenny`)
- Dependency supply chain concerns (core has zero production dependencies by design)
