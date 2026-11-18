import { render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

const flags = vi.hoisted(() => ({ isDemoDeployment: false }));
vi.mock("@/config", () => flags);

import { DEMO_NOTICE, DemoNotice } from "./demo-notice";

afterEach(() => {
  flags.isDemoDeployment = false;
});

describe("DemoNotice", () => {
  it("renders nothing outside the demo deployment", () => {
    const { container } = render(<DemoNotice />);
    expect(container).toBeEmptyDOMElement();
  });

  it("says the data is invented on the demo deployment", () => {
    flags.isDemoDeployment = true;
    render(<DemoNotice />);
    expect(screen.getByText(DEMO_NOTICE)).toHaveTextContent(
      "Demo. Companies, people and figures are invented.",
    );
  });
});
