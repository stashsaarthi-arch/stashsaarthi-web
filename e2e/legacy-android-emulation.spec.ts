import { test, expect } from "@playwright/test";

test.describe("Legacy Android Device Emulation & WebGL Crash Safety Suite", () => {
  test.use({
    userAgent:
      "Mozilla/5.0 (Linux; Android 6.0.1; Nexus 5 Build/MMB29Q) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.159 Mobile Safari/537.36",
    viewport: { width: 360, height: 640 },
    deviceScaleFactor: 2,
    isMobile: true,
    hasTouch: true,
  });

  test("1. Renders landing page cleanly on emulated Android 6 device without WebGL crashes", async ({
    page,
  }) => {
    // Collect console errors to verify zero unhandled WebGL exceptions
    const consoleErrors: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") {
        consoleErrors.push(msg.text());
      }
    });

    await page.goto("/");

    // Verify root layout hydration
    const header = page.locator("header");
    await expect(header).toBeVisible();

    const heroHeading = page.locator("h1");
    await expect(heroHeading).toBeVisible();

    // Verify legacy android fallback attribute is set on HTML root
    const legacyAttr = await page.getAttribute("html", "data-legacy-android");
    expect(legacyAttr).toBe("true");

    // Ensure no severe WebGL crashes were recorded in console
    const webglCrashErrors = consoleErrors.filter(
      (err) => err.includes("WebGL") && err.includes("Uncaught"),
    );
    expect(webglCrashErrors.length).toBe(0);
  });

  test("2. Navigates multi-step booking modal safely on low-spec viewport", async ({ page }) => {
    await page.goto("/");

    // Open booking modal
    const bookBtn = page
      .locator("button:has-text('Book Storage'), button:has-text('Explore')")
      .first();
    await expect(bookBtn).toBeVisible();
    await bookBtn.click();

    // Verify modal is visible and interactive
    const modalHeading = page.locator("h2, [role='dialog']").first();
    await expect(modalHeading).toBeVisible();

    // Fill phone contact
    const phoneInput = page.locator("#bk-phone");
    if (await phoneInput.isVisible()) {
      await phoneInput.fill("9876543210");
      const submitBtn = page.locator("button:has-text('Continue'), button:has-text('आगे बढ़ें')");
      await submitBtn.click();

      // Step 2 should display cleanly
      const step2Title = page.locator("text=Escrow Lock, text=एस्क्रो भुगतान");
      await expect(step2Title).toBeVisible();
    }
  });

  test("3. WebGL Context Lost recovery triggers safe 2D CSS fallback mode", async ({ page }) => {
    await page.goto("/");

    // Dispatch webglcontextlost event to test resilience
    await page.evaluate(() => {
      window.dispatchEvent(new Event("webglcontextlost"));
    });

    // Check if legacy android fallback class is applied
    const hasClass = await page.evaluate(() =>
      document.documentElement.classList.contains("legacy-android-fallback"),
    );
    expect(hasClass).toBe(true);

    // Verify page elements remain interactive and unbroken
    const heroBtn = page
      .locator("button:has-text('Book Storage'), button:has-text('Explore')")
      .first();
    await expect(heroBtn).toBeVisible();
  });
});
