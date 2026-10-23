import { test, expect } from '@playwright/test';

// Runs against BASE_URL (local preview by default, the live URL after deploy).
test('game loads, has no console errors, and responds to a click', async ({ page }) => {
  const errors = [];
  page.on('pageerror', (e) => errors.push(e.message));
  page.on('console', (m) => { if (m.type() === 'error' && !/visits|beacon/i.test(m.text())) errors.push(m.text()); });
  await page.goto('/');
  await expect(page).toHaveTitle(/Word Scramble/);
  const buttons = page.locator('button');
  await expect(buttons.first()).toBeVisible();
  const before = await page.locator('body').innerText();
  await buttons.first().click();
  await page.waitForTimeout(500);
  const after = await page.locator('body').innerText();
  expect(after.length).toBeGreaterThan(0);
  expect(errors, errors.join('\n')).toEqual([]);
  expect(before).not.toBe('');
});
