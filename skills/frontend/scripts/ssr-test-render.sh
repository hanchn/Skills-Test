#!/bin/bash
set -e

echo "Running SSR Render Tests (No-JS)..."

# 确保 outputs 目录存在
mkdir -p skills/frontend/outputs/report

# 调用 Playwright
ROUTES_FILE=skills/frontend/outputs/routes.json \
BASE_URL=http://localhost:3001 \
PLAYWRIGHT_HTML_REPORT=skills/frontend/outputs/report/ssr \
npx playwright test skills/frontend/tests/ssr.spec.ts \
  --reporter=html

echo "SSR Render Tests Passed!"
