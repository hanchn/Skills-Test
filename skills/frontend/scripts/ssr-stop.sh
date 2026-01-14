#!/bin/bash
PORT=3001
PID_FILE="skills/frontend/outputs/server.pid"

if [ -f "$PID_FILE" ]; then
  PID=$(cat "$PID_FILE")
  echo "Stopping server PID: $PID..."
  kill $PID 2>/dev/null || true
  rm "$PID_FILE"
fi

# Ensure port is closed (force kill if necessary)
if lsof -ti:$PORT >/dev/null; then
  echo "Cleaning up port $PORT..."
  lsof -ti:$PORT | xargs kill -9 2>/dev/null || true
fi

echo "Server stopped."
