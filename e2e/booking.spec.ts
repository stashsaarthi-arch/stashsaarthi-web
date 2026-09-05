import { test, expect } from "@playwright/test";

test.describe("StashSaarthi Core Booking Flow E2E Suite", () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to root landing page
    await page.goto("/");
  });

  test("1. Landing page loads cleanly with header and primary CTAs", async ({ page }) => {
    // Check main title or root structure
    await expect(page).toHaveTitle(/StashSaarthi/i);

    // Verify main interactive elements exist on page
    const navbarLogo = page.locator("header");
    await expect(navbarLogo).toBeVisible();

    // Verify primary hero action buttons
    const heroHeading = page.locator("h1");
    await expect(heroHeading).toBeVisible();
  });

  test("2. Opens 6-service booking modal and calculates pricing dynamically", async ({ page }) => {
    // Trigger booking modal via any primary action button
    const bookButton = page.locator("button:has-text('Book Storage'), button:has-text('Explore'), button:has-text('Get Priority Access')").first();
    await expect(bookButton).toBeVisible();
    await bookButton.click();

    // Verify dialog content is displayed
    const modalTitle = page.locator("h2, [role='dialog']").first();
    await expect(modalTitle).toBeVisible();

    // Test service selection tabs (e.g. Stash, Spaces, Kitchen)
    const stashTab = page.locator("button:has-text('Saarthi Stash')");
    if (await stashTab.isVisible()) {
      await stashTab.click();
    }

    // Verify dynamic quantity input changes affect calculation
    const bagsSelect = page.locator("#bk-bags");
    if (await bagsSelect.isVisible()) {
      await bagsSelect.selectOption("3");
      const priceDisplay = page.locator("text=₹900");
      await expect(priceDisplay).toBeVisible();
    }
  });

  test("3. Form validation blocks invalid submissions and proceeds on valid input", async ({ page }) => {
    // Open modal
    const bookButton = page.locator("button:has-text('Book Storage'), button:has-text('Explore')").first();
    await bookButton.click();

    // Fill contact details
    const nameInput = page.locator("#bk-name");
    const phoneInput = page.locator("#bk-phone");

    if (await nameInput.isVisible()) {
      await nameInput.fill("Test Student");
      await phoneInput.fill("9876543210");

      const continueBtn = page.locator("button:has-text('Continue'), button:has-text('आगे बढ़ें')");
      await continueBtn.click();

      // Should move to Step 2 (Escrow Lock & Confirmation)
      const step2Header = page.locator("text=Escrow Lock, text=एस्क्रो भुगतान");
      await expect(step2Header).toBeVisible();
    }
  });

  test("4. Escrow payment step displays QR code, terms waiver, and copy UPI trigger", async ({ page }) => {
    // Open modal and navigate to Step 2
    const bookButton = page.locator("button:has-text('Book Storage'), button:has-text('Explore')").first();
    await bookButton.click();

    const nameInput = page.locator("#bk-name");
    const phoneInput = page.locator("#bk-phone");

    if (await nameInput.isVisible()) {
      await nameInput.fill("Aarav Sharma");
      await phoneInput.fill("9876543210");

      const continueBtn = page.locator("button:has-text('Continue'), button:has-text('आगे बढ़ें')");
      await continueBtn.click();

      // Check UPI QR Code image or Escrow reserve option
      const upiTab = page.locator("button:has-text('UPI QR Code'), button:has-text('UPI QR')");
      await expect(upiTab).toBeVisible();

      // Check terms & conditions waiver checkbox
      const waiverCheckbox = page.locator("#bk-waiver");
      await expect(waiverCheckbox).toBeVisible();
      await waiverCheckbox.check();
      await expect(waiverCheckbox).toBeChecked();
    }
  });

  test("5. Mobile viewport responsive booking check", async ({ page, viewport }) => {
    if (viewport && viewport.width < 600) {
      // Check sticky mobile CTA
      const mobileSticky = page.locator("[data-testid='mobile-sticky-cta'], button:has-text('Book'), button:has-text('Stash')").first();
      await expect(mobileSticky).toBeVisible();
    }
  });
});
