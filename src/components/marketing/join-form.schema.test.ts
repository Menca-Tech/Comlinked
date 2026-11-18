import { describe, expect, it } from "vitest";

import { TEXT_LIMIT } from "./form-rules";
import { joinFormSchema } from "./join-form.schema";

const valid = {
  company: "Kalayaan Foods Inc.",
  name: "Maria Santos",
  role: "Owner / CEO",
  email: "maria@kalayaanfoods.com",
  chamber: "",
  authorized: false,
};

function errorFor(field: keyof typeof valid, value: unknown) {
  const result = joinFormSchema.safeParse({ ...valid, [field]: value });
  return result.success ? undefined : result.error.flatten().fieldErrors[field]?.[0];
}

describe("joinFormSchema", () => {
  it("accepts a complete form with no chamber", () => {
    expect(joinFormSchema.safeParse(valid).success).toBe(true);
  });

  it("trims surrounding spaces", () => {
    const parsed = joinFormSchema.parse({ ...valid, company: "  Kalayaan Foods  " });
    expect(parsed.company).toBe("Kalayaan Foods");
  });

  it.each(["company", "name", "role", "email"] as const)("requires %s", (field) => {
    expect(errorFor(field, "")).toMatch(/^(Enter|Choose)/);
  });

  it.each(["company", "name", "email"] as const)("treats spaces in %s as blank", (field) => {
    expect(errorFor(field, "   ")).toMatch(/^Enter/);
  });

  it("rejects a badly formed email", () => {
    expect(errorFor("email", "maria@")).toBe("Enter a valid email, like you@yourcompany.com.");
  });

  it.each(["company", "name", "role", "chamber"] as const)("caps %s at the limit", (field) => {
    expect(errorFor(field, "a".repeat(TEXT_LIMIT))).toBeUndefined();
    expect(errorFor(field, "a".repeat(TEXT_LIMIT + 1))).toMatch(/or fewer/);
  });

  it("rejects an over-long email", () => {
    expect(errorFor("email", `${"a".repeat(TEXT_LIMIT)}@example.com`)).toMatch(/or fewer/);
  });
});
