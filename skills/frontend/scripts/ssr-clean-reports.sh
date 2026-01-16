#!/bin/bash

REPORT_DIR="skills/frontend/outputs/report"
echo "Cleaning up old reports in $REPORT_DIR..."

# 删除 html_ 开头的目录，保留 latest 软链接
find "$REPORT_DIR" -type d -name "html_*" -exec rm -rf {} +

# 删除 latest 软链接
rm -f "$REPORT_DIR/latest"

echo "All reports cleaned."
