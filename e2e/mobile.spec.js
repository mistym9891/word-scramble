import { test, expect } from '@playwright/test';

test.use({ viewport: { width: 360, height: 740 } });

const expectNoHorizontalScroll = async (page) => {
  const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
  expect(scrollWidth).toBeLessThanOrEqual(360);
};

test('mobile 360x740: no horizontal scroll and keyboard typing fills the slots', async ({ page }) => {
  await page.goto('?e2e=1');

  // Profile screen
  await page.getByPlaceholder('Enter your name').fill('Mobile Tester');
  await expectNoHorizontalScroll(page);
  await page.getByTestId('profile-continue').click();

  // Home screen
  await page.getByTestId('mode-solo').waitFor();
  await expectNoHorizontalScroll(page);
  await page.getByTestId('mode-solo').click();

  // Setup screen (if solo goes through it)
  const next = page.locator('[data-testid="start-game"], [data-testid="slot-0"]').first();
  await next.waitFor();
  if ((await page.getByTestId('start-game').count()) > 0) {
    await expectNoHorizontalScroll(page);
    await page.getByTestId('start-game').click();
  }

  // Game screen
  await page.getByTestId('slot-0').waitFor();
  await page.waitForFunction(() => typeof window.__wsAnswer === 'string' && window.__wsAnswer.length > 0);
  await expectNoHorizontalScroll(page);

  // Letter tiles are real buttons with aria-labels and are at least 44x44
  const tiles = page.getByRole('button', { name: /^letter [A-Z]$/ });
  expect(await tiles.count()).toBeGreaterThan(0);
  const box = await tiles.first().boundingBox();
  expect(box.width).toBeGreaterThanOrEqual(44);
  expect(box.height).toBeGreaterThanOrEqual(44);

  // Typing fills the slots
  const answer = await page.evaluate(() => window.__wsAnswer);
  for (const ch of answer) {
    await page.keyboard.press(ch.toLowerCase());
  }
  for (let i = 0; i < answer.length; i++) {
    await expect(page.getByTestId(`slot-${i}`)).toHaveText(answer[i]);
  }
  await expectNoHorizontalScroll(page);

  // Backspace removes the last letter
  await page.keyboard.press('Backspace');
  await expect(page.getByTestId(`slot-${answer.length - 1}`)).toHaveText('');
  await expect(page.getByTestId(`slot-${answer.length - 2}`)).toHaveText(answer[answer.length - 2]);
});
