Koa + EJS SSR 自动化测试落地指南
一套基于 SKILLS 的标准化测试体系：从目录结构到 CI 门禁
1. 总览：测试目标与策略
本指南旨在为 Koa + EJS 服务端渲染（SSR）项目建立一套 “一键执行、可验证、有质量门槛” 的自动化测试体系。不同于 React/Vue SSR 项目复杂的 “水合（Hydration）” 过程，Koa + EJS 的核心在于纯 HTML 的生成质量与后端模板变量的正确注入。
核心目标
- SSR 完整性：确保在禁用 JavaScript 的情况下，页面内容、SEO 标签（Title/Meta）依然完整可见。
- 路由覆盖：自动化遍历所有静态与动态路由，杜绝 404/500 死链。
- 性能与体验：集成 Lighthouse 与 A11y（可访问性）审计，量化质量指标。
Koa + EJS 特性策略
- 无水合问题：无需关注前端组件挂载状态，重点检查 HTML 源码中的数据绑定。
- 模板变量验证：通过测试断言 HTML 中特定的 `data-ssr-key` 或文本内容，验证后端 Controller 数据传递正确性。
- 静态化模拟：测试环境需模拟真实请求头（Cookies/User-Agent）以覆盖登录态与设备适配逻辑。
2. 标准目录结构 (SKILLS Model)
在项目根目录下建立标准的 SKILLS 目录结构，将测试脚本、用例与产物隔离管理，确保主业务代码整洁。

skills/frontend/
├── scripts/                  # 自动化脚本入口（Shell/Node）
│   ├── ssr-serve.sh          # [基础] 启动测试服务（带 PID 管理）
│   ├── ssr-routes-export.js  # [准备] 导出所有待测路由表
│   ├── ssr-api-check.sh      # [冒烟] 核心接口连通性检查
│   ├── ssr-test-render.sh    # [SSR] 静态渲染与 SEO 断言（调起 Playwright）
│   ├── ssr-a11y.sh           # [体验] 可访问性扫描
│   ├── ssr-lighthouse.sh     # [性能] Lighthouse CI 跑分
│   └── ssr-e2e.sh            # [交互] 关键业务路径端到端测试
├── tests/                    # 测试用例源码
│   ├── ssr.spec.ts           # 针对 HTML/SEO/状态码的 Playwright 用例
│   └── e2e.spec.ts           # 针对登录/表单提交的 Playwright 用例
└── outputs/                  # 测试产物（gitignored）
    ├── routes.json           # 导出的路由表
    ├── api-check.json        # 接口检查结果
    ├── lighthouse/           # 性能报告 HTML
    └── report/               # Playwright 测试报告

3. 脚本模板：即插即用
以下脚本为标准化模板，请根据项目实际入口文件（如 `app.js` 或 `index.js`）微调。
1. 服务启动与路由导出
测试开始前，必须启动一个独立的后台服务进程，并解析出所有需要遍历的页面路径。

#!/bin/bash
set -e

# 配置
PORT=3001
LOG_FILE="skills/frontend/outputs/server.log"

echo "Starting Koa server on port $PORT..."
# 启动服务，强制设置测试环境
NODE_ENV=test PORT=$PORT node app.js > "$LOG_FILE" 2>&1 &
SERVER_PID=$!

echo "Server PID: $SERVER_PID"
echo $SERVER_PID > skills/frontend/outputs/server.pid

# 使用 wait-on 等待端口就绪 (需 npm install -g wait-on 或 npx)
npx wait-on http://localhost:$PORT

echo "Server is up and running!"


/**
 * 自动从 Koa Router 导出路由表
 * 用法: node skills/frontend/scripts/ssr-routes-export.js
 */
const fs = require('fs');
const path = require('path');
// 引入你的主路由文件，需确保 router 对象被 export
// const router = require('../../../src/router'); 

// 模拟示例：如果无法直接引入 router，可手动定义核心路径
const staticRoutes = [
  '/', 
  '/about', 
  '/contact', 
  '/products'
];

// 动态路由需提供具体的测试 ID
const dynamicRoutes = [
  '/product/10001', 
  '/category/electronics'
];

