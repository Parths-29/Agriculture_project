/**
 * Unit Tests — DesiCane Validation Logic
 * Maps to manual test cases in test_case_table.md
 *
 * Run: npm run test:unit
 */
import { describe, it, expect } from "vitest";
import { validateSignUp, validateLogin } from "../validation";

// ─────────────────────────────────────────────
// validateSignUp — Sign Up Form Rules
// ─────────────────────────────────────────────
describe("validateSignUp", () => {

  /** SU-01 — Empty name field */
  it("SU-01: returns fieldRequired error when name is blank or whitespace-only", () => {
    const errorsEmpty = validateSignUp({
      name: "",
      phone: "9876543210",
      password: "pass123",
      confirmPassword: "pass123",
      village: "",
    });
    expect(errorsEmpty).toContainEqual({ field: "name", message: "fieldRequired" });

    const errorsWhitespace = validateSignUp({
      name: "   ",
      phone: "9876543210",
      password: "pass123",
      confirmPassword: "pass123",
      village: "",
    });
    expect(errorsWhitespace).toContainEqual({ field: "name", message: "fieldRequired" });
  });

  /** SU-02 — Empty phone field */
  it("SU-02: returns fieldRequired error when phone is blank or whitespace-only", () => {
    const errorsEmpty = validateSignUp({
      name: "Test User",
      phone: "",
      password: "pass123",
      confirmPassword: "pass123",
      village: "",
    });
    expect(errorsEmpty).toContainEqual({ field: "phone", message: "fieldRequired" });

    const errorsWhitespace = validateSignUp({
      name: "Test User",
      phone: "   ",
      password: "pass123",
      confirmPassword: "pass123",
      village: "",
    });
    expect(errorsWhitespace).toContainEqual({ field: "phone", message: "fieldRequired" });
  });

  /** SU-03 — Non-numeric phone */
  it("SU-03: returns phoneNonNumeric error when phone contains letters", () => {
    // Letters at end
    const errorsTrailing = validateSignUp({
      name: "Test User",
      phone: "98765abcde",
      password: "pass123",
      confirmPassword: "pass123",
      village: "",
    });
    expect(errorsTrailing).toContainEqual({ field: "phone", message: "phoneNonNumeric" });

    // Letters at beginning (kills Regex mutant lacking ^ anchor)
    const errorsLeading = validateSignUp({
      name: "Test User",
      phone: "abc9876543",
      password: "pass123",
      confirmPassword: "pass123",
      village: "",
    });
    expect(errorsLeading).toContainEqual({ field: "phone", message: "phoneNonNumeric" });
  });

  /** SU-04 — Phone not 10 digits */
  it("SU-04: returns phoneInvalid error when phone is fewer than 10 digits", () => {
    const errors = validateSignUp({
      name: "Test User",
      phone: "12345",
      password: "pass123",
      confirmPassword: "pass123",
      village: "",
    });
    expect(errors).toContainEqual({ field: "phone", message: "phoneInvalid" });
  });

  /** SU-05 — Password too short */
  it("SU-05: returns passwordTooShort error when password is under 6 chars and accepts exact 6 chars", () => {
    // Under 6 chars (< 6)
    const errorsShort = validateSignUp({
      name: "Test User",
      phone: "9876543210",
      password: "abc",
      confirmPassword: "abc",
      village: "",
    });
    expect(errorsShort).toContainEqual({ field: "password", message: "passwordTooShort" });

    // Boundary condition: exactly 6 chars is valid (kills <= 6 mutant)
    const errorsExact6 = validateSignUp({
      name: "Test User",
      phone: "9876543210",
      password: "123456",
      confirmPassword: "123456",
      village: "",
    });
    const passwordError = errorsExact6.find((e) => e.field === "password");
    expect(passwordError).toBeUndefined();
  });

  /** SU-06 — Password mismatch */
  it("SU-06: returns passwordMismatch error when passwords differ", () => {
    const errors = validateSignUp({
      name: "Test User",
      phone: "9876543210",
      password: "password1",
      confirmPassword: "password2",
      village: "",
    });
    expect(errors).toContainEqual({ field: "confirmPassword", message: "passwordMismatch" });
  });

  /** SU-08 — Empty password */
  it("SU-08: returns fieldRequired error when password is blank", () => {
    const errors = validateSignUp({
      name: "Test User",
      phone: "9876543210",
      password: "",
      confirmPassword: "pass123",
      village: "",
    });
    expect(errors).toContainEqual({ field: "password", message: "fieldRequired" });
  });

  /** SU-09 — Empty confirmPassword */
  it("SU-09: returns fieldRequired error when confirmPassword is blank", () => {
    const errors = validateSignUp({
      name: "Test User",
      phone: "9876543210",
      password: "pass123",
      confirmPassword: "",
      village: "",
    });
    expect(errors).toContainEqual({ field: "confirmPassword", message: "fieldRequired" });
  });

  /** SU-10 — All fields empty */
  it("SU-10: returns errors for every required field when all are empty", () => {
    const errors = validateSignUp({
      name: "",
      phone: "",
      password: "",
      confirmPassword: "",
      village: "",
    });
    const fields = errors.map((e) => e.field);
    expect(fields).toContain("name");
    expect(fields).toContain("phone");
    expect(fields).toContain("password");
    expect(fields).toContain("confirmPassword");
    expect(errors.length).toBeGreaterThanOrEqual(4);
  });

  /** SU-11 — All fields valid → no errors */
  it("SU-11: returns empty array when all signup fields are valid", () => {
    const errors = validateSignUp({
      name: "Test User",
      phone: "9999999999",
      password: "test123",
      confirmPassword: "test123",
      village: "",
    });
    expect(errors).toHaveLength(0);
  });

  /** SU-12 — Village is optional (no error when blank) */
  it("SU-12: village field is optional and causes no error when left blank", () => {
    const errors = validateSignUp({
      name: "Test User",
      phone: "9999999999",
      password: "test123",
      confirmPassword: "test123",
      village: "",
    });
    const villageError = errors.find((e) => e.field === "village");
    expect(villageError).toBeUndefined();
  });
});

// ─────────────────────────────────────────────
// validateLogin — Login Form Rules
// ─────────────────────────────────────────────
describe("validateLogin", () => {

  /** LI-01 — Empty phone */
  it("LI-01: returns fieldRequired error when phone is blank or whitespace-only", () => {
    const errorsEmpty = validateLogin({ phone: "", password: "somepassword" });
    expect(errorsEmpty).toContainEqual({ field: "phone", message: "fieldRequired" });

    const errorsWhitespace = validateLogin({ phone: "   ", password: "somepassword" });
    expect(errorsWhitespace).toContainEqual({ field: "phone", message: "fieldRequired" });
  });

  /** LI-02 — Empty password */
  it("LI-02: returns fieldRequired error when password is blank", () => {
    const errors = validateLogin({ phone: "9876543210", password: "" });
    expect(errors).toContainEqual({ field: "password", message: "fieldRequired" });
  });

  /** LI-03 — Both fields empty */
  it("LI-03: returns errors for both fields when both are empty", () => {
    const errors = validateLogin({ phone: "", password: "" });
    const fields = errors.map((e) => e.field);
    expect(fields).toContain("phone");
    expect(fields).toContain("password");
    expect(errors).toHaveLength(2);
  });

  /** No errors when both fields are provided */
  it("returns empty array when both login fields are filled", () => {
    const errors = validateLogin({ phone: "9876543210", password: "ramesh123" });
    expect(errors).toHaveLength(0);
  });
});
