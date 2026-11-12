import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { InterestSignalsCard } from "@/components/product/comdash/summary-cards";
import { act, getState } from "@/services/comlinked";

describe("the Overview's Interest Signals card", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    act.demoNew();
    act.claimNext();
    act.claimConfirm("yes");
    act.claimFinish();
  });

  it("shows zeros and says there are no Hot companies when nothing is interested", () => {
    getState().signals = [];
    render(<InterestSignalsCard />);
    expect(screen.getByText("No Hot companies yet")).toBeInTheDocument();
    expect(screen.getByText("0 Hot")).toBeInTheDocument();
    expect(screen.getByText("No search appearances or recommendations yet.")).toBeInTheDocument();
  });

  it("links each Hot company to its timeline drawer", () => {
    render(<InterestSignalsCard />);
    expect(screen.getByRole("link", { name: "Luntian Foods Inc." })).toHaveAttribute(
      "href",
      "/app/dash/signals?company=luntian",
    );
  });
});
