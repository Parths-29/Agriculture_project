/**
 * E2E Tests — Sign Up Page Validation
 * Covers manual test cases: SU-01 through SU-07
 *
 * Run: npm run test:e2e
 * Requires: dev server at http://localhost:5173
 */
import { test, expect } from "@playwright/test";

const BASE = "http://localhost:5173";

test.describe("Sign Up Page — Field Validation (SU-01 to SU-07)", () => {

  test.beforeEach(async ({ page }) => {
    await page.goto(`${BASE}/signup`);
    await page.waitForLoadState("networkidle");
  });

  // ── SU-01: Empty name field ──────────────────────────────────────────────
  test("SU-01: empty name shows required error", async ({ page }) => {
    await test.step("Arrange – leave Name blank, fill other fields", async () => {
      await page.fill("#signup-phone", "9876543210");
      await page.fill("#signup-password", "test123");
      await page.fill("#signup-confirm-password", "test123");
    });

    await test.step("Act – submit the form", async () => {
      await page.click("#signup-submit");
    });

    await test.step("Assert – inline error appears under Name field", async () => {
      // Error text appears as translated value for "fieldRequired"
      await expect(page.locator("text=required").first()).toBeVisible({ timeout: 3000 });
    });
  });

  // ── SU-02: Empty phone field ─────────────────────────────────────────────
  test("SU-02: empty phone shows required error", async ({ page }) => {
    await test.step("Arrange – fill name + passwords, leave phone blank", async () => {
      await page.fill("#signup-name", "Test User");
      await page.fill("#signup-password", "test123");
      await page.fill("#signup-confirm-password", "test123");
    });

    await test.step("Act – submit", async () => {
      await page.click("#signup-submit");
    });

    await test.step("Assert – required error appears under Phone field", async () => {
      await expect(page.locator("text=required").first()).toBeVisible({ timeout: 3000 });
    });
  });

  // ── SU-03: Non-numeric phone ─────────────────────────────────────────────
  test("SU-03: non-numeric phone shows phoneNonNumeric error", async ({ page }) => {
    await test.step("Arrange – fill all valid fields but phone has letters", async () => {
      await page.fill("#signup-name", "Test User");
      await page.fill("#signup-phone", "98765abcde");
      await page.fill("#signup-password", "test123");
      await page.fill("#signup-confirm-password", "test123");
    });

    await test.step("Act – submit", async () => {
      await page.click("#signup-submit");
    });

    await test.step("Assert – 'only numbers' error is visible", async () => {
      await expect(page.locator("text=only numbers")).toBeVisible({ timeout: 3000 });
    });
  });

  // ── SU-04: Phone not 10 digits ───────────────────────────────────────────
  test("SU-04: 5-digit phone shows phoneInvalid error", async ({ page }) => {
    await test.step("Arrange – phone only 5 digits", async () => {
      await page.fill("#signup-name", "Test User");
      await page.fill("#signup-phone", "12345");
      await page.fill("#signup-password", "test123");
      await page.fill("#signup-confirm-password", "test123");
    });

    await test.step("Act – submit", async () => {
      await page.click("#signup-submit");
    });

    await test.step("Assert – '10 digits' error is visible", async () => {
      await expect(page.locator("text=10 digits")).toBeVisible({ timeout: 3000 });
    });
  });

  // ── SU-05: Password too short ────────────────────────────────────────────
  test("SU-05: password under 6 chars shows passwordTooShort error", async ({ page }) => {
    await test.step("Arrange – password is only 3 chars", async () => {
      await page.fill("#signup-name", "Test User");
      await page.fill("#signup-phone", "9876543210");
      await page.fill("#signup-password", "abc");
      await page.fill("#signup-confirm-password", "abc");
    });

    await test.step("Act – submit", async () => {
      await page.click("#signup-submit");
    });

    await test.step("Assert – 'at least 6' error is visible", async () => {
      await expect(page.locator("text=at least 6")).toBeVisible({ timeout: 3000 });
    });
  });

  // ── SU-06: Password mismatch ─────────────────────────────────────────────
  test("SU-06: mismatched passwords shows passwordMismatch error", async ({ page }) => {
    await test.step("Arrange – passwords differ", async () => {
      await page.fill("#signup-name", "Test User");
      await page.fill("#signup-phone", "9876543210");
      await page.fill("#signup-password", "password1");
      await page.fill("#signup-confirm-password", "password2");
    });

    await test.step("Act – submit", async () => {
      await page.click("#signup-submit");
    });

    await test.step("Assert – 'do not match' error is visible", async () => {
      await expect(page.locator("text=do not match")).toBeVisible({ timeout: 3000 });
    });
  });

  // ── SU-07: Duplicate phone number ────────────────────────────────────────
  test("SU-07: duplicate phone shows already-exists error", async ({ page }) => {
    await test.step("Arrange – use pre-seeded phone 9876543210", async () => {
      await page.fill("#signup-name", "Another User");
      await page.fill("#signup-phone", "9876543210");
      await page.fill("#signup-password", "newpass123");
      await page.fill("#signup-confirm-password", "newpass123");
    });

    await test.step("Act – submit (hits backend or in-memory check)", async () => {
      await page.click("#signup-submit");
    });

    await test.step("Assert – 'already exists' error appears", async () => {
      // Works for both the API error (backend) and the caught error alert
      await expect(
        page.locator("text=already exists").or(page.locator("text=already"))
      ).toBeVisible({ timeout: 5000 });
    });
  });

});
