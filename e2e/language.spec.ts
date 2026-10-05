import { expect, test } from "@playwright/test";

const localizedPages = [
  { path: "/home", heading: "ಸ್ವಾಗತ,", content: "ಅನ್ವೇಷಿಸಿ" },
  { path: "/news", heading: "ಸುದ್ದಿ ಮತ್ತು ಸಲಹೆ", content: "ಲೇಖನಗಳನ್ನು ಹುಡುಕಿ..." },
  { path: "/article/1", heading: "Best Irrigation Timing", content: "ಸುದ್ದಿಗೆ ಹಿಂತಿರುಗಿ" },
  { path: "/analysis", heading: "ಕಬ್ಬಿನ ವಿಶ್ಲೇಷಣೆ", content: "ಇಳುವರಿ ಅಂದಾಜು ಲೆಕ್ಕಾಚಾರ" },
  { path: "/weather", heading: "ಹವಾಮಾನ ವಿಶ್ಲೇಷಣೆ", content: "ಪ್ರಸ್ತುತ ಹವಾಮಾನ" },
  { path: "/inventory", heading: "ಕೃಷಿ ದಾಸ್ತಾನು", content: "ವಸ್ತು ಸೇರಿಸಿ" },
  { path: "/iot", heading: "ಐಒಟಿ ಮೇಲ್ವಿಚಾರಣೆ", content: "ಒಟ್ಟು ಸೆನ್ಸರ್‌ಗಳು" },
  { path: "/reports", heading: "ಕೃಷಿ ವರದಿಗಳು", content: "ವರದಿ ಡೌನ್‌ಲೋಡ್ ಮಾಡಿ" },
];

for (const { path, heading, content } of localizedPages) {
  test(`language change translates the ${path} page`, async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem("currentUser", JSON.stringify({ name: "Test Farmer", phone: "9876543210" }));
    });

    await page.goto(path);
    await page.getByTestId("language-selector").selectOption("kn");

    await expect(page.getByRole("heading", { level: 1 })).toContainText(heading);
    if (path === "/news") {
      await expect(page.getByPlaceholder(content)).toBeVisible();
    } else {
      await expect(page.getByText(content, { exact: false }).first()).toBeVisible();
    }
    await page.reload();
    await expect(page.getByRole("heading", { level: 1 })).toContainText(heading);
  });
}

test("language change applies to the landing, sign-up, and login pages", async ({ page }) => {
  await page.goto("/");
  await page.getByTestId("language-selector").selectOption("kn");
  await expect(page.getByText("ಕೃಷಿಯ ಭವಿಷ್ಯಕ್ಕೆ ಸ್ವಾಗತ")).toBeVisible();
  await expect(page.getByRole("button", { name: "ಪ್ರಾರಂಭಿಸಿ" })).toBeVisible();

  await page.goto("/signup");
  await expect(page.getByRole("heading", { name: "ನಿಮ್ಮ ಖಾತೆಯನ್ನು ರಚಿಸಿ" })).toBeVisible();
  await expect(page.getByText("ಪೂರ್ಣ ಹೆಸರು")).toBeVisible();

  await page.goto("/login");
  await expect(page.getByRole("heading", { name: "ಮತ್ತೆ ಸ್ವಾಗತ" })).toBeVisible();
  await expect(page.getByText("ಫೋನ್ ಸಂಖ್ಯೆ")).toBeVisible();
});
