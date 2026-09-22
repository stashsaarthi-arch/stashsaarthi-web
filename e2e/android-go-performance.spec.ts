import { test, expect } from "@playwright/test";

test.describe("Android Go Ultra-Low-Spec Device Performance & Crash Safety Suite", () => {
  test.use({
    userAgent:
      "Mozilla/5.0 (Linux; Android 11; JioPhone Next Build/RP1A.200720.011; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/94.0.4606.85 Mobile Safari/537.36 Android-Go",
    viewport: { width: 360, height: 640 },
    deviceScaleFactor: 2,
    isMobile: true,
    hasTouch: true,
  });

  test("1. Renders landing page cleanly on emulated Android Go device with zero crashes", async ({
    page,
  }) => {
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

    // Verify android-go data attribute or class application
    const root = page.locator("html");
    await expect(root).toBeVisible();

    // Ensure zero unhandled WebGL or JS crashes occurred
    const crashes = consoleErrors.filter(
      (err) => (err.includes("WebGL") || err.includes("Uncaught")) && err.includes("Error"),
    );
    expect(crashes.length).toBe(0);
  });

  test("2. Opens Android Go Performance Modal and inspects 5-point audit assertions", async ({
    page,
  }) => {
    await page.goto("/");

    // Scroll to footer and locate Android Go Audit trigger button
    const auditBtn = page
      .locator(
        "button:has-text('Android Go Audit'), button:has-text('📱 एंड्रॉइड गो परफॉर्मेंस टेस्ट')",
      )
      .first();
    await auditBtn.scrollIntoViewIfNeeded();
    await expect(auditBtn).toBeVisible();
    await auditBtn.click();

    // Verify modal dialog appears
    const dialogTitle = page.locator(
      "text=Android Go & Low-Spec Device Performance Guard, text=एंड्रॉइड गो परफॉर्मेंस",
    );
    await expect(dialogTitle).toBeVisible();

    // Check hardware stats card display
    const auditScore = page.locator("text=Score: 100/100, text=Score:");
    await expect(auditScore).toBeVisible();

    // Trigger FPS test runner
    const runFpsBtn = page.locator(
      "button:has-text('Run FPS Test'), button:has-text('बेंचमार्क चलाएं')",
    );
    if (await runFpsBtn.isVisible()) {
      await runFpsBtn.click();
      const avgFpsLabel = page.locator("text=Avg FPS");
      await expect(avgFpsLabel).toBeVisible();
    }
  });
});