const allRoutes = [...staticRoutes, ...dynamicRoutes];
const outputPath = path.join(__dirname, '../outputs/routes.json');

fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(outputPath, JSON.stringify(allRoutes, null, 2));

console.log(`Exported ${allRoutes.length} routes to ${outputPath}`);

2. SSR 渲染验证 (无 JS 环境)
此脚本调用 Playwright 对导出路由进行 “禁用 JavaScript” 的渲染测试，验证 SEO 标签与 HTML 内容。

#!/bin/bash
set -e

echo "Running SSR Render Tests (No-JS)..."

# 确保 outputs 目录存在
mkdir -p skills/frontend/outputs/report

# 调用 Playwright，传入路由表文件路径作为环境变量
# --project=ssr 指向 playwright.config.ts 中配置的无 JS 环境
ROUTES_FILE=skills/frontend/outputs/routes.json \
BASE_URL=http://localhost:3001 \
npx playwright test skills/frontend/tests/ssr.spec.ts \
  --reporter=html:skills/frontend/outputs/report/ssr \
  --headed=false

echo "SSR Render Tests Passed!"

3. API 连通性与 E2E
在进行重型 UI 测试前，先对 API 进行快速冒烟，失败则立即熔断。

#!/bin/bash
# 简单的 curl 冒烟测试
BASE_URL="http://localhost:3001"
ENDPOINTS=("/api/health" "/api/user/status" "/api/config")
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

# 闭合 JSON (简单处理，实际可优化)
echo "{}]" >> skills/frontend/outputs/api-check.json

if [ $FAIL_COUNT -gt 0 ]; then
  echo "API Check Failed: $FAIL_COUNT errors."
  exit 1
fi
echo "API Check Passed."

4. Playwright 用例设计
测试用例分为两类：ssr.spec.ts（关注 HTML 结构与 SEO）与 e2e.spec.ts（关注用户交互）。
SSR 专项用例 (ssr.spec.ts)
核心逻辑：禁用 JavaScript，模拟爬虫视角，验证 EJS 模板是否正确输出了内容。

