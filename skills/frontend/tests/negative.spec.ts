import { test, expect } from '@playwright/test';
import { HtmlValidate } from 'html-validate';

const htmlValidate = new HtmlValidate({
  extends: ['html-validate:recommended'],
  rules: {
    // 根据需要调整规则，这里启用一些基础检查
    'close-order': 'error',
    'element-required-content': 'error',
    'no-dup-attr': 'error',
    'no-trailing-whitespace': 'off', // 忽略空白字符问题
    'void-style': 'off',
    'no-raw-characters': ['error', { relaxed: true }] // 检查未转义的特殊字符，如 < >
  }
});

test.describe('Negative Testing & Validation', () => {
  
  // 拦截并阻止外部 CDN 请求
  test.beforeEach(async ({ page }) => {
    await page.route('**/*', route => {
      const url = route.request().url();
      if (url.includes('cdn.jsdelivr.net')) {
        return route.abort();
      }
      return route.continue();
    });
  });

  test('Should detect HTML structure errors in /bad/html', async ({ page }) => {
    const baseUrl = process.env.BASE_URL || 'http://localhost:3001';
    const response = await page.goto(baseUrl + '/bad/html', { waitUntil: 'domcontentloaded' });
    
    expect(response?.status()).toBe(200);

    // 获取页面原始 HTML (避免浏览器自动修复)
    if (!response) throw new Error('Response is null');
    const content = await response.text();

    // 使用 html-validate 验证
    const report = await htmlValidate.validateString(content);
    
    // 我们预期会有错误
    console.log(`Detected ${report.results[0].messages.length} HTML issues.`);
    
    // 断言验证结果不仅有效，而且确实包含错误
    expect(report.valid).toBe(false);
    
    // 检查是否包含特定的错误类型（示例）
    const errors = report.results[0].messages.map(m => ({
      rule: m.ruleId,
      message: m.message,
      line: m.line,
      column: m.column
    }));
    
    console.log('\n=== HTML Validation Report ===');
    console.table(errors);
    console.log('==============================\n');
    
    // 断言存在错误
    expect(errors.length).toBeGreaterThan(0);
  });

  test('Should handle 500 errors gracefully in /bad/logic', async ({ page }) => {
    const baseUrl = process.env.BASE_URL || 'http://localhost:3001';
    
    // 预期页面会返回 500
    const response = await page.goto(baseUrl + '/bad/logic', { waitUntil: 'domcontentloaded' });
    
    expect(response?.status()).toBe(500);
    
    // 验证页面上是否显示了错误信息 (Express 默认错误页或自定义错误页)
    // 注意：如果是生产环境 (NODE_ENV=production)，错误详情可能被隐藏
    const text = await page.innerText('body');
    // 在开发模式下，通常会包含 ReferenceError
    // 在我们自定义的 server.js catch 块中，返回的是 'Server Error'
    expect(text).toContain('ReferenceError');
  });

});
