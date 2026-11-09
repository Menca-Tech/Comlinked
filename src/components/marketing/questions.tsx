export interface Question {
  question: string;
  answer: string;
}

/** A section heading beside a list of expandable questions. */
export function Questions({ title, items }: { title: string; items: Question[] }) {
  return (
    <div className="flex flex-wrap gap-x-14 gap-y-6">
      <h2 className="cl-h2 mx-0 mt-0 mb-4 flex-[0.6_1_280px] text-balance text-cl-ink">{title}</h2>
      <div className="min-w-0 flex-[1.4_1_480px] border-b border-b-cl-rule">
        {items.map(({ question, answer }) => (
          <details className="cl-faq border-t border-t-cl-rule" key={question}>
            <summary className="flex cursor-pointer list-none justify-between gap-4 px-0 py-5.5 text-[20px] leading-[27px] tracking-[-0.01em] text-cl-ink">
              <span className="min-w-0 [overflow-wrap:anywhere]">{question}</span>
              <span
                className="cl-faq-mark font-sans text-[20px] font-bold text-cl-accent-strong"
                aria-hidden="true"
              >
                +
              </span>
            </summary>
            <p className="mx-0 mt-0 mb-6 max-w-[46em] text-[16px] leading-[25px] [overflow-wrap:anywhere] text-cl-ink-2">
              {answer}
            </p>
          </details>
        ))}
      </div>
    </div>
  );
}
