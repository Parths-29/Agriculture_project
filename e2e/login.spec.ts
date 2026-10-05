/**
 * E2E Tests — Login Page
 * Covers manual test cases: LI-01, LI-02, LI-04, LI-05, LI-07
 *
 * Run: npm run test:e2e
 */
import { test, expect } from "@playwright/test";

const BASE = "http://localhost:5173";

test.describe("Login Page — Validation & Auth Flow (LI-01, LI-02, LI-04, LI-05, LI-07)", () => {

  test.beforeEach(async ({ page }) => {
    // Ensure no existing session bleeds across tests
    await page.goto(`${BASE}/login`);
    await page.evaluate(() => localStorage.removeItem("currentUser"));
    await page.reload();
    await page.waitForLoadState("networkidle");
  });

  // ── LI-01: Empty phone ───────────────────────────────────────────────────
  test("LI-01: empty phone field shows required error", async ({ page }) => {
    await test.step("Arrange – leave phone blank, fill password", async () => {
      await page.fill("#login-password", "somepassword");
    });

    await test.step("Act – submit form", async () => {
      await page.click("#login-submit");
    });

    await test.step("Assert – required error visible under phone", async () => {
      await expect(page.locator("text=required").first()).toBeVisible({ timeout: 3000 });
    });
  });

  // ── LI-02: Empty password ────────────────────────────────────────────────
  test("LI-02: empty password field shows required error", async ({ page }) => {
    await test.step("Arrange – fill phone, leave password blank", async () => {
      await page.fill("#login-phone", "9876543210");
    });

    await test.step("Act – submit form", async () => {
      await page.click("#login-submit");
    });

    await test.step("Assert – required error visible under password", async () => {
      await expect(page.locator("text=required").first()).toBeVisible({ timeout: 3000 });
    });
  });

  // ── LI-04: Phone not in database ─────────────────────────────────────────
  test("LI-04: unregistered phone shows no-account-found error", async ({ page }) => {
    await test.step("Arrange – use phone that doesn't exist", async () => {
      await page.fill("#login-phone", "9000000001");
      await page.fill("#login-password", "anypassword");
    });

    await test.step("Act – submit", async () => {
      await page.click("#login-submit");
    });

    await test.step("Assert – error about account not found appears", async () => {
      // Accepts either "No account" text or generic "Invalid" from backend
      await expect(
        page.locator("text=No account").or(page.locator("text=account found")).or(page.locator("text=Invalid"))
      ).toBeVisible({ timeout: 6000 });
    });
  });

  // ── LI-05: Wrong password ────────────────────────────────────────────────
  test("LI-05: correct phone but wrong password shows incorrect-password error", async ({ page }) => {
    await test.step("Arrange – use known phone with wrong password", async () => {
      await page.fill("#login-phone", "9876543210");
      await page.fill("#login-password", "wrongpassword");
    });

    await test.step("Act – submit", async () => {
      await page.click("#login-submit");
    });

    await test.step("Assert – error about incorrect password is shown", async () => {
      await expect(
        page.locator("text=Incorrect").or(page.locator("text=incorrect")).or(page.locator("text=Invalid"))
      ).toBeVisible({ timeout: 6000 });
    });
  });

  // ── LI-07: Successful login ──────────────────────────────────────────────
  test("LI-07: valid credentials (9876543210/ramesh123) redirect to /home", async ({ page }) => {
    await test.step("Arrange – use the pre-seeded Ramesh Patil account", async () => {
      await page.fill("#login-phone", "9876543210");
      await page.fill("#login-password", "ramesh123");
    });

    await test.step("Act – submit", async () => {
      await page.click("#login-submit");
    });

    await test.step("Assert – redirected to /home with greeting visible", async () => {
      await page.waitForURL(`${BASE}/home`, { timeout: 8000 });
      await expect(page).toHaveURL(`${BASE}/home`);
      // Greeting contains the user's name
      await expect(page.locator("text=Ramesh").first()).toBeVisible({ timeout: 5000 });
    });
  });

});