import { test, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';

// 读取路由表
const routesPath = process.env.ROUTES_FILE || '../outputs/routes.json';
const routes = JSON.parse(fs.readFileSync(routesPath, 'utf-8'));

test.describe('SSR Render Integrity (No-JS)', () => {
  // 关键配置：禁用 JavaScript
  test.use({ javaScriptEnabled: false });

  routes.forEach((routeUrl) => {
    test(`Run: ${routeUrl} should render correctly`, async ({ page }) => {
      const response = await page.goto(process.env.BASE_URL + routeUrl);

      // 1. 状态码断言
      expect(response?.status()).toBe(200);

      // 2. SEO 标签断言
      const title = await page.title();
      expect(title).not.toBe('');
      
      const metaDesc = await page.getAttribute('meta[name="description"]', 'content');
      expect(metaDesc).toBeTruthy();

      // 3. 模板变量断言 (Koa+EJS 核心)
      // 检查关键容器是否有内容（避免空壳）
      await expect(page.locator('main, #app, .content-wrapper').first()).toBeVisible();
      
      // 检查特定 SSR 数据标记 (建议在 EJS 模板中添加 data-ssr-key="price")
      // await expect(page.locator('[data-ssr-key="page-title"]')).toHaveText(/.+/);
    });
  });
});

E2E 交互用例 (e2e.spec.ts)

import { test, expect } from '@playwright/test';

test.describe('Critical User Flows', () => {
  // 开启 JS
  test.use({ javaScriptEnabled: true });

  test('User Login and Redirect', async ({ page }) => {
    // 监听 Console 与 页面错误
    page.on('console', msg => console.log(`BROWSER LOG: ${msg.text()}`));
    page.on('pageerror', err => console.log(`BROWSER ERROR: ${err}`));

    await page.goto('/login');
    await page.fill('input[name="username"]', 'testuser');
    await page.fill('input[name="password"]', 'password123');
    await page.click('button[type="submit"]');

    // 断言跳转与登录态
    await expect(page).toHaveURL('/dashboard');
    await expect(page.locator('.user-profile')).toBeVisible();
  });
});

5. 验收标准与阻断策略
在 CI/CD 流水线中，不同维度的测试失败应有明确的阻断策略。
测试维度
关键指标 (Metrics)
阈值 (Threshold)
阻断策略
SSR 渲染
Status 200, SEO Meta 存在
100% 路由通过
阻断构建
API 连通性
HTTP 200 响应
失败率 < 5%
阻断测试
Lighthouse
Performance Score
≥ 85 (Mobile)
警告 (Warning)
A11y (可访问性)
Critical Errors
0 个严重错误
警告 (Warning)
E2E 流程
核心路径 (下单/登录)
100% 通过
阻断上线
6. CI 集成：并行流水线
以下为 GitHub Actions 示例配置，展示了如何并行执行各类检查以缩短反馈时间。

name: Koa SSR Automation CI

on: [push, pull_request]

jobs:
  test-suite:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
          
      - name: Install Dependencies
        run: npm ci && npx playwright install --with-deps chromium

      # 1. 启动服务 (后台运行)
      - name: Start Server
        run: bash skills/frontend/scripts/ssr-serve.sh

      # 2. 导出路由
      - name: Export Routes
        run: node skills/frontend/scripts/ssr-routes-export.js

      # 3. 并行执行各测试脚本 (Fail Fast)
      - name: Run Checks in Parallel
        run: |
          bash skills/frontend/scripts/ssr-api-check.sh &
          PID_API=$!
          
          bash skills/frontend/scripts/ssr-test-render.sh &
          PID_RENDER=$!
          
          # 等待关键任务完成
          wait $PID_API
          if [ $? -ne 0 ]; then echo "API Check Failed"; exit 1; fi
          
          wait $PID_RENDER
          if [ $? -ne 0 ]; then echo "SSR Render Failed"; exit 1; fi

      # 4. 可选：非阻断性检查 (Lighthouse / A11y)
      - name: Run Quality Audits
        continue-on-error: true
        run: |
          npm install -g @lhci/cli pa11y-ci
          bash skills/frontend/scripts/ssr-lighthouse.sh
          bash skills/frontend/scripts/ssr-a11y.sh

      # 5. 上传报告
      - name: Upload Test Artifacts
        if: always()
        uses: actions/upload-artifact@v3
        with:
          name: test-reports
          path: skills/frontend/outputs/

7. 快速落地清单 (30-60 分钟)
1. 初始化目录：在项目根目录创建 skills/frontend/scripts 与 skills/frontend/tests。
2. 复制脚本：将上述 Shell 和 Node 脚本复制到对应目录，并赋予执行权限 (chmod +x skills/frontend/scripts/*.sh)。
3. 配置路由表：修改 ssr-routes-export.js，手动填入 5-10 个典型路由用于初次调试。
4. 安装依赖：npm install -D playwright wait-on 并执行 npx playwright install。
5. 本地验证：依次运行 ssr-serve.sh (确认服务启动) -> ssr-test-render.sh (确认 Playwright 跑通)。
6. 编写 SKILL.md：在 skills/frontend/ 下创建 README，记录启动命令，方便团队成员查阅。
8. FAQ：常见问题排错
Q: 动态路由（如 /product/:id）如何测试？
A: 不要依赖自动遍历。在 routes.json 生成阶段，手动或自动注入一组 “已知的真实 ID”（如测试数据库中存在的商品 ID），确保请求能返回 200 而不是 404。
Q: 为什么一定要禁用 JavaScript 测试 SSR？
A: 搜索引擎爬虫（Googlebot/Baiduspider）虽然具备一定的 JS 解析能力，但纯 HTML 渲染是 SEO 的基石。禁用 JS 能暴露依赖客户端渲染的内容（如 Loading 骨架屏一直不消失），确保首屏内容是由服务器 EJS 模板直出的。
Q: 登录态页面如何测试？
A: 在 Playwright 的 `page.setExtraHTTPHeaders()` 中注入测试账号的 Cookie 或 Auth Token。对于 Koa 后端，这等同于已登录用户的请求。
Q: 测试脚本在 CI 中报错 "Connection Refused"？
A: 即使使用了 `&` 后台启动，服务启动也需要时间。务必使用 `wait-on http://localhost:PORT` 阻塞脚本执行，直到端口真正对外响应。
