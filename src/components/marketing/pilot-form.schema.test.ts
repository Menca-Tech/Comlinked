import { describe, expect, it } from "vitest";

import { MESSAGE_LIMIT, TEXT_LIMIT } from "./form-rules";
import { pilotFormSchema } from "./pilot-form.schema";

const valid = {
  chamber: "Example Chamber of Commerce",
  name: "Ana Reyes",
  role: "Executive Director",
  memberCount: "150",
  email: "ana@examplechamber.org",
  message: "",
};

function errorFor(field: keyof typeof valid, value: unknown) {
  const result = pilotFormSchema.safeParse({ ...valid, [field]: value });
  return result.success ? undefined : result.error.flatten().fieldErrors[field]?.[0];
}

describe("pilotFormSchema", () => {
  it("accepts a complete form", () => {
    expect(pilotFormSchema.safeParse(valid).success).toBe(true);
  });

  it("trims surrounding spaces", () => {
    expect(pilotFormSchema.parse({ ...valid, role: "  Director  " }).role).toBe("Director");
  });

  it.each(["chamber", "name", "role", "email"] as const)("requires %s", (field) => {
    expect(errorFor(field, "")).toMatch(/^Enter/);
    expect(errorFor(field, "   ")).toMatch(/^Enter/);
  });

  it("rejects a badly formed email", () => {
    expect(errorFor("email", "ana@")).toMatch(/valid email/);
  });

  it("allows a blank member count", () => {
    expect(errorFor("memberCount", "  ")).toBeUndefined();
  });

  it.each(["many", "12a", "-5", "1.5", "0"])("rejects %s as a member count", (value) => {
    expect(errorFor("memberCount", value)).toBe("Enter a number, like 150.");
  });

  it.each(["chamber", "name", "role"] as const)("caps %s at the limit", (field) => {
    expect(errorFor(field, "a".repeat(TEXT_LIMIT))).toBeUndefined();
    expect(errorFor(field, "a".repeat(TEXT_LIMIT + 1))).toMatch(/or fewer/);
  });

  it("caps the message at its own limit", () => {
    expect(errorFor("message", "a".repeat(MESSAGE_LIMIT))).toBeUndefined();
    expect(errorFor("message", "a".repeat(MESSAGE_LIMIT + 1))).toMatch(/1000 characters or fewer/);
  });
});
