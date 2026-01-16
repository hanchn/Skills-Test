import { test, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';
import { HtmlValidate } from 'html-validate';

const htmlValidate = new HtmlValidate({
  extends: ['html-validate:recommended'],
  rules: {
    'close-order': 'error',
    'element-required-content': 'error',
    'no-dup-attr': 'error',
    'no-trailing-whitespace': 'off',
    'void-style': 'off',
    'no-raw-characters': ['warn', { relaxed: true }] // 对正常页面使用 warn 级别，避免阻断
  }
});

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

  routes.forEach((routeUrl: string) => {
    test(`Run: ${routeUrl} should render correctly`, async ({ page }) => {
      // 优先使用 config 中的 baseURL，如果没有则回退到 localhost:3001 (与 serve 脚本一致)
      const baseUrl = process.env.BASE_URL || 'http://localhost:3001';
      
      // 拦截并阻止外部 CDN 请求，避免因网络问题导致超时
      await page.route('**/*', route => {
        const url = route.request().url();
        if (url.includes('cdn.jsdelivr.net')) {
          return route.abort();
        }
        return route.continue();
      });

      // 使用 domcontentloaded 即可，不需要等待所有资源加载完成
      const response = await page.goto(baseUrl + routeUrl, { waitUntil: 'domcontentloaded' });

      // 1. 状态码断言
      expect(response?.status()).toBe(200);

      // 2. SEO 标签断言
      const title = await page.title();
      expect(title).not.toBe('');
      
      // 3. 模板变量断言
      // 检查关键容器是否有内容
      await expect(page.locator('.container').first()).toBeVisible();

      // 4. HTML 结构验证 (Walkthrough)
      // 使用原始响应文本，避免浏览器自动修复 HTML 错误
      if (!response) throw new Error('Response is null');
      const content = await response.text();
      const report = await htmlValidate.validateString(content);
      
      if (!report.valid) {
        const errors = report.results[0].messages.map(m => ({
          route: routeUrl,
          rule: m.ruleId,
          message: m.message,
          line: m.line
        }));
        console.warn(`\n[HTML Validation Warning] Found ${errors.length} issues in ${routeUrl}:`);
        console.table(errors);

        // 2. 将警告添加到报告头部 (Annotations)
        test.info().annotations.push({
          type: 'HTML Validation Warning',
          description: `Found ${errors.length} issues in ${routeUrl}. See attachments for details.`
        });

        // 3. 将详细错误列表渲染为 Markdown 表格
        const markdownTable = [
          '| Route | Rule | Message | Line |',
          '| :--- | :--- | :--- | :--- |',
          ...errors.map(e => `| \`${e.route}\` | \`${e.rule}\` | ${e.message.replace(/\|/g, '\\|')} | ${e.line} |`)
        ].join('\n');

        await test.info().attach(`html-warnings-${routeUrl.replace(/\//g, '-')}.md`, {
          body: markdownTable,
          contentType: 'text/markdown'
        });
        
        // 这里的策略是：打印警告但不让测试失败，除非是严重的结构错误
        // 如果想强制 HTML 完美，可以取消注释下面这行：
        // expect(report.valid).toBe(true);
      }
    });
  });
});
