import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { PreviewAsk } from "@/components/product/screens/preview-ask";

// The presenter's address is a deployment setting, so a deployment without one is set up here.
vi.mock("@/services/comlinked", async (original) => ({
  ...(await original<typeof import("@/services/comlinked")>()),
  PRESENTER: null,
}));

describe("the ask with no presenter address set", () => {
  it("shows no email button, and says inside the white panel to reply to whoever sent the link", () => {
    const { container } = render(<PreviewAsk />);
    expect(screen.queryByRole("link", { name: /^Email/ })).toBeNull();
    const reply = screen.getByText("Reply to the person who sent you this link.");
    // The navy panel is the Focus panel, so what is in the frame but outside it is the white one.
    const navy = container.querySelector<HTMLElement>("[data-focus-panel]");
    expect(navy).not.toBeNull();
    const explore = screen.getByRole("link", { name: "Explore on your own" });
    for (const part of [reply, explore]) {
      expect(navy).not.toContainElement(part);
      expect(navy?.parentElement).toContainElement(part);
    }
  });
});
