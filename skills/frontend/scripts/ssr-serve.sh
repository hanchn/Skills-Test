#!/bin/bash
set -e

# 配置
PORT=3001
LOG_FILE="skills/frontend/outputs/server.log"

echo "Starting server on port $PORT..."
# 启动服务，强制设置测试环境
NODE_ENV=test PORT=$PORT node server.js > "$LOG_FILE" 2>&1 &
SERVER_PID=$!

echo "Server PID: $SERVER_PID"
echo $SERVER_PID > skills/frontend/outputs/server.pid

# 使用 wait-on 等待端口就绪
npx wait-on http://localhost:$PORT

echo "Server is up and running!"
