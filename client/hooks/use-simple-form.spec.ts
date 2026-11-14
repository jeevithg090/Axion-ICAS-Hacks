import { describe, expect, it } from "vitest";
import { email, minLength, required, validate } from "./use-simple-form";

describe("form validators", () => {
  it("required rejects blank and whitespace-only values", () => {
    expect(required("name")("")).toBe("Please enter your name.");
    expect(required("name")("   ")).toBe("Please enter your name.");
    expect(required("name")("Asha")).toBeUndefined();
  });

  it("email asks for a value, then for a valid address", () => {
    expect(email("")).toMatch(/enter your email/);
    expect(email("asha@")).toMatch(/doesn’t look right/);
    expect(email("asha@icas")).toMatch(/doesn’t look right/);
    expect(email(" asha@icas.edu ")).toBeUndefined();
  });

  it("minLength counts trimmed characters", () => {
    const rule = minLength(10, "message");
    expect(rule("short   ")).toBe(
      "Your message should be at least 10 characters.",
    );
    expect(rule("long enough text")).toBeUndefined();
  });

  it("validate returns only the first failing rule per field", () => {
    const errors = validate(
      { name: "", email: "nope", message: "hi" },
      {
        name: [required("name")],
        email: [email],
        message: [required("message"), minLength(10, "message")],
      },
    );
    expect(errors).toEqual({
      name: "Please enter your name.",
      email: "That email address doesn’t look right. Check for typos.",
      message: "Your message should be at least 10 characters.",
    });
  });

  it("validate returns no errors for valid input", () => {
    expect(validate({ email: "a@b.co" }, { email: [email] })).toEqual({});
  });
});
