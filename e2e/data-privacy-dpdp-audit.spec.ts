import { test, expect } from "@playwright/test";

test.describe("Data Privacy & DPDP Act 2023 Compliance Portal", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/privacy");
  });

  test("opens Data Privacy Audit portal, verifies 100% compliance score, and submits DSAR erasure request", async ({ page }) => {
    // 1. Verify title and launch button
    const pageHeading = page.locator("h1");
    await expect(pageHeading).toContainText("Privacy Policy");

    const auditLaunchBtn = page.locator('button:has-text("Audit DPDP & GDPR Compliance Portal"), button:has-text("ऑटोनॉमस DPDP")').first();
    await expect(auditLaunchBtn).toBeVisible();
    await auditLaunchBtn.click();

    // 2. Verify modal opened
    const modalHeading = page.locator('h2:has-text("Data Sovereignty & DPDP Audit Portal"), h2:has-text("डेटा गोपनीयता")');
    await expect(modalHeading).toBeVisible();

    // 3. Verify compliance score banner
    const scoreBadge = page.locator('div:has-text("100%")').first();
    await expect(scoreBadge).toBeVisible();

    // 4. Switch to DSAR tab
    const dsarTab = page.locator('button:has-text("Data Erasure / DSAR Portal"), button:has-text("डेटा विलोपन")').first();
    await expect(dsarTab).toBeVisible();
    await dsarTab.click();

    // 5. Fill out DSAR erasure request
    const nameInput = page.locator('input[placeholder*="Rahul Kumar"]').first();
    const contactInput = page.locator('input[placeholder*="9876543210"]').first();
    await nameInput.fill("Ananya Roy");
    await contactInput.fill("ananya.roy@kanpur-univ.ac.in");

    const submitBtn = page.locator('button:has-text("Submit Legal Request"), button:has-text("अनुरोध दर्ज करें")').first();
    await expect(submitBtn).toBeVisible();
    await submitBtn.click();

    // 6. Verify Ticket Acknowledgement banner
    const ackTicketBanner = page.locator('span:has-text("DSAR-2026-KNP-")').first();
    await expect(ackTicketBanner).toBeVisible();
  });
});
