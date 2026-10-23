#!/usr/bin/env bash
# Bundelt de lead-route met nagebootste Sanity- en mailmodules en draait de tests.
set -euo pipefail
OUT="$PWD/.test-build"; mkdir -p "$OUT"
npx --yes esbuild app/api/submit-request/route.ts --bundle --format=cjs --platform=node \
  --outfile="$OUT/route.cjs" --log-level=warning \
  --alias:@/lib/sanityLeadsClient=./scripts/tests/mocks/leadsClient.mjs \
  --alias:@/lib/leadEmail=./scripts/tests/mocks/leadEmail.mjs \
  --alias:@=.
LEAD_ROUTE="$OUT/route.cjs" node --test scripts/tests/lead-route.test.mjs
