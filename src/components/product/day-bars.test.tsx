import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { DayBars } from "@/components/product/day-bars";

// The Demo's data holds no day with recommendations alone, so the browser cannot reach one.
describe("the day bars, with two series", () => {
  const SERIES = [
    { name: "Search appearances", unit: "search appearances" },
    { name: "Recommendations", unit: "recommendations" },
  ];
  const drawn = (days: { label: string; values: number[] }[]) => {
    const { container } = render(<DayBars series={SERIES} days={days} />);
    return [...container.querySelectorAll("ol:last-of-type > li")].map((day) => ({
      segments: [...day.querySelectorAll("[data-series]")].map((segment) => ({
        series: segment.getAttribute("data-series"),
        says: segment.getAttribute("title"),
      })),
      quiet: day.hasAttribute("data-empty"),
    }));
  };

  it("draws only the second series' segment on a day with nothing of the first", () => {
    const [both, second, nothing] = drawn([
      { label: "Day 1", values: [2, 1] },
      { label: "Day 2", values: [0, 3] },
      { label: "Day 3", values: [0, 0] },
    ]);
    expect(both?.segments).toEqual([
      { series: "0", says: "Day 1: 2 search appearances" },
      { series: "1", says: "Day 1: 1 recommendations" },
    ]);
    expect(second).toEqual({
      segments: [{ series: "1", says: "Day 2: 3 recommendations" }],
      quiet: false,
    });
    expect(nothing).toEqual({ segments: [], quiet: true });
  });

  it("draws nothing at all when there are no days", () => {
    const { container } = render(<DayBars series={SERIES} days={[]} />);
    expect(container).toBeEmptyDOMElement();
  });
});
