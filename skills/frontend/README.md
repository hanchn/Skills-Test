# SKILLS 标准化测试体系

本目录包含 Koa + EJS 项目的自动化测试脚本与用例。

## 目录结构

- `scripts/`: 自动化执行脚本 (Shell/Node)
- `tests/`: Playwright 测试用例
- `outputs/`: 测试产物 (日志、报告、路由表)

## 快速开始

### 1. 启动测试环境

```bash
# 启动独立测试服务 (Port 3001)
bash skills/frontend/scripts/ssr-serve.sh
```

### 2. 导出路由表

```bash
node skills/frontend/scripts/ssr-routes-export.js
```

### 3. 执行测试

```bash
# API 冒烟测试
bash skills/frontend/scripts/ssr-api-check.sh

# SSR 渲染验证 (无 JS 环境)
bash skills/frontend/scripts/ssr-test-render.sh

# 运行 E2E 测试
npx playwright test skills/frontend/tests/e2e.spec.ts
```

## 常见问题

- 如果端口冲突，请修改 `scripts/ssr-serve.sh` 中的 `PORT` 变量。
- 动态路由测试需在 `scripts/ssr-routes-export.js` 中手动添加 ID。
