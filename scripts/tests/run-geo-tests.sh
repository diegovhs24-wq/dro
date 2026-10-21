#!/usr/bin/env bash
# Compileert de geteste modules en draait de node:test-suite.
set -euo pipefail
OUT="$PWD/.test-build"; mkdir -p "$OUT"
npx --yes esbuild lib/seo/business.ts --format=esm --platform=node --outfile="$OUT/business.mjs" --log-level=warning
npx --yes esbuild lib/leadInsights.ts --format=esm --platform=node --outfile="$OUT/leads.mjs" --log-level=warning
npx --yes esbuild lib/smartLink.ts --bundle --format=esm --platform=node --outfile="$OUT/smartlink.mjs" --log-level=warning --alias:@=.
GEO_SMARTLINK="$OUT/smartlink.mjs" GEO_BUSINESS="$OUT/business.mjs" GEO_LEADS="$OUT/leads.mjs" node --test scripts/tests/geo.test.mjs
