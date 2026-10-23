import { test, expect } from '@playwright/test';

async function startSolo(page, url) {
  await page.goto(url);

  const nameInput = page.getByPlaceholder('Enter your name');
  if (await nameInput.isVisible({ timeout: 5000 }).catch(() => false)) {
    await nameInput.fill('Tester');
    await page.getByTestId('profile-continue').click();
  }

  await page.getByTestId('mode-solo').click();
  await page.getByTestId('start-game').click();
  await expect(page.getByTestId('tile-0')).toBeVisible();
}

test('plays one full solo round and the score increases', async ({ page }) => {
  await startSolo(page, '/?e2e=1');

  await page.waitForFunction(() => typeof window.__wsAnswer === 'string' && window.__wsAnswer.length > 0);
  const answer = await page.evaluate(() => window.__wsAnswer);

  await expect(page.locator('[data-testid^="slot-"]')).toHaveCount(answer.length);

  const score = page.getByTestId('score');
  const before = Number(await score.textContent());

  for (let i = 0; i < answer.length; i++) {
    const ch = answer[i];
    await page
      .locator('[data-testid^="tile-"]:not([disabled])')
      .filter({ hasText: new RegExp(`^${ch}$`) })
      .first()
      .click();
    await expect(page.getByTestId(`slot-${i}`)).toHaveText(ch);
  }

  await expect(page.getByTestId('check-btn')).toBeEnabled();
  await page.getByTestId('check-btn').click();

  await expect(page.getByTestId('next-round')).toBeVisible();
  await expect
    .poll(async () => Number(await score.textContent()))
    .toBeGreaterThan(before);
});

test('window.__wsAnswer is undefined without ?e2e=1', async ({ page }) => {
  await startSolo(page, '/');

  await expect(page.getByTestId('tile-0')).toBeVisible();
  const value = await page.evaluate(() => window.__wsAnswer);
  expect(value).toBeUndefined();
});
