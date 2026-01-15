import { test, expect } from '@playwright/test';

test.describe('Critical User Flows', () => {
  // 开启 JS
  test.use({ javaScriptEnabled: true });

  test('Form Submission', async ({ page }) => {
    const baseUrl = process.env.BASE_URL || 'http://localhost:3001';
    await page.goto(baseUrl + '/form');
    
    // 填写表单
    await page.fill('input[name="username"]', 'testuser');
    await page.fill('input[name="email"]', 'test@example.com');
    await page.click('button[type="submit"]');

    // 验证结果消息
    await expect(page.locator('#resultMessage')).toBeVisible({ timeout: 5000 });
    await expect(page.locator('#resultMessage')).toContainText('用户 testuser 提交成功');
  });
  
  test('Carousel Interaction', async ({ page }) => {
     const baseUrl = process.env.BASE_URL || 'http://localhost:3001';
     await page.goto(baseUrl + '/carousel');
     // 验证 Swiper 存在
     await expect(page.locator('.swiper')).toBeVisible();
  });

  test('Dynamic List Interaction', async ({ page }) => {
    const baseUrl = process.env.BASE_URL || 'http://localhost:3001';
    await page.goto(baseUrl + '/dynamic');

    await page.fill('#newItemInput', 'New Item');
    await page.click('#addItemBtn');

    // 验证新项目出现
    await expect(page.locator('#item-list')).toContainText('New Item');
  });
});
