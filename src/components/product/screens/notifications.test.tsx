import { render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { Notifications } from "@/components/product/screens/notifications";
import { act, getState } from "@/services/comlinked";

// A Company has notifications from its first day in the Demo, so the screen with none cannot be
// reached in a browser. The state is set on the simulation here.
describe("Notifications with nothing to show", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    act.demoNew();
    getState().notes = [];
    getState().incoming = [];
  });
  afterEach(() => {
    vi.useRealTimers();
  });

  it("shows its calm empty state in a flat panel, with nothing raised and nothing to press", () => {
    const { container } = render(<Notifications />);
    expect(screen.getByRole("heading", { name: "Notifications", level: 1 })).toBeInTheDocument();
    expect(screen.getByText("Nothing yet.")).toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: "Connection Requests" })).not.toBeInTheDocument();
    expect(container.querySelector("[data-focus-panel]")).toBeNull();
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });
});
