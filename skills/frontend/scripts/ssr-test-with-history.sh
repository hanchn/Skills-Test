#!/bin/bash

# 获取当前时间戳，例如: 20240320_153045
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
REPORT_DIR="skills/frontend/outputs/report/html_$TIMESTAMP"

echo "Setting Playwright report directory to: $REPORT_DIR"
export PLAYWRIGHT_HTML_REPORT="$REPORT_DIR"

# 运行测试
npm run skill:serve && \
npm run skill:export && \
npm run skill:smoke && \
npm run skill:ssr && \
npm run skill:e2e && \
npm run skill:negative

EXIT_CODE=$?

npm run skill:stop

# 更新最新报告的软链接 (方便查看)
ln -sfn "html_$TIMESTAMP" "skills/frontend/outputs/report/latest"

echo ""
echo "Test finished with exit code: $EXIT_CODE"
echo "Report generated at: $REPORT_DIR"

# 使用 Playwright 自带的命令展示报告 (会自动启动服务并打开浏览器)
# 注意：这会阻塞终端，直到用户按 Ctrl+C
if [ -t 1 ]; then
    echo "Launching report viewer..."
    npx playwright show-report "$REPORT_DIR"
else
    echo "To view report: npx playwright show-report $REPORT_DIR"
fi

exit $EXIT_CODE
