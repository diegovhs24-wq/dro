#!/usr/bin/env bash
# Compileert de geteste modules en draait de node:test-suite.
set -euo pipefail
OUT="$(mktemp -d)"
npx --yes esbuild lib/seo/business.ts --format=esm --platform=node --outfile="$OUT/business.mjs" --log-level=warning
npx --yes esbuild lib/leadInsights.ts --format=esm --platform=node --outfile="$OUT/leads.mjs" --log-level=warning
GEO_BUSINESS="$OUT/business.mjs" GEO_LEADS="$OUT/leads.mjs" node --test scripts/tests/geo.test.mjs
