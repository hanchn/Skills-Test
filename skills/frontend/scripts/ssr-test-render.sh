#!/bin/bash
set -e

echo "Running SSR Render Tests (No-JS)..."

# 确保 outputs 目录存在
mkdir -p skills/frontend/outputs/report

# 调用 Playwright
ROUTES_FILE=skills/frontend/outputs/routes.json \
BASE_URL=http://localhost:3001 \
npx playwright test skills/frontend/tests/ssr.spec.ts \
  --reporter=html:skills/frontend/outputs/report/ssr \
  --headed=false

echo "SSR Render Tests Passed!"
