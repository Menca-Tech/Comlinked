const STEPS = [
  {
    title: "Your morning digest",
    text: "Every morning: new leads, who viewed you, and how your rank changed.",
  },
  {
    title: "Act on today’s leads",
    text: "5 new matched companies. Connect, message or skip, in a few taps.",
  },
  {
    title: "Talk and close",
    text: "ComMail with templates for intros and quotes. Confirm “We met” and “We did business” together.",
  },
  {
    title: "Share the win",
    text: "Post a short testimonial and share it to social media.",
  },
  {
    title: "Your rank rises",
    text: "Activity lifts your place in search, which brings more views tomorrow.",
  },
];

/** The five steps of the Daily Lead Loop. CSS draws the list as a loop or a sequence. */
export function DailyLeadLoop() {
  return (
    <div className="cl-loop">
      <ol className="cl-loop-steps" role="list">
        {STEPS.map(({ title, text }, index) => (
          <li className="cl-loop-step" key={title}>
            <span className="cl-loop-number" aria-hidden="true">
              {index + 1}
            </span>
            <h3 className="mx-0 mt-0 mb-1.5 text-[20px] leading-[26px] text-cl-ink">{title}</h3>
            <p className="m-0 text-[15px] leading-[23px] text-cl-ink-2">{text}</p>
          </li>
        ))}
      </ol>
      <p className="cl-loop-return">More views tomorrow lead back to step 1</p>
    </div>
  );
}
