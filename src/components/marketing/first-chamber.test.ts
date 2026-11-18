import { describe, expect, it } from "vitest";

import { FirstChamber } from "./first-chamber";

const complete = {
  name: "Example Chamber of Commerce",
  quote: "Our members found each other in a week.",
  person: "Ana Reyes",
  role: "President",
};

describe("FirstChamber", () => {
  it("renders nothing by default", () => {
    expect(FirstChamber({})).toBeNull();
  });

  it("renders nothing for null", () => {
    expect(FirstChamber({ value: null })).toBeNull();
  });

  it.each(["name", "quote", "person", "role"] as const)("renders nothing without %s", (field) => {
    const partial: Record<string, string> = { ...complete };
    delete partial[field];
    expect(FirstChamber({ value: partial })).toBeNull();
  });

  it.each(["name", "quote", "person", "role"] as const)(
    "renders nothing when %s is blank",
    (field) => {
      expect(FirstChamber({ value: { ...complete, [field]: "   " } })).toBeNull();
    },
  );

  it("renders when every detail is present", () => {
    expect(FirstChamber({ value: complete })).not.toBeNull();
  });
});
