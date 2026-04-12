import { expect, test } from '@playwright/test';

test('Location Discovery flow', async ({ page }) => {
	await page.goto('/');

	// Should see the Discover view
	await expect(page.locator('title')).toHaveText(/wohin — find your vibe/);

	// Should see the ActivitySearch component (placeholder text initially)
	// We'll update this once the component is implemented.
	// await expect(page.getByRole('button', { name: 'Study' })).toBeVisible();
});
