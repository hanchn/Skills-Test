#!/bin/bash
set -e

# 获取当前时间戳
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
REPORT_DIR="skills/frontend/outputs/report/html_negative_$TIMESTAMP"

echo "Setting Playwright report directory to: $REPORT_DIR"
export PLAYWRIGHT_HTML_REPORT="$REPORT_DIR"

# 1. 启动服务
echo "Starting server..."
bash skills/frontend/scripts/ssr-serve.sh

# 2. 运行异常测试
echo "Running negative tests..."
npx playwright test skills/frontend/tests/negative.spec.ts

EXIT_CODE=$?

# 3. 停止服务
echo "Stopping server..."
bash skills/frontend/scripts/ssr-stop.sh

# 更新最新报告的软链接
ln -sfn "html_negative_$TIMESTAMP" "skills/frontend/outputs/report/latest"

echo ""
echo "Negative tests finished with exit code: $EXIT_CODE"
echo "Report generated at: $REPORT_DIR"
exit $EXIT_CODE
