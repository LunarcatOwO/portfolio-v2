Just Rewriting my portfolio.

License headers
- Run `npm run license:add` to prepend a GPLv3 header to all supported source files (`.ts`, `.tsx`, `.js`, `.jsx`, `.mjs`, `.cjs`, `.css`, `.scss`).
- The header template is at `scripts/license-header.txt`. You can customize `${PROJECT}`, `${OWNER}`, and `${YEAR}`. The script auto-detects these from `package.json` and `LICENSE`, or uses env `LICENSE_OWNER`.
- The script is idempotent and skips files already containing an SPDX GPL line or a GPL notice.