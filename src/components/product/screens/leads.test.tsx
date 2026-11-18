import { render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { Leads } from "@/components/product/screens/leads";
import { act, getState } from "@/services/comlinked";

// The Demo runs out of example companies only after weeks of mornings, which no browser test
// walks, so this state is set on the simulation here.
describe("Leads with no company left to show", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    act.demoActive();
    getState().lists[getState().day] = [];
  });
  afterEach(() => {
    vi.useRealTimers();
  });

  it("still shows its Focus panel, holding the one line and no button", () => {
    render(<Leads />);
    const line = screen.getByText(/^You have seen every example company\./);
    expect(line.closest("[data-focus-panel]")).not.toBeNull();
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });
});
