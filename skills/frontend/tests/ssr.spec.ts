import { test, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';

// 读取路由表
const routesPath = process.env.ROUTES_FILE || path.join(__dirname, '../outputs/routes.json');
let routes = [];
try {
  routes = JSON.parse(fs.readFileSync(routesPath, 'utf-8'));
} catch (e) {
  console.warn('Routes file not found, using default routes.');
  routes = ['/', '/carousel', '/form', '/dynamic'];
}

test.describe('SSR Render Integrity (No-JS)', () => {
  // 关键配置：禁用 JavaScript
  test.use({ javaScriptEnabled: false });

  routes.forEach((routeUrl) => {
    test(`Run: ${routeUrl} should render correctly`, async ({ page }) => {
      const baseUrl = process.env.BASE_URL || 'http://localhost:3000';
      const response = await page.goto(baseUrl + routeUrl);

      // 1. 状态码断言
      expect(response?.status()).toBe(200);

      // 2. SEO 标签断言
      const title = await page.title();
      expect(title).not.toBe('');
      
      // 3. 模板变量断言
      // 检查关键容器是否有内容
      await expect(page.locator('.container').first()).toBeVisible();
    });
  });
});
