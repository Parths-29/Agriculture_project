# DesiCane — Testing Quick Reference Guide

A concise reference for viva examination explaining the automated testing layers implemented for the DesiCane platform.

---

## 1. Unit Testing (Vitest)

- **What's Tested**: Pure client-side form validation logic in [`src/lib/validation.ts`](file:///c:/Users/Admin/Desktop/Agri/Agriculture_project/src/lib/validation.ts) across `validateSignUp()` and `validateLogin()`.
  - **Sign Up Rules**: Empty Name (SU-01), Empty Phone (SU-02), Non-numeric Phone (SU-03), Phone not 10 digits (SU-04), Empty Password (SU-05), Password < 6 chars (SU-06), Empty Confirm Password (SU-07), Password Mismatch (SU-08), All Fields Empty (SU-09), and Valid Sign-Up (SU-10).
  - **Login Rules**: Empty Phone (LI-01), Empty Password (LI-02), and Valid Login Input (LI-03).
- **Execution Command**:
  ```bash
  npm run test:unit
  ```
- **Framework**: Vitest (minimal, fast, isolated Node-like runner).
- **Result**: **15 / 15 Passed** (1 test file, 15 tests, ~1.5s execution time).

---

## 2. Functional & End-to-End Testing (Playwright)

- **What's Tested**: Real browser user journeys using Chromium with Arrange/Act/Assert step reporting matching [`test_case_table.md`](file:///c:/Users/Admin/Desktop/Agri/Agriculture_project/test_case_table.md):
  - **Sign Up Validation (`e2e/signup.spec.ts`)**: SU-01 through SU-06 (in-browser inline field errors for empty name/phone, letters in phone, invalid length, short password, mismatched passwords) and SU-07 (duplicate phone registration error).
  - **Authentication Flow (`e2e/login.spec.ts`)**: LI-01 & LI-02 (required phone/password validation), LI-04 (unregistered phone number error), LI-05 (wrong password error), and LI-07 (successful login with `9876543210` / `ramesh123` redirecting to `/home` with user greeting).
  - **Route Guards & Session (`e2e/guards-and-logout.spec.ts`)**: CC-01 & CC-03 (unauthenticated access to `/home`, `/news`, and `/article/1` redirects to `/login`), CC-04 (authenticated access preserved), and HM-07 (clicking Logout in Navbar clears `localStorage` session and redirects to `/login`).
- **Prerequisite**: Start dev and backend servers (`npm run dev` or separate terminals).
- **Execution Command**:
  ```bash
  npm run test:e2e
  ```
- **Framework**: Playwright (`@playwright/test`) with Chromium headless runner and list reporter.
- **Result**: **17 / 17 Passed** (3 test files, 17 tests, ~28s execution time).

---

## 3. Basic Security Headers (Helmet)

- **What's Added**: `helmet` middleware in [`backend/server.js`](file:///c:/Users/Admin/Desktop/Agri/Agriculture_project/backend/server.js).
- **Headers Verified**: `Content-Security-Policy`, `X-Content-Type-Options: nosniff`, and `X-Frame-Options: SAMEORIGIN`.

---

## 4. Mutation Testing (StrykerJS)

- **Tool**: StrykerJS with its Vitest runner.
- **What's Mutated**: Only `src/lib/validation.ts`; the existing Vitest unit tests check whether each introduced change is detected.
- **Execution Command**:
  ```bash
  npm run test:mutation
  ```
- **Report**: `reports/mutation/mutation.html`.
- **Final Result**: **100% mutation score** — 84 mutants killed, 0 survived, 0 equivalent mutants identified.
