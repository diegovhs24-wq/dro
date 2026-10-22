#!/usr/bin/env bash
# Compileert de fase-2-modules en draait de node:test-suite.
set -euo pipefail
OUT="$PWD/.test-build"; mkdir -p "$OUT"
b() { npx --yes esbuild "$1" --bundle --format=esm --platform=node --outfile="$OUT/$2" --log-level=warning --alias:@=.; }
b lib/caseStudy.ts f2-case.mjs
b lib/verifiedClaims.ts f2-claims.mjs
b lib/leadInsights.ts f2-leads.mjs
b lib/analytics.ts f2-analytics.mjs
b lib/conversionRoutes.ts f2-routes.mjs
b lib/seo/business.ts f2-business.mjs
b lib/assurances.ts f2-assurances.mjs
b lib/projectCategories.ts f2-cats.mjs
b components/premium/homeContent.ts f2-home.mjs
npx --yes esbuild scripts/tests/render-entry.tsx --bundle --format=esm --platform=node --jsx=automatic --outfile="$OUT/f2-render.mjs" --log-level=warning --alias:@=. --alias:next/link=./scripts/tests/mocks/next-link.mjs --external:react --external:react-dom
F2_CASE="$OUT/f2-case.mjs" F2_CLAIMS="$OUT/f2-claims.mjs" F2_LEADS="$OUT/f2-leads.mjs" F2_ANALYTICS="$OUT/f2-analytics.mjs" \
F2_ROUTES="$OUT/f2-routes.mjs" F2_BUSINESS="$OUT/f2-business.mjs" F2_ASSURANCES="$OUT/f2-assurances.mjs" F2_CATS="$OUT/f2-cats.mjs" F2_HOME="$OUT/f2-home.mjs" F2_RENDER="$OUT/f2-render.mjs" NODE_PATH="$PWD/node_modules" node --test scripts/tests/fase2.test.mjs
