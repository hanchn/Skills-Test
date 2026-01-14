#!/bin/bash
# 简单的 curl 冒烟测试
BASE_URL="http://localhost:3001"
ENDPOINTS=("/api/health" "/" "/carousel" "/form")
FAIL_COUNT=0

mkdir -p skills/frontend/outputs
echo "[" > skills/frontend/outputs/api-check.json

for api in "${ENDPOINTS[@]}"; do
  status=$(curl -o /dev/null -s -w "%{http_code}" "$BASE_URL$api")
  echo "Checking $api ... Status: $status"
  
  if [ "$status" -ne 200 ]; then
    FAIL_COUNT=$((FAIL_COUNT+1))
  fi
  
  # 记录结果
  echo "{\"url\":\"$api\", \"status\":$status}," >> skills/frontend/outputs/api-check.json
done

# 闭合 JSON
echo "{}]" >> skills/frontend/outputs/api-check.json

if [ $FAIL_COUNT -gt 0 ]; then
  echo "API Check Failed: $FAIL_COUNT errors."
  exit 1
fi
echo "API Check Passed."
