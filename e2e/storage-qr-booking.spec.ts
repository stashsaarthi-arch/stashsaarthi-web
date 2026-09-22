import { test, expect } from "@playwright/test";

test.describe("Luggage Storage Booking Flow & Role-Based QR Code Verification", () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to homepage with local storage initialized
    await page.goto("/");
  });

  test("completes luggage storage booking, verifies generated QR code matches unique booking ID, and tests cross-role QR scanning", async ({
    page,
  }) => {
    // 1. Open Booking Modal for Saarthi Stash (Luggage Storage)
    const bookButton = page
      .locator(
        'button:has-text("Book Storage"), button:has-text("Reserve Stash"), button:has-text("Book Now")',
      )
      .first();
    await expect(bookButton).toBeVisible();
    await bookButton.click();

    // 2. Verify modal opened
    const dialogTitle = page.locator('[role="dialog"] h2, [role="dialog"] [class*="DialogTitle"]');
    await expect(dialogTitle).toBeVisible();

    // Select Saarthi Stash service if not already active
    const stashServiceBtn = page
      .locator('button:has-text("Saarthi Stash"), button:has-text("सार्थी स्टैश")')
      .first();
    if (await stashServiceBtn.isVisible()) {
      await stashServiceBtn.click();
    }

    // 3. Fill out contact & item details
    const nameInput = page.locator('input[placeholder*="Full Name"], input[id="bk-name"]').first();
    const phoneInput = page.locator('input[placeholder*="WhatsApp"], input[id="bk-phone"]').first();
    const emailInput = page.locator('input[placeholder*="Email"], input[id="bk-email"]').first();
    const pinInput = page.locator('input[placeholder*="PIN"], input[id="bk-pin"]').first();

    if (await nameInput.isVisible()) await nameInput.fill("Aarav Sharma");
    if (await phoneInput.isVisible()) await phoneInput.fill("9876543210");
    if (await emailInput.isVisible()) await emailInput.fill("aarav.sharma@iitk.ac.in");
    if (await pinInput.isVisible()) await pinInput.fill("208016");

    // 4. Proceed to Step 2 (Escrow Review)
    const continueBtn = page
      .locator('button:has-text("Continue"), button:has-text("आगे बढ़ें")')
      .first();
    await expect(continueBtn).toBeVisible();
    await continueBtn.click();

    // 5. Select Escrow Payment Mode & Accept Waiver in Step 2
    const waiverCheckbox = page.locator('input[type="checkbox"][id="bk-waiver"]').first();
    await expect(waiverCheckbox).toBeVisible();
    await waiverCheckbox.check();

    // 6. Submit Checkout to Issue StashPass
    const confirmBtn = page
      .locator(
        'button:has-text("Confirm & Lock Reservation"), button:has-text("आरक्षण व एस्क्रो लॉक करें")',
      )
      .first();
    await expect(confirmBtn).toBeVisible();
    await confirmBtn.click();

    // 7. Verify Transition to Step 3 (StashPass Issued)
    const passHeader = page.locator(
      'h3:has-text("StashPass is Ready"), h3:has-text("स्टैशपास तैयार है")',
    );
    await expect(passHeader).toBeVisible({ timeout: 10000 });

    // 8. Extract Generated Unique Booking ID (tokenId)
    const tokenIdElem = page.locator('[data-testid="stash-pass-token-id"]');
    await expect(tokenIdElem).toBeVisible();
    const tokenId = (await tokenIdElem.textContent())?.trim() || "";
    expect(tokenId).toMatch(/^ST-\d{5}$/);

    // 9. Assert Generated QR Code Matches Unique Booking ID
    const qrImage = page.locator('[data-testid="stash-pass-qr"]');
    await expect(qrImage).toBeVisible();

    const qrSrc = await qrImage.getAttribute("src");
    expect(qrSrc).toContain(encodeURIComponent(tokenId));

    const qrTokenAttr = await qrImage.getAttribute("data-token-id");
    expect(qrTokenAttr).toBe(tokenId);

    // 10. Verify Cross-Role QR Scanning
    // Role 1: Student Role Scan
    const studentRoleBtn = page.locator('[data-testid="qr-scan-student"]');
    await expect(studentRoleBtn).toBeVisible();
    await studentRoleBtn.click();
    await expect(page.locator("text=Role: STUDENT")).toBeVisible();
    await expect(page.locator("text=Student Aarav Sharma verified active storage")).toBeVisible();

    // Role 2: Senior Host Role Scan
    const hostRoleBtn = page.locator('[data-testid="qr-scan-host"]');
    await expect(hostRoleBtn).toBeVisible();
    await hostRoleBtn.click();
    await expect(page.locator("text=Role: HOST")).toBeVisible();
    await expect(page.locator("text=Senior Host Node verified physical intake")).toBeVisible();

    // Role 3: Admin Ops Role Scan
    const adminRoleBtn = page.locator('[data-testid="qr-scan-admin"]');
    await expect(adminRoleBtn).toBeVisible();
    await adminRoleBtn.click();
    await expect(page.locator("text=Role: ADMIN")).toBeVisible();
    await expect(page.locator("text=Admin Operations audited Escrow")).toBeVisible();

    // 11. Verify Booking Record Saved in Local Storage Store
    const savedBookingsRaw = await page.evaluate(() => localStorage.getItem("ss_local_bookings"));
    expect(savedBookingsRaw).not.toBeNull();

    const savedBookings = JSON.parse(savedBookingsRaw || "[]");
    const matchingBooking = savedBookings.find((b: any) => b.token === tokenId);
    expect(matchingBooking).toBeDefined();
    expect(matchingBooking.name).toBe("Aarav Sharma");
    expect(matchingBooking.service).toBe("stash");
  });
});
